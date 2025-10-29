// src/services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
     timeout: 15000,
  },
});

// Usa interceptor para agregar token desde sessionStorage
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
); */

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;

    // Si la sesión expira (401), solo redirige si NO estás en el login
    if (status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/login")) {
        sessionStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
