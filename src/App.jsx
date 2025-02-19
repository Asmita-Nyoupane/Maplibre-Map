import * as React from "react";
import Map, { Source, Layer } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import CrimeMap from "./components/map";
import TimeSlider from "./components/time-slider";
import LocationBasedScroll from "./components/location-based-scroll";
import CommandMenu from "./components/command-menu";
import RegionSelector from "./components/region-selector";
import "./App.css";
import NepalMap from "./components/map-nepal";
import MultiRegionSelector from "./components/multi-region-selector";
import HierarchicalSelect from "./components/hierarchical-select";

function App() {
  const handleSelectionChange = (selection) => {
    console.log("Selected:", selection);
  };

  return (
    <div>
      <h1>Nepal Region Selector</h1>
      <HierarchicalSelect onSelectionChange={handleSelectionChange} />
      {/* <RegionSelector /> */}
      {/* <NepalMap /> */}
      {/* <MultiRegionSelector /> */}
    </div>
  );
}

export default App;
