import Mapbox from "@rnmapbox/maps";

export const mapboxAccessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";

export const mapboxStyleURL = Mapbox.StyleURL.Street;

Mapbox.setAccessToken(mapboxAccessToken);
