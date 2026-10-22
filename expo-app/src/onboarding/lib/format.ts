/**
 * TripSplit — formatting helpers
 * Indian-numbering grouping (1,84,620) without relying on Intl,
 * so it works identically on Hermes / JSC / web.
 */

export function formatINR(n: number): string {
  const rounded = Math.round(Math.abs(n));
  const s = rounded.toString();
  let out = s.length > 3 ? s.slice(-3) : s;
  let rest = s.length > 3 ? s.slice(0, -3) : "";
  while (rest.length > 2) {
    out = rest.slice(-2) + "," + out;
    rest = rest.slice(0, -2);
  }
  if (rest) out = rest + "," + out;
  return (n < 0 ? "-₹" : "₹") + out;
}

export const inr = formatINR;

/** Deterministic hue for avatar initials, drawn from the APEX palette. */
const AVATAR_HUES = ["#D4A62E", "#3F8F6A", "#5B87B9", "#CB5C48", "#6E51A8", "#3AA895"];
export function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
  return AVATAR_HUES[h % AVATAR_HUES.length];
}

/** Login endpoint of the hosted TripSplit web app. */
export const LOGIN_URL = "https://trip-split-zeta-taupe.vercel.app/login";

export const ONBOARDED_STORAGE_KEY = "@tripsplit/onboarded";
