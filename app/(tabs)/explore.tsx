import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import { Map } from "../../components/map/Map";
import { RestaurantBottomSheet } from "../../components/restaurant/RestaurantBottomSheet";
import { hongKongCenter } from "../../constants/demo";
import { colors, radius, shadow, spacing } from "../../constants/theme";
import { useRestaurants } from "../../hooks/useRestaurants";
import { useDiscoveryStore } from "../../stores/useDiscoveryStore";
import { Coordinates, RestaurantPreview } from "../../types/restaurant";

export default function ExploreRoute() {
  const mapRef = useRef<MapView>(null);
  const restaurants = useRestaurants();
  const selectedRestaurant = useDiscoveryStore((state) => state.selectedRestaurant);
  const selectRestaurant = useDiscoveryStore((state) => state.selectRestaurant);
  const [userLocation, setUserLocation] = useState<Coordinates>();
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [permissionState, setPermissionState] = useState<"checking" | "granted" | "denied">("checking");

  const localRestaurants = useMemo(
    () => projectRestaurantsAroundCoordinate(restaurants, userLocation ?? hongKongCenter),
    [restaurants, userLocation]
  );

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

  const handleSelectRestaurant = useCallback(
    (restaurant: RestaurantPreview) => {
      selectRestaurant(restaurant);
      setIsFollowingUser(false);
      mapRef.current?.animateToRegion(
        {
          latitude: restaurant.latitude,
          longitude: restaurant.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015
        },
        450
      );
    },
    [selectRestaurant]
  );

  const handleMapPress = useCallback(() => {
    if (selectedRestaurant) {
      selectRestaurant(undefined);
    }
  }, [selectedRestaurant, selectRestaurant]);

  const handleWalkThere = useCallback(
    (restaurant: RestaurantPreview) => {
      setIsFollowingUser(false);
      mapRef.current?.animateToRegion(
        {
          latitude: restaurant.latitude,
          longitude: restaurant.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        },
        500
      );
    },
    []
  );

  const recenter = useCallback(() => {
    setIsFollowingUser(true);
    selectRestaurant(undefined);
  }, [selectRestaurant]);

  const retryPermission = useCallback(async () => {
    setPermissionState("checking");
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.granted) {
      setPermissionState("granted");
      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setUserLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude
      });
    } else {
      setPermissionState("denied");
    }
  }, []);

  return (
    <View style={styles.screen}>
      <Map
        ref={mapRef}
        centerCoordinate={userLocation ?? hongKongCenter}
        followUserLocation={permissionState === "granted" && isFollowingUser}
        restaurants={localRestaurants}
        selectedRestaurantId={selectedRestaurant?.id}
        onRestaurantPress={handleSelectRestaurant}
        onMapPress={handleMapPress}
      />

      {/* Top overlay */}
      <View style={styles.topOverlay}>
        <Text style={styles.eyebrow}>Explore</Text>
        <Text style={styles.title}>What&apos;s around me?</Text>
        {permissionState === "denied" && (
          <Text style={styles.permissionText}>Location is off. Tap below to pick a nearby area.</Text>
        )}
      </View>

      {/* Loading overlay */}
      {permissionState === "checking" && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>Finding your location...</Text>
        </View>
      )}

      {/* Denied permission fallback */}
      {permissionState === "denied" && (
        <View style={styles.deniedOverlay}>
          <Pressable accessibilityRole="button" onPress={retryPermission} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Enable Location</Text>
          </Pressable>
          <Text style={styles.deniedHint}>We use your location to find great restaurants nearby.</Text>
        </View>
      )}

      {/* Near me button */}
      <Pressable
        accessibilityRole="button"
        disabled={!userLocation}
        onPress={recenter}
        style={[styles.recenterButton, !userLocation && styles.disabledButton]}
      >
        <Text style={styles.recenterText}>Near me</Text>
      </Pressable>

      <RestaurantBottomSheet restaurant={selectedRestaurant} onWalkThere={handleWalkThere} />
    </View>
  );
}

function projectRestaurantsAroundCoordinate(restaurants: RestaurantPreview[], coordinate: Coordinates): RestaurantPreview[] {
  return restaurants.slice(0, 5).map((restaurant) => ({
    ...restaurant,
    latitude: coordinate.latitude + (restaurant.latitude - hongKongCenter.latitude),
    longitude: coordinate.longitude + (restaurant.longitude - hongKongCenter.longitude)
  }));
}

const styles = StyleSheet.create({
  deniedHint: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17
  },
  deniedOverlay: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: radius.lg,
    gap: spacing.sm,
    left: spacing.md,
    padding: spacing.md,
    position: "absolute",
    right: spacing.md,
    top: 200,
    ...shadow.card
  },
  disabledButton: {
    opacity: 0.45
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    gap: spacing.sm,
    justifyContent: "center",
    zIndex: 10
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "700"
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
  retryButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  retryButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "900"
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
