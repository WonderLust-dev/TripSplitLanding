import React from "react";
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated from "react-native-reanimated";
import { useTheme, FONTS } from "../theme-context";
import { usePressScale } from "../lib/hooks";
import { inr, avatarColor } from "../lib/format";

/* ── GlassCard — your APEX `glass` token rendered with expo-blur ── */
export { GlassCard } from "./GlassCard";

/* ── mono INR amount with money semantics ── */
export function AmountText({
  value,
  signed = false,
  size = 15,
  color,
  style,
}: {
  value: number;
  signed?: boolean;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  const c =
    color ??
    (signed
      ? value >= 0
        ? t.colors.success
        : t.colors.danger
      : t.colors.textPrimary);
  const label = signed && value > 0 ? "+" + inr(value) : inr(value);
  return (
    <Text style={[{ fontFamily: FONTS.mono, fontSize: size, color: c }, style]}>{label}</Text>
  );
}

/* ── avatars ── */
export function Avatar({ name, size = 30 }: { name: string; size?: number }) {
  const t = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: avatarColor(name),
        borderWidth: 2,
        borderColor: t.isDark ? "#121214" : "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.displayBold,
          fontSize: size * 0.42,
          color: "#FFFFFF",
        }}
      >
        {name.charAt(0)}
      </Text>
    </View>
  );
}

export function AvatarStack({ names, size = 28, visible = 4 }: { names: string[]; size?: number; visible?: number }) {
  const shown = names.slice(0, visible);
  const rest = names.length - shown.length;
  const t = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {shown.map((n, i) => (
        <View key={n} style={{ marginLeft: i === 0 ? 0 : -size * 0.28 }}>
          <Avatar name={n} size={size} />
        </View>
      ))}
      {rest > 0 && (
        <View
          style={{
            marginLeft: -size * 0.28,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: t.colors.elevated,
            borderWidth: 2,
            borderColor: t.isDark ? "#121214" : "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontFamily: FONTS.mono, fontSize: size * 0.34, color: t.colors.textSecondary }}>
            +{rest}
          </Text>
        </View>
      )}
    </View>
  );
}

/* ── small label pill ── */
export function Pill({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "success" | "neutral" | "danger" }) {
  const t = useTheme();
  const map = {
    gold: { border: t.colors.secondary, text: t.colors.secondary },
    success: { border: t.colors.success, text: t.colors.success },
    danger: { border: t.colors.danger, text: t.colors.danger },
    neutral: { border: t.colors.borderStrong, text: t.colors.textSecondary },
  }[tone];
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: map.border,
        borderRadius: t.borderRadius.full,
        paddingHorizontal: 10,
        paddingVertical: 3,
        alignSelf: "flex-start",
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 9.5,
          letterSpacing: 1.4,
          color: map.text,
          textTransform: "uppercase",
        }}
      >
        {children}
      </Text>
    </View>
  );
}

/* ── kicker line: dash + mono uppercase ── */
export function Kicker({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <View style={{ width: 22, height: 1.5, backgroundColor: t.colors.secondary }} />
      <Text
        style={{
          fontFamily: FONTS.mono,
          fontSize: 10.5,
          letterSpacing: 2.2,
          textTransform: "uppercase",
          color: t.colors.secondary,
        }}
      >
        {children}
      </Text>
    </View>
  );
}

/* ── rotated dashed stamp (SETTLED / VERIFIED) ── */
export function Stamp({ children, color }: { children: React.ReactNode; color?: string }) {
  const t = useTheme();
  const c = color ?? t.colors.success;
  return (
    <View
      style={{
        borderWidth: 1.5,
        borderStyle: "dashed",
        borderColor: c,
        borderRadius: t.borderRadius.full,
        paddingHorizontal: 10,
        paddingVertical: 4,
        transform: [{ rotate: "-8deg" }],
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1.8, color: c, textTransform: "uppercase" }}>
        {children}
      </Text>
    </View>
  );
}

/* ── pressable with spring-scale feedback ── */
export function PressableScale({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { style: pressStyle, onPressIn, onPressOut } = usePressScale();
  return (
    <Animated.View style={pressStyle}>
      <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} style={style}>
        {children}
      </Pressable>
    </Animated.View>
  );
}

/* ── primary gold-gradient button ── */
export function GoldButton({
  label,
  onPress,
  icon,
}: {
  label: string;
  onPress?: () => void;
  icon?: React.ReactNode;
}) {
  const t = useTheme();
  return (
    <PressableScale onPress={onPress}>
      <LinearGradient
        colors={[...t.gradients.gold]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: t.borderRadius.full,
          paddingHorizontal: 26,
          paddingVertical: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          shadowColor: "#B8891F",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.35,
          shadowRadius: 18,
          elevation: 8,
        }}
      >
        <Text style={{ fontFamily: FONTS.displayBold, fontSize: 16, color: "#121214" }}>{label}</Text>
        {icon}
      </LinearGradient>
    </PressableScale>
  );
}

/* ── ghost / text button ── */
export function GhostButton({ label, onPress }: { label: string; onPress?: () => void }) {
  const t = useTheme();
  return (
    <PressableScale onPress={onPress}>
      <View
        style={{
          borderRadius: t.borderRadius.full,
          borderWidth: 1,
          borderColor: t.colors.borderStrong,
          paddingHorizontal: 26,
          paddingVertical: 15,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: t.colors.overlayLight,
        }}
      >
        <Text style={{ fontFamily: FONTS.displayBold, fontSize: 15, color: t.colors.textPrimary }}>{label}</Text>
      </View>
    </PressableScale>
  );
}
