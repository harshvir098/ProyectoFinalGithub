import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAutonomyByName } from "../services/api";
import { getPlacesByAutonomyAndCategory } from "../services/api";
import "./Comunidad.css"; // Asegúrate de importar el archivo CSS

const Comunidad = () => {
  const { comunidad } = useParams(); // Desestructuración para obtener el parámetro
  const [comunidadData, setComunidadData] = useState({}); // Datos de la comunidad
  const [selectedButton, setSelectedButton] = useState(""); // Estado para el botón seleccionado (vacío por defecto)
  const [places, setPlaces] = useState([]); // Estado para los lugares

  useEffect(() => {
    // Verificar si el parámetro 'comunidad' está presente y decodificarlo
    if (!comunidad) {
      console.error("El parámetro 'comunidad' no está presente en la URL.");
      return;
    }
    const fetchData = async () => {
      const data = await getAutonomyByName(comunidad); // Usamos el parámetro decodificado
      console.log("Datos de autonomía:", data); // Para verificar la respuesta de la API

      setComunidadData(data);
      console.log(data);
    };

    fetchData();
  }, []);

  const handleButtonClick = async (buttonName) => {
    console.log("comunidadData en handleButtonClick:", comunidadData); // Verifica el estado
    setSelectedButton(buttonName); // Actualiza el botón seleccionado
    if (comunidadData && comunidadData.id) {
      const placesData = await getPlacesByAutonomyAndCategory(
        comunidadData.id,
        buttonName
      );
      console.log("Lugares obtenidos:", placesData); // Verifica los datos

      setPlaces(placesData || []);
    }
  };

  return (
    <div className="comunidad-container">
      <h1 className="comunidad-title">Comunidad: {comunidadData.name}</h1>
      <nav className="comunidad-nav">
        {[
          "Comida",
          "Restaurantes",
          "Sitio Histórico",
          "Naturaleza y Aire Libre",
          "Vida Nocturna y Entretenimiento",
          "Hoteles",
          "Mercados y Compras",
        ].map((buttonName) => (
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
            <div key={index} className="place-card">
              <img
                src={`http://localhost:8080/images/${place.imagePath}`}
                alt={place.placeName}
                className="place-image"
              />
              <p className="place-description">{place.description}</p>
              <h3 className="place-name">{place.placeName}</h3>
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
