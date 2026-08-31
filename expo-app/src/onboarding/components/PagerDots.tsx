import React, { useState } from "react";
import { View } from "react-native";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  Extrapolation,
} from "react-native-reanimated";
import { useTheme } from "../theme-context";

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
  const fill = useAnimatedStyle(() => {
    const w = interpolate(
      progress.value,
      [index - 1, index],
      [0, segWidth],
      Extrapolation.CLAMP
    );
    return { width: Math.max(0, w) };
  });

  const isDone = activeIndex > index;
  return (
    <View
      style={{
        height: 4,
        width: segWidth,
        borderRadius: 2,
        backgroundColor: t.isDark ? "rgba(255,255,255,0.14)" : "rgba(18,18,20,0.12)",
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={[
          {
            height: 4,
            borderRadius: 2,
            backgroundColor: isDone ? t.colors.secondary : t.colors.secondary,
          },
          fill,
        ]}
      />
    </View>
  );
}

/** Segmented progress bar that fills continuously with pager scroll. */
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
