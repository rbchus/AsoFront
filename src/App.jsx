// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./layout/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import TramiteFormPage from "./pages/TramiteFormPage";
import TramiteListPage from "./pages/TramiteListPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage"; // nuevo nombre coherente
import ProtectedRoute from "./components/ProtectedRoute";

import { useDocumentTitle } from "./hooks/useDocumentTitle";

function App() {
  useDocumentTitle("Asomunicipios | Sistema Catastral");

  return (
    <Routes>
      {/* Redirección principal  */}
      <Route path="/" element={<Navigate to="/login" replace />} />. 

      {/* Redirección principal — si hay sesión, ir al dashboard; si no, ir al login 
      <Route
        path="/"
        element={
          sessionStorage.getItem("token") ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />. */}
        
      {/* Autenticación */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Alias (por si usaban las rutas antiguas) */}
      <Route path="/registro" element={<Navigate to="/register" replace />} />
      <Route
        path="/recuperar"
        element={<Navigate to="/forgot-password" replace />}
      />

      {/* Área protegida */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="tramites" element={<TramiteListPage />} />
        <Route path="tramites/nuevo" element={<TramiteFormPage />} />

        {/* Sección solo para ADMIN */}
        <Route
          path="admin/usuarios"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "ADMINISTRADOR"]}>
              <div style={{ padding: 20 }}>
                <h2>Administración de Usuarios</h2>
                <p>
                  Aquí mostrarás el listado y el formulario para crear usuarios.
                </p>
              </div>
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all: redirige a login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
