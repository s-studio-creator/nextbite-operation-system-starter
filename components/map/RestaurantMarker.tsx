import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { colors, radius, shadow } from "../../constants/theme";
import { RestaurantPreview } from "../../types/restaurant";

type RestaurantMarkerProps = {
  restaurant: RestaurantPreview;
  onPress?: (restaurant: RestaurantPreview) => void;
};

export const RestaurantMarker = memo(function RestaurantMarker({ restaurant, onPress }: RestaurantMarkerProps) {
  return (
    <Mapbox.MarkerView allowOverlap allowOverlapWithPuck anchor={{ x: 0.5, y: 0.5 }} coordinate={[restaurant.longitude, restaurant.latitude]}>
      <Pressable accessibilityRole="button" onPress={() => onPress?.(restaurant)} style={[styles.marker, restaurant.isHealthyPick && styles.healthyMarker]}>
        <Text style={styles.label}>B</Text>
      </Pressable>
    </Mapbox.MarkerView>
  );
});

const styles = StyleSheet.create({
  healthyMarker: {
    backgroundColor: colors.healthy
  },
  label: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: "900"
  },
  marker: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderColor: colors.surface,
    borderRadius: radius.full,
    borderWidth: 3,
    height: 42,
    justifyContent: "center",
    width: 42,
    ...shadow.card
  }
});
