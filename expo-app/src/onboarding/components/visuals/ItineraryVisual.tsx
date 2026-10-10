import React from "react";
import { Text, View } from "react-native";
import { useTheme, FONTS } from "../../theme-context";
import { GlassCard, Pill } from "../primitives";
import { IconPlane, IconPin, IconMap } from "../icons";

const DAYS = [
  {
    day: "DAY 01",
    city: "London",
    items: ["🏨 Hotel check-in", "🍽️ Dinner at Soho", "📍 Big Ben at dusk"],
    travel: "🚆 Eurostar · 2h 16m",
  },
  {
    day: "DAY 03",
    city: "Paris",
    items: ["🏨 Hôtel Marais", "🗼 Eiffel Tower", "🥐 Café crawl"],
    travel: "✈️ AMS · 1h 15m",
  },
  {
    day: "DAY 06",
    city: "Amsterdam",
    items: ["🚲 Canal city tour", "🌷 Flower market"],
    travel: null,
  },
];

/** Slide 4 — the itinerary timeline with travel segments. */
export function ItineraryVisual({ width, scale, active }: { width: number; scale: number; active: boolean }) {
  const t = useTheme();
  const cardW = Math.min(width - 48, 420);

  return (
    <View style={{ width: cardW }}>
      <GlassCard radius={22} shimmer style={{ padding: 18 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: t.colors.secondaryBg, alignItems: "center", justifyContent: "center" }}>
            <IconMap size={18} color={t.colors.secondary} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontFamily: FONTS.display, fontSize: 17, color: t.colors.textPrimary }}>
              Europe Adventure
            </Text>
            <Text style={{ fontFamily: FONTS.monoRegular, fontSize: 9.5, color: t.colors.textTertiary, marginTop: 1 }}>
              3 COUNTRIES · 12 DAYS
            </Text>
          </View>
          <View style={{ marginLeft: "auto" }}>
            <Pill>PLANNED</Pill>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 5,
            marginTop: 10,
            alignItems: "center",
          }}
        >
          {["London", "Paris", "Amsterdam", "Zurich"].map((c, i, arr) => (
            <React.Fragment key={c}>
              <Text style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1, color: i <= 2 ? t.colors.secondary : t.colors.textTertiary }}>
                {c.toUpperCase()}
              </Text>
              {i < arr.length - 1 && <IconPlane size={11} color={t.colors.textTertiary} />}
            </React.Fragment>
          ))}
        </View>

        <View style={{ marginTop: 14 }}>
          {DAYS.map((d, di) => (
            <View key={d.city} style={{ flexDirection: "row" }}>
              {/* rail */}
              <View style={{ width: 20, alignItems: "center" }}>
                <View
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: 6,
                    borderWidth: 2.5,
                    borderColor: t.colors.secondary,
                    backgroundColor: t.colors.background,
                    marginTop: 3,
                  }}
                />
                {di < DAYS.length - 1 && (
                  <View
                    style={{
                      width: 0,
                      flex: 1,
                      borderLeftWidth: 1.5,
                      borderStyle: "dashed",
                      borderColor: t.colors.borderStrong,
                    }}
                  />
                )}
              </View>
              {/* content */}
              <View style={{ flex: 1, paddingBottom: 14, paddingLeft: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1.6, color: t.colors.secondary }}>
                    {d.day}
                  </Text>
                  <Text style={{ fontFamily: FONTS.displayBold, fontSize: 14.5, color: t.colors.textPrimary }}>
                    {d.city}
                  </Text>
                  <IconPin size={12} color={t.colors.textTertiary} />
                </View>
                {d.items.map((it) => (
                  <Text key={it} style={{ fontFamily: FONTS.body, fontSize: 12, color: t.colors.textSecondary, marginTop: 4 }}>
                    {it}
                  </Text>
                ))}
                {d.travel && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 8,
                      backgroundColor: t.colors.overlayCool,
                      borderRadius: 8,
                      paddingHorizontal: 9,
                      paddingVertical: 5,
                      alignSelf: "flex-start",
                    }}
                  >
                    <Text style={{ fontFamily: FONTS.monoRegular, fontSize: 10, color: t.colors.info }}>{d.travel}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* trip planning progress */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
          <Text style={{ fontFamily: FONTS.monoRegular, fontSize: 9.5, letterSpacing: 1.2, color: t.colors.textTertiary }}>
            PLANNED
          </Text>
          <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: t.colors.overlayLight, marginHorizontal: 10, overflow: "hidden" }}>
            <View style={{ width: "62%", height: 6, borderRadius: 3, backgroundColor: t.colors.secondary }} />
          </View>
          <Text style={{ fontFamily: FONTS.mono, fontSize: 10.5, color: t.colors.secondary }}>62%</Text>
        </View>
      </GlassCard>
    </View>
  );
}
