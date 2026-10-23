import { useEffect, useMemo, useState } from "react";
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
import type { StageGuidance } from "../lib/stage-guidance";
import FlowIcon, { type FlowIconName } from "./FlowIcon";
import StageInspector from "./StageInspector";

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

export default function AttackFlow({
  flow,
  name,
  guidance,
  dataURL,
  sources,
}: {
  flow: FlowData;
  name: string;
  guidance: Record<string, StageGuidance>;
  dataURL: string;
  sources: string[];
}) {
  const [activeId, setActiveId] = useState(flow.nodes[0].id);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [initialView, setInitialView] = useState("evidence");
  const [mobile, setMobile] = useState(false);
  const [instance, setInstance] = useState<ReactFlowInstance<StepNode> | null>(
    null,
  );
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stage = params.get("stage");
    if (stage && flow.nodes.some((node) => node.id === stage)) {
      setActiveId(stage);
      const view = params.get("view") || "evidence";
      setInitialView(
        ["evidence", "prevent", "hunt"].includes(view) ? view : "evidence",
      );
      setInspectorOpen(true);
    }
  }, [flow]);
  useEffect(() => {
    const query = matchMedia("(max-width: 900px)");
    const sync = () => setMobile(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  const coords = useMemo(() => positions(flow, mobile), [flow, mobile]);
  const inspect = (id: string) => {
    setActiveId(id);
    setInspectorOpen(true);
    if (mobile)
      requestAnimationFrame(() =>
        document.querySelector(".stage-inspector")?.scrollIntoView({
          block: "nearest",
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        }),
      );
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
    if (!instance || mobile) return;
    const frame = requestAnimationFrame(() => {
      instance.fitView({ padding: 0.18, maxZoom: 1.15 });
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
        className={`attack-flow-canvas${branching ? " has-branches" : ""}${mobile ? " mobile-flow-list" : ""}`}
        role="group"
        aria-label={`Interactive attack flow for ${name}`}
      >
        {mobile ? (
          <ol className="mobile-network-stages">
            {flow.nodes.map((node, i) => (
              <li key={node.id}>
                <button
                  type="button"
                  className={`mobile-network-stage kind-${node.kind}${activeId === node.id ? " is-active" : ""}`}
                  aria-label={`Inspect stage ${i + 1}: ${node.title}`}
                  aria-pressed={activeId === node.id && inspectorOpen}
                  onClick={() => inspect(node.id)}
                >
                  <span className="mobile-stage-icon">
                    <FlowIcon
                      name={
                        profileIcons[guidance[node.id]?.profile] ||
                        kinds[node.kind].icon
                      }
                    />
                  </span>
                  <span>
                    <small>
                      {String(i + 1).padStart(2, "0")} ·{" "}
                      {kinds[node.kind].label}
                    </small>
                    <strong>{node.title}</strong>
                  </span>
                  {guidance[node.id]?.control && (
                    <FlowIcon name="shield" size={14} />
                  )}
                </button>
                {guidance[node.id]?.control && (
                  <a
                    className="mobile-policy-link"
                    href={guidance[node.id].control!.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FlowIcon name="shield" size={13} /> MagicSword policy
                    opportunity ↗
                  </a>
                )}
                <div className="mobile-stage-connections">
                  {flow.edges
                    .filter((e) => e.source === node.id)
                    .map((edge, j) => (
                      <button
                        type="button"
                        key={j}
                        onClick={() => inspect(edge.target)}
                      >
                        {edge.loop ? "↶ Repeats to" : "→"}{" "}
                        {String(
                          flow.nodes.findIndex((n) => n.id === edge.target) + 1,
                        ).padStart(2, "0")}
                        {edge.label ? ` · ${edge.label}` : ""}
                      </button>
                    ))}
                </div>
              </li>
            ))}
          </ol>
        ) : (
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
        )}
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
      {inspectorOpen && (
        <StageInspector
          node={active}
          number={number}
          guidance={activeGuidance}
          dataURL={dataURL}
          sources={sources}
          initialView={initialView}
          onClose={() => {
            setInspectorOpen(false);
            document
              .querySelectorAll<HTMLButtonElement>(
                ".network-stage-picker button",
              )
              .item(number - 1)
              ?.focus();
          }}
        />
      )}
    </div>
  );
}
