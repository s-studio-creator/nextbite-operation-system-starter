import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, shadow, spacing } from "../../constants/theme";
import { RestaurantPreview } from "../../types/restaurant";

type RestaurantCardProps = {
  restaurant: RestaurantPreview;
  onPress?: (restaurant: RestaurantPreview) => void;
};

export function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={() => onPress?.(restaurant)} style={styles.card}>
      <ImageBackground source={restaurant.imageUrl ? { uri: restaurant.imageUrl } : undefined} style={styles.photo} imageStyle={styles.photoImage}>
        {!restaurant.imageUrl && <View style={styles.photoFallback} />}
      </ImageBackground>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.name}>
            {restaurant.name}
          </Text>
          {restaurant.healthScore !== undefined && <Text style={styles.score}>{restaurant.healthScore}</Text>}
        </View>
        <Text numberOfLines={1} style={styles.meta}>
          {restaurant.cuisine} · {restaurant.distanceLabel}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    minWidth: 260,
    overflow: "hidden",
    ...shadow.card
  },
  content: {
    gap: spacing.xs,
    padding: spacing.sm
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600"
  },
  name: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 18,
    fontWeight: "900"
  },
  photo: {
    height: 150
  },
  photoFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.accent
  },
  photoImage: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg
  },
  score: {
    backgroundColor: "rgba(65, 167, 101, 0.14)",
    borderRadius: radius.full,
    color: colors.healthy,
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs
  }
});
