import React, { useRef, useState } from "react";
import Map, { NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import MultiRegionSelector from "./multi-region-selector";
import { useDriverTour } from "../hooks/useDriverTour";
import { tours } from "./driver-container";

const NepalMap = () => {
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({
    longitude: 84.124,
    latitude: 28.3949,
    zoom: 6.5,
  });

  useDriverTour(tours.mapControls, "hasSeenMapTour");

  const flyToLocation = (location) => {
    console.log("Flying to location:", location);
    if (mapRef.current && location.coordinates) {
      const { longitude, latitude, zoom } = location.coordinates;
      console.log("Coordinates:", longitude, latitude, zoom);

      mapRef.current.getMap().flyTo({
        center: [longitude, latitude],
        zoom: zoom || 10,
        duration: 2000,
      });
    } else {
      console.log("Missing coordinates or map reference");
    }
  };

  const handleRegionSelect = (selection) => {
    console.log("Selected:", selection);
    // Handle the selection - you can access:
    // selection.province
    // selection.district
    // selection.municipalities (array)
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <div
        className="map-controls"
        style={{ position: "absolute", top: 20, left: 20, zIndex: 1 }}
      >
        <MultiRegionSelector
          onRegionSelect={handleRegionSelect}
          className="region-selector"
        />
      </div>

      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=ISUgWLQ7t7DKjTgbSNvJ"
      >
        <NavigationControl position="top-right" />
      </Map>
    </div>
  );
};

export default NepalMap;
