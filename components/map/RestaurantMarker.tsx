import { memo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Marker } from "react-native-maps";
import { colors, radius, shadow } from "../../constants/theme";
import { RestaurantPreview } from "../../types/restaurant";

type RestaurantMarkerProps = {
  restaurant: RestaurantPreview;
  selected?: boolean;
  onPress?: (restaurant: RestaurantPreview) => void;
};

export const RestaurantMarker = memo(function RestaurantMarker({ restaurant, selected, onPress }: RestaurantMarkerProps) {
  return (
    <Marker
      coordinate={{ latitude: restaurant.latitude, longitude: restaurant.longitude }}
      onPress={() => onPress?.(restaurant)}
      tracksViewChanges={false}
    >
      <Pressable
        accessibilityRole="button"
        onPress={() => onPress?.(restaurant)}
        style={[
          styles.marker,
          restaurant.isHealthyPick && styles.healthyMarker,
          selected && styles.selectedMarker
        ]}
      >
        <Text style={[styles.label, selected && styles.selectedLabel]}>B</Text>
      </Pressable>
    </Marker>
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
  },
  selectedLabel: {
    fontSize: 15
  },
  selectedMarker: {
    backgroundColor: colors.primaryPressed,
    borderColor: colors.primary,
    height: 52,
    width: 52
  }
});
