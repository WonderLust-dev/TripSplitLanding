import React from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useTheme, FONTS } from "../../theme-context";
import { useFloat, useCountUp } from "../../lib/hooks";
import { inr } from "../../lib/format";
import { GlassCard, AmountText, AvatarStack, Pill } from "../primitives";
import { IconPin, IconPlane } from "../icons";

export type SlideVisualProps = { width: number; scale: number; active: boolean };

const CREW = ["Arjun", "Nehal", "Sarah", "Rahul", "Priya", "Dev"];

const CHIPS = [
  { emoji: "🏨", label: "Hotel", amount: 36000, by: "Arjun", top: -14, right: -8, rot: "3deg", delay: 0 },
  { emoji: "🍜", label: "Dinner", amount: 4820, by: "Nehal", top: 118, left: -12, rot: "-4deg", delay: 500 },
  { emoji: "🚕", label: "Taxi", amount: 1250, by: "Sarah", bottom: -16, right: 6, rot: "2deg", delay: 900 },
];

function ExpenseChip({ c, scale }: { c: (typeof CHIPS)[number]; scale: number }) {
  const t = useTheme();
  const float = useFloat(7, 3400, c.delay);
  const pos: any = {};
  if (c.top !== undefined) pos.top = c.top * scale;
  if (c.bottom !== undefined) pos.bottom = c.bottom * scale;
  if (c.left !== undefined) pos.left = c.left * scale;
  if (c.right !== undefined) pos.right = c.right * scale;
  return (
    <Animated.View style={[{ position: "absolute", transform: [{ rotate: c.rot }] }, float, pos]}>
      <GlassCard radius={14} style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 9 }}>
        <Text style={{ fontSize: 16 }}>{c.emoji}</Text>
        <View>
          <Text style={{ fontFamily: FONTS.displayBold, fontSize: 11.5, color: t.colors.textPrimary }}>{c.label}</Text>
          <AmountText value={c.amount} size={11.5} />
          <Text style={{ fontFamily: FONTS.monoRegular, fontSize: 8.5, color: t.colors.textTertiary, marginTop: 1 }}>
            Paid by {c.by}
          </Text>
        </View>
      </GlassCard>
    </Animated.View>
  );
}

/** Slide 1 — the live trip dashboard, straight from the landing hero. */
export function PlanVisual({ width, scale, active }: SlideVisualProps) {
  const t = useTheme();
  const cardW = Math.min(width - 48, 420);
  const total = useCountUp(86420, active, 1600);
  const per = useCountUp(14403, active, 1600);

  return (
    <View style={{ width: cardW, alignItems: "center" }}>
      <View style={{ width: cardW * 0.86 }}>
        <GlassCard radius={22} style={{ padding: 18 }}>
          {/* header */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <IconPin size={17} color={t.colors.secondary} />
            <Text style={{ fontFamily: FONTS.display, fontSize: 19, color: t.colors.textPrimary }}>
              Bali Escape
            </Text>
            <View style={{ marginLeft: "auto" }}>
              <Pill>LIVE TRIP</Pill>
            </View>
          </View>
          <Text style={{ fontFamily: FONTS.monoRegular, fontSize: 10.5, letterSpacing: 1, color: t.colors.textTertiary, marginTop: 4, textTransform: "uppercase" }}>
            6 travelers · 7 days · 2–9 Dec
          </Text>

          {/* totals */}
          <View style={{ flexDirection: "row", marginTop: 16, gap: 12 }}>
            <View style={{ flex: 1, backgroundColor: t.colors.overlayLight, borderRadius: 14, padding: 12 }}>
              <Text style={{ fontFamily: FONTS.monoRegular, fontSize: 9, letterSpacing: 1.4, color: t.colors.textTertiary, textTransform: "uppercase" }}>
                Trip spend
              </Text>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 21 * scale, color: t.colors.textPrimary, marginTop: 3 }}>
                {inr(total)}
              </Text>
            </View>
            <View style={{ flex: 1, backgroundColor: t.colors.overlayLight, borderRadius: 14, padding: 12 }}>
              <Text style={{ fontFamily: FONTS.monoRegular, fontSize: 9, letterSpacing: 1.4, color: t.colors.textTertiary, textTransform: "uppercase" }}>
                Per person
              </Text>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 21 * scale, color: t.colors.secondary, marginTop: 3 }}>
                {inr(per)}
              </Text>
            </View>
          </View>

          {/* crew + balance */}
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16 }}>
            <AvatarStack names={CREW} size={26} visible={5} />
            <View style={{ marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 5 }}>
              <IconPlane size={13} color={t.colors.success} />
              <Text style={{ fontFamily: FONTS.monoRegular, fontSize: 9.5, color: t.colors.success }}>all synced</Text>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: t.colors.borderLight, marginVertical: 13 }} />

          {[
            { name: "Arjun", v: 8240 },
            { name: "Nehal", v: -2180 },
            { name: "Sarah", v: -1420 },
          ].map((r) => (
            <View key={r.name} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 4.5 }}>
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: r.v >= 0 ? t.colors.success : t.colors.danger, marginRight: 9 }} />
              <Text style={{ fontFamily: FONTS.body, fontSize: 13, color: t.colors.textSecondary }}>{r.name}</Text>
              <View style={{ marginLeft: "auto" }}>
                <AmountText value={r.v} signed size={13} />
              </View>
            </View>
          ))}
        </GlassCard>

        {/* floating expense chips */}
        {CHIPS.map((c) => (
          <ExpenseChip key={c.label} c={c} scale={scale} />
        ))}
      </View>
    </View>
  );
}
