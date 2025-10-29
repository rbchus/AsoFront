import React from "react";
import { Menu, PanelLeftClose } from "lucide-react";
import UserMenu from "./UserMenu";
import MenuList from "./MenuList";
import "./dashboard.css";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { usuario, logout } = useAuth();

  return (
    <aside
      className={`sidebar ${isCollapsed ? "collapsed" : ""} hidden md:flex`}
    >
      {/* Encabezado normal */}
      {!isCollapsed ? (
        <div className="brand flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-green-300 tracking-wide">
            Asomunicipios
          </h2>
          <button
            className="p-2 rounded-full hover:bg-green-800/30 transition"
            onClick={toggleSidebar}
          >
            <PanelLeftClose className="w-5 h-5 text-green-400" />
          </button>
        </div>
      ) : (
        /* Encabezado colapsado */
        <div className="collapsed-header flex flex-col items-center justify-center py-4 border-b border-gray-200">
          <button
            className="p-2 rounded-full hover:bg-green-800/30 transition"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6 text-green-400" />
          </button>
          <span className="text-xs text-green-300 text-center">Menú</span>
        </div>
      )}

      {/* Lista de menús */}
      {!isCollapsed && (
        <div className="menu mt-4 space-y-1 px-4">
          <MenuList />
        </div>
      )}

      {/* Menú de usuario */}
      {!isCollapsed && usuario && (
        <div className="mt-auto">
          <UserMenu usuario={usuario.nombre} onLogout={logout} />
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
