import { useMute } from "@/context/MuteContext";
import { Routine, Workout } from "@/types/workout.types";
import { VideoView, useVideoPlayer } from "expo-video";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MuteOverlay from "./MuteOverlay";
import ProgressDots from "./ProgressDots";
import RoutineThumbnail from "./RoutineThumbnail";
import WorkoutDetails from "./WorkoutDetails";

export default function WorkoutCard({
  workout,
  currentIndex,
  index,
}: {
  workout: Workout;
  currentIndex: number;
  index: number;
}) {
  const ref = useRef<VideoView>(null);

  const [routineIndex, setRoutineIndex] = useState(0);
  const { isMuted, setIsMuted, showOverlay } = useMute();
  const [isReady, setIsReady] = useState(false);

  const player = useVideoPlayer(
    workout.routines[0]?.video.playlist_url,
    (player) => {
      player.loop = true;
      player.showNowPlayingNotification = false;
    }
  );

  const { width } = Dimensions.get("window");
  const isViewing = currentIndex === index;

  const styles = useStyles(isViewing);

  useEffect(() => {
    if (isViewing) {
      player.play();
    } else {
      player?.pause();
    }

    if (isMuted) {
      player.muted = true;
    } else {
      player.muted = false;
    }
    player.addListener("statusChange", (st, _, err) => {
      if (err) {
        Alert.alert("Error loading video");
      }
      if (st === "readyToPlay") {
        setIsReady(true);
      }
    });
    return () => {
      player.removeAllListeners("statusChange");
    };
  }, [isViewing, workout.routines, player, isMuted]);

  const renderRoutine = ({
    item,
    workoutName,
    index,
  }: {
    item: Routine;
    workoutName: string;
    index: number;
  }) => {
    const muteUnmute = () => {
      if (isViewing) {
        setIsMuted(!isMuted);
      }
    };

    if (!item?.video) {
      return null;
    }
    return (
      <View style={styles.routineItem}>
        <WorkoutDetails
          title={workoutName}
          subTitle={item.name}
          profilePic={workout.user.profile_photo_url}
          duration={item.video.duration}
          difficulty={workout.difficulty}
        />
        {isViewing && index == routineIndex ? (
          <View style={styles.videoContainer}>
            <VideoView
              ref={ref}
              style={styles.video}
              player={player}
              nativeControls={false}
              contentFit="cover"
              onLayout={() => {
                player.replace(item?.video.playlist_url);
              }}
            >
              {Platform.OS === "ios" && (
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    zIndex: -1,
                  }}
                >
                  <RoutineThumbnail thumbnail={item?.video.thumbnail_url} />
                </View>
              )}
            </VideoView>
          </View>
        ) : (
          <RoutineThumbnail thumbnail={item?.video.thumbnail_url} />
        )}
        <TouchableWithoutFeedback onPress={muteUnmute}>
          <View style={styles.volumeLayer}>
            {showOverlay && isViewing && <MuteOverlay />}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {index >= currentIndex - 1 && index <= currentIndex + 1 && (
        <>
          {isViewing && (
            <ProgressDots
              routines={workout.routines.length}
              currentIndex={routineIndex}
              duration={workout.routines[routineIndex]?.video.duration}
              isReady={isReady}
            />
          )}
          <FlatList
            data={workout.routines}
            renderItem={({ item, index }) =>
              renderRoutine({
                item,
                index,
                workoutName: workout.name,
              })
            }
            initialNumToRender={1}
            removeClippedSubviews
            keyExtractor={(item, idx) => item.id + item.exercise_id}
            horizontal
            windowSize={width}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            viewabilityConfig={{ itemVisiblePercentThreshold: 100 }}
            onViewableItemsChanged={({ viewableItems }) => {
              if (viewableItems.length > 0) {
                const currentRoutineIndex = viewableItems[0].index!;
                if (index === currentIndex) {
                  setIsReady(false);
                  setRoutineIndex(currentRoutineIndex);
                }
              }
            }}
          />
        </>
      )}
    </View>
  );
}

const useStyles = (isViewing?: boolean) => {
  const { top } = useSafeAreaInsets();
  const { width, height } = Dimensions.get("window");

  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          justifyContent: "center",
          alignItems: "center",
          height: height * 0.8,
          marginVertical: 15,
          marginHorizontal: 24,
          borderRadius: 10,
          overflow: "hidden",
        },
        routineItem: {
          flexDirection: "column",
          width: width - 48,
        },
        videoContainer: {
          position: "relative",
          width: "100%",
          height: "100%",
        },
        video: {
          width: width - 48,
          height: "100%",
          zIndex: -1,
          resizeMode: "cover",
          objectFit: "cover",
        },
        videoPlaceholder: {
          width: "100%",
          height: "100%",
          zIndex: -1,
        },
        volumeLayer: {
          width: width - 48,
          height: "100%",
          zIndex: 2,
          position: "absolute",
          top: 0,
        },
      }),
    [top, isViewing, width]
  );
};
