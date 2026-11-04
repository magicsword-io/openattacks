import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import YAML from 'yaml';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const recipes = Object.freeze({
  'mcp-tool-poisoning': 'metadata', 'mcp-result-injection': 'tool-result',
  'mcp-retrieved-context': 'retrieved-context', 'mcp-split-instructions': 'split-channel',
  'project-instructions': 'project-instructions', 'skill-instructions': 'skill-instructions',
  'mcp-config-change': 'config-change',
});
const entries = {'mcp-tool-poisoning':'0014','mcp-result-injection':'0013','mcp-retrieved-context':'0043','mcp-split-instructions':'0044','project-instructions':'0003','skill-instructions':'0004','mcp-config-change':'0028'};
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const fail = message => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };
const text = (value, name) => assert(typeof value === 'string' && value.trim().length > 0 && value.length <= 8000, `Invalid ${name}`);
const keys = (value, expected, name) => {
  assert(value && typeof value === 'object' && !Array.isArray(value), `Invalid ${name}`);
  assert(Object.keys(value).sort().join('|') === [...expected].sort().join('|'), `Unexpected or missing ${name} fields`);
};
const list = (v, name, max = 20) => assert(Array.isArray(v) && v.length > 0 && v.length <= max, `Invalid ${name}`);
const digest = v => assert(typeof v === 'string' && /^[a-f0-9]{64}$/.test(v), 'Invalid SHA-256');
const url = v => { text(v, 'URL'); assert(new URL(v).protocol === 'https:', 'Sources must use HTTPS'); };
function readRegular(base, relative) {
  assert(typeof relative === 'string' && /^[a-zA-Z0-9_./-]+$/.test(relative) && !path.isAbsolute(relative) && !relative.split('/').some(p => !p || p === '.' || p === '..'), 'Unsafe source path');
  let current = base;
  for (const part of relative.split('/')) { current = path.join(current, part); assert(!fs.lstatSync(current).isSymbolicLink(), 'Symlink source rejected'); }
  assert(fs.statSync(current).isFile() && fs.statSync(current).size <= 65536, 'Source must be a bounded regular file');
  return fs.readFileSync(current);
}
function validateJsonFixture(recipe, kind, data) {
  if (!['retrieved-context', 'split-channel', 'config-change'].includes(recipe)) return;
  const v = JSON.parse(data); keys(v, ['version', recipe === 'retrieved-context' ? 'cases' : recipe === 'split-channel' ? 'conditions' : 'server'], 'fixture');
  assert(v.version === 1, 'Unsupported fixture version');
  if (recipe === 'retrieved-context') {
    keys(v.cases, ['error-report', 'documentation'], 'cases');
    for (const [name, c] of Object.entries(v.cases)) {
      keys(c, ['tool', 'result'], 'case'); assert(c.tool === (name === 'error-report' ? 'lookup_error_report' : 'lookup_documentation'), 'Unknown case tool');
      keys(c.result, ['kind', 'item_id', 'summary', 'context'], 'result'); Object.values(c.result).forEach(x => text(x, 'result value'));
      assert(c.result.kind === (name === 'error-report' ? 'synthetic_error_report' : 'synthetic_documentation'), 'Invalid case kind');
    }
  } else if (recipe === 'split-channel') {
    keys(v.conditions, kind === 'clean' ? ['clean'] : ['schema-only', 'result-only', 'combined'], 'conditions');
    for (const c of Object.values(v.conditions)) { keys(c, ['schema', 'result'], 'condition'); text(c.schema, 'schema'); text(c.result, 'result'); }
  } else {
    keys(v.server, ['name', 'command', 'args'], 'mock server');
    assert(v.server.name === 'synthetic-helper' && v.server.command === (kind === 'clean' ? 'mock-clean' : 'mock-changed') && Array.isArray(v.server.args) && v.server.args.length === 0, 'Only fixed mock configuration allowed');
  }
}
export function buildCatalog(base = root) {
  const definitions = path.join(base, 'simulations/definitions');
  assert(!fs.lstatSync(path.join(base, 'simulations')).isSymbolicLink() && !fs.lstatSync(definitions).isSymbolicLink() && !fs.lstatSync(path.join(base,'simulations/fixtures')).isSymbolicLink(), 'Symlink source directory rejected');
  const files = fs.readdirSync(definitions).sort();
  const fixtureNames = fs.readdirSync(path.join(base,'simulations/fixtures')).sort();
  assert(fixtureNames.join('|') === ['LICENSE.txt','NOTICE.txt',...Object.keys(recipes)].sort().join('|'), 'Unexpected fixture directory content');
  for(const id of Object.keys(recipes)){
    const directory=path.join(base,'simulations/fixtures',id);
    assert(!fs.lstatSync(directory).isSymbolicLink() && fs.readdirSync(directory).sort().join('|')==='clean.txt|poisoned.txt','Unexpected or active fixture files');
  }
  assert(files.length === 7 && files.every(f => f.endsWith('.yaml')), 'Exactly seven YAML definitions required');
  const seen = new Set();
  const simulations = files.map(file => {
    const bytes = readRegular(definitions, file);
    const d = YAML.parse(bytes.toString('utf8'), { maxAliasCount: 0 });
    keys(d, ['id','recipe','mode','title','question','summary','attack_mappings','requirements','observations','limitations','research_credit','research_url','sources','fixtures','task','platforms','provenance'], 'definition');
    assert(Object.hasOwn(recipes,d.id) && file === `${d.id}.yaml` && !seen.has(d.id), 'Unknown, duplicate or mismatched slug'); seen.add(d.id);
    assert(d.recipe === recipes[d.id] && d.mode === (d.recipe === 'config-change' ? 'replay' : 'injection'), 'Invalid recipe or mode');
    for (const k of ['title','question','summary','limitations','research_credit','task']) text(d[k], k);
    url(d.research_url); list(d.sources, 'sources');
    for (const s of d.sources) { keys(s,['url','title'],'source'); url(s.url); text(s.title,'source title'); }
    assert(d.sources.some(s=>s.url===d.research_url),'Research URL missing from sources');
    list(d.requirements,'requirements');d.requirements.forEach(x=>text(x,'requirement'));
    list(d.observations,'observations');for(const o of d.observations){keys(o,['label','text'],'observation');text(o.label,'observation label');text(o.text,'observation text');}
    list(d.attack_mappings,'attack mappings');
    for(const m of d.attack_mappings){
      keys(m,['attack_id','stage_ids','relationship','rationale'],'mapping');assert(/^[a-z0-9-]+$/.test(m.attack_id),'Invalid attack id');
      const attack=YAML.parse(readRegular(path.join(base,'attacks'),`${m.attack_id}.yaml`).toString('utf8'));
      assert(attack.id===m.attack_id,'Attack ID mismatch');list(m.stage_ids,'stage ids');assert(new Set(m.stage_ids).size===m.stage_ids.length,'Duplicate stages');
      assert(m.stage_ids.every(id=>attack.attack_flow?.nodes.some(n=>n.id===id)),'Unknown mapped stage');
      assert(['source-match','analogue'].includes(m.relationship),'Invalid relationship');text(m.rationale,'mapping rationale');
      if(m.relationship==='source-match')assert(attack.sources.some(s=>s.url===d.research_url),'Source match lacks shared research URL');
    }
    keys(d.platforms,['macos','linux','windows'],'platforms');
    for(const p of Object.values(d.platforms)){assert(p && ['pending','passed','failed'].includes(p.status),'Invalid platform status');assert(Object.keys(p).every(k=>['status','evidence'].includes(k)),'Unknown platform fields');if(p.status!=='pending')text(p.evidence,'platform evidence');}
    keys(d.provenance,['repository','revision','entry','license','notice','modifications','source_sha256','original_fixtures'],'provenance');
    const p=d.provenance;assert(p.entry===`catalog/entries/AAB-${entries[d.id]}.yaml`,'Wrong source entry');assert(p.repository==='https://github.com/magicsword-io/solid-fortnight' && p.revision==='unreleased working-tree snapshot' && /^catalog\/entries\/AAB-\d{4}\.yaml$/.test(p.entry),'Invalid provenance');
    assert(p.license==='Apache-2.0' && p.notice==='NOTICE.txt','Missing source rights');text(p.modifications,'modifications');digest(p.source_sha256);
    assert(Array.isArray(p.original_fixtures) && p.original_fixtures.length===(d.recipe==='config-change'?0:2),'Missing original fixture hashes');
    for(const f of p.original_fixtures){keys(f,['path','sha256'],'original fixture');assert(/^catalog\/assets\/AAB-\d{4}\/[a-z0-9-]+\.txt$/.test(f.path),'Invalid original fixture path');digest(f.sha256);}
    const fixtureBase=path.join(base,'simulations/fixtures');
    assert(readRegular(fixtureBase,'LICENSE.txt').toString().includes('Apache License'),'Missing Apache license');
    assert(readRegular(fixtureBase,p.notice).toString().includes('Agent Atomics'),'Missing attribution notice');
    assert(Array.isArray(d.fixtures) && d.fixtures.length===2 && d.fixtures.map(f=>f.id).sort().join(',')==='clean,poisoned','Required closed fixtures missing');
    const fixtureData={};
    for(const f of d.fixtures){keys(f,['id','path','sha256'],'fixture reference');assert(f.path===`${d.id}/${f.id}.txt`,'Only inert fixed fixture paths allowed');digest(f.sha256);const data=readRegular(fixtureBase,f.path);assert(sha(data)===f.sha256,'Fixture SHA-256 mismatch');
      const content=data.toString('utf8');assert(!content.includes('\0'),'NUL fixture content');
      for(const match of content.matchAll(/\{\{([^}]+)\}\}/g))assert(['RUN_ID','CANARY','MARKER_NAME','MARKER_CONTENT','WORKSPACE'].includes(match[1]),'Unknown template placeholder');
      validateJsonFixture(d.recipe,f.id,content);fixtureData[f.id]=content;
    }
    assert(fixtureData.clean!==fixtureData.poisoned,'Comparison fixtures must differ');
    if(['project-instructions','skill-instructions'].includes(d.recipe))assert(!fixtureData.clean.includes('{{MARKER_') && fixtureData.poisoned.includes('{{MARKER_NAME}}') && fixtureData.poisoned.includes('{{MARKER_CONTENT}}'),'Marker comparison missing');
    if(d.recipe==='split-channel'){
      const clean=JSON.parse(fixtureData.clean).conditions.clean, conditions=JSON.parse(fixtureData.poisoned).conditions;
      assert(conditions['schema-only'].result===clean.result && conditions['result-only'].schema===clean.schema && conditions.combined.schema===conditions['schema-only'].schema && conditions.combined.result===conditions['result-only'].result && conditions.combined.schema!==clean.schema && conditions.combined.result!==clean.result,'Split conditions must isolate the two channels');
    }
    if(d.recipe==='retrieved-context'){
      const clean=JSON.parse(fixtureData.clean).cases, poisoned=JSON.parse(fixtureData.poisoned).cases;
      for(const name of Object.keys(clean)){
        for(const field of ['kind','item_id','summary'])assert(clean[name].result[field]===poisoned[name].result[field],'Retrieval baseline task drift');
        assert(clean[name].result.context!==poisoned[name].result.context,'Retrieval context must differ');
      }
    }
    return {...d,source_sha256:sha(bytes)};
  });
  return {version:1,simulations};
}
export function generate({base=root,check=false}={}){
  const output=JSON.stringify(buildCatalog(base),null,2)+'\n';const destination=path.join(base,'simulations/catalog.json');
  if(check){assert(fs.existsSync(destination) && fs.readFileSync(destination,'utf8')===output,'Generated catalog drift: run node scripts/build-simulations.mjs');}
  else fs.writeFileSync(destination,output);
  return output;
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{assert(process.argv.slice(2).every(a=>a==='--check') && process.argv.length<=3,'Usage: node scripts/build-simulations.mjs [--check]');generate({check:process.argv.includes('--check')});console.log('Simulation catalog validated.');}catch(error){console.error(error.message);process.exitCode=1;}
}
