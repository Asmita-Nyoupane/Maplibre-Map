import { useEffect } from "react";
import { createDriver } from "../components/driver-container";

export const useDriverTour = (steps, tourKey, options = {}) => {
  useEffect(() => {
    const driverObj = createDriver(steps, options);

    const shouldShowTour = localStorage.getItem(tourKey) !== "true";

    if (shouldShowTour) {
      driverObj.drive();
      localStorage.setItem(tourKey, "true");
    }
  }, [steps, tourKey]);
};
