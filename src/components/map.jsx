import Map, {
  Source,
  Layer,
  NavigationControl,
  FullscreenControl,
  Popup,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useMemo, useState } from "react";
import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import GeoRegions from "../data/region-data.json";
import incidents from "../data/incident-info.json";
import "../styles/map.css";
const adminLevels = [
  { feature: "ADM1", slug: "provinces", label: "Province" },
  { feature: "ADM2", slug: "districts", label: "District" },
  { feature: "ADM3", slug: "local", label: "Palika" },
];

const generatePointSource = (regions) => ({
  type: "FeatureCollection",
  features: regions.map((region) => ({
    type: "Feature",
    properties: {
      code: region.code,
      name: region.name,
      name_ne: region.name_ne,
    },
    geometry: {
      type: "Point",
      coordinates: region.centroid.coordinates,
    },
  })),
});

const ColoredNepalMap = () => {
  const [schema, setSchema] = useState({ feature: "ADM1" });
  const [hoverInfo, setHoverInfo] = useState(null);
  const adminLevel = useMemo(() => {
    const levels = adminLevels.reduce(
      (acc, cur) => ({ ...acc, [cur.feature]: cur }),
      {}
    );
    return levels[schema.feature].slug;
  }, [schema.feature]);

  const { vectorSource, vectorLayers, counts } = useMemo(() => {
    // Generate random counts for testing
    const counts = {};
    Object.values(GeoRegions).forEach((region) => {
      if (
        (schema.feature === "ADM1" && region.type === "Province") ||
        (schema.feature === "ADM2" && region.type === "District")
      ) {
        counts[region.code] = Math.floor(Math.random() * 500) + 100; // Random number between 100 and 600
      }
    });
    console.log(
      "🚀 ~ const{vectorSource,vectorLayers,counts}=useMemo ~ counts:",
      counts
    );

    const colorScale = scaleLinear()
      .domain(extent(Object.values(counts)))
      .range(["rgba(254,229,217,1)", "rgba(203,24,29,1)"]);

    const colors = {};
    for (const code in counts) {
      colors[code] = colorScale(counts[code]);
      console.log("colors", colors[code]);
    }
    console.log(
      "🚀 ~ const{vectorSource,vectorLayers,counts}=useMemo ~ colors :",
      colors
    );

    const color_style = ["get", ["get", "code"], ["literal", colors]];
    const defaultColor = "rgba(200,200,200,0.3)";

    // Vector tiles for region boundaries
    const vectorSource = {
      id: "admin-regions",
      type: "vector",
      tiles: [
        `https://ankamala.org/geo/${
          schema.feature === "ADM1" ? "provinces" : "districts"
        }/{z}/{x}/{y}`,
      ],
    };

    const vectorLayers = [
      {
        id: "region-fills",
        type: "fill",
        "source-layer": "admin-regions",
        paint: {
          "fill-color": "rgba(255, 0, 0, 0.5)", // Test with static color
          "fill-opacity": 0.7,
        },
      },
      {
        id: "region-borders",
        type: "line",
        "source-layer": "admin-regions",
        paint: {
          "line-color": "#6e6c6c",
          "line-width": 1,
          // Temporarily hide borders for testing
          "line-opacity": 0,
        },
      },
    ];

    // const vectorLayers = [
    //   {
    //     id: "region-fills",
    //     type: "fill",
    //     "source-layer": adminLevel,
    //     paint: {
    //       "fill-color": [
    //         "case",
    //         ["boolean", ["feature-state", "focused"], false],
    //         "red",
    //         ["coalesce", color_style, defaultColor],
    //       ],
    //       "fill-opacity": 0.7,
    //     },
    //   },
    //   {
    //     id: "region-borders",
    //     type: "line",
    //     "source-layer": adminLevel,
    //     paint: {
    //       "line-color": "#6e6c6c",
    //       "line-width": 0.5,
    //     },
    //   },
    // ];
    console.log(
      "🚀 ~ const{vectorSource,vectorLayers,counts}=useMemo ~ vectorLayers :",
      vectorLayers
    );

    return { vectorSource, vectorLayers, counts };
  }, [schema.feature, adminLevel]);
  console.log("vectorSource", vectorSource);
  console.log("vectorLayers", vectorLayers);

  const onHover = (event) => {
    const feature = event.features && event.features[0];
    if (feature) {
      const regionInfo = Object.values(GeoRegions).find(
        (region) => region.code === feature.properties.code
      );

      if (regionInfo) {
        setHoverInfo({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
          name: regionInfo.name,
          name_ne: regionInfo.name_ne,
          incidents: counts[regionInfo.code] || 0,
        });
      }
    } else {
      setHoverInfo(null);
    }
  };

  return (
    <div className="map-container">
      <div className="map-controls">
        <select
          value={schema.feature}
          onChange={(e) => setSchema({ feature: e.target.value })}
          className="view-selector"
        >
          <option value="ADM1">Province View</option>
          <option value="ADM2">District View</option>
        </select>
      </div>

      <Map
        initialViewState={{
          longitude: 84,
          latitude: 28.3,
          zoom: 6.5,
        }}
        style={{ width: "100vw", height: "80vh" }}
        mapStyle="https://api.maptiler.com/maps/dataviz/style.json?key=ISUgWLQ7t7DKjTgbSNvJ"
        interactiveLayerIds={["region-fills"]}
        onMouseMove={onHover}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl />

        {/* Region boundaries with colors */}
        <Source {...vectorSource}>
          {vectorLayers.map((layer) => (
            <Layer key={layer.id} {...layer} />
          ))}
        </Source>

        {/* {hoverInfo && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            anchor="bottom"
            onClose={() => setHoverInfo(null)}
            closeButton={false}
            style={{ color: "black" }}
          >
            <div className="popup-content">
              <h3>
                {hoverInfo.name} {hoverInfo.name_ne}
              </h3>
              <p>Incidents: {hoverInfo.incidents}</p>
            </div>
          </Popup>
        )} */}
      </Map>
    </div>
  );
};

export default ColoredNepalMap;
