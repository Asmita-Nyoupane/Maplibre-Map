import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// Factory function to create driver instance
export const createDriver = (steps, options = {}) => {
  return driver({
    animate: true, // Enable animations
    showProgress: true, // Show step progress
    ...options, // Spread additional options
    steps: steps, // Tour steps configuration
  });
};

// Predefined tours configuration
export const tours = {
  // Tour for region selector component
  regionSelector: [
    {
      element: "#province-select", // Target element ID
      popover: {
        title: "Province Selection",
        description: "Start by selecting a province from here",
        side: "bottom", // Popover position
        align: "start", // Alignment
      },
    },
    {
      element: "#district-select",
      popover: {
        title: "District Selection",
        description: "After selecting a province, choose a district",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: "#palika-select",
      popover: {
        title: "Palika Selection",
        description:
          "Finally, select one or more palikas from the selected district",
        side: "bottom",
        align: "start",
      },
    },
    {
      element: ".select-container",
      popover: {
        title: "Happy Journey",
        description: "Explore the data anlysis",
        side: "top",
        align: "center",
      },
    },
  ],

  // Tour for map controls
  mapControls: [
    {
      element: ".map-controls", // Target element class
      popover: {
        title: "Map Navigation",
        description: "Use these controls to zoom and pan the map",
        side: "right",
      },
    },
    {
      element: ".region-selector",
      popover: {
        title: "Region Selection",
        description: "Select regions to view on the map",
        side: "left",
      },
    },
  ],
};
