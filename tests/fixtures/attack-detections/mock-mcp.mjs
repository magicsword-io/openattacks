import { stdin, stdout } from "node:process";

const rules = [
  {
    id: "macos-plist",
    name: "Persistence Via PlistBuddy",
    source_type: "sigma",
    status: "stable",
    platforms: ["macos"],
    logsource_product: "macos",
    mitre_ids: ["T1543.001"],
    file_path:
      "/opt/sigma/rules/macos/process_creation/proc_creation_macos_persistence_via_plistbuddy.yml",
  },
  {
    id: "macos-launchagent-splunk",
    name: "MacOS LaunchAgent Persistence",
    source_type: "splunk_escu",
    status: "stable",
    platforms: ["macos"],
    logsource_product: "macos",
    mitre_ids: ["T1543.001"],
    file_path: "/opt/splunk/detections/macos/launchagent.yml",
  },
  {
    id: "macos-launchagent-elastic",
    name: "Launch Agent Persistence",
    source_type: "elastic",
    status: "stable",
    platforms: ["macos"],
    logsource_product: "macos",
    mitre_ids: ["T1543.001"],
    file_path: "/opt/elastic/rules/macos/persistence_launch_agent.toml",
  },
  {
    id: "windows-schtasks",
    name: "Scheduled Task Creation Via Schtasks",
    source_type: "sigma",
    status: "stable",
    platforms: ["windows"],
    logsource_product: "windows",
    mitre_ids: ["T1543.001"],
    file_path:
      "/opt/sigma/rules/windows/process_creation/proc_creation_win_schtasks_creation.yml",
  },
];

function send(message) {
  stdout.write(`${JSON.stringify(message)}\n`);
}

function payloadFor(name, args) {
  if (
    name === "list_by_mitre" &&
    (args.technique_id === "T1543.001" || args.technique_id === "T1543")
  )
    return { count: rules.length, detections: rules };
  return { count: 0, detections: [] };
}

function handle(message) {
  if (message.method === "initialize") {
    send({
      jsonrpc: "2.0",
      id: message.id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "mock-security-detections", version: "0" },
      },
    });
    return;
  }
  if (message.method !== "tools/call") return;
  const args = message.params.arguments || {};
  send({
    jsonrpc: "2.0",
    id: message.id,
    result: {
      content: [
        {
          type: "text",
          text: JSON.stringify(payloadFor(message.params.name, args)),
        },
      ],
    },
  });
}

let buffer = "";
stdin.setEncoding("utf8");
stdin.on("data", (chunk) => {
  buffer += chunk;
  let newline = buffer.indexOf("\n");
  while (newline !== -1) {
    const line = buffer.slice(0, newline).replace(/\r$/, "");
    buffer = buffer.slice(newline + 1);
    if (line.trim()) handle(JSON.parse(line));
    newline = buffer.indexOf("\n");
  }
});
