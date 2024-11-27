import axios from "axios";

const i = axios.create({ baseURL: 'http://localhost:8080' });

export const login = async (user) => {
    // Verificar que username y password no estén vacíos
    if (!user.username || !user.password) {
        console.error("Username or password is missing");
        return;
    }

    // Crear el token base64
    const token = btoa(user.username + ":" + user.password);

    try {
        const response = await i.post("/login", {}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + token,
            },
        });

        // Verificar si la respuesta es exitosa
        if (response.data.resp === "Login exitoso") {
            setAuth(token);
            return { token, id: response.data.id };
        } else {
            console.error("Login failed", response.data.resp);
        }
    } catch (error) {
        console.error("Login error", error);
    }
};

export const setAuth = async (token) => {
    i.defaults.headers.common["Authorization"] = `Basic ${token}`;
};

export const registerUser = async (user) => {
    try {
        await i.post("/auth/register", user);
    } catch (error) {
        console.error("Register error", error);
    }
};

export const getUserById = async (id) => {
    try {
        const response = await i.get("/users/" + id);
        return response.data;
    } catch (error) {
        console.error("Get user by id error", error);
    }
};