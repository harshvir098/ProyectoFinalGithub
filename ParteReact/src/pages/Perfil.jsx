import { useEffect, useState } from "react";
import { getUserById } from "../services/api";
import { useUserContext } from "../providers/UserProvider";

const Perfil = () => {
  const [userData, setUserData] = useState({});
  const { user } = useUserContext(); // Asegúrate de que `user` se obtiene correctamente del contexto

  useEffect(() => {
    if (user?.id) {
      // Verificar si la `id` de `user` existe
      getUserById(user.id)
        .then((response) => {
          setUserData(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data", error);
        });
    }
  }, []); // Agregar `user` como dependencia para que se ejecute cuando cambie

  return (
    <div>
      <h3>Perfil</h3>
      <label>Usuario</label>
      <input
        type="text"
        placeholder="Usuario"
        value={userData.username || ""}
        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
      />
      <label>Nombre</label>
      <input
        type="text"
        placeholder="Nombre"
        value={userData.name || ""}
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
      />
      <label>Apellido</label>
      <input
        type="text"
        placeholder="Apellido"
        value={userData.lastName || ""}
        onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
      />
      <label>Edad</label>
      <input
        type="text"
        placeholder="Edad"
        value={userData.age || ""}
        onChange={(e) => setUserData({ ...userData, age: e.target.value })}
      />
      <label>Localidad</label>
      <input
        type="text"
        placeholder="Localidad"
        value={userData.location || ""}
        onChange={(e) => setUserData({ ...userData, location: e.target.value })}
      />
      <button>Guardar</button>
    </div>
  );
};

export default Perfil;
