// src/components/UserMenu.jsx
import { LogOut, User } from "lucide-react";

export default function UserMenu({ usuario, onLogout }) {
  return (
    <div className="flex items-center justify-between p-3 mt-auto border-t border-gray-700 bg-black/40">
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-green-700 rounded-full">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-green-300">{usuario}</p>
          <p className="text-xs text-gray-400">Conectado</p>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-800/20 rounded-full transition"
        title="Cerrar sesión"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
}
