import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  createAnimatedComponent,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme, FONTS } from "../../theme-context";
import { useReducedMotion } from "../../lib/hooks";
import { GlassCard, AmountText, Avatar, Stamp, Pill } from "../primitives";
import { IconWallet, IconArrowRight } from "../icons";

const AnimatedPath = createAnimatedComponent(Path);

function FlowLine({ color }: { color: string }) {
  const reduced = useReducedMotion();
  const offset = useSharedValue(0);
  useEffect(() => {
    if (reduced) return;
    offset.value = withRepeat(withTiming(-22, { duration: 900, easing: Easing.linear }), -1, false);
  }, [reduced, offset]);
  const props = Animated.useAnimatedProps(() => ({ strokeDashoffset: offset.value }));
  return (
    <Svg width={34} height={2} viewBox="0 0 34 2" style={{ marginHorizontal: 4 }}>
      <AnimatedPath d="M0 1 H34" stroke={color} strokeWidth={2} strokeLinecap="round" strokeDasharray="4 7" animatedProps={props} />
    </Svg>
  );
}

const BALANCES = [
  { name: "Arjun", v: 4820 },
  { name: "Nehal", v: -2140 },
  { name: "Sarah", v: -1280 },
  { name: "Rahul", v: -1400 },
];

const TRANSFERS = [
  { from: "Nehal", to: "Arjun", amount: 2140 },
  { from: "Sarah", to: "Arjun", amount: 1280 },
  { from: "Rahul", to: "Arjun", amount: 1400 },
];

/** Slide 3 — final balances collapse into 3 simple transfers. */
export function SettleVisual({ width, scale, active }: { width: number; scale: number; active: boolean }) {
  const t = useTheme();
  const cardW = Math.min(width - 48, 420);

  return (
    <View style={{ width: cardW }}>
      <GlassCard radius={22} style={{ padding: 18 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <IconWallet size={17} color={t.colors.secondary} />
            <Text style={{ fontFamily: FONTS.display, fontSize: 17, color: t.colors.textPrimary }}>Final trip balance</Text>
          </View>
          <View style={{ marginLeft: "auto" }}>
            <Stamp>✓ Settled</Stamp>
          </View>
        </View>

        <View style={{ marginTop: 12 }}>
          {BALANCES.map((b) => (
            <View key={b.name} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 5 }}>
              <Avatar name={b.name} size={24} />
              <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: t.colors.textSecondary, marginLeft: 9 }}>
                {b.name}
              </Text>
              <View style={{ marginLeft: "auto" }}>
                <AmountText value={b.v} signed size={14} />
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 1, borderStyle: "dashed", borderBottomWidth: 1, borderColor: t.colors.borderDefault, marginVertical: 12 }} />

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 9.5, letterSpacing: 1.8, color: t.colors.textTertiary }}>
            SIMPLIFIED · 3 PAYMENTS INSTEAD OF 6
          </Text>
          <View style={{ marginLeft: "auto" }}>
            <Pill tone="success">OPTIMAL</Pill>
          </View>
        </View>

        {TRANSFERS.map((tr) => (
          <View
            key={tr.from}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: t.colors.overlayLight,
              borderRadius: 14,
              paddingHorizontal: 12,
              paddingVertical: 9,
              marginBottom: 7,
            }}
          >
            <Avatar name={tr.from} size={24} />
            <FlowLine color={t.colors.secondary} />
            <IconArrowRight size={12} color={t.colors.secondary} />
            <FlowLine color={t.colors.secondary} />
            <Avatar name={tr.to} size={24} />
            <Text style={{ fontFamily: FONTS.body, fontSize: 12, color: t.colors.textSecondary, marginLeft: 9 }}>
              {tr.from} pays {tr.to}
            </Text>
            <View style={{ marginLeft: "auto" }}>
              <AmountText value={tr.amount} size={13.5} color={t.colors.secondary} />
            </View>
          </View>
        ))}
      </GlassCard>
    </View>
  );
}
