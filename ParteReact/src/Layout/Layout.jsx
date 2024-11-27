import { useState } from "react";
import "./Layout.css"; // Archivo CSS separado
import { login } from "../services/api"; // Servicio para login
import { registerUser } from "../services/api"; // Servicio para registro

const Navbar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [formType, setFormType] = useState(""); // Para saber si es Login o Register
  const [userLogin, setUserLogin] = useState({ username: "", password: "" });
  const [userRegister, setUserRegister] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Para mostrar mensajes de error

  // Maneja la apertura del popup y determina si es Login o Register
  const handleButtonClick = (type) => {
    setFormType(type); // Establece el tipo de formulario (Login o Register)
    setShowPopup(true); // Muestra el popup
    setErrorMessage(""); // Limpiar mensaje de error al abrir el formulario
  };

  // Maneja el cierre del popup
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  // Maneja el cambio de valores para Login
  const handleLoginChange = (e) => {
    setUserLogin({ ...userLogin, [e.target.name]: e.target.value });
  };

  // Maneja el cambio de valores para Register
  const handleRegisterChange = (e) => {
    setUserRegister({ ...userRegister, [e.target.name]: e.target.value });
  };

  // Maneja el envío del formulario de login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Llamada a la función login, pasa los datos del usuario
    login(userLogin)
      .then((response) => {
        // Lógica de éxito
        console.log("Login exitoso", response);
        setShowPopup(false); // Cerrar el popup
      })
      .catch((error) => {
        setErrorMessage("Usuario o contraseña incorrectos");
        console.error(error);
      });
  };

  // Maneja el envío del formulario de registro
  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    // Verifica si las contraseñas coinciden
    if (userRegister.password !== userRegister.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return;
    }

    // Llamada a la función registerUser, pasa los datos del nuevo usuario
    registerUser(userRegister)
      .then((response) => {
        // Lógica de éxito
        console.log("Registro exitoso", response);
        setShowPopup(false); // Cerrar el popup
      })
      .catch((error) => {
        setErrorMessage("Error al registrar el usuario");
        console.error(error);
      });
  };

  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="brand">
          <h1>Mi Aplicación</h1>
        </div>
        <div className="button-group">
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
        </div>
      </div>

      {/* Popup para Login o Register */}
      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <h2>{formType === "login" ? "Login" : "Register"}</h2>
            <form
              onSubmit={
                formType === "login" ? handleLoginSubmit : handleRegisterSubmit
              }
            >
              <label>
                Usuario:
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ingresa tu usuario"
                  name="username"
                  value={
                    formType === "login"
                      ? userLogin.username
                      : userRegister.username
                  }
                  onChange={
                    formType === "login"
                      ? handleLoginChange
                      : handleRegisterChange
                  }
                />
              </label>
              <label>
                Contraseña:
                <input
                  type="password"
                  className="input-field"
                  placeholder="Ingresa tu contraseña"
                  name="password"
                  value={
                    formType === "login"
                      ? userLogin.password
                      : userRegister.password
                  }
                  onChange={
                    formType === "login"
                      ? handleLoginChange
                      : handleRegisterChange
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
                    name="confirmPassword"
                    value={userRegister.confirmPassword}
                    onChange={handleRegisterChange}
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
    </div>
  );
};

export default Navbar;
