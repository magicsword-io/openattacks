import { useEffect, useId, useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  type Node,
  type NodeProps,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { AttackFlow as FlowData, AttackFlowNode } from "../lib/catalog";
import type { QueryFormat, StageGuidance } from "../lib/stage-guidance";
import FlowIcon, { type FlowIconName } from "./FlowIcon";

const kinds: Record<
  AttackFlowNode["kind"],
  { label: string; icon: FlowIconName }
> = {
  access: { label: "Entry point", icon: "entry" },
  ai: { label: "AI involvement", icon: "ai" },
  execution: { label: "Action", icon: "terminal" },
  impact: { label: "Outcome", icon: "target" },
  unknown: { label: "Not established", icon: "unknown" },
};
const profileIcons: Record<string, FlowIconName> = {
  web: "server",
  "linux-webshell": "server",
  cloud: "cloud",
  bedrock: "cloud",
  metadata: "cloud",
  credentials: "key",
  identity: "key",
  extension: "browser",
  repository: "server",
  exfil: "upload",
  phishing: "mail",
  "agent-tools": "network",
  provider: "ai",
  "model-network": "ai",
  "mcp-config": "network",
};
type StepNode = Node<
  AttackFlowNode &
    Record<string, unknown> & {
      number: number;
      mobile: boolean;
      loopIn: boolean;
      loopOut: boolean;
      active: boolean;
      guidance: StageGuidance;
      inspect: (id: string) => void;
    },
  "step"
>;

function Step({ data }: NodeProps<StepNode>) {
  return (
    <div
      className={`attack-flow-node kind-${data.kind}${data.active ? " is-active" : ""}`}
    >
      <Handle
        type="target"
        position={data.mobile ? Position.Top : Position.Left}
        style={data.mobile ? undefined : { top: 37, left: 56 }}
        isConnectable={false}
      />
      <button
        type="button"
        className="network-stage nodrag nopan"
        aria-label={`Inspect stage ${data.number}: ${data.title}`}
        aria-pressed={data.active}
        onClick={() => data.inspect(data.id)}
      >
        <span className="network-orb">
          <FlowIcon
            name={profileIcons[data.guidance.profile] || kinds[data.kind].icon}
            size={27}
          />
          <span className="network-stage-number">
            {String(data.number).padStart(2, "0")}
          </span>
        </span>
        <span className="flow-node-kicker">{kinds[data.kind].label}</span>
        <strong>{data.title}</strong>
        <span className="network-stage-summary">{data.description}</span>
      </button>
      {data.guidance.control && (
        <a
          className="network-control-link nodrag nopan"
          href={data.guidance.control.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`${data.guidance.control.title}. ${data.guidance.control.scope}`}
          aria-label={`MagicSword policy opportunity for stage ${data.number}. ${data.guidance.control.scope}`}
        >
          <FlowIcon name="shield" size={12} /> MagicSword{" "}
          <span aria-hidden="true">↗</span>
        </a>
      )}
      <Handle
        type="source"
        position={data.mobile ? Position.Bottom : Position.Right}
        style={data.mobile ? undefined : { top: 37, left: 126, right: "auto" }}
        isConnectable={false}
      />
      {data.loopOut && (
        <Handle
          id="loop-out"
          type="source"
          position={data.mobile ? Position.Right : Position.Bottom}
          style={{ left: data.mobile ? undefined : "65%" }}
          isConnectable={false}
        />
      )}
      {data.loopIn && (
        <Handle
          id="loop-in"
          type="target"
          position={data.mobile ? Position.Right : Position.Bottom}
          style={{ left: data.mobile ? undefined : "35%" }}
          isConnectable={false}
        />
      )}
    </div>
  );
}
const nodeTypes = { step: Step };

function positions(flow: FlowData, mobile: boolean) {
  const level = new Map(flow.nodes.map((node) => [node.id, 0]));
  for (let pass = 0; pass < flow.nodes.length; pass++)
    for (const edge of flow.edges.filter((edge) => !edge.loop))
      level.set(
        edge.target,
        Math.max(
          level.get(edge.target) || 0,
          (level.get(edge.source) || 0) + 1,
        ),
      );
  const maxLane = Math.max(
    ...[...new Set(level.values())].map(
      (depth) =>
        flow.nodes.filter((node) => level.get(node.id) === depth).length,
    ),
  );
  const lanes = new Map<number, number>();
  return flow.nodes.map((node) => {
    const depth = level.get(node.id) || 0;
    const lane = lanes.get(depth) || 0;
    lanes.set(depth, lane + 1);
    const count = flow.nodes.filter(
      (item) => level.get(item.id) === depth,
    ).length;
    return mobile
      ? { x: lane * 245, y: depth * 275 }
      : { x: depth * 255, y: lane * 280 + (maxLane - count) * 140 };
  });
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(""), 2400);
    return () => clearTimeout(timer);
  }, [status]);
  return (
    <span className="flow-copy-wrap">
      <button
        type="button"
        className="flow-small-button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setStatus("Copied");
          } catch {
            setStatus("Select the text below to copy");
          }
        }}
      >
        <FlowIcon name="copy" size={12} />
        {label}
      </button>
      <span role="status">{status}</span>
    </span>
  );
}

