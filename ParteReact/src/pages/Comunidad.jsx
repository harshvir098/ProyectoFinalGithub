import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAutonomyByName } from "../services/api";
import { getPlacesByAutonomyAndCategory } from "../services/api";
import "./Comunidad.css"; // Asegúrate de importar el archivo CSS

const Comunidad = () => {
  const { comunidad } = useParams(); // Desestructuración para obtener el parámetro
  const [comunidadData, setComunidadData] = useState({});
  const [selectedButton, setSelectedButton] = useState("Comida"); // Estado para el botón seleccionado
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // Traer datos de la autonomía
    const fetchData = async () => {
      const data = await getAutonomyByName(comunidad);
      setComunidadData(data);

      // Traer lugares según la categoría por defecto (Comida)
      const placesData = await getPlacesByAutonomyAndCategory(
        comunidad,
        "Comida"
      );
      setPlaces(placesData);
    };

    fetchData();
  }, [comunidad]);

  const handleButtonClick = async (buttonName) => {
    setSelectedButton(buttonName); // Actualiza el botón seleccionado
    const placesData = await getPlacesByAutonomyAndCategory(
      comunidad,
      buttonName
    );
    setPlaces(placesData); // Actualiza los lugares según la categoría seleccionada
  };

  return (
    <div className="comunidad-container">
      <h1 className="comunidad-title">Comunidad: {comunidadData.name}</h1>
      <nav className="comunidad-nav">
        {[
          "Comida",
          "Restaurantes",
          "Monumentos",
          "Paisajes",
          "Ocio",
          "Hoteles",
          "Mercados",
        ].map((buttonName) => (
          <button
            key={buttonName}
            className={`comunidad-btn ${
              selectedButton === buttonName ? "active" : ""
            }`}
            onClick={() => handleButtonClick(buttonName)} // Maneja el clic en el botón
          >
            {buttonName}
          </button>
        ))}
      </nav>
      <div className="places-list">
        {places.length > 0 ? (
          places.map((place, index) => (
            <div key={index} className="place-item">
              <h3>{place.name}</h3>
              <p>{place.description}</p>
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
