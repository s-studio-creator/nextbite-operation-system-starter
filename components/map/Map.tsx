import MapView, { Region } from "react-native-maps";
import { forwardRef, useCallback } from "react";
import { StyleSheet } from "react-native";
import { hongKongCenter } from "../../constants/demo";
import { Coordinates, RestaurantPreview } from "../../types/restaurant";
import { RestaurantMarker } from "./RestaurantMarker";

export type MapCameraRef = MapView;

type MapProps = {
  restaurants: RestaurantPreview[];
  centerCoordinate?: Coordinates;
  followUserLocation: boolean;
  selectedRestaurantId?: string;
  onRestaurantPress?: (restaurant: RestaurantPreview) => void;
  onMapPress?: () => void;
};

export const Map = forwardRef<MapCameraRef, MapProps>(function Map(
  { restaurants, centerCoordinate = hongKongCenter, followUserLocation, selectedRestaurantId, onRestaurantPress, onMapPress },
  ref
) {
  const region: Region = {
    latitude: centerCoordinate.latitude,
    longitude: centerCoordinate.longitude,
    latitudeDelta: 0.035,
    longitudeDelta: 0.035
  };

  const handleMarkerPress = useCallback(
    (restaurant: RestaurantPreview) => {
      onRestaurantPress?.(restaurant);
    },
    [onRestaurantPress]
  );

  const handleMapPress = useCallback(() => {
    onMapPress?.();
  }, [onMapPress]);

  return (
    <MapView
      ref={ref}
      initialRegion={region}
      style={StyleSheet.absoluteFillObject}
      showsUserLocation={true}
      followsUserLocation={followUserLocation}
      showsCompass={false}
      showsScale={false}
      mapPadding={{ top: 80, right: 0, bottom: 260, left: 0 }}
      rotateEnabled={false}
      toolbarEnabled={false}
      onPress={handleMapPress}
    >
      {restaurants.map((restaurant) => (
        <RestaurantMarker
          key={restaurant.id}
          restaurant={restaurant}
          selected={restaurant.id === selectedRestaurantId}
          onPress={handleMarkerPress}
        />
      ))}
    </MapView>
  );
});
