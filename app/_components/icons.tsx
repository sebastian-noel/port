import type { SVGProps } from "react";

const paths = {
  arrow: "M5 12h14m-6-6 6 6-6 6",
  external: "M7 17 17 7M7 7h10v10",
  down: "M12 4v16m-6-6 6 6 6-6",
  search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  file: "M14 2H5v20h14V7l-5-5Zm0 0v5h5M8 12h8m-8 4h8",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "m6 6 12 12M6 18 18 6",
  pause: "M8 5v14M16 5v14",
  play: "m8 5 11 7-11 7V5Z",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  trophy:
    "M7 3h10v5a5 5 0 0 1-10 0V3Zm0 2H4v3a4 4 0 0 0 4 4m9-7h3v3a4 4 0 0 1-4 4m-4 1v5m-4 3h8m-6-3h4v3h-4v-3Z",
  github:
    "M9 19c-4 1-4-2-6-2m14 5v-4c0-1-.3-2-1-2.5 4-.5 6-2 6-6a5 5 0 0 0-1.5-3.5c.2-1 .2-2-.5-3-2 0-3 1-4 1a14 14 0 0 0-6 0c-1 0-2-1-4-1-.7 1-.7 2-.5 3A5 5 0 0 0 4 9.5c0 4 2 5.5 6 6-.7.5-1 1.5-1 2.5v4",
  linkedin: "M4 9v12M4 4v.1M10 21V9m0 5c0-7 10-7 10 0v7",
};
export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: keyof typeof paths }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
