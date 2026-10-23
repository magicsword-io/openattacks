export type FlowIconName =
  | "entry"
  | "ai"
  | "terminal"
  | "target"
  | "unknown"
  | "shield"
  | "search"
  | "arrow"
  | "copy"
  | "network"
  | "server"
  | "cloud"
  | "key"
  | "browser"
  | "mail"
  | "upload";
const paths: Record<FlowIconName, string> = {
  entry: "M14 3h7v18h-7M3 12h13m-4-4 4 4-4 4M5 5h4M5 19h4",
  ai: "M8 3h8v4h4v10h-4v4H8v-4H4V7h4ZM8 8h8v8H8ZM1 9h3m-3 6h3m16-6h3m-3 6h3M9 1v2m6-2v2M9 21v2m6-2v2",
  terminal: "M3 4h18v16H3Zm3 5 3 3-3 3m6 0h6",
  target: "M21 12a9 9 0 1 1-9-9m5 9a5 5 0 1 1-5-5m0 5L22 2m-5 0h5v5",
  unknown: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9a3 3 0 1 1 4 3v2m-1 3h.01",
  shield: "m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6Zm-4 10 3 3 5-6",
  search: "M20 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-2 6 5 6",
  arrow: "M7 17 17 7M7 7h10v10",
  copy: "M8 8h13v13H8ZM4 16H2V2h14v2",
  network: "M9 2h6v6H9Zm-7 14h6v6H2Zm14 0h6v6h-6ZM12 8v4M5 16v-4h14v4",
  server: "M3 3h18v7H3Zm0 11h18v7H3ZM6 6.5h.01M6 17.5h.01M10 6.5h7M10 17.5h7",
  cloud: "M7 19h11a5 5 0 0 0 1-10 7 7 0 0 0-13-1 5.5 5.5 0 0 0 1 11Z",
  key: "M14 6a5 5 0 1 1-7 7L2 18v4h4v-3h3l3-3m4-8h.01",
  browser: "M3 4h18v16H3ZM3 9h18M6 6.5h.01m3 0h.01M8 13h8m-8 3h5",
  mail: "M2 5h20v14H2Zm0 0 10 8L22 5",
  upload: "M12 16V2m-5 5 5-5 5 5M3 14v7h18v-7",
};
export default function FlowIcon({
  name,
  size = 22,
}: {
  name: FlowIconName;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
