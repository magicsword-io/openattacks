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

const kindLabels: Record<string, string> = {
  access: "Entry point",
  ai: "AI involvement",
  execution: "Action",
  impact: "Outcome",
  unknown: "Not established",
};
type StepNode = Node<
  AttackFlowNode &
    Record<string, unknown> & {
      number: number;
      mobile: boolean;
      loopIn: boolean;
      loopOut: boolean;
    },
  "step"
>;
function Step({ data }: NodeProps<StepNode>) {
  return (
    <div className={`attack-flow-node kind-${data.kind}`}>
      <Handle
        type="target"
        position={data.mobile ? Position.Top : Position.Left}
        isConnectable={false}
      />
      <div className="flow-node-kicker">
        <span>{String(data.number).padStart(2, "0")}</span>
        {kindLabels[data.kind]}
      </div>
      <strong>{data.title}</strong>
      <p>{data.description}</p>
      <a
        className="nodrag nopan"
        href={data.source_urls[0]}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Source for step ${data.number}: ${data.title}`}
      >
        Source ↗
      </a>
      <Handle
        type="source"
        position={data.mobile ? Position.Bottom : Position.Right}
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
function layout(flow: FlowData, mobile: boolean): StepNode[] {
  const level = new Map(flow.nodes.map((node) => [node.id, 0]));
  // Only non-loop edges participate in the left-to-right layout.
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
  return flow.nodes.map((node, index) => {
    const depth = level.get(node.id) || 0;
    const lane = lanes.get(depth) || 0;
    lanes.set(depth, lane + 1);
    const count = flow.nodes.filter(
      (item) => level.get(item.id) === depth,
    ).length;
    const offset = (maxLane - count) * 118;
    return {
      id: node.id,
      type: "step",
      position: mobile
        ? { x: lane * 285, y: depth * 250 }
        : { x: depth * 300, y: lane * 235 + offset },
      data: {
        ...node,
        number: index + 1,
        mobile,
        loopIn: flow.edges.some((edge) => edge.loop && edge.target === node.id),
        loopOut: flow.edges.some(
          (edge) => edge.loop && edge.source === node.id,
        ),
      },
      width: 240,
      height: 200,
      draggable: false,
      selectable: false,
      focusable: false,
    };
  });
}
export default function AttackFlow({
  flow,
  name,
}: {
  flow: FlowData;
  name: string;
}) {
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
  const nodes = useMemo(() => layout(flow, mobile), [flow, mobile]);
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
        markerEnd: { type: MarkerType.ArrowClosed, color: "#818895" },
        style: {
          stroke: "#818895",
          strokeWidth: 1.5,
          ...(edge.loop ? { strokeDasharray: "5 5" } : {}),
        },
        labelStyle: { fill: "var(--muted)", fontSize: 10 },
        labelBgStyle: { fill: "var(--panel)" },
        labelBgPadding: [6, 4] as [number, number],
        labelBgBorderRadius: 3,
      })),
    [flow],
  );
  useEffect(() => {
    if (!instance) return;
    const frame = requestAnimationFrame(() => {
      if (mobile) instance.setViewport({ x: 30, y: 25, zoom: 1 });
      else instance.fitView({ padding: 0.12, maxZoom: 1 });
    });
    return () => cancelAnimationFrame(frame);
  }, [instance, mobile, nodes]);
  const branching =
    !mobile && new Set(nodes.map((node) => node.position.y)).size > 1;
  return (
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
        fitViewOptions={{ padding: 0.12, maxZoom: 1 }}
        proOptions={{ hideAttribution: false }}
      >
        <Background
          color="var(--line)"
          gap={20}
          size={1}
          variant={BackgroundVariant.Dots}
        />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
