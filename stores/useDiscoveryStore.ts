import { create } from "zustand";
import { demoRestaurants } from "../constants/demo";
import { RestaurantPreview } from "../types/restaurant";

type DiscoveryState = {
  restaurants: RestaurantPreview[];
  selectedRestaurant?: RestaurantPreview;
  selectRestaurant: (restaurant?: RestaurantPreview) => void;
};

export const useDiscoveryStore = create<DiscoveryState>((set) => ({
  restaurants: demoRestaurants,
  selectedRestaurant: undefined,
  selectRestaurant: (restaurant) => set({ selectedRestaurant: restaurant })
}));
