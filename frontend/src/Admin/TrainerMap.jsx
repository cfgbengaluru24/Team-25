import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// Import the Leaflet CSS
import L from "leaflet";

// Fix the default marker icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapComponent = () => {
  const [travel, setTravel] = useState();
  useEffect(() => {
    axios
      .post("http://localhost:8080/api/v1/trainer/get-flights", {
        date: new Date(),
        location: "Mumbai",
      })
      .then((response) => {
        setTravel(response.data.trainers);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  console.log(travel);
  const defaultPosition =
    travel?.length > 0 ? [travel[0]?.lat, travel[0].lng] : [20.5937, 78.9629]; // Default to India

  return (
    <MapContainer
      center={defaultPosition}
      zoom={5} // Adjust the zoom level as needed
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {travel?.map((point, index) => (
        <Marker
          key={index}
          position={[point.geolocation.x, point.geolocation.y]}
        >
          <Popup>
            {point.popupText ||
              "A pretty CSS3 popup. <br /> Easily customizable."}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
