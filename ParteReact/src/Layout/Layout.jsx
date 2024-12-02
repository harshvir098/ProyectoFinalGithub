/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./Layout.css";
import { login } from "../services/api";
import { registerUser } from "../services/api";
import perfil from "../assets/perfil.png";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../providers/UserProvider";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // Asegúrate de importar tu logo

const Layout = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [formType, setFormType] = useState(""); // Login o Register
  const [userLogin, setUserLogin] = useState({}); // Datos del login
  const [userRegister, setUserRegister] = useState({}); // Datos del registro
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { setUser } = useUserContext();

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleButtonClick = (type) => {
    setFormType(type);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setErrorMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Llamamos a la función login y esperamos la respuesta
      const user = await login({
        username: userLogin.username,
        password: userLogin.password,
      });

      if (user && user.id && user.token) {
        // Guardamos el usuario, token e id en localStorage
        setUser(user); // Establece el usuario completo
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", user.id); // Guardar ID en localStorage
        localStorage.setItem("token", user.token); // Guardar token en localStorage

        setIsLoggedIn(true);
        setShowPopup(false);
      } else {
        setErrorMessage("Usuario o contraseña incorrectos.");
      }
    } catch (error) {
      setErrorMessage("Error al iniciar sesión. Inténtalo de nuevo.");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (userRegister.password !== userRegister.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }
    registerUser(userRegister)
      .then(() => {
        setShowPopup(false);
      })
      .catch(() => {
        setErrorMessage("Error al registrar el usuario.");
      });
  };

  const handleLogout = () => {
    // Eliminar los elementos relacionados con el login del localStorage
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId"); // Eliminar ID del usuario
    localStorage.removeItem("token"); // Eliminar el token de autenticación

    // Actualizar el estado de login
    setIsLoggedIn(false);
    setUser(null); // Si estás usando el contexto para el usuario, reiniciar el estado

    // Redirigir al usuario a la página de inicio
    navigate("/");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar-container">
        <div className="navbar">
          <div className="navbar-left">
            <a href="/">
              <img src={logo} alt="Logo" className="logo" />
            </a>
          </div>
          <div className="navbar-center"></div>
          <div className="navbar-right">
            {!isLoggedIn ? (
              <>
                <button
                  className="navbar-button login"
                  onClick={() => handleButtonClick("login")}
                >
                  Login
                </button>
                <button
                  className="navbar-button register"
                  onClick={() => handleButtonClick("register")}
                >
                  Register
                </button>
              </>
            ) : (
              <div className="profile">
                <a href="/perfil">
                  <img
                    src={perfil}
                    alt="Perfil"
                    className="profile-image" // Aplica la clase para la imagen
                  />
                </a>
                <button className="navbar-button logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Popup para Login o Register */}
      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <h2>{formType === "login" ? "Login" : "Register"}</h2>
            <form
              onSubmit={formType === "login" ? handleLogin : handleRegister}
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

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
