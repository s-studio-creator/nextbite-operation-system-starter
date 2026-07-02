import { FlatList, StyleSheet } from "react-native";
import { ScreenShell } from "../../components/common/ScreenShell";
import { RestaurantCard } from "../../components/restaurant/RestaurantCard";
import { spacing } from "../../constants/theme";
import { useRestaurants } from "../../hooks/useRestaurants";

export default function SavedRoute() {
  const restaurants = useRestaurants();

  return (
    <ScreenShell title="Saved" subtitle="Restaurants you want to visit next. A collection, not a history log.">
      <FlatList
        contentContainerStyle={styles.list}
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RestaurantCard restaurant={item} />}
        showsVerticalScrollIndicator={false}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
    paddingBottom: spacing.xl
  }
});
