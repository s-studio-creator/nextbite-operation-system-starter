import Mapbox, { Camera, UserTrackingMode } from "@rnmapbox/maps";
import { forwardRef } from "react";
import { StyleSheet } from "react-native";
import { hongKongCenter } from "../../constants/demo";
import { mapboxStyleURL } from "../../constants/mapbox";
import { Coordinates, RestaurantPreview } from "../../types/restaurant";
import { RestaurantMarker } from "./RestaurantMarker";

export type MapCameraRef = Camera;

type MapProps = {
  restaurants: RestaurantPreview[];
  centerCoordinate?: Coordinates;
  followUserLocation: boolean;
  onRestaurantPress?: (restaurant: RestaurantPreview) => void;
};

export const Map = forwardRef<MapCameraRef, MapProps>(function Map(
  { restaurants, centerCoordinate = hongKongCenter, followUserLocation, onRestaurantPress },
  ref
) {
  return (
    <Mapbox.MapView
      attributionEnabled={false}
      compassEnabled={false}
      logoEnabled={false}
      scaleBarEnabled={false}
      style={StyleSheet.absoluteFillObject}
      styleURL={mapboxStyleURL}
    >
      <Mapbox.Camera
        ref={ref}
        animationDuration={500}
        animationMode="easeTo"
        centerCoordinate={[centerCoordinate.longitude, centerCoordinate.latitude]}
        followPadding={{ paddingBottom: 260, paddingLeft: 0, paddingRight: 0, paddingTop: 80 }}
        followUserLocation={followUserLocation}
        followUserMode={UserTrackingMode.Follow}
        followZoomLevel={15}
        zoomLevel={15}
      />
      <Mapbox.LocationPuck pulsing={{ color: "#E73D2F", isEnabled: true, radius: 42 }} puckBearing="course" puckBearingEnabled />
      {restaurants.map((restaurant) => (
        <RestaurantMarker key={restaurant.id} restaurant={restaurant} onPress={onRestaurantPress} />
      ))}
    </Mapbox.MapView>
  );
});
