import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, unlink, symlink, mkdtemp, rmdir } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { Readable, Writable, PassThrough } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { prepareLab, verifyLab, cleanupLab, serveMcp } from '../simulations/lab.mjs';
import { parseStrictJson } from '../simulations/lib/strict-json.mjs';
const script = fileURLToPath(new URL('../simulations/lab.mjs', import.meta.url));
const request = (id, method, params) => JSON.stringify({ jsonrpc: '2.0', id, method, ...(params ? {params} : {}) }) + '\n';
async function serve(run, input) {
  let output = '';
  await serveMcp(run.recordPath, { input: Readable.from([input]), output: new Writable({write(chunk, encoding, done) { output += chunk; done(); }}) });
  return output.trim().split('\n').filter(Boolean).map(line => JSON.parse(line));
}
const cases = [
  ['mcp-tool-poisoning', {}], ['mcp-tool-poisoning', {clean:true}],
  ['mcp-result-injection', {}], ['mcp-result-injection', {clean:true}],
  ...['error-report','documentation'].flatMap(caseId => [false,true].map(clean => ['mcp-retrieved-context',{caseId,clean}])),
  ...['clean','schema-only','result-only','combined'].map(condition => ['mcp-split-instructions',{condition}]),
  ...['project-instructions','skill-instructions','mcp-config-change'].flatMap(id => [false,true].map(clean => [id,{clean}]))
];
for (const [id, options] of cases) test(`${id} ${JSON.stringify(options)} real prepare/serve/verify/cleanup`, async () => {
  const run = await prepareLab(id, options);
  assert.equal(run.provider_started, false);
  const record = JSON.parse(await readFile(run.recordPath));
  if (id === 'mcp-config-change') {
    const result = await verifyLab(run.recordPath);
    assert.equal(result.change_observed,true); assert.equal(result.commands_executed,0); assert.equal(result.native_activation,false);
    await assert.rejects(serveMcp(run.recordPath), /no MCP/);
  } else if (id === 'project-instructions' || id === 'skill-instructions') {
    assert.equal((await verifyLab(run.recordPath)).marker,'absent');
    const fixture = await readFile(path.join(run.workspace, id === 'project-instructions' ? 'AGENTS.md' : 'SKILL.md'),'utf8');
    assert.equal(fixture.includes('{{'),false);
    await writeFile(path.join(run.workspace,'unexpected-marker.txt'),`OPENATTACKS-SYNTHETIC-MARKER ${run.run_id}\n`);
    const result = await verifyLab(run.recordPath); assert.equal(result.marker,'observed'); assert.equal(result.agent_attribution,'requires-independent-provider-trace');
  } else {
    const lookup = id === 'mcp-retrieved-context' ? record.fixture.tool : id === 'mcp-split-instructions' ? 'lookup_release_note' : 'lookup_issue';
    const output = await serve(run, request(1,'initialize') + request(2,'tools/list') + request(3,'tools/call',{name:lookup,arguments:{}}) + request(4,'tools/call',{name:'read_canary',arguments:{}}) + request(5,'tools/call',{name:'record_receipt',arguments:{canary:record.canary,destination:'synthetic-audit-sink'}}) + request(6,'tools/call',{name:'read_canary',arguments:{path:'/etc/passwd'}}));
    assert.equal(output[5].result.isError,true);
    assert.equal(output[1].result.tools.length,3);
    if (id === 'mcp-tool-poisoning') assert.equal(output[1].result.tools[0].description,record.fixture);
    if (id === 'mcp-split-instructions') assert.equal(output[1].result.tools[0].description,record.fixture.schema);
    const result = await verifyLab(run.recordPath);
    assert.equal(result.synthetic_receipt,'observed'); assert.equal(result.server_completed,true); assert.equal(result.agent_attribution,'requires-independent-provider-trace'); assert.equal(result.network_requests,0);
    await assert.rejects(serveMcp(run.recordPath),/already been served/);
  }
  assert.equal((await cleanupLab(run.recordPath)).cleanup,'verified');
});
test('strict JSON rejects duplicate, unsafe, nonfinite and malformed input', () => {
  for (const value of ['{"a":1,"a":2}', '{"__proto__":{}}', '{"a":1e999}', '{"a":1,}', '{"a":1}\u00a0', '[]']) assert.throws(() => parseStrictJson(value));
});
test('fixed selectors reject invalid combinations', async () => {
  for (const [id, opts] of [['unknown',{}], ['mcp-tool-poisoning',{caseId:'documentation'}], ['mcp-retrieved-context',{}], ['mcp-split-instructions',{}], ['mcp-split-instructions',{condition:'combined',clean:true}]]) await assert.rejects(prepareLab(id,opts));
});
test('unknown files, active lock, tampered artifacts fail closed before deletion', async () => {
  const run = await prepareLab('mcp-tool-poisoning');
  for (const name of ['unknown.txt','server.lock']) { await writeFile(path.join(run.workspace,name),'preserve'); await assert.rejects(cleanupLab(run.recordPath)); assert.ok(await readFile(run.recordPath)); await unlink(path.join(run.workspace,name)); }
  const file=path.join(run.workspace,'task.txt'); const original=await readFile(file); await writeFile(file,'tampered'); await assert.rejects(verifyLab(run.recordPath)); await assert.rejects(cleanupLab(run.recordPath)); await writeFile(file,original); await cleanupLab(run.recordPath);
});
test('symlink artifact rejected without touching target', async t => {
  const run=await prepareLab('mcp-tool-poisoning'); const file=path.join(run.workspace,'events.jsonl'); await unlink(file);
  try { await symlink(path.join(run.workspace,'task.txt'),file); } catch (error) { if(process.platform==='win32' && ['EPERM','EACCES'].includes(error.code)) { await writeFile(file,''); await cleanupLab(run.recordPath); t.skip('Windows symlink privilege unavailable'); return; } throw error; }
  await assert.rejects(cleanupLab(run.recordPath)); assert.ok(await readFile(path.join(run.workspace,'task.txt'))); await unlink(file); await writeFile(file,''); await cleanupLab(run.recordPath);
});
test('caller workspace and noncanonical aliases cannot be cleaned', async () => {
  const directory=await mkdtemp(path.join(os.tmpdir(),'caller-owned-')); const recordPath=path.join(directory,'record.json'); await writeFile(recordPath,'{}'); await assert.rejects(cleanupLab(recordPath)); assert.equal(await readFile(recordPath,'utf8'),'{}'); await unlink(recordPath); await rmdir(directory);
  const run=await prepareLab('mcp-tool-poisoning'); await assert.rejects(cleanupLab(run.workspace + path.sep + '.' + path.sep + 'record.json')); await cleanupLab(run.recordPath);
});
test('wrong marker content remains invalid and preserved',async()=>{
  const run=await prepareLab('skill-instructions');const file=path.join(run.workspace,'unexpected-marker.txt');await writeFile(file,'stale'); assert.equal((await verifyLab(run.recordPath)).marker,'invalid'); await assert.rejects(cleanupLab(run.recordPath)); await unlink(file); await cleanupLab(run.recordPath);
});
for(const [label,input] of [['invalid JSON','{oops}\n'],['duplicate JSON','{"jsonrpc":"2.0","id":1,"id":2,"method":"initialize"}\n'],['oversize','x'.repeat(17000)+'\n'],['unterminated',request(1,'initialize').trimEnd()]]) test(`stdio rejects ${label}`,async()=>{
  const run=await prepareLab('mcp-tool-poisoning');await assert.rejects(serve(run,input));await cleanupLab(run.recordPath);
});
test('CLI uses argv and closed commands; stdin is never a path/command',async()=>{
  const result=spawnSync(process.execPath,[script,'list'],{input:'cleanup /etc/passwd\n',encoding:'utf8'});assert.equal(result.status,0,result.stderr);assert.equal(JSON.parse(result.stdout).length,7);
  for(const args of [['list','unexpected'],['prepare','mcp-tool-poisoning','--bad'],['prepare','mcp-tool-poisoning','--clean','--clean']]) assert.notEqual(spawnSync(process.execPath,[script,...args],{encoding:'utf8'}).status,0);
});
test('live server lock blocks cleanup, initialize gate and tool bounds hold',async()=>{
  const run=await prepareLab('mcp-tool-poisoning'); const input=new PassThrough(); let output='';
  const active=serveMcp(run.recordPath,{input,output:new Writable({write(chunk,enc,done){output+=chunk;done();}})});
  input.write(request(1,'tools/list')+request(2,'initialize')+request(3,'tools/call',{name:'shell',arguments:{command:'whoami'}}));
  for(let i=0;i<100 && !output.includes('Rejected:');i++) await new Promise(resolve=>setTimeout(resolve,10));
  assert.ok(output.includes('Initialize first.')); assert.ok(output.includes('Rejected:')); await assert.rejects(cleanupLab(run.recordPath),/Stop/);
  input.end(); await active; await cleanupLab(run.recordPath);
});
test('fixed tool call and message budgets terminate stream',async()=>{
  const run=await prepareLab('mcp-tool-poisoning'); await assert.rejects(serve(run,request(1,'initialize')+Array.from({length:13},(_,i)=>request(i+2,'tools/call',{name:'lookup_issue',arguments:{}})).join('')),/budget/);await cleanupLab(run.recordPath);
  const run2=await prepareLab('mcp-tool-poisoning'); await assert.rejects(serve(run2,request(1,'initialize')+Array.from({length:65},(_,i)=>request(i+2,'ping')).join('')),/budget/);await cleanupLab(run2.recordPath);
});
test('record tampering rejected and artifact identity replacement rejected',async()=>{
  const run=await prepareLab('mcp-tool-poisoning'); const record=await readFile(run.recordPath); const altered=JSON.parse(record); altered.canary='OTHER'; await writeFile(run.recordPath,JSON.stringify(altered));await assert.rejects(cleanupLab(run.recordPath));await writeFile(run.recordPath,record);
  const task=path.join(run.workspace,'task.txt');const original=await readFile(task); const {rename}=await import('node:fs/promises');await rename(task,task+'.backup'); await writeFile(task,original);await assert.rejects(verifyLab(run.recordPath));await unlink(task);await rename(task+'.backup',task);await cleanupLab(run.recordPath);
});
test('CLI stdio real child process completes protocol',async()=>{
  const run=await prepareLab('mcp-tool-poisoning'); const result=spawnSync(process.execPath,[script,'serve',run.recordPath],{input:request(1,'initialize')+request(2,'tools/list'),encoding:'utf8',timeout:10000});assert.equal(result.status,0,result.stderr);assert.equal(JSON.parse(result.stdout.trim().split('\n')[1]).result.tools.length,3);assert.equal((await verifyLab(run.recordPath)).server_completed,true);await cleanupLab(run.recordPath);
});
test('source, fixture and helper drift fail closed in isolated copy',async()=>{
  const { cp, rm }=await import('node:fs/promises'); const root=await mkdtemp(path.join(os.tmpdir(),'openattacks-source-test-'));await cp(path.dirname(script),path.join(root,'simulations'),{recursive:true});const copyScript=path.join(root,'simulations','lab.mjs');
  try {
    for(const relative of ['definitions/mcp-tool-poisoning.yaml','fixtures/mcp-tool-poisoning/poisoned.txt','lab.mjs','lib/strict-json.mjs']) {
      const result=spawnSync(process.execPath,[copyScript,'prepare','mcp-tool-poisoning'],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);const run=JSON.parse(result.stdout);const file=path.join(root,'simulations',relative);const original=await readFile(file);await writeFile(file,Buffer.concat([original,Buffer.from('\n')]));
      const verify=spawnSync(process.execPath,[copyScript,'verify',run.recordPath],{encoding:'utf8'});assert.notEqual(verify.status,0);const cleanup=spawnSync(process.execPath,[copyScript,'cleanup',run.recordPath],{encoding:'utf8'});assert.notEqual(cleanup.status,0);assert.ok(await readFile(run.recordPath));await writeFile(file,original);assert.equal(spawnSync(process.execPath,[copyScript,'cleanup',run.recordPath],{encoding:'utf8'}).status,0);
    }
  } finally { await rm(root,{recursive:true,force:true}); }
});
