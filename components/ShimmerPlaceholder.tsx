import { View, Text, ViewStyle } from "react-native";
import React from "react";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

export default function ShimmerPlaceholder({ style }: { style: ViewStyle }) {
  const Shimmer = createShimmerPlaceHolder(LinearGradient);

  return (
    <Shimmer
      visible={false}
      style={style}
      shimmerColors={["#35343b", "#19181D", "#35343b"]}
    ></Shimmer>
  );
}
