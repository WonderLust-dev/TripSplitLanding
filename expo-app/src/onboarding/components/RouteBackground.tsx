import React, { useEffect } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import Animated, {
  createAnimatedComponent,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../theme-context";
import { useFloat, useReducedMotion } from "../lib/hooks";

const AnimatedPath = createAnimatedComponent(Path);
const AnimatedCircle = createAnimatedComponent(Circle);

function Orbit({ size, top, left, right, color, borderWidth = 1 }: { size: number; top?: number; left?: number; right?: number; color: string; borderWidth?: number }) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth,
        borderColor: color,
        top,
        left,
        right,
      }}
    />
  );
}

function FloatingDot({ size, top, left, right, color, delay, glow = false }: { size: number; top?: number; left?: number; right?: number; color: string; delay: number; glow?: boolean }) {
  const float = useFloat(8, 3800, delay);
  const pulse = useSharedValue(1);
  const reduced = useReducedMotion();
  
  useEffect(() => {
    if (reduced || !glow) return;
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [reduced, glow, pulse]);

  const pulseStyle = Animated.useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

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
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: glow ? 0.6 : 0,
          shadowRadius: glow ? size * 1.5 : 0,
          elevation: glow ? 8 : 0,
        },
        float,
        glow && pulseStyle,
      ]}
    />
  );
}

/**
 * Enhanced ambient scene:
 * midnight gradient · aurora glow · topo orbit rings · animated dashed travel route ·
 * floating waypoints with glow · subtle particle dots
 */
export function RouteBackground() {
  const t = useTheme();
  const reduced = useReducedMotion();
  const { width, height } = useWindowDimensions();

  const dashOffset = useSharedValue(0);
  useEffect(() => {
    if (reduced) return;
    dashOffset.value = withRepeat(
      withTiming(-320, { duration: 9000, easing: Easing.linear }),
      -1,
      false
    );
  }, [reduced, dashOffset]);

  const animatedDash = Animated.useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.value,
  }));

  const line = t.isDark ? "rgba(212,166,46,0.35)" : "rgba(150,112,26,0.45)";
  const lineGlow = t.isDark ? "rgba(212,166,46,0.15)" : "rgba(150,112,26,0.20)";

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={[...t.gradients.midnight]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
      />

      {/* aurora glow - top-right (gold) */}
      <View
        style={{
          position: "absolute",
          top: -180,
          right: -160,
          width: 420,
          height: 420,
          borderRadius: 210,
          backgroundColor: t.isDark ? "rgba(184,137,31,0.12)" : "rgba(184,137,31,0.15)",
        }}
      />
      {/* aurora glow - bottom-left (cyan) */}
      <View
        style={{
          position: "absolute",
          bottom: -200,
          left: -180,
          width: 440,
          height: 440,
          borderRadius: 220,
          backgroundColor: t.isDark ? "rgba(91,135,185,0.10)" : "rgba(91,135,185,0.13)",
        }}
      />
      {/* subtle center glow */}
      <View
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          marginLeft: -150,
          marginTop: -150,
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: t.isDark ? "rgba(63,143,106,0.06)" : "rgba(63,143,106,0.08)",
        }}
      />

      {/* topo rings - larger and more visible */}
      <Orbit size={520} top={-120} left={-180} color={t.isDark ? "rgba(255,255,255,0.06)" : "rgba(18,18,20,0.07)"} borderWidth={1.5} />
      <Orbit size={380} top={-40} left={-100} color={t.isDark ? "rgba(255,255,255,0.05)" : "rgba(18,18,20,0.06)"} />
      <Orbit size={640} top={400} right={-320} color={t.isDark ? "rgba(212,166,46,0.12)" : "rgba(150,112,26,0.14)"} borderWidth={1.5} />
      <Orbit size={280} top={height * 0.6} left={width * 0.1} color={t.isDark ? "rgba(91,135,185,0.08)" : "rgba(91,135,185,0.10)"} />

      {/* the travel route - enhanced with glow */}
      <Svg width={width} height={280} style={{ position: "absolute", top: 180, opacity: 1 }}>
        <Defs>
          <RadialGradient id="routeGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={lineGlow} />
            <Stop offset="100%" stopColor="transparent" />
          </RadialGradient>
        </Defs>
        {/* glow layer */}
        <AnimatedPath
          d={`M -20 180 C ${width * 0.22} 60, ${width * 0.48} 240, ${width * 0.72} 110 S ${width + 50} 140, ${width + 70} 70`}
          stroke={lineGlow}
          strokeWidth={8}
          strokeLinecap="round"
          fill="none"
          opacity={0.5}
          animatedProps={animatedDash}
        />
        {/* main route */}
        <AnimatedPath
          d={`M -20 180 C ${width * 0.22} 60, ${width * 0.48} 240, ${width * 0.72} 110 S ${width + 50} 140, ${width + 70} 70`}
          stroke={line}
          strokeWidth={2.5}
          strokeDasharray="8 12"
          strokeLinecap="round"
          fill="none"
          animatedProps={animatedDash}
        />
      </Svg>

      {/* waypoints with glow */}
      <FloatingDot size={9} top={258} left={width * 0.18} color={t.colors.secondary} delay={0} glow />
      <FloatingDot size={7} top={340} left={width * 0.52} color={t.colors.success} delay={500} glow />
      <FloatingDot size={10} top={230} right={width * 0.12} color={t.colors.secondary} delay={900} glow />
      <FloatingDot size={6} top={480} left={width * 0.08} color={t.colors.info} delay={1300} glow />
      <FloatingDot size={8} top={420} right={width * 0.2} color={t.colors.warning} delay={1700} glow />

      {/* subtle particle dots */}
      {Array.from({ length: 12 }).map((_, i) => (
        <FloatingDot
          key={i}
          size={2 + (i % 3)}
          top={100 + (i * 60) % (height - 200)}
          left={(i * 80) % width}
          color={t.isDark ? "rgba(255,255,255,0.15)" : "rgba(18,18,20,0.12)"}
          delay={i * 200}
        />
      ))}
    </View>
  );
}
