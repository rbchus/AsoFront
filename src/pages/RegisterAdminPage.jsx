import React, { useState } from "react";
import { createUserFromAdmin as apiRegister } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

// 👉 Función para formatear nombres (Capital Case inteligente)
const formatNombre = (texto) => {
  // detectar si el usuario dejó un espacio al final
  const tieneEspacioFinal = texto.endsWith(" ");

  const palabrasMinusculas = [
    "de", "del", "la", "las", "los", "y",
    "da", "das", "do", "dos",
    "van", "von",
    "di", "du",
    "el"
  ];

  const palabras = texto
    .trim()
    .toLowerCase()
    .split(/\s+/) // acepta múltiples espacios
    .map((palabra, index) => {
      if (index === 0) {
        return palabra.charAt(0).toUpperCase() + palabra.slice(1);
      }
      if (palabrasMinusculas.includes(palabra)) {
        return palabra;
      }
      return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    });

  // reconstruir el texto
  let resultado = palabras.join(" ");

  // restaurar espacio final si el usuario lo escribió
  if (tieneEspacioFinal) resultado += " ";

  return resultado;
};


export default function RegisterAdminPage() {
  const [form, setForm] = useState({
    nombre: "",
    tipoDocumento: "",
    numeroDocumento: "",
    telefono: "",
    confirmarTelefono: "",
    correo: "",
    confirmarCorreo: "",
    rol: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (form.correo !== form.confirmarCorreo) {
      setMsg("❌ Los correos electrónicos no coinciden.");
      return;
    }
    if (form.telefono !== form.confirmarTelefono) {
      setMsg("❌ Los números de teléfono no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await apiRegister({
        nombre: form.nombre,
        tipoDocumento: form.tipoDocumento,
        numeroDocumento: form.numeroDocumento,
        telefono: form.telefono,
        correo: form.correo,
        rol: form.rol,
      });

      setMsg("✅ Usuario registrado correctamente.");
      setTimeout(() => navigate("/dashboard/admin/usuarios"), 500);
    } catch (error) {
      console.error("❌ Error al registrar:", error);

      if (error.response?.status === 409) {
        setMsg(error.response.data.message || "El usuario ya existe.");
      } else if (error.response?.status === 400) {
        setMsg("Datos inválidos, revisa el formulario.");
      } else {
        setMsg("❌ Error al registrar, inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 to-green-700 p-6">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <div className="flex items-center justify-center mb-6">
          <UserPlus className="text-emerald-600 w-7 h-7 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">
            Registro de Usuario (Admin)
          </h2>
        </div>

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

        <form onSubmit={submit} className="space-y-6">
          {/* DATOS PERSONALES */}
          <div>
            <h3 className="text-lg font-semibold text-emerald-700 mb-2">
              🧍 Datos personales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NOMBRE CON CAPITAL CASE */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) =>
                    setForm({ ...form, nombre: formatNombre(e.target.value) })
                  }
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none"
                  placeholder="Ej: Ana Gómez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de documento
                </label>
                <select
                  value={form.tipoDocumento}
                  onChange={(e) =>
                    setForm({ ...form, tipoDocumento: e.target.value })
                  }
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none"
                >
                  <option value="">Seleccione...</option>
                  <option value="CC">Cédula de ciudadanía (CC)</option>
                  <option value="CE">Cédula de extranjería (CE)</option>
                  <option value="PA">Pasaporte (PA)</option>
                  <option value="NIT">NIT</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Número de documento
                </label>
                <input
                  type="text"
                  value={form.numeroDocumento}
                  onChange={(e) =>
                    setForm({ ...form, numeroDocumento: e.target.value })
                  }
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none"
                  placeholder="Ej: 1001234567"
                />
              </div>
            </div>
          </div>

          {/* CONTACTO */}
          <div>
            <h3 className="text-lg font-semibold text-emerald-700 mb-2">
              ☎️ Contacto
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(e) =>
                    setForm({ ...form, telefono: e.target.value })
                  }
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none"
                  placeholder="Ej: 3001234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirmar teléfono
                </label>
                <input
                  type="tel"
                  value={form.confirmarTelefono}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      confirmarTelefono: e.target.value,
                    })
                  }
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none"
                  placeholder="Repite el número"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={form.correo}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirmar correo
                </label>
                <input
                  type="email"
                  value={form.confirmarCorreo}
                  onChange={(e) =>
                    setForm({ ...form, confirmarCorreo: e.target.value })
                  }
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none"
                  placeholder="Repite tu correo"
                />
              </div>
            </div>
          </div>

          {/* ROL */}
          <div>
            <h3 className="text-lg font-semibold text-emerald-700 mb-2">
              👤 Rol del usuario
            </h3>
            <select
              value={form.rol}
              onChange={(e) => setForm({ ...form, rol: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none"
            >
              <option value="">Seleccione un rol...</option>
              <option value="CIUDADANO">CIUDADANO</option>
              <option value="GESTOR">GESTOR</option>
              <option value="SUPERVISOR">SUPERVISOR</option>
            </select>
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-3 rounded-lg shadow transition ${
              loading
                ? "bg-emerald-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {loading ? "Registrando..." : "Registrar usuario"}
          </button>
        </form>
      </div>
    </div>
  );
}
