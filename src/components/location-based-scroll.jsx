import React, { useEffect, useRef } from "react";
import Map, {
  FullscreenControl,
  NavigationControl,
} from "react-map-gl/maplibre";

import "../styles/cities.css";
import { cities } from "../data/major-cities";

const LocationBasedScroll = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const sections = document.getElementsByClassName("scroll-section");

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();

        if (rect.top >= 0 && rect.top <= window.innerHeight * 0.5) {
          const city = cities[i];

          // Ensure map instance is available
          if (mapRef.current) {
            const map = mapRef.current.getMap(); // Get Mapbox instance
            map.flyTo({
              name: city.title.toLowerCase(),
              center: city.location.center,
              zoom: city.location.zoom || 10,
              duration: 1000,
              pitch: city.location.pitch || 0,
              bearing: city.location.bearing || 0,
            });

            section.classList.add("active");
          }
        } else {
          section.classList.remove("active");
        }
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="scroll-container">
      <div className="map-container">
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: 84.124,
            latitude: 28.3949,
            zoom: 7,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://api.maptiler.com/maps/streets/style.json?key=ISUgWLQ7t7DKjTgbSNvJ"
        >
          <FullscreenControl />
          <NavigationControl position="top-right" />
        </Map>
      </div>

      <div className="scroll-content">
        {cities.map((city) => (
          <div key={city.id} className="scroll-section">
            <h2>{city.title}</h2>
            <p>{city.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationBasedScroll;
