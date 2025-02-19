import React, { useState, useEffect } from "react";
import Map, {
  Source,
  Layer,
  NavigationControl,
  FullscreenControl,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/time-slider.css";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const TimeSlider = () => {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [earthquakeData, setEarthquakeData] = useState(null);

  useEffect(() => {
    // Fetch earthquake data
    fetch(
      "https://maplibre.org/maplibre-gl-js/docs/assets/significant-earthquakes-2015.geojson"
    )
      .then((response) => response.json())
      .then((data) => setEarthquakeData(data));
  }, []);

  const filteredData = earthquakeData
    ? {
        type: "FeatureCollection",
        features: earthquakeData.features.filter((feature) => {
          const date = new Date(feature.properties.time);
          return date.getMonth() === selectedMonth;
        }),
      }
    : null;

  return (
    <div className="time-slider-container">
      <div className="map-overlay">
        <div className="map-overlay-inner">
          <h2>Significant earthquakes in 2015</h2>
          <label id="month">{months[selectedMonth]}</label>
          <input
            id="slider"
            type="range"
            min="0"
            max="11"
            step="1"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          />
        </div>
        <div class="map-overlay-inner">
          <div id="legend" class="legend">
            <div class="bar"></div>
            <div>Magnitude (m)</div>
          </div>
        </div>
      </div>

      <Map
        initialViewState={{
          longitude: 31.4606,
          latitude: 20.7927,
          zoom: 0.5,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="https://api.maptiler.com/maps/hybrid/style.json?key=ISUgWLQ7t7DKjTgbSNvJ"
      >
        <NavigationControl position="top-right" />
        <FullscreenControl />

        {filteredData && (
          <Source id="earthquakes" type="geojson" data={filteredData}>
            <Layer
              id="earthquakes"
              type="circle"
              paint={{
                "circle-color": [
                  "interpolate",
                  ["linear"],
                  ["get", "mag"],
                  6,
                  "#FCA107",
                  8,
                  "#7F3121",
                ],
                "circle-opacity": 0.75,
                "circle-radius": [
                  "interpolate",
                  ["linear"],
                  ["get", "mag"],
                  6,
                  20,
                  8,
                  40,
                ],
              }}
            />

            <Layer
              id="earthquakes-labels"
              type="symbol"
              source="earthquakes"
              sourceLayer="earthquakes"
              layout={{
                "text-field": ["concat", ["to-string", ["get", "mag"]], "m"],
                "text-font": ["Open Sans Bold"],
                "text-size": 12,
              }}
              paint={{
                "text-color": "#000",
                "text-halo-color": "#fff",
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
};

export default TimeSlider;
