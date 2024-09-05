import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabTwoScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <ThemedText style={styles.header}>About the Fitness App</ThemedText>
        <ThemedText style={styles.text}>
          This fitness app provides users with a feed of workouts fetched from
          an API. Users can swipe through workouts in a TikTok-style interface,
          navigating between different routines and workouts. Each workout
          displays details like the workout name, trainer profile, duration, and
          video thumbnails. The app is designed to work on both iOS and Android,
          ensuring smooth performance and infinite scrolling for continuous
          workout exploration.
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});
