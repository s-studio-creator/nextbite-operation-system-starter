import { useMemo } from "react";
import { useDiscoveryStore } from "../stores/useDiscoveryStore";

export function useRestaurants() {
  const restaurants = useDiscoveryStore((state) => state.restaurants);

  return useMemo(() => restaurants, [restaurants]);
}
