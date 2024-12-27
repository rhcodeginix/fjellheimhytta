import React, { useState } from "react";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";

const GoogleMapComponent: React.FC<{ coordinates: any }> = ({
  coordinates,
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const bounds = coordinates?.reduce(
    (acc: any, coord: any) => {
      acc.north = Math.max(acc.north, coord.latitude);
      acc.south = Math.min(acc.south, coord.latitude);
      acc.east = Math.max(acc.east, coord.longitude);
      acc.west = Math.min(acc.west, coord.longitude);
      return acc;
    },
    {
      north: coordinates[0]?.latitude || 0,
      south: coordinates[0]?.latitude || 0,
      east: coordinates[0]?.longitude || 0,
      west: coordinates[0]?.longitude || 0,
    }
  );

  const center = {
    lat: (bounds?.north + bounds?.south) / 2,
    lng: (bounds?.east + bounds?.west) / 2,
  };

  const onLoad = (map: google.maps.Map) => {
    setMap(map);

    if (bounds) {
      const googleBounds = new google.maps.LatLngBounds(
        { lat: bounds.south, lng: bounds.west },
        { lat: bounds.north, lng: bounds.east }
      );

      map.fitBounds(googleBounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      });
    }
  };

  const onUnmount = () => {
    setMap(null);
  };

  const mapOptions = {
    mapTypeId: "satellite",
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: false,
    disableDefaultUI: true,
    draggable: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    styles: [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  const polygonOptions = {
    fillColor: "transparent",
    fillOpacity: 0.3,
    strokeColor: "#FF0000",
    strokeOpacity: 1,
    strokeWeight: 2,
    // clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    zIndex: 1,
  };

  const getClosedPath = () => {
    if (!coordinates || coordinates.length === 0) return [];

    const path = coordinates.map((coord: any) => ({
      lat: coord.latitude,
      lng: coord.longitude,
    }));

    const firstPoint = path[0];
    const lastPoint = path[path.length - 1];

    if (firstPoint.lat !== lastPoint.lat || firstPoint.lng !== lastPoint.lng) {
      path.push(firstPoint);
    }

    return path;
  };
  console.log(map);
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    const clickedLatLng: any = e.latLng;
    const lat = clickedLatLng.lat();
    const lng = clickedLatLng.lng();

    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(googleMapsUrl, "_blank");

    if (map) {
      map.panTo(clickedLatLng);
      map.setZoom(12);
    }
  };
  return (
    <LoadScript
      googleMapsApiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {coordinates && coordinates.length > 0 && (
          <Polygon
            paths={getClosedPath()}
            options={polygonOptions}
            onClick={handleMapClick}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
