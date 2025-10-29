import React, { useState } from "react";
import { forgotPassword } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setMsg(
        res.message ||
          "Si el correo existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña."
      );
    } catch (error) {
      setMsg(
        error.response?.data?.message ||
          "Ocurrió un error al procesar la solicitud."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 to-green-700">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Recuperar contraseña
        </h2>

        {msg && (
          <p className="bg-emerald-100 text-emerald-700 p-2 rounded-md text-center mb-4">
            {msg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-2 rounded-lg shadow transition ${
              loading
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {loading ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <button
            onClick={() => navigate("/login")}
            className="text-emerald-600 hover:underline"
          >
            ← Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
}
