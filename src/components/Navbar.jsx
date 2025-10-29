import React, { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import MenuList from "./MenuList";

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!usuario) return null;

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <nav className="bg-emerald-600 text-white shadow-md sticky top-0 z-50 md:hidden">
      {/* Barra superior */}
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="font-semibold text-lg tracking-wide">Asomunicipios</h1>

        <button
          onClick={toggleMobileMenu}
          className="flex items-center justify-center w-10 h-10 rounded-md bg-emerald-700 hover:bg-emerald-800 transition-all duration-300 ease-in-out"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú desplegable animado */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-emerald-700 px-4 pb-4 space-y-3">
          {/* Lista de enlaces */}
          <div className="border-t border-emerald-500 pt-3">
            <MenuList onItemClick={() => setMobileMenuOpen(false)} />
          </div>

          {/* Usuario + botón de logout alineado */}
          <div className="border-t border-emerald-500 pt-3 flex items-center justify-between">
            <p className="text-sm text-emerald-100 flex items-center gap-2">
              👤 {usuario?.nombre || usuario?.correo}
              <span className="text-xs text-emerald-300">
                ({usuario?.rol})
              </span>
            </p>

            <button
              onClick={logout}
              className="p-2 text-emerald-200 hover:text-red-400 hover:bg-red-800/20 rounded-full transition"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
