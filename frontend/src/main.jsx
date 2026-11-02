import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";

import "./index.css";
import App from "./App.jsx";

// Endereço atual do seu backend
const API_ORIGIN = "http://localhost:5000";

// Confere se a requisição é destinada ao nosso backend.
function pertenceAoBackend(config) {
    try {
        const endereco = new URL(
            config.url,
            config.baseURL || window.location.origin
        );

        return endereco.origin === API_ORIGIN;
    } catch {
        return false;
    }
}

// Executa antes de enviar cada requisição.
const requestInterceptor = axios.interceptors.request.use(
    (config) => {

        // Evita enviar o token para outros servidores.
        if (!pertenceAoBackend(config)) {
            return config;
        }

        const endereco = new URL(
            config.url,
            config.baseURL || window.location.origin
        );

        // O login não precisa de um token anterior.
        if (endereco.pathname === "/login") {
            return config;
        }

        const token = localStorage.getItem("token");

        if (token) {
            config.headers = config.headers || {};

            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    }
);

// Executa quando o backend devolve uma resposta.
const responseInterceptor = axios.interceptors.response.use(
    (response) => response,

    (error) => {

        const config = error.config;

        if (
            config &&
            pertenceAoBackend(config) &&
            error.response?.status === 401
        ) {
            const tokenAtual = localStorage.getItem("token");

            const tokenEnviado =
                config.headers?.Authorization;

            // Limpa somente a sessão que foi recusada.
            // Uma resposta antiga não apaga um login mais recente.
            if (
                tokenAtual &&
                tokenEnviado === `Bearer ${tokenAtual}`
            ) {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                localStorage.removeItem("tipoUsuario");

                if (window.location.pathname !== "/") {
                    window.location.replace("/");
                }
            }
        }

        return Promise.reject(error);
    }
);

// Remove os interceptadores quando o Vite recarrega este módulo.
if (import.meta.hot) {
    import.meta.hot.dispose(() => {
        axios.interceptors.request.eject(requestInterceptor);
        axios.interceptors.response.eject(responseInterceptor);
    });
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);