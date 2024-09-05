import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  ViewToken,
} from "react-native";
import React, { useMemo, useState, useCallback } from "react";
import { ThemedView } from "@/components/ThemedView";
import WorkoutCard from "@/components/WorkoutCard";
import { useWorkout } from "@/context/WorkoutContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Workout } from "@/types/workout.types";

export default function HomeScreen() {
  const { workouts, fetchWorkouts, noMoreData } = useWorkout();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const styles = useStyles();

  const fetchMore = async () => {
    if (loading) return;
    setLoading(true);
    await fetchWorkouts(currentPage + 1);
    setCurrentPage((prev) => prev + 1);
    setLoading(false);
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<Workout>[] }) => {
      if (viewableItems.length > 0) {
        const newIndex = viewableItems[viewableItems.length - 1].index!;
        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex);
        }
      }
    },
    [currentIndex]
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={workouts}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item, index }) => (
          <WorkoutCard
            workout={item}
            index={index}
            currentIndex={currentIndex}
          />
        )}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.1}
        removeClippedSubviews
        initialNumToRender={1}
        maxToRenderPerBatch={3}
        snapToAlignment="start"
        windowSize={3}
        pagingEnabled
        ListFooterComponent={
          loading && !noMoreData ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : null
        }
      />
    </ThemedView>
  );
}

const useStyles = () => {
  const { top } = useSafeAreaInsets();

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          paddingTop: top,
        },
      }),
    [top]
  );
};
