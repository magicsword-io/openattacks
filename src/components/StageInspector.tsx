import { useId, useState } from "react";
import type { AttackFlowNode } from "../lib/catalog";
import type { StageGuidance } from "../lib/stage-guidance";
import FlowIcon from "./FlowIcon";
import HuntGuidance from "./HuntGuidance";

export default function StageInspector({
  node,
  number,
  guidance,
  dataURL,
  sources,
  initialView = "evidence",
  onClose,
}: {
  node: AttackFlowNode;
  number: number;
  guidance: StageGuidance;
  dataURL: string;
  sources: string[];
  initialView?: string;
  onClose: () => void;
}) {
  const [view, setView] = useState(initialView);
  const id = useId();
  const views = [
    { id: "evidence", label: "Evidence" },
    { id: "prevent", label: "Prevent" },
    { id: "hunt", label: "Hunt" },
  ];
  const tabKeys = (
    event: React.KeyboardEvent,
    index: number,
    options: { id: string }[],
    pick: (id: string) => void,
    prefix: string,
  ) => {
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % options.length
        : event.key === "ArrowLeft"
          ? (index + options.length - 1) % options.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? options.length - 1
              : -1;
    if (next < 0) return;
    event.preventDefault();
    pick(options[next].id);
    document.getElementById(`${prefix}-${options[next].id}`)?.focus();
  };
  return (
    <section
      className="stage-inspector stage-inspector-focused"
      aria-label="Selected stage details"
      data-stage-id={node.id}
    >
      <div className="inspector-heading">
        <div>
          <span className="stage-detail-label">
            STAGE {String(number).padStart(2, "0")}
          </span>
          <h3 aria-live="polite">{node.title}</h3>
        </div>
        <button
          type="button"
          className="inspector-close"
          onClick={onClose}
          aria-label="Close stage details"
        >
          ×
        </button>
      </div>
      <div className="inspector-tabs" role="tablist" aria-label="Stage details">
        {views.map((v, index) => (
          <button
            type="button"
            role="tab"
            key={v.id}
            id={`${id}-${v.id}`}
            aria-controls={`${id}-view`}
            aria-selected={view === v.id}
            tabIndex={view === v.id ? 0 : -1}
            onClick={() => setView(v.id)}
            onKeyDown={(event) => tabKeys(event, index, views, setView, id)}
          >
            {v.label}
            {v.id === "prevent" && guidance.control && (
              <FlowIcon name="shield" size={12} />
            )}
            {v.id === "hunt" && (
              <span className="draft-badge">
                {guidance.queries
                  ? "Draft"
                  : guidance.validation === "not_assessed"
                    ? "Not mapped"
                    : "Evidence gap"}
              </span>
            )}
          </button>
        ))}
      </div>
      <div
        id={`${id}-view`}
        role="tabpanel"
        aria-labelledby={`${id}-${view}`}
        tabIndex={0}
        className="inspector-body"
      >
        {view === "evidence" && (
          <div className="stage-evidence">
            <p>{node.description}</p>
            {guidance.note && (
              <p className="stage-editorial-note">{guidance.note}</p>
            )}
            <div className="stage-source-links">
              {node.source_urls.map((url) => (
                <a
                  key={url}
                  href={`#source-${Math.max(0, sources.indexOf(url)) + 1}`}
                >
                  Source [{Math.max(0, sources.indexOf(url)) + 1}]
                </a>
              ))}
              <a href={dataURL}>Full stage data</a>
            </div>
          </div>
        )}
        {view === "prevent" && (
          <div>
            {guidance.control ? (
              <div className="stage-control">
                <div className="stage-detail-label">
                  <FlowIcon name="shield" size={14} /> PREVENT WITH MAGICSWORD
                </div>
                <h4>{guidance.control.title}</h4>
                <p>{guidance.control.action}</p>
                <p>
                  <strong>Applies to:</strong> {guidance.control.scope}
                </p>
                <p className="policy-prerequisite">
                  Requires an enforced Windows policy covering the actual
                  executable. Audit mode records events without blocking.
                </p>
                <a
                  href={guidance.control.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="stage-control-cta"
                >
                  Explore the policy control
                </a>
                <details className="policy-requirements">
                  <summary>Scope and limitations</summary>
                  <p>{guidance.control.limitation}</p>
                </details>
              </div>
            ) : (
              <p className="stage-no-control">
                No MagicSword execution-policy opportunity is mapped to this
                stage. Consult the source's defensive guidance for other
                controls.
              </p>
            )}
            {guidance.resource && (
              <a
                className="stage-resource"
                href={guidance.resource.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FlowIcon name="network" size={14} />
                <span>
                  <strong>{guidance.resource.name}</strong>
                  <small>Community intelligence for this stage</small>
                </span>
              </a>
            )}
          </div>
        )}
        {view === "hunt" && <HuntGuidance key={node.id} guidance={guidance} />}
      </div>
    </section>
  );
}
