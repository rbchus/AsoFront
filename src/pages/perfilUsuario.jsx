import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { changePassword } from "../services/authService";
import { Lock, User, Eye, EyeOff } from "lucide-react";

export default function PerfilUsuario() {
  const { usuario } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const validarPassword = (pwd) => {
    // ✅ Mínimo 6 caracteres, debe incluir letras y números
    // y puede contener caracteres especiales comunes
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_\-*\/#%&!]{6,}$/;
    return regex.test(pwd);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (password !== confirmarPassword) {
      setMsg("❌ Las contraseñas no coinciden.");
      return;
    }

    if (!validarPassword(password)) {
      setMsg(
        "⚠️ La contraseña debe tener al menos 6 caracteres, incluir letras, números y puede contener símbolos (_ * / # % & !)."
      );
      return;
    }

    setLoading(true);
    try {
      const objeto = { newPass: password };
      await changePassword(objeto);
      setMsg("✅ Contraseña actualizada correctamente.");
      setPassword("");
      setConfirmarPassword("");
    } catch (error) {
      console.error("❌ Error al cambiar contraseña:", error);
      setMsg(
        error.response?.data?.message ||
          "❌ No se pudo actualizar la contraseña."
      );
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(null), 5000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 to-green-700 p-6">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <User className="text-emerald-600 w-7 h-7 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            Perfil del Usuario
          </h2>
        </div>

        {/* Mensaje */}
        {msg && (
          <p
            className={`text-center mb-4 p-2 rounded-md ${
              msg.startsWith("✅")
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {msg}
          </p>
        )}

        {/* Información del usuario */}
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p>
              <strong>🪪 Tipo de Documento:</strong> {usuario?.tipoDocumento}
            </p>
            <p>
              <strong>🔢 Número:</strong> {usuario?.numeroDocumento}
            </p>
            <p>
              <strong>👤 Nombre:</strong> {usuario?.nombre}
            </p>
            <p>
              <strong>📞 Teléfono:</strong> {usuario?.telefono}
            </p>
            <p>
              <strong>📧 Correo:</strong> {usuario?.correo}
            </p>
            <p>
              <strong>🎭 Rol:</strong> {usuario?.rol}
            </p>
          </div>
        </div>

        {/* Cambiar contraseña */}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <h3 className="text-lg font-semibold text-emerald-700 mb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" /> Cambiar Contraseña
          </h3>

          {/* Campo: Nueva contraseña */}
          <div className="relative">
            <input
              type={mostrarPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:ring-2 focus:ring-emerald-400 outline-none"
            />
            <button
              type="button"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-emerald-600"
            >
              {mostrarPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Campo: Confirmar contraseña */}
          <div className="relative">
            <input
              type={mostrarConfirmar ? "text" : "password"}
              placeholder="Confirmar nueva contraseña"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:ring-2 focus:ring-emerald-400 outline-none"
            />
            <button
              type="button"
              onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-emerald-600"
            >
              {mostrarConfirmar ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-3 rounded-lg shadow transition ${
              loading
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {loading ? "Actualizando..." : "Actualizar Contraseña"}
          </button>

          <p className="text-xs text-gray-500 text-center mt-2">
            La contraseña debe tener al menos 6 caracteres, incluir letras y
            números, y puede contener símbolos como: <br />
            <span className="font-mono text-emerald-700">
              _ * / # % & !
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
