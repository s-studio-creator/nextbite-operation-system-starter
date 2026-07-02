import { Coordinates } from "./restaurant";

export type MapRegion = Coordinates & {
  latitudeDelta: number;
  longitudeDelta: number;
};
