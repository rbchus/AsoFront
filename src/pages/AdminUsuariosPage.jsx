// src/pages/AdminUsuariosPage.jsx
import React, { useState } from "react";
import { createUserFromAdmin } from "../services/authService";

export default function AdminUsuariosPage() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    rol: "FUNCIONARIO",
  });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      await createUserFromAdmin(form);
      setMsg("✅ Usuario creado correctamente. Recibirá un correo para asignar su clave.");
      setForm({ nombre: "", correo: "", rol: "FUNCIONARIO" });
    } catch (error) {
      console.error(error);
      setMsg(
        `❌ Error al crear el usuario: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 max-w-md mx-auto mt-10 shadow-lg rounded-xl bg-white">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Crear Usuario (Administrador)
      </h2>

      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="text-gray-600">Nombre:</span>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
          />
        </label>

        <label className="block">
          <span className="text-gray-600">Correo:</span>
          <input
            type="email"
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
            required
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
          />
        </label>

        <label className="block">
          <span className="text-gray-600">Rol:</span>
          <select
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value })}
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
          >
            <option value="FUNCIONARIO">FUNCIONARIO</option>
            <option value="ADMINISTRADOR">ADMINISTRADOR</option>
            <option value="CIUDADANO">CIUDADANO</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          {loading ? "Creando..." : "Crear Usuario"}
        </button>
      </form>

      {msg && (
        <p className="mt-4 text-sm text-gray-700 text-center bg-gray-50 p-2 rounded-md">
          {msg}
        </p>
      )}
    </div> // ✅ cierre correcto del div principal
  );
}