function HuntDetails({
  guidance,
  stageId,
}: {
  guidance: StageGuidance;
  stageId: string;
}) {
  const [format, setFormat] = useState<QueryFormat>("sigma");
  const tabId = useId();
  const formats: { id: QueryFormat; label: string }[] = [
    { id: "sigma", label: "Sigma" },
    { id: "kql", label: "KQL" },
    { id: "spl", label: "SPL" },
  ];
  return (
    <div className="stage-hunt">
      <div className="stage-detail-label">
        <FlowIcon name="search" size={14} /> HOW TO HUNT THIS STAGE{" "}
        <span className="draft-badge">
          {guidance.queries
            ? "Draft hunt"
            : guidance.validation === "not_assessed"
              ? "Not mapped"
              : "Evidence gap"}
        </span>
      </div>
      <h3>{guidance.title}</h3>
      <p>{guidance.hypothesis}</p>
      <div className="stage-telemetry">
        <span>Required visibility</span>
        <p>{guidance.visibility}</p>
        {guidance.telemetry.length > 0 && (
          <ul>
            {guidance.telemetry.map((source) => (
              <li key={source}>{source}</li>
            ))}
          </ul>
        )}
      </div>
      <ol className="stage-hunt-steps">
        {guidance.investigate.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="stage-limit">
        <strong>Coverage limit.</strong> {guidance.limitation}
      </p>
      {guidance.queries && (
        <details className="stage-query-details" key={stageId}>
          <summary>
            Explore Sigma, KQL & SPL starters{" "}
            <span>Not validated against your logs</span>
          </summary>
          <p className="query-scope">{guidance.query_scope}</p>
          <div
            className="query-formats"
            role="tablist"
            aria-label="Hunt query format"
          >
            {formats.map((f, index) => (
              <button
                type="button"
                role="tab"
                key={f.id}
                id={`${tabId}-${f.id}`}
                aria-controls={`${tabId}-panel`}
                aria-selected={format === f.id}
                tabIndex={format === f.id ? 0 : -1}
                onClick={() => setFormat(f.id)}
                onKeyDown={(event) => {
                  const next =
                    event.key === "ArrowRight"
                      ? (index + 1) % formats.length
                      : event.key === "ArrowLeft"
                        ? (index + formats.length - 1) % formats.length
                        : event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? formats.length - 1
                            : -1;
                  if (next < 0) return;
                  event.preventDefault();
                  setFormat(formats[next].id);
                  document
                    .getElementById(`${tabId}-${formats[next].id}`)
                    ?.focus();
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div
            id={`${tabId}-panel`}
            role="tabpanel"
            aria-labelledby={`${tabId}-${format}`}
            tabIndex={0}
          >
            <CopyButton
              text={guidance.queries[format]}
              label={`Copy ${formats.find((f) => f.id === format)!.label}`}
            />
            <pre className="hunt-code">
              <code>{guidance.queries[format]}</code>
            </pre>
          </div>
        </details>
      )}
      <details className="stage-mcp-details">
        <summary>
          Research matching rules with Detection MCP{" "}
          <FlowIcon name="network" size={13} />
        </summary>
        <p>
          Use this brief with a connected{" "}
          <a
            href="https://github.com/MHaggis/Security-Detections-MCP"
            target="_blank"
            rel="noopener noreferrer"
          >
            Security Detections MCP ↗
          </a>{" "}
          to find existing rules and coverage gaps in all three formats. This
          site does not perform a live rule search.
        </p>
        <CopyButton
          text={guidance.mcp_prompt}
          label="Copy MCP research brief"
        />
        <pre className="hunt-code mcp-brief">
          <code>{guidance.mcp_prompt}</code>
        </pre>
      </details>
    </div>
  );
}

export default function AttackFlow({
  flow,
  name,
  guidance,
  dataURL,
}: {
  flow: FlowData;
  name: string;
  guidance: Record<string, StageGuidance>;
  dataURL: string;
}) {
  const [activeId, setActiveId] = useState(
    () =>
      flow.nodes.find((n) => guidance[n.id]?.control)?.id ||
      flow.nodes.find((n) => n.kind === "execution" && guidance[n.id]?.queries)
        ?.id ||
      flow.nodes[0].id,
  );
  const [mobile, setMobile] = useState(false);
  const [instance, setInstance] = useState<ReactFlowInstance<StepNode> | null>(
    null,
  );
  useEffect(() => {
    const query = matchMedia("(max-width: 680px)");
    const sync = () => setMobile(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  const coords = useMemo(() => positions(flow, mobile), [flow, mobile]);
  const inspect = (id: string) => {
    setActiveId(id);
    if (mobile && instance) {
      const at = coords[flow.nodes.findIndex((n) => n.id === id)];
      instance.setCenter(at.x + 91, at.y + 100, {
        zoom: 1,
        duration: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : 250,
      });
    }
  };
  const nodes: StepNode[] = flow.nodes.map((node, index) => ({
    id: node.id,
    type: "step",
    position: coords[index],
    data: {
      ...node,
      number: index + 1,
      mobile,
      active: node.id === activeId,
      guidance: guidance[node.id],
      inspect,
      loopIn: flow.edges.some((e) => e.loop && e.target === node.id),
      loopOut: flow.edges.some((e) => e.loop && e.source === node.id),
    },
    width: 182,
    height: 220,
    draggable: false,
    selectable: false,
    focusable: false,
  }));
  const edges = useMemo(
    () =>
      flow.edges.map((edge, index) => ({
        id: `edge-${index}`,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.loop ? "loop-out" : undefined,
        targetHandle: edge.loop ? "loop-in" : undefined,
        label: edge.label,
        type: edge.loop ? "smoothstep" : "default",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color:
            edge.source === activeId || edge.target === activeId
              ? "#b5a08c"
              : "#818895",
        },
        style: {
          stroke:
            edge.source === activeId || edge.target === activeId
              ? "#b5a08c"
              : "#818895",
          strokeWidth: 1.5,
          ...(edge.loop ? { strokeDasharray: "5 5" } : {}),
        },
        labelStyle: { fill: "var(--muted)", fontSize: 10 },
        labelBgStyle: { fill: "var(--panel)" },
        labelBgPadding: [6, 4] as [number, number],
        labelBgBorderRadius: 3,
      })),
    [flow, activeId],
  );
  useEffect(() => {
    if (!instance) return;
    const frame = requestAnimationFrame(() => {
      if (mobile) {
        const at = coords[flow.nodes.findIndex((n) => n.id === activeId)];
        instance.setCenter(at.x + 91, at.y + 100, { zoom: 1 });
      } else instance.fitView({ padding: 0.18, maxZoom: 1.15 });
    });
    return () => cancelAnimationFrame(frame);
  }, [instance, mobile, coords]);
  const branching = !mobile && new Set(coords.map((p) => p.y)).size > 1;
  const active = flow.nodes.find((n) => n.id === activeId)!;
  const activeGuidance = guidance[activeId];
  const number = flow.nodes.indexOf(active) + 1;
  return (
    <div className="attack-network">
      <div className="network-toolbar">
        <span>
          <FlowIcon name="network" size={14} /> Select a stage to explore its
          defenses
        </span>
        {flow.nodes.some((node) => guidance[node.id]?.control) && (
          <span className="network-policy-key">
            <FlowIcon name="shield" size={12} /> MagicSword policy opportunity
          </span>
        )}
      </div>
      <div
        className={`attack-flow-canvas${branching ? " has-branches" : ""}`}
        role="group"
        aria-label={`Interactive attack flow for ${name}`}
      >
        <ReactFlow<StepNode>
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onInit={setInstance}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          edgesFocusable={false}
          nodesFocusable={false}
          deleteKeyCode={null}
          minZoom={0.2}
          maxZoom={1.7}
          zoomOnScroll={false}
          panOnScroll={false}
          fitView={!mobile}
          fitViewOptions={{ padding: 0.18, maxZoom: 1.15 }}
          proOptions={{ hideAttribution: false }}
        >
          <Background
            color="var(--line)"
            gap={22}
            size={1}
            variant={BackgroundVariant.Dots}
          />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      <div
        className="network-stage-picker"
        role="group"
        aria-label="Choose attack stage"
      >
        {flow.nodes.map((n, i) => (
          <button
            type="button"
            key={n.id}
            className={n.id === activeId ? "is-active" : ""}
            aria-pressed={n.id === activeId}
            aria-label={`View stage ${i + 1}: ${n.title}`}
            onClick={() => inspect(n.id)}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            <span>{kinds[n.kind].label}</span>
            {guidance[n.id]?.control && <FlowIcon name="shield" size={11} />}
          </button>
        ))}
      </div>
      <section
        className="stage-inspector"
        aria-label="Selected stage details"
        data-stage-id={active.id}
      >
        <div className={`stage-context kind-${active.kind}`}>
          <div className="stage-detail-label">
            <span className="stage-detail-number">
              {String(number).padStart(2, "0")}
            </span>{" "}
            {kinds[active.kind].label}
          </div>
          <h3 aria-live="polite">{active.title}</h3>
          <p>{active.description}</p>
          <div className="stage-source-links">
            {active.source_urls.map((url, i) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                {active.source_urls.length > 1
                  ? `Source ${i + 1}`
                  : "Original evidence"}{" "}
                ↗
              </a>
            ))}
            <a href={dataURL}>Hunt data ↗</a>
          </div>
          {activeGuidance.note && (
            <p className="stage-editorial-note">{activeGuidance.note}</p>
          )}
          {activeGuidance.control ? (
            <div className="stage-control">
              <div className="stage-detail-label">
                <FlowIcon name="shield" size={14} /> PREVENT WITH MAGICSWORD
              </div>
              <h4>{activeGuidance.control.title}</h4>
              <p>{activeGuidance.control.action}</p>
              <p>
                <strong>Applies to:</strong> {activeGuidance.control.scope}
              </p>
              <p className="stage-limit">{activeGuidance.control.limitation}</p>
              <a
                href={activeGuidance.control.url}
                target="_blank"
                rel="noopener noreferrer"
                className="stage-control-cta"
              >
                Explore this policy control <FlowIcon name="arrow" size={13} />
              </a>
            </div>
          ) : (
            <div className="stage-no-control">
              <FlowIcon name="shield" size={15} />
              <p>
                No direct MagicSword prevention claim for this stage. Use the
                visibility and controls described in the hunt.
              </p>
            </div>
          )}
          {activeGuidance.resource && (
            <a
              className="stage-resource"
              href={activeGuidance.resource.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FlowIcon name="network" size={14} />
              <span>
                <strong>{activeGuidance.resource.name}</strong>
                <small>Community intelligence for this stage</small>
              </span>
              <FlowIcon name="arrow" size={13} />
            </a>
          )}
        </div>
        <HuntDetails
          key={activeId}
          guidance={activeGuidance}
          stageId={activeId}
        />
      </section>
    </div>
  );
}
