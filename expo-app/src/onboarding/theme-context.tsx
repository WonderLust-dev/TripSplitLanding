import React, { createContext, useContext } from "react";
// NOTE: adjust this path if your theme lives somewhere else.
// It assumes the APEX design-system file sits at `<root>/theme/index.ts`.
import { darkThemeObj, lightTheme, type Theme } from "../../theme";

const ThemeCtx = createContext<Theme>(darkThemeObj as Theme);

export function OnboardingThemeProvider({
  theme,
  children,
}: {
  theme?: Theme;
  children: React.ReactNode;
}) {
  return <ThemeCtx.Provider value={(theme ?? darkThemeObj) as Theme}>{children}</ThemeCtx.Provider>;
}

/** Use inside any onboarding component to read the active APEX theme. */
export function useTheme(): Theme {
  return useContext(ThemeCtx);
}

/** Font families — pairs your APEX tokens (System + SpaceMono) with Bricolage Grotesque display. */
export const FONTS = {
  display: "BricolageGrotesque_800ExtraBold",
  displayBold: "BricolageGrotesque_700Bold",
  body: "System", // your typography.fontFamily.sans
  mono: "SpaceMono_700Bold",
  monoRegular: "SpaceMono_400Regular",
} as const;

export { lightTheme, darkThemeObj };
