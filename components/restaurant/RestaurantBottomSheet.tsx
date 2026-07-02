import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useEffect } from "react";
import { colors, radius, shadow, spacing } from "../../constants/theme";
import { RestaurantPreview } from "../../types/restaurant";

type RestaurantBottomSheetProps = {
  restaurant?: RestaurantPreview;
  onWalkThere?: (restaurant: RestaurantPreview) => void;
};

const hiddenOffset = 420;

export function RestaurantBottomSheet({ restaurant, onWalkThere }: RestaurantBottomSheetProps) {
  const translateY = useSharedValue(hiddenOffset);

  useEffect(() => {
    translateY.value = withSpring(restaurant ? 0 : hiddenOffset, {
      damping: 22,
      stiffness: 180,
      mass: 0.9
    });
  }, [restaurant, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }));

  return (
    <Animated.View pointerEvents={restaurant ? "auto" : "none"} style={[styles.sheet, animatedStyle]}>
      <View style={styles.handle} />
      {restaurant && (
        <View style={styles.content}>
          <Image source={{ uri: restaurant.imageUrl }} style={styles.image} />
          <View style={styles.headerRow}>
            <View style={styles.titleBlock}>
              <Text numberOfLines={1} style={styles.name}>
                {restaurant.name}
              </Text>
              <Text numberOfLines={1} style={styles.cuisine}>
                {restaurant.cuisine}
              </Text>
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.rating}>★ {restaurant.rating.toFixed(1)}</Text>
            </View>
          </View>
          <View style={styles.metrics}>
            <Metric label="Calories" value={`${restaurant.calories}`} />
            <Metric label="Protein" value={`${restaurant.protein}g`} />
            <Metric label="Walk" value={restaurant.distanceLabel} />
          </View>
          <Pressable accessibilityRole="button" onPress={() => onWalkThere?.(restaurant)} style={styles.walkButton}>
            <Text style={styles.walkButtonText}>Walk There</Text>
          </Pressable>
        </View>
      )}
    </Animated.View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm
  },
  cuisine: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "700"
  },
  handle: {
    alignSelf: "center",
    backgroundColor: colors.border,
    borderRadius: radius.full,
    height: 4,
    marginBottom: spacing.sm,
    width: 42
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  image: {
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    height: 160,
    width: "100%"
  },
  metric: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    flex: 1,
    gap: 2,
    minHeight: 68,
    paddingHorizontal: spacing.sm,
    paddingVertical: 12
  },
  metricLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "800"
  },
  metricValue: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "900"
  },
  metrics: {
    flexDirection: "row",
    gap: spacing.xs
  },
  name: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "900"
  },
  rating: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900"
  },
  ratingBadge: {
    backgroundColor: "rgba(231, 61, 47, 0.1)",
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    bottom: 0,
    left: 0,
    padding: spacing.md,
    position: "absolute",
    right: 0,
    ...shadow.floating
  },
  titleBlock: {
    flex: 1,
    gap: 3
  },
  walkButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    minHeight: 54,
    justifyContent: "center"
  },
  walkButtonText: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: "900"
  }
});
