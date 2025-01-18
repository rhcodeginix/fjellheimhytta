import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import proj4 from "proj4";

// Define the source projection (EPSG:25833 - UTM Zone 33N)
proj4.defs("EPSG:25833", "+proj=utm +zone=33 +datum=WGS84 +units=m +no_defs");

const MapWithConvertedCoordinates = () => {
  // UTM coordinates
  const utmCoords = [247308.11, 6632336.33]; // Replace with your input coordinates

  // Convert UTM (EPSG:25833) to WGS84 (EPSG:4326)
  const [lng, lat] = proj4("EPSG:25833", "EPSG:4326", utmCoords);

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const center = { lat, lng }; // Use converted coordinates as the map center

  return (
    <div>
      <h3>Map with Converted Coordinates</h3>
      <p>
        UTM Coordinates: {utmCoords[0]}, {utmCoords[1]}
      </p>
      <p>
        Converted Coordinates: Latitude {lat.toFixed(6)}, Longitude{" "}
        {lng.toFixed(6)}
      </p>
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={center}
        >
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};
