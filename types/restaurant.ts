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
  carbs?: number;
  fat?: number;
  distanceLabel: string;
  price?: "$" | "$$" | "$$$" | "$$$$";
  healthScore?: number;
  imageUrl?: string;
  isHealthyPick?: boolean;
  highlights?: string[];
};
