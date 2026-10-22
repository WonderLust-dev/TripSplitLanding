import React from "react";
import { StyleSheet, StyleProp, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../theme-context";

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** override the token's glass.borderRadius */
  radius?: number;
  /** override blur strength (default: min(glass.blur, 45)) */
  intensity?: number;
  /** add a subtle shimmer overlay */
  shimmer?: boolean;
}

/**
 * Renders your APEX `glass` token (background, per-side borders, radius,
 * shadow) on top of expo-blur. Fully typed against `Theme` — no `any`,
 * no spreads that can silently overwrite earlier properties.
 */
export function GlassCard({ children, style, radius, intensity, shimmer = false }: GlassCardProps) {
  const t = useTheme();
  const g = t.glass;
  const r = radius ?? g.borderRadius;

  return (
    <View
      style={[
        {
          borderRadius: r,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <BlurView
        intensity={intensity ?? Math.min(g.blur, 45)}
        tint={t.isDark ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />
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
        {shimmer && (
          <LinearGradient
            colors={[
              "transparent",
              t.isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.15)",
              "transparent",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { opacity: 0.6 }]}
          />
        )}
      </View>
    </View>
  );
}
