import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { path: "/dashboard", label: "Inicio" },
  { path: "/dashboard/tramites", label: "Trámites" },
  { path: "/dashboard/tramites/nuevo", label: "Nuevo Trámite" },
  // { path: "/dashboard/reportes", label: "Reportes" },
];

export default function MenuList({ onItemClick }) {
  const { usuario } = useAuth();

  const menuItems =
    usuario?.rol === "CIUDADANO"
      ? [
          { path: "/dashboard", label: "Inicio" },
          { path: "/dashboard/tramites", label: "Mis Trámites" },
          { path: "/dashboard/tramites/nuevo", label: "Nuevo Trámite" },
        ]
      : [
          { path: "/dashboard", label: "Inicio" },
          { path: "/dashboard/tramites", label: "Trámites" },
          { path: "/dashboard/tramites/nuevo", label: "Nuevo Trámite" },
          // { path: "/dashboard/reportes", label: "Reportes" },
        ];
        
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
