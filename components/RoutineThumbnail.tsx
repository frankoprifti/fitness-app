import { getImageUrl } from "@/utils/getImageUrl";
import React, { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, View, ViewStyle } from "react-native";
import ShimmerPlaceholder from "./ShimmerPlaceholder";

interface WorkoutDetailsProps {
  thumbnail: string;
  style?: ViewStyle;
}

export default function RoutineThumbnail({
  thumbnail,
  style,
}: WorkoutDetailsProps) {
  const styles = useStyles();
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      const fetchedUrl = await getImageUrl(thumbnail);
      setImage(fetchedUrl);
    };
    if (thumbnail) {
      fetchImage();
    }
  }, [thumbnail]);

  return (
    <View style={[styles.container, style]}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <ShimmerPlaceholder style={styles.image} />
      )}
    </View>
  );
}

const useStyles = () => {
  return useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1 },
        image: {
          zIndex: -2,
          borderRadius: 8,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        },
      }),
    []
  );
};
