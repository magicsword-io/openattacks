import { useId, useState } from "react";
import type { QueryFormat, StageGuidance } from "../lib/stage-guidance";
import FlowIcon from "./FlowIcon";

function Copy({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState("");
  return (
    <div className="flow-copy-wrap">
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
        <FlowIcon name="copy" size={13} />
        {label}
      </button>
      <span role="status">{status}</span>
    </div>
  );
}

export default function HuntGuidance({
  guidance,
  standalone = false,
}: {
  guidance: StageGuidance;
  standalone?: boolean;
}) {
  const [format, setFormat] = useState<QueryFormat>("sigma");
  const id = useId();
  const custom = !!guidance.queries?.kql.includes("OpenAttacksAudit_CL");
  const formats = [
    { id: "sigma" as const, label: "Sigma" },
    { id: "kql" as const, label: "KQL" },
    { id: "spl" as const, label: "SPL" },
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
    <div className={standalone ? "detection-hunt" : "stage-hunt"}>
      <div className="hunt-heading">
        <h4>{guidance.title}</h4>
        <span>{guidance.visibility}</span>
      </div>
      <p>{guidance.hypothesis}</p>
      {guidance.telemetry.length > 0 && (
        <div className="hunt-log-requirements">
          <strong>Required logs</strong>
          <ul>
            {guidance.telemetry.map((source) => (
              <li key={source}>{source}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="stage-limit">
        <strong>Coverage limit.</strong> {guidance.limitation}
      </p>
      {guidance.queries && (
        <details
          open
          className={
            standalone ? "detection-query-details" : "stage-query-details"
          }
        >
          <summary>
            {custom
              ? "Query template · custom schema"
              : standalone
                ? "Open Sigma, KQL & SPL queries"
                : "Explore Sigma, KQL & SPL starters"}
            <span>
              {custom
                ? "Requires log collection and field mapping; not a native detector"
                : "Draft queries · not validated against your logs"}
            </span>
          </summary>
          <p className="query-scope">{guidance.query_scope}</p>
          {guidance.upstream_matches.length > 0 && (
            <p className="detection-upstream-matches">
              <strong>MCP reference matches:</strong>{" "}
              {guidance.upstream_matches.map((match, index) => (
                <span key={match.id}>
                  {index > 0 && ", "}
                  <a href={match.url} target="_blank" rel="noreferrer">
                    {match.name} ({match.source})
                  </a>
                </span>
              ))}
              . Catalog adaptation; not a verbatim upstream rule.
            </p>
          )}
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
                id={`${id}-format-${f.id}`}
                aria-controls={`${id}-query`}
                aria-selected={format === f.id}
                tabIndex={format === f.id ? 0 : -1}
                onClick={() => setFormat(f.id)}
                onKeyDown={(event) =>
                  tabKeys(
                    event,
                    index,
                    formats,
                    (value) => setFormat(value as QueryFormat),
                    `${id}-format`,
                  )
                }
              >
                {f.label}
              </button>
            ))}
          </div>
          <div
            id={`${id}-query`}
            role="tabpanel"
            aria-labelledby={`${id}-format-${format}`}
            tabIndex={0}
          >
            <Copy
              text={guidance.queries[format]}
              label={`Copy ${formats.find((f) => f.id === format)!.label}`}
            />
            <pre
              className={standalone ? "detection-code" : "hunt-code"}
              tabIndex={0}
            >
              <code>{guidance.queries[format]}</code>
            </pre>
          </div>
        </details>
      )}
      <details className="stage-investigation-details">
        <summary>Investigation steps</summary>
        <ol className="stage-hunt-steps">
          {guidance.investigate.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}
