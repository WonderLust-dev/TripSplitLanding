import React, { useEffect } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import Animated, {
  createAnimatedComponent,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../theme-context";
import { useFloat, useReducedMotion } from "../lib/hooks";

const AnimatedPath = createAnimatedComponent(Path);

function Orbit({ size, top, left, right, color }: { size: number; top?: number; left?: number; right?: number; color: string }) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: color,
        top,
        left,
        right,
      }}
    />
  );
}

function FloatingDot({ size, top, left, right, color, delay }: { size: number; top?: number; left?: number; right?: number; color: string; delay: number }) {
  const float = useFloat(6, 3600, delay);
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          top,
          left,
          right,
        },
        float,
      ]}
    />
  );
}

/**
 * Ambient scene behind every slide:
 * midnight gradient · topo orbit rings · an animated dashed travel route ·
 * floating gold/green waypoints · a soft gold glow.
 */
export function RouteBackground() {
  const t = useTheme();
  const reduced = useReducedMotion();
  const { width } = useWindowDimensions();

  const dashOffset = useSharedValue(0);
  useEffect(() => {
    if (reduced) return;
    dashOffset.value = withRepeat(
      withTiming(-260, { duration: 11000, easing: Easing.linear }),
      -1,
      false
    );
  }, [reduced, dashOffset]);

  const animatedDash = Animated.useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  const line = t.isDark ? "rgba(212,166,46,0.28)" : "rgba(150,112,26,0.35)";

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={[...t.gradients.midnight]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      {/* soft gold glow, top-right */}
      <View
        style={{
          position: "absolute",
          top: -140,
          right: -120,
          width: 340,
          height: 340,
          borderRadius: 170,
          backgroundColor: t.isDark ? "rgba(184,137,31,0.10)" : "rgba(184,137,31,0.12)",
        }}
      />
      {/* cool glow, bottom-left */}
      <View
        style={{
          position: "absolute",
          bottom: -160,
          left: -140,
          width: 360,
          height: 360,
          borderRadius: 180,
          backgroundColor: t.isDark ? "rgba(91,135,185,0.08)" : "rgba(91,135,185,0.10)",
        }}
      />

      {/* topo rings */}
      <Orbit size={420} top={-90} left={-140} color={t.isDark ? "rgba(255,255,255,0.05)" : "rgba(18,18,20,0.06)"} />
      <Orbit size={300} top={-30} left={-80} color={t.isDark ? "rgba(255,255,255,0.04)" : "rgba(18,18,20,0.05)"} />
      <Orbit size={520} top={330} right={-260} color={t.isDark ? "rgba(212,166,46,0.10)" : "rgba(150,112,26,0.12)"} />

      {/* the travel route */}
      <Svg width={width} height={220} style={{ position: "absolute", top: 150, opacity: 0.9 }}>
        <AnimatedPath
          d={`M -20 160 C ${width * 0.25} 40, ${width * 0.5} 200, ${width * 0.75} 90 S ${width + 40} 120, ${width + 60} 60`}
          stroke={line}
          strokeWidth={2}
          strokeDasharray="6 10"
          strokeLinecap="round"
          fill="none"
          animatedProps={animatedDash}
        />
      </Svg>

      {/* waypoints */}
      <FloatingDot size={7} top={238} left={width * 0.2} color={t.colors.secondary} delay={0} />
      <FloatingDot size={5} top={300} left={width * 0.55} color={t.colors.success} delay={400} />
      <FloatingDot size={8} top={210} right={width * 0.14} color={t.colors.secondary} delay={800} />
      <FloatingDot size={5} top={420} left={width * 0.12} color={t.colors.info} delay={1200} />
    </View>
  );
}
