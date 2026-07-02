export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type RestaurantPreview = Coordinates & {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  calories: number;
  protein: number;
  distanceLabel: string;
  healthScore?: number;
  imageUrl?: string;
  isHealthyPick?: boolean;
};
