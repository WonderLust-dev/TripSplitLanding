import React, { useCallback, useState } from "react";
import { Linking, StatusBar, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { BricolageGrotesque_700Bold, BricolageGrotesque_800ExtraBold } from "@expo-google-fonts/bricolage-grotesque";
import { SpaceMono_400Regular, SpaceMono_700Bold } from "@expo-google-fonts/space-mono";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
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
                <Text style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 1.4, color: t.colors.textTertiary }}>
                  SKIP
                </Text>
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
        <View style={{ paddingHorizontal: 28, minHeight: 132 * scale }}>
          <Animated.View key={slide.id} entering={entering}>
            <Text style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 2.2, color: t.colors.secondary }}>
              {slide.kicker.toUpperCase()}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.display,
                fontSize: 27 * scale,
                lineHeight: 33 * scale,
                color: t.colors.textPrimary,
                marginTop: 8,
              }}
            >
              {slide.title}{"\n"}
              <Text style={{ color: t.colors.secondary }}>{slide.titleAccent}</Text>
            </Text>
            <Text
              style={{
                fontFamily: FONTS.body,
                fontSize: 13.5,
                lineHeight: 20,
                color: t.colors.textSecondary,
                marginTop: 9,
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
                <View
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 29,
                    backgroundColor: t.colors.secondary,
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: t.colors.secondary,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.45,
                    shadowRadius: 14,
                    elevation: 8,
                  }}
                >
                  <IconArrowRight size={22} color="#121214" strokeWidth={2.4} />
                </View>
              </PressableScale>
            </View>
          ) : (
            <Animated.View entering={entering} style={{ gap: 10, maxWidth: contentW, alignSelf: "stretch" }}>
              <GoldButton label="Create Your First Trip" onPress={openLogin} icon={<IconArrowRight size={17} color="#121214" strokeWidth={2.4} />} />
              <GhostButton label="Log in" onPress={openLogin} />
              <Text style={{ fontFamily: FONTS.monoRegular, fontSize: 9.5, letterSpacing: 1.2, color: t.colors.textTertiary, textAlign: "center", marginTop: 2 }}>
                FREE TO GET STARTED · OPENS TRIPSPLIT WEB
              </Text>
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
