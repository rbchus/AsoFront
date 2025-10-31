// src/services/authService.js
import apiClient from "./apiClient";

/**
 * Iniciar sesión
 * Endpoint: POST /api/auth/login
 * Body: { username, password }
 * Respuesta: { access_token: "..." }
 */
export const login = async (username, password) => {
  const res = await apiClient.post("/auth/login", { username, password });
  // Devuelve el token con el nombre correcto del backend
  return res.data; // { access_token: "..." }
};

/**
 * Crear usuario (registro normal)
 * Endpoint: POST /api/usuarios/create-user
 * Body: { nombre, correo, password }
 */
export const register = async (payload) => {
  console.log ("register" ,payload)
  const res = await apiClient.post("/usuarios/create-user", payload);
  return res.data;
};

/**
 * Olvidé contraseña
 * Endpoint: POST /api/usuarios/reset-password
 * Body: { correo }
 */
export const forgotPassword = async (correo) => {
  const res = await apiClient.post("/usuarios/reset-password", { correo });
  return res.data;
};

/**
 * Cambiar contraseña (requiere token Bearer)
 * Endpoint: POST /api/usuarios/edit-password
 * Body: { newPass }
 */
export const changePassword = async (payload) => {
  const res = await apiClient.post("/usuarios/edit-password", payload);
  return res.data;
};

/**
 * Crear usuario desde administrador (requiere token Bearer)
 * Endpoint: POST /api/usuarios/create-from-admin
 * Body: { nombre, correo, rol }
 */
export const createUserFromAdmin = async (payload) => {
  const res = await apiClient.post("/usuarios/create-from-admin", payload);
  return res.data;
};

export const doLogin = login;
