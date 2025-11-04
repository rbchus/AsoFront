import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MenuList({ onItemClick }) {
  const { usuario } = useAuth();
  const rol = usuario?.rol || "";

  let menuItems = [];

  if (rol === "CIUDADANO") {
    menuItems = [
      { path: "/dashboard", label: "Inicio" },
      { path: "/dashboard/perfil", label: "Mi Perfil" },
      { path: "/dashboard/tramites", label: "Mis Trámites" },
      { path: "/dashboard/tramites/nuevo", label: "Nuevo Trámite" },
    ];
  } else if (rol === "GESTOR") {
    menuItems = [
      { path: "/dashboard", label: "Inicio" },
      { path: "/dashboard/perfil", label: "Mi Perfil" },
      { path: "/dashboard/tramites", label: "Trámites Asignados" },
      { path: "/dashboard/tramites/nuevo", label: "Registrar Trámite" },
    ];
  } else if (rol === "ADMIN") {
    menuItems = [
      { path: "/dashboard", label: "Inicio" },
      { path: "/dashboard/perfil", label: "Mi Perfil" },
      { path: "/dashboard/tramites", label: "Trámites" },
      { path: "/dashboard/tramites/nuevo", label: "Nuevo Trámite" },
      { path: "/dashboard/admin/usuarios", label: "Admin Usuarios" },
      { path: "/dashboard/admin/usuarios/create", label: "Crear Usuarios" },
      { path: "/dashboard/admin/gestor", label: "Asignar Gestores" },
    ];
  } else if (rol === "ATENCION_AL_USUARIO") {
    menuItems = [
      { path: "/dashboard", label: "Inicio" },
      { path: "/dashboard/perfil", label: "Mi Perfil" },
      { path: "/dashboard/tramites", label: "Trámites" },
       { path: "/dashboard/admin/usuarios", label: "Usuarios" },
      { path: "/dashboard/tramites/nuevo", label: "Nuevo Trámite" },
     
    ];
  }

  return (
    <ul className="space-y-2">
      {menuItems.map((item) => (
        <li key={item.path}>
          <Link
            to={item.path}
            onClick={onItemClick}
            className="block px-3 py-2 rounded-md hover:bg-green-900/40 text-gray-200 transition"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
