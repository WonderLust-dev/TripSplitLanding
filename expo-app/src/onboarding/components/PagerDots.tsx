import React, { useState } from "react";
import { View } from "react-native";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  Extrapolation,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "../theme-context";
import { useReducedMotion } from "../lib/hooks";

const GAP = 6;

function Segment({
  index,
  progress,
  segWidth,
  activeIndex,
  count,
}: {
  index: number;
  progress: SharedValue<number>;
  segWidth: number;
  activeIndex: number;
  count: number;
}) {
  const t = useTheme();
  const reduced = useReducedMotion();
  const isActive = index === activeIndex;
  const isDone = activeIndex > index;

  const fill = useAnimatedStyle(() => {
    const w = interpolate(
      progress.value,
      [index - 1, index],
      [0, segWidth],
      Extrapolation.CLAMP
    );
    return { width: Math.max(0, w) };
  });

  // subtle pulse on the active segment
  const pulse = useAnimatedStyle(() => {
    if (!isActive || reduced) return { opacity: 1 };
    return { opacity: 1 };
  });

  return (
    <View
      style={{
        height: 4,
        width: segWidth,
        borderRadius: 2,
        backgroundColor: t.isDark ? "rgba(255,255,255,0.12)" : "rgba(18,18,20,0.10)",
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={[
          {
            height: 4,
            borderRadius: 2,
            backgroundColor: isDone || isActive ? t.colors.secondary : t.colors.secondary,
            shadowColor: isActive ? t.colors.secondary : "transparent",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: isActive ? 0.5 : 0,
            shadowRadius: isActive ? 6 : 0,
            elevation: isActive ? 4 : 0,
          },
          fill,
          pulse,
        ]}
      />
    </View>
  );
}

/** Segmented progress bar that fills continuously with pager scroll + glow on active. */
export function PagerDots({
  count,
  progress,
  activeIndex,
}: {
  count: number;
  progress: SharedValue<number>;
  activeIndex: number;
}) {
  const [containerW, setContainerW] = useState(0);
  const segWidth = containerW > 0 ? (containerW - GAP * (count - 1)) / count : 0;

  return (
    <View
      style={{ flexDirection: "row", gap: GAP, alignItems: "center" }}
      onLayout={(e) => setContainerW(e.nativeEvent.layout.width)}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Segment
          key={i}
          index={i}
          progress={progress}
          segWidth={segWidth}
          activeIndex={activeIndex}
          count={count}
        />
      ))}
    </View>
  );
}
