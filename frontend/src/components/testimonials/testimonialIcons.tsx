import type { SVGProps } from "react";

export function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.3l6.5-.9L12 2.5Z" />
    </svg>
  );
}

export function QuoteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M9.5 6C6.4 6 4 8.5 4 11.6V18h6.2v-6.2H7.6c0-1.7 1-2.8 2.8-2.9L9.5 6Zm10 0c-3.1 0-5.5 2.5-5.5 5.6V18h6.2v-6.2h-2.6c0-1.7 1-2.8 2.8-2.9L19.5 6Z" />
    </svg>
  );
}
