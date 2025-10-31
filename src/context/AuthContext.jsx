/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { login as apiLogin } from "../services/authService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Restaurar sesión
  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");

    /*   if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        setUsuario({
          id: decoded.id_user,
          nombre: decoded.username,
          correo: decoded.email,
          rol: decoded.rol,
        });
        setToken(savedToken);
      } catch {
        sessionStorage.removeItem("token");
      }
    }
    setInitialized(true); */

    const isValidToken =
      savedToken && savedToken !== "undefined" && savedToken !== "null";

    if (isValidToken) {
      try {
        const decoded = jwtDecode(savedToken);
        setUsuario({
          id: decoded.id_user,
          nombre: decoded.username,
          correo: decoded.email,
          rol: decoded.rol,
        });
        setToken(savedToken);
      } catch (err) {
        console.warn("⚠️ Token inválido, se limpia la sesión:", err);
        sessionStorage.removeItem("token");
      }
    } else {
      sessionStorage.removeItem("token");
    }

    setInitialized(true);
  }, []);

  // Iniciar sesión
  const doLogin = async (username, password) => {
    setLoading(true);
    try {
      const data = await apiLogin(username, password);

      /*   const tokenFromServer = data?.access_token;
      if (!tokenFromServer) {
        setLoading(false);
        return { success: false, message: "❌ Usuario o contraseña incorrectos" };
      }

      const decoded = jwtDecode(tokenFromServer);
      setUsuario({
        id: decoded.id_user,
        nombre: decoded.username,
        correo: decoded.email,
        rol: decoded.rol,
      });
      setToken(tokenFromServer);
      sessionStorage.setItem("token", tokenFromServer);

      setLoading(false);
      navigate("/dashboard", { replace: true });
      return { success: true }; */

      const tokenFromServer = data?.access_token || null;

      if (!tokenFromServer || tokenFromServer === "undefined") {
        setLoading(false);
        return {
          success: false,
          message: "❌ Usuario o contraseña incorrectos",
        };
      }

      try {
        const decoded = jwtDecode(tokenFromServer);
        setUsuario({
          id: decoded.id_user,
          nombre: decoded.username,
          correo: decoded.email,
          rol: decoded.rol,
        });
        setToken(tokenFromServer);
        sessionStorage.setItem("token", tokenFromServer);
        navigate("/dashboard", { replace: true });
        setLoading(false);
        return { success: true };
      } catch (decodeErr) {
        console.error("Error decodificando token:", decodeErr);
        setLoading(false);
        return {
          success: false,
          message: "❌ Usuario o contraseña incorrectos",
        };
      }
    } catch (err) {
      console.error("Error login:", err);
      setLoading(false);
      return { success: false, message: "❌   Usuario o contraseña incorrectos" };
    }
  };

  // Cerrar sesión
  const logout = () => {
    setToken(null);
    setUsuario(null);
    sessionStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{ token, usuario, loading, initialized, doLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
