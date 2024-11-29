import { useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import geojsonData from "../assets/json/es.json"; // Asegúrate de poner la ruta correcta al archivo
import { useNavigate } from "react-router-dom";

const Home = () => {
  // Crear una referencia para el componente GeoJSON
  const geojsonRef = useRef();

  const navigate = useNavigate();

  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindTooltip(feature.properties.name);
    }

    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 5,
          color: "#666",
          fillOpacity: 0.7,
        });
      },
      mouseout: (e) => {
        if (geojsonRef.current) {
          geojsonRef.current.resetStyle(e.target);
        }
      },
      click: () => {
        // Navegar a la página de la comunidad autónoma
        if (feature.properties && feature.properties.name) {
          const comunidad = feature.properties.name
            .toLowerCase()
            .replace(/ /g, "-"); // Formato URL
          console.log("Clicked on:", comunidad);
          navigate(`/${comunidad}`);
        }
      },
    });
  };

  const geojsonStyle = {
    color: "#3388ff",
    weight: 2,
    fillOpacity: 0.2,
  };

  return (
    <MapContainer
      center={[40.4168, -3.7038]} // Coordenadas centrales (Madrid, por ejemplo)
      zoom={6}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON
        data={geojsonData}
        style={geojsonStyle}
        onEachFeature={onEachFeature}
        ref={geojsonRef} // Guardar referencia al componente GeoJSON
      />
    </MapContainer>
  );
};

export default Home;
