/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Verifica si el usuario está logueado

  if (!isLoggedIn) {
    alert("Por favor, inicie sesión para acceder a esta ruta.");
    return <Navigate to="/" />;
  }

  return children; // Si está logueado, renderiza la ruta protegida
};

export default PrivateRoute;
