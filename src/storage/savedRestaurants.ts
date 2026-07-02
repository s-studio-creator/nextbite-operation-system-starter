import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SavedRestaurant } from "../types";
import { loadData, saveData } from "./storage";

const savedRestaurantsKey = "calorie-map:saved-restaurants";

export async function loadSavedRestaurants(): Promise<SavedRestaurant[] | null> {
  return loadData<SavedRestaurant[]>(savedRestaurantsKey);
}

export async function saveSavedRestaurants(savedRestaurants: SavedRestaurant[]): Promise<void> {
  await saveData(savedRestaurantsKey, savedRestaurants);
}

export function useSavedRestaurants() {
  const [savedRestaurants, setSavedRestaurants] = useState<SavedRestaurant[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasHydrated = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateSavedRestaurants() {
      const storedSavedRestaurants = await loadSavedRestaurants();

      if (!isMounted) {
        return;
      }

      if (storedSavedRestaurants) {
        setSavedRestaurants(storedSavedRestaurants);
      }

      hasHydrated.current = true;
      setIsHydrated(true);
    }

    hydrateSavedRestaurants();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }

    saveSavedRestaurants(savedRestaurants);
  }, [savedRestaurants]);

  const savedRestaurantIds = useMemo(() => new Set(savedRestaurants.map((restaurant) => restaurant.id)), [savedRestaurants]);

  const isRestaurantSaved = useCallback(
    (restaurantId: string) => {
      return savedRestaurantIds.has(restaurantId);
    },
    [savedRestaurantIds]
  );

  const toggleSavedRestaurant = useCallback((restaurantId: string) => {
    setSavedRestaurants((current) => {
      const exists = current.some((restaurant) => restaurant.id === restaurantId);

      if (exists) {
        return current.filter((restaurant) => restaurant.id !== restaurantId);
      }

      return [{ id: restaurantId, savedAt: Date.now() }, ...current];
    });
  }, []);

  return {
    savedRestaurants,
    savedRestaurantIds,
    isRestaurantSaved,
    toggleSavedRestaurant,
    isHydrated
  };
}
