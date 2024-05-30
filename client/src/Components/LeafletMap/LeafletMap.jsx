import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "./LeafletMap.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";

const LeafletMap = ({ onTotalDistanceChange }) => {
  const [markers, setMarkers] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);

// şehir seçimi
  const [selectedCity, setSelectedCity] = useState(null);
  const [cities, setCities] = useState([]);
  useEffect(() => {
    // Simulating fetching data from an API
    const fetchedCities = [
      { name: "Adana", lat: 37.0, lng: 35.3213 },
      { name: "Adıyaman", lat: 37.7648, lng: 38.2786 },
      { name: "Afyonkarahisar", lat: 38.7638, lng: 30.5403 },
      { name: "Ağrı", lat: 39.7191, lng: 43.0503 },
      { name: "Amasya", lat: 40.6499, lng: 35.8353 },
      { name: "Ankara", lat: 39.9334, lng: 32.8597 },
      { name: "Antalya", lat: 36.8969, lng: 30.7133 },
      { name: "Artvin", lat: 41.1825, lng: 41.8195 },
      { name: "Aydın", lat: 37.8487, lng: 27.8456 },
      { name: "Balıkesir", lat: 39.6484, lng: 27.8826 },
      { name: "Bilecik", lat: 40.1501, lng: 29.9833 },
      { name: "Bingöl", lat: 38.8853, lng: 40.4983 },
      { name: "Bitlis", lat: 38.3935, lng: 42.1232 },
      { name: "Bolu", lat: 40.735, lng: 31.6089 },
      { name: "Burdur", lat: 37.7203, lng: 30.2906 },
      { name: "Bursa", lat: 40.1828, lng: 29.0666 },
      { name: "Çanakkale", lat: 40.1553, lng: 26.4142 },
      { name: "Çankırı", lat: 40.6013, lng: 33.6134 },
      { name: "Çorum", lat: 40.5506, lng: 34.9556 },
      { name: "Denizli", lat: 37.7765, lng: 29.0864 },
      { name: "Diyarbakır", lat: 37.925, lng: 40.210 },
      { name: "Edirne", lat: 41.6772, lng: 26.5556 },
      { name: "Elazığ", lat: 38.675, lng: 39.220 },
      { name: "Erzincan", lat: 39.75, lng: 39.5 },
      { name: "Erzurum", lat: 39.904, lng: 41.267 },
      { name: "Eskişehir", lat: 39.7767, lng: 30.5206 },
      { name: "Gaziantep", lat: 37.0662, lng: 37.3833 },
      { name: "Giresun", lat: 40.9128, lng: 38.3895 },
      { name: "Gümüşhane", lat: 40.4592, lng: 39.4813 },
      { name: "Hakkari", lat: 37.5833, lng: 43.7333 },
      { name: "Hatay", lat: 36.2, lng: 36.15 },
      { name: "Isparta", lat: 37.7663, lng: 30.5522 },
      { name: "Mersin", lat: 36.8121, lng: 34.6413 },
      { name: "İstanbul", lat: 41.01, lng: 29.0 },
      { name: "İzmir", lat: 38.4237, lng: 27.1428 },
      { name: "Kars", lat: 40.6022, lng: 43.0975 },
      { name: "Kastamonu", lat: 41.3887, lng: 33.7827 },
      { name: "Kayseri", lat: 38.7225, lng: 35.4875 },
      { name: "Kırklareli", lat: 41.7333, lng: 27.2167 },
      { name: "Kırşehir", lat: 39.15, lng: 34.1667 },
      { name: "Kocaeli", lat: 40.8533, lng: 29.8815 },
      { name: "Konya", lat: 37.8667, lng: 32.4833 },
      { name: "Kütahya", lat: 39.4167, lng: 29.9833 },
      { name: "Malatya", lat: 38.3552, lng: 38.3095 },
      { name: "Manisa", lat: 38.6191, lng: 27.4289 },
      { name: "Kahramanmaraş", lat: 37.5744, lng: 36.9374 },
      { name: "Mardin", lat: 37.3212, lng: 40.7245 },
      { name: "Muğla", lat: 37.2153, lng: 28.3636 },
      { name: "Muş", lat: 38.9462, lng: 41.7539 },
      { name: "Nevşehir", lat: 38.6244, lng: 34.7239 },
      { name: "Niğde", lat: 37.9667, lng: 34.6833 },
      { name: "Ordu", lat: 40.9839, lng: 37.8764 },
      { name: "Rize", lat: 41.0201, lng: 40.5234 },
      { name: "Sakarya", lat: 40.7731, lng: 30.3948 },
      { name: "Samsun", lat: 41.2867, lng: 36.33 },
      { name: "Siirt", lat: 37.9333, lng: 41.95 },
      { name: "Sinop", lat: 42.0268, lng: 35.1622 },
      { name: "Sivas", lat: 39.7477, lng: 37.0179 },
      { name: "Tekirdağ", lat: 40.9833, lng: 27.5167 },
      { name: "Tokat", lat: 40.3167, lng: 36.55 },
      { name: "Trabzon", lat: 41.0015, lng: 39.7178 },
      { name: "Tunceli", lat: 39.108, lng: 39.5482 },
      { name: "Şanlıurfa", lat: 37.1671, lng: 38.7955 },
      { name: "Şırnak", lat: 37.4187, lng: 42.4918 },
      { name: "Uşak", lat: 38.6823, lng: 29.4082 },
      { name: "Van", lat: 38.5012, lng: 43.373 },
      { name: "Yozgat", lat: 39.8181, lng: 34.8147 },
      { name: "Zonguldak", lat: 41.4564, lng: 31.7987 },
      { name: "Aksaray", lat: 38.3687, lng: 34.036 },
      { name: "Bayburt", lat: 40.2565, lng: 40.2229 },
      { name: "Karaman", lat: 37.1814, lng: 33.215 },
      { name: "Kırıkkale", lat: 39.8468, lng: 33.5153 },
      { name: "Batman", lat: 37.8812, lng: 41.1351 },
      { name: "Bartın", lat: 41.6358, lng: 32.3375 },
      { name: "Ardahan", lat: 41.1105, lng: 42.7022 },
      { name: "Iğdır", lat: 39.8885, lng: 44.0048 },
      { name: "Yalova", lat: 40.650, lng: 29.2667 },
      { name: "Karabük", lat: 41.2061, lng: 32.6204 },
      { name: "Kilis", lat: 36.7184, lng: 37.1212 },
      { name: "Osmaniye", lat: 37.0745, lng: 36.2463 },
      { name: "Düzce", lat: 40.8438, lng: 31.1565 }
    ];
    
    setCities(fetchedCities);
    setSelectedCity(fetchedCities[0]); // Default to the first city
  }, []);


  const handleCityChange = (event) => {
    const selectedCityName = event.target.value;
    const city = cities.find((c) => c.name === selectedCityName);
    setSelectedCity(city);
  };

  const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center);
    }, [center, map]);
    return null;
  };

  if (!selectedCity) return null;


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
    return distance.toFixed(1); // Kilometre cinsinden
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
      },
    });
    return null;
  };

  
  return (
    <div>
       <MapContainer
        center={selectedCity ? [selectedCity.lat, selectedCity.lng] : [41.01, 29.0]}
        zoom={15}
        style={{ height: "600px", width: "100%", zIndex: 1 }}
      >
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
          <Polyline
            positions={markers.map((marker) => [marker.lat, marker.lng])}
            color="blue"
          />
        )}
        <MapClickHandler />
        <MapUpdater center={[selectedCity.lat, selectedCity.lng]} />
      </MapContainer>
      <div style={{ marginTop: "2px" }}>
        <h2>Total Distance: {totalDistance} m</h2>
        <button
          onClick={handleRemoveLastMarker}
          style={{ marginRight: "10px" }}
        >
          Son Noktayı Sil
        </button>
        <button onClick={handleRemoveAllMarkers}>Tümünü Sil</button>
        <select onChange={handleCityChange}>
          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LeafletMap;
