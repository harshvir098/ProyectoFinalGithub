/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom"; // Importa Outlet para manejar rutas anidadas
import "./Layout.css"; // Archivo CSS separado
import { login } from "../services/api"; // Servicio de login
import { registerUser } from "../services/api"; // Servicio de registro
import perfil from "../assets/perfil.png";

const Layout = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [formType, setFormType] = useState(""); // Para saber si es Login o Register
  const [userLogin, setUserLogin] = useState({}); // Datos del login
  const [userRegister, setUserRegister] = useState({}); // Datos del registro
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para saber si el usuario está logueado
  const [errorMessage, setErrorMessage] = useState("");

  // Leer el estado de autenticación desde localStorage cuando se monta el componente
  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true); // Si está en localStorage, el usuario está logueado
    }
  }, []);

  // Maneja la apertura del popup y determina si es Login o Register
  const handleButtonClick = (type) => {
    setFormType(type); // Establece el tipo de formulario (Login o Register)
    setShowPopup(true); // Muestra el popup
  };

  // Maneja el cierre del popup
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Función para manejar el login
  const handleLogin = () => {
    login(userLogin)
      .then((response) => {
        localStorage.setItem("isLoggedIn", "true"); // Guardar en localStorage
        setIsLoggedIn(true);
        setShowPopup(false);
      })
      .catch((error) => {
        setErrorMessage("Usuario o contraseña incorrectos.");
      });
  };

  // Función para manejar el registro
  const handleRegister = () => {
    if (userRegister.password !== userRegister.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }
    registerUser(userRegister)
      .then(() => {
        setShowPopup(false);
      })
      .catch((error) => {
        setErrorMessage("Error al registrar el usuario.");
      });
  };

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // Eliminar el estado de localStorage
    setIsLoggedIn(false);
  };

  return (
    <div className="layout-container">
      <div className="navbar-container">
        <div className="navbar">
          <div className="brand">
            <h1>Mi Aplicación</h1>
          </div>
          <div className="button-group">
            {!isLoggedIn ? (
              <>
                <button
                  className="navbar-button"
                  onClick={() => handleButtonClick("login")}
                >
                  Login
                </button>
                <button
                  className="navbar-button"
                  onClick={() => handleButtonClick("register")}
                >
                  Register
                </button>
              </>
            ) : (
              <div className="profile">
                <a href="/perfil">
                  <img src={perfil} alt="Perfil" className="profile-image" />
                </a>
                <button className="navbar-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Popup para Login o Register */}
      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <h2>{formType === "login" ? "Login" : "Register"}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (formType === "login") {
                  handleLogin();
                } else {
                  handleRegister();
                }
              }}
            >
              <label>
                Usuario:
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ingresa tu usuario"
                  onChange={(e) =>
                    formType === "login"
                      ? setUserLogin({ ...userLogin, username: e.target.value })
                      : setUserRegister({
                          ...userRegister,
                          username: e.target.value,
                        })
                  }
                />
              </label>
              <label>
                Contraseña:
                <input
                  type="password"
                  className="input-field"
                  placeholder="Ingresa tu contraseña"
                  onChange={(e) =>
                    formType === "login"
                      ? setUserLogin({ ...userLogin, password: e.target.value })
                      : setUserRegister({
                          ...userRegister,
                          password: e.target.value,
                        })
                  }
                />
              </label>
              {formType === "register" && (
                <label>
                  Confirmar Contraseña:
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Confirma tu contraseña"
                    onChange={(e) =>
                      setUserRegister({
                        ...userRegister,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </label>
              )}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div className="button-group">
                <button
                  type="button"
                  className="close-button"
                  onClick={handleClosePopup}
                >
                  Cerrar
                </button>
                <button type="submit" className="submit-button">
                  {formType === "login" ? "Ingresar" : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Aquí se renderizan las rutas anidadas */}
      <div className="main-content">
        <Outlet /> {/* El contenido de las rutas se mostrará aquí */}
      </div>
    </div>
  );
};

export default Layout;
