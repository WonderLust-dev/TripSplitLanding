import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";
import {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from "react-native-reanimated";

/* ── reduced motion ─────────────────────────────────────── */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => alive && setReduced(v));
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", (v) =>
      alive && setReduced(v)
    );
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);
  return reduced;
}

/* ── gentle floating loop (chips, badges, orbs) ─────────── */
export function useFloat(amplitude = 7, duration = 3200, delay = 0) {
  const reduced = useReducedMotion();
  const y = useSharedValue(0);
  useEffect(() => {
    if (reduced) {
      y.value = 0;
      return;
    }
    y.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(amplitude, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(-amplitude, { duration, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
  }, [reduced, amplitude, duration, delay, y]);
  return useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
}

/* ── animated counter (rupee totals, stats) ─────────────── */
export function useCountUp(target: number, active: boolean, duration = 1400): number {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setDisplay(target);
      return;
    }
    progress.value = 0;
    progress.value = withTiming(1, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [active, target, duration, reduced, progress]);

  const rounded = useDerivedValue(() => Math.round(progress.value * target));
  useEffect(() => {
    const id = setInterval(() => {
      // pull latest worklet value onto the JS thread at ~30fps while animating
      setDisplay(rounded.value);
    }, 33);
    return () => clearInterval(id);
  }, [rounded]);

  return display;
}

/* ── press-scale feedback for buttons/cards ─────────────── */
export function usePressScale() {
  const scale = useSharedValue(1);
  const onPressIn = () => {
    scale.value = withTiming(0.965, { duration: 120 });
  };
  const onPressOut = () => {
    scale.value = withTiming(1, { duration: 260, easing: Easing.out(Easing.back(2)) });
  };
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return { style, onPressIn, onPressOut };
}

export { runOnJS };
