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

function FlowLine({ color, width = 40 }: { color: string; width?: number }) {
  const reduced = useReducedMotion();
  const offset = useSharedValue(0);
  useEffect(() => {
    if (reduced) return;
    offset.value = withRepeat(withTiming(-26, { duration: 800, easing: Easing.linear }), -1, false);
  }, [reduced, offset]);
  const props = Animated.useAnimatedProps(() => ({ strokeDashoffset: offset.value }));
  return (
    <Svg width={width} height={4} viewBox={`0 0 ${width} 4`} style={{ marginHorizontal: 6 }}>
      {/* glow layer */}
      <AnimatedPath
        d={`M0 2 H ${width}`}
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray="5 8"
        opacity={0.3}
        animatedProps={props}
      />
      {/* main line */}
      <AnimatedPath
        d={`M0 2 H ${width}`}
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray="5 8"
        animatedProps={props}
      />
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
      <GlassCard radius={22} shimmer style={{ padding: 18 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: t.colors.successBg, alignItems: "center", justifyContent: "center" }}>
              <IconWallet size={18} color={t.colors.success} />
            </View>
            <View>
              <Text style={{ fontFamily: FONTS.display, fontSize: 17, color: t.colors.textPrimary }}>Final trip balance</Text>
              <Text style={{ fontFamily: FONTS.monoRegular, fontSize: 9.5, color: t.colors.textTertiary, marginTop: 1 }}>
                ALL EXPENSES SETTLED
              </Text>
            </View>
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
              backgroundColor: t.colors.secondaryBg,
              borderRadius: 14,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: t.colors.secondary,
              shadowColor: t.colors.secondary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <Avatar name={tr.from} size={26} />
            <FlowLine color={t.colors.secondary} width={36} />
            <IconArrowRight size={14} color={t.colors.secondary} strokeWidth={2.5} />
            <FlowLine color={t.colors.secondary} width={36} />
            <Avatar name={tr.to} size={26} />
            <Text style={{ fontFamily: FONTS.body, fontSize: 12.5, color: t.colors.textSecondary, marginLeft: 10, fontWeight: "500" }}>
              {tr.from} pays {tr.to}
            </Text>
            <View style={{ marginLeft: "auto" }}>
              <AmountText value={tr.amount} size={14} color={t.colors.secondary} />
            </View>
          </View>
        ))}
      </GlassCard>
    </View>
  );
}
