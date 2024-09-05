import { View, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useMemo } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ProgressDotsProps {
  routines: number;
  currentIndex: number;
  duration: number;
  isReady: boolean;
}

export default function ProgressDots({
  routines,
  currentIndex,
  duration,
  isReady,
}: ProgressDotsProps) {
  const slices = Array.from({ length: routines }).map((_, i) => i);
  const styles = useStyles({ routines });
  const animatedWidth = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: animatedWidth.value,
    };
  });

  useEffect(() => {
    const animate = () => {
      if (isReady) {
        animatedWidth.value = 0;
        animatedWidth.value = withTiming(styles.slice.width, {
          duration,
        });
      }
    };

    animate();

    if (!isReady) {
      animatedWidth.value = 0;
    }

    const interval = setInterval(() => {
      animate();
    }, duration);

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex, duration, styles.slice.width, isReady]);

  return (
    <View style={styles.container}>
      {slices.map((_, index) => (
        <View
          key={index}
          style={[styles.slice, index < currentIndex && styles.activeSlice]}
        >
          {index === currentIndex && isReady && (
            <Animated.View style={[styles.animatedSlice, animatedStyle]} />
          )}
        </View>
      ))}
    </View>
  );
}

const useStyles = ({ routines }: { routines: number }) => {
  const scrWidth = Dimensions.get("window").width;
  const sliceWidth = (scrWidth * 0.85 - 10) / routines;
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: "100%",
          height: 4,
          position: "absolute",
          top: 6,
          paddingHorizontal: 6,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 9,
        },
        slice: {
          backgroundColor: "#A2A2A2",
          height: 2,
          width: sliceWidth,
          zIndex: 2,
          borderRadius: 8,
        },
        animatedSlice: {
          backgroundColor: "#fff",
          height: 2,
          zIndex: 2,
          borderRadius: 8,
        },
        activeSlice: {
          backgroundColor: "#fff",
        },
      }),
    [routines]
  );
};
