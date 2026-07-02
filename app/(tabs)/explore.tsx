import * as Location from "expo-location";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Map, MapCameraRef } from "../../components/map/Map";
import { RestaurantBottomSheet } from "../../components/restaurant/RestaurantBottomSheet";
import { hongKongCenter } from "../../constants/demo";
import { mapboxAccessToken } from "../../constants/mapbox";
import { colors, radius, shadow, spacing } from "../../constants/theme";
import { useRestaurants } from "../../hooks/useRestaurants";
import { useDiscoveryStore } from "../../stores/useDiscoveryStore";
import { Coordinates, RestaurantPreview } from "../../types/restaurant";

export default function ExploreRoute() {
  const cameraRef = useRef<MapCameraRef>(null);
  const restaurants = useRestaurants();
  const selectedRestaurant = useDiscoveryStore((state) => state.selectedRestaurant);
  const selectRestaurant = useDiscoveryStore((state) => state.selectRestaurant);
  const [userLocation, setUserLocation] = useState<Coordinates>();
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [permissionState, setPermissionState] = useState<"checking" | "granted" | "denied">("checking");

  const localRestaurants = useMemo(() => projectRestaurantsAroundCoordinate(restaurants, userLocation ?? hongKongCenter), [restaurants, userLocation]);

  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;
    let isMounted = true;

    async function followUser() {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!isMounted) return;

      if (!permission.granted) {
        setPermissionState("denied");
        return;
      }

      setPermissionState("granted");
      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      if (!isMounted) return;

      setUserLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude
      });

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 8,
          timeInterval: 3000
        },
        (nextPosition) => {
          const nextCoordinate = {
            latitude: nextPosition.coords.latitude,
            longitude: nextPosition.coords.longitude
          };
          setUserLocation(nextCoordinate);
        }
      );
    }

    followUser();

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, []);

  const handleSelectRestaurant = (restaurant: RestaurantPreview) => {
    selectRestaurant(restaurant);
    setIsFollowingUser(false);
    cameraRef.current?.setCamera({
      animationDuration: 450,
      animationMode: "easeTo",
      centerCoordinate: [restaurant.longitude, restaurant.latitude],
      padding: { paddingBottom: 320, paddingLeft: 0, paddingRight: 0, paddingTop: 90 },
      zoomLevel: 16
    });
  };

  const handleWalkThere = (restaurant: RestaurantPreview) => {
    setIsFollowingUser(false);
    cameraRef.current?.setCamera({
      animationDuration: 500,
      animationMode: "easeTo",
      centerCoordinate: [restaurant.longitude, restaurant.latitude],
      padding: { paddingBottom: 300, paddingLeft: 0, paddingRight: 0, paddingTop: 90 },
      zoomLevel: 17
    });
  };

  const recenter = () => {
    setIsFollowingUser(true);
    selectRestaurant(undefined);
  };

  return (
    <View style={styles.screen}>
      <Map
        ref={cameraRef}
        centerCoordinate={userLocation ?? hongKongCenter}
        followUserLocation={permissionState === "granted" && isFollowingUser}
        restaurants={localRestaurants}
        onRestaurantPress={handleSelectRestaurant}
      />
      <View style={styles.topOverlay}>
        <Text style={styles.eyebrow}>Explore</Text>
        <Text style={styles.title}>What’s around me?</Text>
        {!mapboxAccessToken && <Text style={styles.permissionText}>Add EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN to load Mapbox tiles.</Text>}
        {permissionState === "denied" && <Text style={styles.permissionText}>Location is off. Showing a nearby demo area.</Text>}
      </View>
      <Pressable accessibilityRole="button" disabled={!userLocation} onPress={recenter} style={[styles.recenterButton, !userLocation && styles.disabledButton]}>
        <Text style={styles.recenterText}>Near me</Text>
      </Pressable>
      <RestaurantBottomSheet restaurant={selectedRestaurant} onWalkThere={handleWalkThere} />
    </View>
  );
}

function projectRestaurantsAroundCoordinate(restaurants: RestaurantPreview[], coordinate: Coordinates) {
  return restaurants.slice(0, 5).map((restaurant) => ({
    ...restaurant,
    latitude: coordinate.latitude + (restaurant.latitude - hongKongCenter.latitude),
    longitude: coordinate.longitude + (restaurant.longitude - hongKongCenter.longitude)
  }));
}

const styles = StyleSheet.create({
  disabledButton: {
    opacity: 0.45
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  permissionText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17
  },
  recenterButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
    position: "absolute",
    right: spacing.md,
    top: 72,
    ...shadow.card
  },
  recenterText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 44
  },
  screen: {
    flex: 1
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "900"
  },
  topOverlay: {
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: radius.lg,
    gap: 3,
    left: spacing.md,
    maxWidth: 245,
    padding: spacing.sm,
    position: "absolute",
    top: 60,
    ...shadow.card
  }
});
