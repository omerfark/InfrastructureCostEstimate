import React, { useState } from 'react';
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "./LeafletMap.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";

const LeafletMap = ({onTotalDistanceChange }) => {
  const [markers, setMarkers] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);

  // Mesafe hesaplama fonksiyonu
  const calculateTotalDistance = (markers) => {
    let distance = 0;
    if (markers.length < 2) {
      return distance;
    }
    for (let i = 0; i < markers.length - 1; i++) {
      const latlng1 = L.latLng(markers[i].lat, markers[i].lng);
      const latlng2 = L.latLng(markers[i + 1].lat, markers[i + 1].lng);
      distance += latlng1.distanceTo(latlng2);
    }
    return distance.toFixed(1) ; // Kilometre cinsinden
  };

  const handleRemoveLastMarker = () => {
    if (markers.length === 0) return;
    const newMarkers = markers.slice(0, -1);
    setMarkers(newMarkers);
    const newTotalDistance = calculateTotalDistance(newMarkers);
    setTotalDistance(newTotalDistance);
    onTotalDistanceChange(newTotalDistance);
  };

  const handleRemoveAllMarkers = () => {
    setMarkers([]);
    setTotalDistance(0);
    onTotalDistanceChange(0);
  };



  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        const newMarker = {
          lat: lat,
          lng: lng,
          popUp: "New Marker",
        };
        const newMarkers = [...markers, newMarker];
        setMarkers(newMarkers);
        const newTotalDistance = calculateTotalDistance(newMarkers);
        setTotalDistance(newTotalDistance);
        console.log("Markers:", newMarkers);
        console.log("Total Distance:", newTotalDistance);
        onTotalDistanceChange(newTotalDistance); // totalDistance değerini dışa aktar
      }
    });
    return null;
  };

  return (
    <div>
      <MapContainer center={[41.01, 29.00]} zoom={13} style={{ height: "600px", width: "100%", zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          {markers.map((marker, index) => (
            <Marker key={index} position={[marker.lat, marker.lng]}>
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        {markers.length > 1 && (
          <Polyline positions={markers.map(marker => [marker.lat, marker.lng])} color="blue" />
        )}
        <MapClickHandler />
      </MapContainer>
      <div style={{ marginTop: '20px' }}>
        <h2>Total Distance: {totalDistance} m</h2>
        <button onClick={handleRemoveLastMarker}>Son Noktayı Sil</button>
        <button onClick={handleRemoveAllMarkers}>Tümünü Sil</button>
      </div>
    </div>
  );
};

export default LeafletMap;
