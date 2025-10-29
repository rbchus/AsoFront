import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { usuario, initialized, loading } = useAuth();
  const location = useLocation();

  // ⏳ Esperar a que el contexto termine de inicializar
  if (!initialized || loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        Verificando sesión...
      </div>
    );
  }

  // 🚫 Si no hay usuario y no estamos en login → redirigir
  if (initialized && !usuario && location.pathname.startsWith("/dashboard")) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Si hay restricción de roles
  if (allowedRoles.length > 0 && usuario) {
    const userRol = String(usuario.rol || "").toUpperCase();
    const allowed = allowedRoles.map((r) => String(r).toUpperCase());
    if (!allowed.includes(userRol)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
