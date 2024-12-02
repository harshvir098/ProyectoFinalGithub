import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAutonomyByName,
  getPlacesByAutonomyAndCategory,
} from "../services/api";
import "./Comunidad.css";
import { useNavigate } from "react-router-dom";

const Comunidad = () => {
  const { comunidad } = useParams();
  const [comunidadData, setComunidadData] = useState({});
  const [selectedButton, setSelectedButton] = useState("Comida"); // Cambiado para seleccionar "Comida" por defecto
  const [places, setPlaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!comunidad) {
      console.error("El parámetro 'comunidad' no está presente en la URL.");
      return;
    }
    const fetchData = async () => {
      const data = await getAutonomyByName(comunidad);
      setComunidadData(data);
    };

    fetchData();
  }, [comunidad]);

  useEffect(() => {
    if (comunidadData && comunidadData.id) {
      const fetchPlaces = async () => {
        const placesData = await getPlacesByAutonomyAndCategory(
          comunidadData.id,
          selectedButton
        );
        setPlaces(placesData || []);
      };

      fetchPlaces();
    }
  }, [comunidadData, selectedButton]); // Ahora también se activa cuando selectedButton cambia

  const handleButtonClick = async (buttonName) => {
    setSelectedButton(buttonName);
  };

  const categories = [
    "Comida",
    "Restaurantes",
    "Sitio Histórico",
    "Naturaleza y Aire Libre",
    "Vida Nocturna y Entretenimiento",
    "Hoteles",
    "Mercados y Compras",
  ];

  return (
    <div className="comunidad-container">
      <h1 className="comunidad-title">Comunidad: {comunidadData.name}</h1>
      <nav className="comunidad-nav">
        {categories.map((buttonName) => (
          <button
            key={buttonName}
            className={`comunidad-btn ${
              selectedButton === buttonName ? "active" : ""
            }`}
            onClick={() => handleButtonClick(buttonName)}
          >
            {buttonName}
          </button>
        ))}
      </nav>
      <div className="places-grid">
        {places && places.length > 0 ? (
          places.map((place, index) => (
            <div
              key={index}
              className="place-card"
              onClick={() => navigate(`/${place.placeName}`)}
            >
              <img
                src={`http://localhost:8080/images/${place.imagePath}`}
                alt={place.placeName}
                className="place-image"
              />
              <div className="place-content">
                <h3 className="place-name">{place.placeName}</h3>
                <p className="place-description">{place.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No hay lugares disponibles para esta categoría.</p>
        )}
      </div>
    </div>
  );
};

export default Comunidad;
