import React from "react";
import { Text, View } from "react-native";
import { useTheme, FONTS } from "../../theme-context";
import { useCountUp } from "../../lib/hooks";
import { inr } from "../../lib/format";
import { GlassCard, Avatar, Pill } from "../primitives";
import { IconTrophy } from "../icons";

const STATS = [
  { label: "TRIPS", value: 7, fmt: (n: number) => String(n) },
  { label: "CITIES", value: 14, fmt: (n: number) => String(n) },
  { label: "SPENT", value: 184620, fmt: (n: number) => inr(n) },
  { label: "BADGES", value: 12, fmt: (n: number) => String(n) },
];

const BADGES = [
  { emoji: "🏆", name: "Weekend Wanderer", sub: "5 trips done" },
  { emoji: "🌍", name: "Globe Trotter", sub: "10 destinations" },
  { emoji: "💸", name: "Budget Master", sub: "3× under budget" },
];

const BOARD = [
  { rank: "1", name: "Nehal", pts: 2140, color: "#E5BC52" },
  { rank: "2", name: "Rahul", pts: 1875, color: "#D1D1D6" },
  { rank: "3", name: "Sarah", pts: 1690, color: "#DC7E6D" },
];

/** Slide 5 — year-in-review energy: stats, achievements, leaderboard. */
export function MemoryVisual({ width, scale, active }: { width: number; scale: number; active: boolean }) {
  const t = useTheme();
  const cardW = Math.min(width - 48, 420);
  const trips = useCountUp(7, active, 900);
  const cities = useCountUp(14, active, 1100);
  const spent = useCountUp(184620, active, 1600);
  const badges = useCountUp(12, active, 1300);
  const values = [trips, cities, spent, badges];

  return (
    <View style={{ width: cardW }}>
      <GlassCard radius={22} shimmer style={{ padding: 18 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: t.colors.secondaryBg, alignItems: "center", justifyContent: "center" }}>
            <IconTrophy size={18} color={t.colors.secondary} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontFamily: FONTS.display, fontSize: 17, color: t.colors.textPrimary }}>Your 2026, wrapped</Text>
            <Text style={{ fontFamily: FONTS.monoRegular, fontSize: 9.5, color: t.colors.textTertiary, marginTop: 1 }}>
              YEAR IN REVIEW
            </Text>
          </View>
          <View style={{ marginLeft: "auto" }}>
            <Pill tone="gold">2026</Pill>
          </View>
        </View>

        {/* stat grid */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 13 }}>
          {STATS.map((s, i) => (
            <View
              key={s.label}
              style={{
                width: (cardW - 36 - 8) / 2 - 4,
                backgroundColor: t.colors.overlayLight,
                borderRadius: 14,
                padding: 12,
              }}
            >
              <Text style={{ fontFamily: FONTS.monoRegular, fontSize: 8.5, letterSpacing: 1.6, color: t.colors.textTertiary }}>
                {s.label}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: i === 2 ? 17 : 20,
                  color: i === 2 ? t.colors.secondary : t.colors.textPrimary,
                  marginTop: 3,
                }}
              >
                {s.fmt(values[i])}
              </Text>
            </View>
          ))}
        </View>

        {/* achievements */}
        <View style={{ flexDirection: "row", gap: 7, marginTop: 12 }}>
          {BADGES.map((b) => (
            <View
              key={b.name}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: t.colors.secondary,
                borderRadius: 13,
                paddingVertical: 10,
                paddingHorizontal: 6,
                alignItems: "center",
                backgroundColor: t.colors.secondaryBg,
                shadowColor: t.colors.secondary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text style={{ fontSize: 22 }}>{b.emoji}</Text>
              <Text style={{ fontFamily: FONTS.displayBold, fontSize: 10, color: t.colors.textPrimary, marginTop: 6, textAlign: "center" }}>
                {b.name}
              </Text>
              <Text style={{ fontFamily: FONTS.monoRegular, fontSize: 8, color: t.colors.secondary, marginTop: 2 }}>
                {b.sub}
              </Text>
            </View>
          ))}
        </View>

        {/* leaderboard */}
        <View style={{ marginTop: 12 }}>
          {BOARD.map((r) => (
            <View key={r.name} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 4.5 }}>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: r.color, width: 16 }}>{r.rank}</Text>
              <Avatar name={r.name} size={22} />
              <Text style={{ fontFamily: FONTS.body, fontSize: 12.5, color: t.colors.textSecondary, marginLeft: 8 }}>
                {r.name}
              </Text>
              <View style={{ marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: t.colors.secondary }}>{r.pts.toLocaleString()}</Text>
                <Text style={{ fontFamily: FONTS.monoRegular, fontSize: 8.5, color: t.colors.textTertiary }}>PTS</Text>
              </View>
            </View>
          ))}
        </View>
      </GlassCard>
    </View>
  );
}
