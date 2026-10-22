import React, { useCallback, useState } from "react";
import { Linking, StatusBar, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { BricolageGrotesque_700Bold, BricolageGrotesque_800ExtraBold } from "@expo-google-fonts/bricolage-grotesque";
import { SpaceMono_400Regular, SpaceMono_700Bold } from "@expo-google-fonts/space-mono";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { OnboardingThemeProvider, useTheme, FONTS, type Theme } from "./theme-context";
import { SLIDES } from "./data/slides";
import { LOGIN_URL, ONBOARDED_STORAGE_KEY } from "./lib/format";
import { useReducedMotion } from "./lib/hooks";
import { RouteBackground } from "./components/RouteBackground";
import { PagerDots } from "./components/PagerDots";
import { LogoMark, IconArrowRight } from "./components/icons";
import { GoldButton, GhostButton, PressableScale } from "./components/primitives";

/* ────────────────────────────────────────────────────────── */

function OnboardingFlow({ onFinish, onLogin }: { onFinish?: () => void; onLogin?: () => void }) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const progress = useSharedValue(0);
  const lastIdx = useSharedValue(0);
  const scrollRef = React.useRef<Animated.ScrollView>(null);

  const count = SLIDES.length;
  const isLast = index === count - 1;
  const slide = SLIDES[index];

  const scale = Math.max(0.78, Math.min(1.02, height / 812));
  const contentW = Math.min(width - 48, 470);

  const haptic = useCallback(() => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  }, []);

  const handleIndexChange = useCallback(
    (i: number) => {
      setIndex(i);
      haptic();
    },
    [haptic]
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      const w = e.layoutMeasurement.width || 1;
      progress.value = e.contentOffset.x / w;
      const i = Math.round(progress.value);
      if (i !== lastIdx.value && i >= 0 && i < count) {
        lastIdx.value = i;
        runOnJS(handleIndexChange)(i);
      }
    },
  });

  const complete = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDED_STORAGE_KEY, "1");
    } catch {}
    onFinish?.();
  }, [onFinish]);

  const openLogin = useCallback(() => {
    try {
      Haptics.selectionAsync();
    } catch {}
    if (onLogin) {
      onLogin();
      return;
    }
    Linking.openURL(LOGIN_URL).catch(() => {});
    void complete();
  }, [onLogin, complete]);

  const goToNext = () => {
    if (isLast) return;
    scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: !reduced });
  };

  const entering = reduced ? undefined : FadeInDown.duration(420).delay(60);

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: t.colors.background }]}>
      <RouteBackground />
      <StatusBar barStyle={t.isDark ? "light-content" : "dark-content"} translucent />

      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        {/* header */}
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 22, paddingTop: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <LogoMark size={32} />
            <View>
              <Text style={{ fontFamily: FONTS.display, fontSize: 17, color: t.colors.textPrimary }}>
                Trip<Text style={{ color: t.colors.secondary }}>Split</Text>
              </Text>
              <Text style={{ fontFamily: FONTS.monoRegular, fontSize: 8, letterSpacing: 1.6, color: t.colors.textTertiary }}>
                TRAVEL TOGETHER · SPLIT SMARTER
              </Text>
            </View>
          </View>
          {!isLast && (
            <View style={{ marginLeft: "auto" }}>
              <PressableScale onPress={complete}>
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: t.borderRadius.full,
                    borderWidth: 1,
                    borderColor: t.colors.borderDefault,
                    backgroundColor: t.colors.overlayLight,
                  }}
                >
                  <Text style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 1.6, color: t.colors.textSecondary }}>
                    SKIP
                  </Text>
                </View>
              </PressableScale>
            </View>
          )}
        </View>

        {/* pager */}
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          decelerationRate="fast"
          style={{ flex: 1 }}
        >
          {SLIDES.map((s, i) => {
            const Visual = s.Visual;
            return (
              <View
                key={s.id}
                style={{ width, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}
              >
                <Visual width={width} scale={scale} active={i === index} />
              </View>
            );
          })}
        </Animated.ScrollView>

        {/* copy */}
        <View style={{ paddingHorizontal: 28, minHeight: 150 * scale }}>
          <Animated.View key={slide.id} entering={entering}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 10.5, letterSpacing: 2.4, color: t.colors.secondary, marginBottom: 10 }}>
              {slide.kicker.toUpperCase()}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.display,
                fontSize: 32 * scale,
                lineHeight: 38 * scale,
                color: t.colors.textPrimary,
                fontWeight: "800",
              }}
            >
              {slide.title}{"\n"}
              <Text style={{ color: t.colors.secondary }}>{slide.titleAccent}</Text>
            </Text>
            <Text
              style={{
                fontFamily: FONTS.body,
                fontSize: 14.5,
                lineHeight: 22,
                color: t.colors.textSecondary,
                marginTop: 12,
                maxWidth: contentW,
              }}
            >
              {slide.subtitle}
            </Text>
          </Animated.View>
        </View>

        {/* footer */}
        <View style={{ paddingHorizontal: 28, paddingBottom: 14, paddingTop: 16 }}>
          {!isLast ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
              <View style={{ flex: 1 }}>
                <PagerDots count={count} progress={progress} activeIndex={index} />
              </View>
              <PressableScale onPress={goToNext}>
                <LinearGradient
                  colors={[...t.gradients.gold]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: t.colors.secondary,
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.5,
                    shadowRadius: 18,
                    elevation: 10,
                  }}
                >
                  <IconArrowRight size={24} color="#121214" strokeWidth={2.6} />
                </LinearGradient>
              </PressableScale>
            </View>
          ) : (
            <Animated.View entering={entering} style={{ gap: 12, maxWidth: contentW, alignSelf: "stretch" }}>
              <GoldButton label="Create Your First Trip" onPress={openLogin} icon={<IconArrowRight size={18} color="#121214" strokeWidth={2.6} />} shimmer />
              <GhostButton label="Log in" onPress={openLogin} />
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 4 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: t.colors.success }} />
                <Text style={{ fontFamily: FONTS.monoRegular, fontSize: 10, letterSpacing: 1.4, color: t.colors.textTertiary }}>
                  FREE TO GET STARTED · OPENS TRIPSPLIT WEB
                </Text>
              </View>
            </Animated.View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

/* ────────────────────────────────────────────────────────── */

export function OnboardingScreen({
  theme,
  onFinish,
  onLogin,
}: {
  /** Pass `lightTheme` from your APEX design system for light mode. Defaults to `darkThemeObj`. */
  theme?: Theme;
  /** Called when the user finishes or skips. Persists `@tripsplit/onboarded` automatically. */
  onFinish?: () => void;
  /** Override the CTA action. Defaults to opening the hosted TripSplit login URL. */
  onLogin?: () => void;
}) {
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <OnboardingThemeProvider theme={theme}>
      <OnboardingFlow onFinish={onFinish} onLogin={onLogin} />
    </OnboardingThemeProvider>
  );
}

export default OnboardingScreen;
