import React from "react";
import Svg, { Path, Circle, Defs, LinearGradient, Stop, G } from "react-native-svg";

type IconProps = { size?: number; color?: string; strokeWidth?: number };
const d = (p: IconProps) => ({
  width: p.size ?? 20,
  height: p.size ?? 20,
  viewBox: "0 0 24 24",
  fill: "none",
});
const s = (p: IconProps) => ({
  stroke: p.color ?? "currentColor",
  strokeWidth: p.strokeWidth ?? 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

/** TripSplit logo — location pin carved by a splitting travel route. */
export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <LinearGradient id="tsGold" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#E5BC52" />
          <Stop offset="0.55" stopColor="#B8891F" />
          <Stop offset="1" stopColor="#755716" />
        </LinearGradient>
      </Defs>
      <Path
        d="M24 44c8.5-8.6 15-15.8 15-24A15 15 0 0 0 9 20c0 8.2 6.5 15.4 15 24Z"
        fill="url(#tsGold)"
      />
      <Path
        d="M24 12v8m0 0-5.5 6.5M24 20l5.5 6.5"
        stroke="#121214"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Circle cx="24" cy="12" r="2.6" fill="#121214" />
      <Circle cx="18.5" cy="26.5" r="2.1" fill="#121214" />
      <Circle cx="29.5" cy="26.5" r="2.1" fill="#121214" />
    </Svg>
  );
}

export const IconPlane = (p: IconProps) => (
  <Svg {...d(p)}>
    <Path
      {...s(p)}
      d="M10.5 13.5 3 11l1.5-1.5L15 11l4.5-4.5c.8-.8 2.2-.8 3 0 .8.8.8 2.2 0 3L18 14l1.5 10.5L18 21l-2.5-7.5L11 18l-2.5 2.5V17L10.5 13.5Z"
    />
  </Svg>
);

export const IconPin = (p: IconProps) => (
  <Svg {...d(p)}>
    <Path {...s(p)} d="M12 21c4-4.2 7-7.8 7-11a7 7 0 1 0-14 0c0 3.2 3 6.8 7 11Z" />
    <Circle {...s(p)} cx="12" cy="10" r="2.4" />
  </Svg>
);

export const IconCheck = (p: IconProps) => (
  <Svg {...d(p)}>
    <Path {...s(p)} d="m4.5 12.5 5 5 10-11" />
  </Svg>
);

export const IconArrowRight = (p: IconProps) => (
  <Svg {...d(p)}>
    <Path {...s(p)} d="M4 12h15m0 0-6-6m6 6-6 6" />
  </Svg>
);

export const IconSplit = (p: IconProps) => (
  <Svg {...d(p)}>
    <Path {...s(p)} d="M12 4v6m0 0-6 6.5M12 10l6 6.5" />
    <Circle {...s(p)} cx="6" cy="19" r="2" />
    <Circle {...s(p)} cx="18" cy="19" r="2" />
    <Circle {...s(p)} cx="12" cy="4.5" r="1.8" />
  </Svg>
);

export const IconWallet = (p: IconProps) => (
  <Svg {...d(p)}>
    <Path {...s(p)} d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
    <Path {...s(p)} d="M15 12h5v3h-5a1.5 1.5 0 0 1 0-3Z" />
  </Svg>
);

export const IconUsers = (p: IconProps) => (
  <Svg {...d(p)}>
    <Circle {...s(p)} cx="9" cy="8.5" r="3" />
    <Path {...s(p)} d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
    <Path {...s(p)} d="M15.5 5.8a3 3 0 0 1 0 5.4M17.5 14.4c1.7.7 2.7 2.3 3 4.6" />
  </Svg>
);

export const IconTrophy = (p: IconProps) => (
  <Svg {...d(p)}>
    <Path {...s(p)} d="M8 4h8v6a4 4 0 0 1-8 0V4Z" />
    <Path {...s(p)} d="M8 6H5a3 3 0 0 0 3 4.5M16 6h3a3 3 0 0 1-3 4.5M12 14v3m-4 3h8m-6.5-3h5l.7 3H8.8l.7-3Z" />
  </Svg>
);

export const IconMap = (p: IconProps) => (
  <Svg {...d(p)}>
    <Path {...s(p)} d="m9 5-5 2v13l5-2 6 2 5-2V5l-5 2-6-2Zm0 0v13m6-11v13" />
  </Svg>
);

export const IconReceipt = (p: IconProps) => (
  <Svg {...d(p)}>
    <Path {...s(p)} d="M6 3.5h12V21l-2.4-1.6L13.2 21l-2.4-1.6L8.4 21 6 19.4V3.5Z" />
    <Path {...s(p)} d="M9 8h6M9 12h6M9 16h3.5" />
  </Svg>
);

export const IconBell = (p: IconProps) => (
  <Svg {...d(p)}>
    <Path {...s(p)} d="M6 16v-5a6 6 0 1 1 12 0v5l1.5 2.5H4.5L6 16Z" />
    <Path {...s(p)} d="M10 21a2.2 2.2 0 0 0 4 0" />
  </Svg>
);

export const IconSpark = (p: IconProps) => (
  <Svg {...d(p)}>
    <Path {...s(p)} d="M12 3v4m0 10v4m9-9h-4M7 12H3m14.7-6.7-2.9 2.9M9.2 14.8l-2.9 2.9m0-11.4 2.9 2.9m5.6 5.6 2.9 2.9" />
  </Svg>
);

/** Small animated dashed connector line (used in settlement + itinerary). */
export function DashedFlow({
  width,
  color,
  offset,
}: {
  width: number;
  color: string;
  offset: number;
}) {
  return (
    <Svg width={width} height={2} viewBox={`0 0 ${width} 2`}>
      <Path
        d={`M0 1 H ${width}`}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="5 6"
        strokeDashoffset={offset}
      />
    </Svg>
  );
}

export { G, Defs, LinearGradient, Stop };
