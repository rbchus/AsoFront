import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { doLogin, loading } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await doLogin(form.username, form.password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 to-green-700">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Iniciar sesión
        </h2>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded-md text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {/* Enlaces complementarios */}
        <div className="text-center mt-6 text-sm text-gray-700 space-y-2">
          <p>
            ¿Olvidaste tu contraseña?{" "}
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-emerald-600 font-medium hover:underline"
            >
              Recuperarla
            </button>
          </p>
          <p>
            ¿No tienes cuenta?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-emerald-600 font-medium hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
