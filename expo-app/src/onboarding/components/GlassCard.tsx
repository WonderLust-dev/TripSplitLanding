import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "../theme-context";

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** override the token's glass.borderRadius */
  radius?: number;
  /** override blur strength (default: min(glass.blur, 45)) */
  intensity?: number;
}

/**
 * Renders your APEX `glass` token (background, per-side borders, radius,
 * shadow) on top of expo-blur. Fully typed against `Theme` — no `any`,
 * no spreads that can silently overwrite earlier properties.
 */
export function GlassCard({ children, style, radius, intensity }: GlassCardProps) {
  const t = useTheme();
  const g = t.glass;
  const r = radius ?? g.borderRadius;

  return (
    <BlurView
      intensity={intensity ?? Math.min(g.blur, 45)}
      tint={t.isDark ? "dark" : "light"}
      style={[
        {
          borderRadius: r,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: g.background,

          // per-side border widths + colors (all from the glass token)
          borderTopWidth: g.borderTopWidth,
          borderLeftWidth: g.borderLeftWidth,
          borderRightWidth: g.borderRightWidth,
          borderBottomWidth: g.borderBottomWidth,
          borderTopColor: g.borderTopColor,
          borderLeftColor: g.borderLeftColor,
          borderRightColor: g.borderRightColor,
          borderBottomColor: g.borderBottomColor,

          shadowColor: g.shadowColor,
          shadowOffset: g.shadowOffset,
          shadowOpacity: g.shadowOpacity,
          shadowRadius: g.shadowRadius,
          elevation: g.elevation,
        }}
      >
        {children}
      </View>
    </BlurView>
  );
}
