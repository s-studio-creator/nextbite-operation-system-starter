import { Heart } from "lucide-react-native";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { Restaurant } from "../types";

export function RestaurantCard({
  restaurant,
  selected,
  isSaved,
  onPress,
  onToggleSaved
}: {
  restaurant: Restaurant;
  selected?: boolean;
  isSaved: boolean;
  onPress: () => void;
  onToggleSaved: () => void;
}) {
  return (
    <Pressable style={[styles.restaurantCard, selected && styles.restaurantCardActive]} onPress={onPress}>
      <ImageBackground source={{ uri: restaurant.image }} style={styles.restaurantImage} imageStyle={styles.restaurantImageRadius}>
        <View style={styles.scorePill}>
          <Text style={styles.scoreText}>{restaurant.healthyScore} 健康分</Text>
        </View>
        <Pressable style={[styles.favoriteButton, isSaved && styles.favoriteButtonActive]} onPress={onToggleSaved}>
          <Heart size={18} color={isSaved ? "#FFFFFF" : "#0F766E"} fill={isSaved ? "#FFFFFF" : "transparent"} />
        </Pressable>
      </ImageBackground>
      <View style={styles.restaurantInfo}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>{restaurant.name}</Text>
          <Text style={styles.rating}>★ {restaurant.rating}</Text>
        </View>
        <Text style={styles.muted}>
          {restaurant.district} · {restaurant.cuisine} · {restaurant.price} · {restaurant.distanceKm} km
        </Text>
        <View style={styles.chipRow}>
          {restaurant.highlights.map((highlight) => (
            <Text key={highlight} style={styles.smallChip}>
              {highlight}
            </Text>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  restaurantCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden"
  },
  restaurantCardActive: {
    borderColor: "#0F766E"
  },
  restaurantImage: {
    flexDirection: "row",
    height: 130,
    justifyContent: "space-between",
    padding: 10
  },
  restaurantImageRadius: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  scorePill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(15, 118, 110, 0.92)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  scoreText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900"
  },
  favoriteButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 999,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  favoriteButtonActive: {
    backgroundColor: "#0F766E"
  },
  restaurantInfo: {
    gap: 8,
    padding: 13
  },
  rowBetween: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  cardTitle: {
    color: "#111827",
    flexShrink: 1,
    fontSize: 18,
    fontWeight: "800"
  },
  rating: {
    color: "#B45309",
    fontSize: 14,
    fontWeight: "900"
  },
  muted: {
    color: "#6B7280",
    flexShrink: 1,
    fontSize: 13,
    lineHeight: 19
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6
  },
  smallChip: {
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    color: "#374151",
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 9,
    paddingVertical: 5
  }
});
