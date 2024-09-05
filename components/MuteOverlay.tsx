import { View, Text, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import { useMute } from "@/context/MuteContext";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function MuteOverlay() {
  const styles = useStyles();
  const { isMuted } = useMute();
  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.iconContainer}>
        <Ionicons
          name={isMuted ? "volume-mute" : "volume-high"}
          color={"#fff"}
          size={24}
        />
      </View>
    </View>
  );
}

const useStyles = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: "100%",
          height: "100%",
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
        },
        iconContainer: {
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 60,
          backgroundColor: "rgba(0,0,0,0.8)",
          width: 50,
          height: 50,
        },
      }),
    []
  );
};
