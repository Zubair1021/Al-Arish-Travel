import type { SVGProps } from "react";

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2 4 5v6c0 5 3.4 8.3 8 11 4.6-2.7 8-6 8-11V5l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function PassportIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="2.5" width="14" height="19" rx="2.5" />
      <circle cx="12" cy="9.5" r="3" />
      <path d="M9.5 16h5" />
    </svg>
  );
}

export function HotelIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 21V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16M16 21V9h3a1 1 0 0 1 1 1v11M2 21h20" />
      <path d="M7.5 8h1.5M11 8h1.5M7.5 12h1.5M11 12h1.5M9 21v-4h2v4" />
    </svg>
  );
}

export function PlaneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M2 16.5l20-7-4.5 12-3.5-5-5 2.5-2-1 4.5-3.5L2 16.5Z" />
    </svg>
  );
}

export function SupportIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="2.5" y="13" width="4" height="6" rx="1.5" />
      <rect x="17.5" y="13" width="4" height="6" rx="1.5" />
      <path d="M20 19a3 3 0 0 1-3 3h-3" />
      <circle cx="12.5" cy="22" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function ScholarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 9l9-4 9 4-9 4-9-4Z" />
      <path d="M7 11v4c0 1.5 2.2 2.5 5 2.5s5-1 5-2.5v-4M21 9v4" />
    </svg>
  );
}
