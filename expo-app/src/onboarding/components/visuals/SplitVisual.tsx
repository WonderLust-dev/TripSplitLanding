import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useTheme, FONTS } from "../../theme-context";
import { useReducedMotion } from "../../lib/hooks";
import { inr } from "../../lib/format";
import { GlassCard, AmountText, Avatar } from "../primitives";
import { IconSplit, IconCheck } from "../icons";

const PEOPLE = ["Rahul", "Sarah", "Arjun", "Nehal"];
const EQUAL = [1200, 1200, 1200, 1200];
const CUSTOM = [1500, 1000, 1800, 500];
const TOTAL = 4800;

function SplitRow({
  name,
  share,
  maxBar,
  active,
  delay,
}: {
  name: string;
  share: number;
  maxBar: number;
  active: boolean;
  delay: number;
}) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const w = useSharedValue(0);

  useEffect(() => {
    if (!active) return;
    const target = Math.max(24, (share / TOTAL) * maxBar * 2.2);
    if (reduced) {
      w.value = target;
      return;
    }
    w.value = withDelay(
      delay,
      withTiming(target, { duration: 750, easing: Easing.out(Easing.cubic) })
    );
  }, [active, share, maxBar, reduced, delay, w]);

  const barStyle = useAnimatedStyle(() => ({ width: w.value }));

  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 7 }}>
      <Avatar name={name} size={26} />
      <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: t.colors.textSecondary, marginLeft: 9, width: 58 }}>
        {name}
      </Text>
      <View style={{ flex: 1, height: 7, borderRadius: 4, backgroundColor: t.colors.overlayLight, overflow: "hidden", marginRight: 10 }}>
        <Animated.View
          style={[
            { height: 7, borderRadius: 4, backgroundColor: t.colors.secondary },
            barStyle,
          ]}
        />
      </View>
      <AmountText value={share} size={13} />
    </View>
  );
}

/** Slide 2 — live splitting demo with Equal ↔ Custom toggle. */
export function SplitVisual({ width, scale, active }: { width: number; scale: number; active: boolean }) {
  const t = useTheme();
  const cardW = Math.min(width - 48, 420);
  const [custom, setCustom] = useState(false);
  const shares = custom ? CUSTOM : EQUAL;

  return (
    <View style={{ width: cardW }}>
      <GlassCard radius={22} shimmer style={{ padding: 18 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: t.colors.secondaryBg,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: t.colors.secondary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 20 }}>🍜</Text>
          </View>
          <View style={{ marginLeft: 11 }}>
            <Text style={{ fontFamily: FONTS.display, fontSize: 17, color: t.colors.textPrimary }}>Dinner</Text>
            <Text style={{ fontFamily: FONTS.monoRegular, fontSize: 9.5, color: t.colors.textTertiary, marginTop: 1 }}>
              PAID BY NEHAL · SPLIT 4 WAYS
            </Text>
          </View>
          <View style={{ marginLeft: "auto" }}>
            <AmountText value={TOTAL} size={20} />
          </View>
        </View>

        {/* toggle */}
        <View
          style={{
            flexDirection: "row",
            marginTop: 15,
            backgroundColor: t.colors.overlayLight,
            borderRadius: 999,
            padding: 3,
            borderWidth: 1,
            borderColor: t.colors.borderLight,
          }}
        >
          {(["Equal split", "Custom"] as const).map((label, i) => {
            const on = (i === 1) === custom;
            return (
              <Pressable
                key={label}
                onPress={() => {
                  setCustom(i === 1);
                  try {
                    Haptics.selectionAsync();
                  } catch {}
                }}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 999,
                  alignItems: "center",
                  backgroundColor: on ? t.colors.secondary : "transparent",
                  shadowColor: on ? t.colors.secondary : "transparent",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: on ? 0.3 : 0,
                  shadowRadius: 4,
                  elevation: on ? 3 : 0,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.displayBold,
                    fontSize: 12,
                    color: on ? "#121214" : t.colors.textTertiary,
                  }}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ marginTop: 6 }}>
          {PEOPLE.map((p, i) => (
            <SplitRow
              key={p + (custom ? "-c" : "-e")}
              name={p}
              share={shares[i]}
              maxBar={Math.min(cardW - 48, 420) - 36 - 190}
              active={active}
              delay={i * 110}
            />
          ))}
        </View>

        <View style={{ height: 1, backgroundColor: t.colors.borderLight, marginVertical: 10 }} />

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: t.colors.successBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconCheck size={11} color={t.colors.success} />
          </View>
          <Text style={{ fontFamily: FONTS.monoRegular, fontSize: 10, color: t.colors.success, marginLeft: 8, letterSpacing: 0.6 }}>
            SHARES BALANCE TO {inr(TOTAL)} · MATH HANDLED AUTOMATICALLY
          </Text>
        </View>
      </GlassCard>

      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 12, alignItems: "center", gap: 7 }}>
        <IconSplit size={15} color={t.colors.secondary} />
        <Text style={{ fontFamily: FONTS.mono, fontSize: 10.5, letterSpacing: 1.6, color: t.colors.textTertiary }}>
          TAP "CUSTOM" — WATCH IT REBALANCE
        </Text>
      </View>
    </View>
  );
}
