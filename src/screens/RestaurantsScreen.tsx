import { MapPin, Search } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { mapboxStyleURL } from "../../constants/mapbox";
import { MapRegion } from "../../types/map";
import { RestaurantCard } from "../components/RestaurantCard";
import { Restaurant } from "../types";

export type RestaurantFilter = "全部" | "低卡" | "高蛋白" | "近我" | "素食" | "少油" | "$$";

export const restaurantFilters: RestaurantFilter[] = ["全部", "低卡", "高蛋白", "近我", "素食", "少油", "$$"];

export function RestaurantsScreen({
  restaurants,
  selectedRestaurant,
  region,
  locationNote,
  search,
  activeFilter,
  onSearch,
  onFilterChange,
  onLocate,
  onFocusRestaurant,
  onOpenRestaurant,
  isRestaurantSaved,
  onToggleSavedRestaurant
}: {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant;
  region: MapRegion;
  locationNote: string;
  search: string;
  activeFilter: RestaurantFilter;
  onSearch: (value: string) => void;
  onFilterChange: (filter: RestaurantFilter) => void;
  onLocate: () => void;
  onFocusRestaurant: (restaurant: Restaurant) => void;
  onOpenRestaurant: (restaurant: Restaurant) => void;
  isRestaurantSaved: (restaurantId: string) => boolean;
  onToggleSavedRestaurant: (restaurantId: string) => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.headerCompact}>
        <Text style={styles.kicker}>附近健康餐廳</Text>
        <Pressable style={styles.iconButton} onPress={onLocate}>
          <MapPin size={20} color="#0F766E" />
        </Pressable>
      </View>
      <View style={styles.searchBox}>
        <Search size={18} color="#6B7280" />
        <TextInput value={search} onChangeText={onSearch} placeholder="搜尋地區、餐廳、菜式" style={styles.searchInput} />
      </View>
      <Text style={styles.locationNote}>{locationNote}</Text>

      <View style={styles.mapWrap}>
        <Mapbox.MapView
          attributionEnabled={false}
          compassEnabled={false}
          logoEnabled={false}
          scaleBarEnabled={false}
          style={styles.map}
          styleURL={mapboxStyleURL}
        >
          <Mapbox.Camera centerCoordinate={[region.longitude, region.latitude]} zoomLevel={13} />
          <Mapbox.LocationPuck pulsing="default" />
          {restaurants.map((restaurant) => (
            <Mapbox.MarkerView
              key={restaurant.id}
              allowOverlap
              coordinate={[restaurant.longitude, restaurant.latitude]}
            >
              <Pressable
                style={[styles.marker, selectedRestaurant.id === restaurant.id && styles.markerActive]}
                onPress={() => {
                  onFocusRestaurant(restaurant);
                  onOpenRestaurant(restaurant);
                }}
              >
                <Text style={styles.markerText}>B</Text>
              </Pressable>
            </Mapbox.MarkerView>
          ))}
        </Mapbox.MapView>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {restaurantFilters.map((filter) => (
          <Pressable
            key={filter}
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            onPress={() => onFilterChange(filter)}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {restaurants.length > 0 ? (
        restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            selected={selectedRestaurant.id === restaurant.id}
            isSaved={isRestaurantSaved(restaurant.id)}
            onPress={() => {
              onFocusRestaurant(restaurant);
              onOpenRestaurant(restaurant);
            }}
            onToggleSaved={() => onToggleSavedRestaurant(restaurant.id)}
          />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>暫時找不到餐廳</Text>
          <Text style={styles.muted}>可以清除搜尋字，或改用另一個篩選條件。</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 18, paddingBottom: 110, gap: 14 },
  headerCompact: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingTop: 8 },
  kicker: { color: "#0F766E", fontSize: 14, fontWeight: "700" },
  iconButton: { alignItems: "center", backgroundColor: "#ECFDF5", borderRadius: 8, height: 42, justifyContent: "center", width: 42 },
  searchBox: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12
  },
  searchInput: { color: "#111827", flex: 1, fontSize: 15, minHeight: 45 },
  locationNote: { color: "#6B7280", fontSize: 12, marginTop: -6 },
  mapWrap: { borderRadius: 8, height: 260, overflow: "hidden" },
  map: { height: "100%", width: "100%" },
  marker: {
    alignItems: "center",
    backgroundColor: "#E73D2F",
    borderColor: "#FFFFFF",
    borderRadius: 999,
    borderWidth: 3,
    height: 38,
    justifyContent: "center",
    width: 38
  },
  markerActive: { backgroundColor: "#0F766E" },
  markerText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
  filterRow: { gap: 8 },
  filterChip: { backgroundColor: "#E0F2FE", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  filterChipActive: { backgroundColor: "#0F766E" },
  filterText: { color: "#075985", fontSize: 13, fontWeight: "800" },
  filterTextActive: { color: "#FFFFFF" },
  emptyState: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    padding: 20
  },
  emptyStateTitle: { color: "#111827", fontSize: 17, fontWeight: "900" },
  muted: { color: "#6B7280", flexShrink: 1, fontSize: 13, lineHeight: 19 }
});
