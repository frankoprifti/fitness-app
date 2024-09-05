import { getImageUrl } from "@/utils/getImageUrl";
import { difficulty as getDifficulty } from "@/utils/workoutDifficulty";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import ShimmerPlaceholder from "./ShimmerPlaceholder";

interface WorkoutDetailsProps {
  title: string;
  subTitle: string;
  profilePic: string;
  difficulty: number;
  duration?: number;
}

export default function WorkoutDetails({
  title,
  subTitle,
  profilePic,
  difficulty,
  duration,
}: WorkoutDetailsProps) {
  const styles = useStyles();
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      const fetchedUrl = await getImageUrl(profilePic);
      setImage(fetchedUrl);
    };
    if (profilePic) {
      fetchImage();
    }
  }, [profilePic]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {image ? (
          <Image
            source={{ uri: image }}
            width={50}
            height={50}
            style={styles.image}
          />
        ) : (
          <ShimmerPlaceholder style={styles.image}></ShimmerPlaceholder>
        )}
        <View style={styles.description}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subTitle}>{subTitle}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Ionicons name="time-outline" size={14} color={"#fff"} />
        <Text style={styles.footerText}>
          &nbsp;{moment(duration).format("mm:ss")}
        </Text>
        <Text style={styles.footerText}>{getDifficulty[difficulty]}</Text>
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
          justifyContent: "space-between",
          position: "absolute",
          top: 0,
          marginTop: 24,
          paddingHorizontal: 12,
          paddingBottom: 48,
          zIndex: 2,
        },
        header: {
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "flex-start",
          gap: 10,
        },
        footer: {
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "flex-start",
        },
        footerText: {
          color: "#fff",
          fontWeight: "bold",
          fontSize: 12,
          alignItems: "center",
          marginRight: 12,
        },
        image: {
          borderRadius: 8,
          width: 50,
          height: 50,
        },
        description: {
          justifyContent: "flex-start",
          height: "100%",
          width: "80%",
        },
        title: {
          textTransform: "uppercase",
          fontWeight: "bold",
          color: "white",
        },
        subTitle: {
          color: "white",
        },
      }),
    []
  );
};
