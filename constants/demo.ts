import { RestaurantPreview } from "../types/restaurant";

export const hongKongCenter = {
  latitude: 22.2855,
  longitude: 114.1577,
  latitudeDelta: 0.035,
  longitudeDelta: 0.035
};

export const demoRestaurants: RestaurantPreview[] = [
  {
    id: "yuzu-garden",
    name: "Yuzu Garden",
    cuisine: "Japanese bowls",
    rating: 4.8,
    calories: 520,
    protein: 34,
    distanceLabel: "8 min walk",
    latitude: 22.2867,
    longitude: 114.1594,
    healthScore: 92,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=900&auto=format&fit=crop",
    isHealthyPick: true
  },
  {
    id: "miso-lane",
    name: "Miso Lane",
    cuisine: "Ramen and small plates",
    rating: 4.6,
    calories: 680,
    protein: 28,
    distanceLabel: "11 min walk",
    latitude: 22.2881,
    longitude: 114.1557,
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=900&auto=format&fit=crop",
    healthScore: 78
  },
  {
    id: "green-hour",
    name: "Green Hour",
    cuisine: "Cafe plates",
    rating: 4.7,
    calories: 440,
    protein: 31,
    distanceLabel: "6 min walk",
    latitude: 22.2837,
    longitude: 114.1548,
    healthScore: 88,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=900&auto=format&fit=crop",
    isHealthyPick: true
  },
  {
    id: "toast-club",
    name: "Toast Club",
    cuisine: "Brunch and coffee",
    rating: 4.5,
    calories: 610,
    protein: 24,
    distanceLabel: "9 min walk",
    latitude: 22.286,
    longitude: 114.1532,
    healthScore: 81,
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=900&auto=format&fit=crop"
  },
  {
    id: "protein-lab",
    name: "Protein Lab",
    cuisine: "Grill and bowls",
    rating: 4.9,
    calories: 560,
    protein: 42,
    distanceLabel: "13 min walk",
    latitude: 22.2824,
    longitude: 114.1605,
    healthScore: 94,
    imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=900&auto=format&fit=crop",
    isHealthyPick: true
  }
];
