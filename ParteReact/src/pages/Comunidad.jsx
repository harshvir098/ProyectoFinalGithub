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
    setComunidadData(getAutonomyByName(comunidad));
    console.log(comunidadData);
  }, [comunidad]);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName); // Actualiza el botón seleccionado
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
            }`} // Agrega la clase 'active' al botón seleccionado
            onClick={() =>
              handleButtonClick(buttonName).then(() =>
                setPlaces(getPlacesByAutonomyAndCategory(comunidad, buttonName))
              )
            } // Maneja el clic en el botón
          >
            {buttonName}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Comunidad;
