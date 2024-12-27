import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  LoadScript,
  Polyline,
} from "@react-google-maps/api";

const GoogleMapComponent: React.FC<{ coordinates: any }> = ({
  coordinates,
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const center =
    coordinates?.length > 0
      ? {
          lat: coordinates[0].latitude,
          lng: coordinates[0].longitude,
        }
      : { lat: 0, lng: 0 };

  const onLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap(null);
  };
  console.log(map);

  return (
    <>
      <LoadScript
        googleMapsApiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {coordinates &&
            coordinates.length > 0 &&
            coordinates.map((coord: any, index: number) => (
              <Marker
                key={index}
                position={{ lat: coord.latitude, lng: coord.longitude }}
              />
            ))}
          {coordinates && coordinates.length > 0 && (
            <Polyline
              path={coordinates.map((coord: any) => ({
                lat: coord.latitude,
                lng: coord.longitude,
              }))}
              options={{
                strokeColor: "#FF0000",
                strokeOpacity: 1,
                strokeWeight: 2,
                //   fillColor: "#FF0000",
                //   fillOpacity: 0.35,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default GoogleMapComponent;
