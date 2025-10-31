import { useEffect, useState, useMemo } from "react";
import { getUsuarios, actualizarRolUsuario } from "../services/usuariosService"; // Crear estos servicios
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function UsuariosListPage() {
  const { usuario: usuarioLogueado } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
   const [msg, setMsg] = useState(null);

  // 🔹 Filtros
  const [filtroTexto, setFiltroTexto] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [porPagina] = useState(5);

  // 🔹 Cargar datos
  const fetchUsuarios = async () => {
    const res = await getUsuarios();
    console.log(res.data);
    setUsuarios(res.data || []);
  };

  useEffect(() => {
    console.log(" ..... USAURIOS ADMIN ......");
    fetchUsuarios();
  }, []);

  // 🔹 Filtrado
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const texto = filtroTexto.toLowerCase();
      return (
        u.numeroDocumento?.toLowerCase().includes(texto) ||
        u.nombre?.toLowerCase().includes(texto) ||
        u.correo?.toLowerCase().includes(texto)
      );
    });
  }, [usuarios, filtroTexto]);

  // 🔹 Paginación
  const indiceInicial = (paginaActual - 1) * porPagina;
  const usuariosPagina = usuariosFiltrados.slice(
    indiceInicial,
    indiceInicial + porPagina
  );
  const totalPaginas = Math.ceil(usuariosFiltrados.length / porPagina);
  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas)
      setPaginaActual(nuevaPagina);
  };

  // 🔹 Cambiar rol
  const handleCambiarRol = async (id_usuario, nuevoRol) => {
  try {
    const objeto = { rol: nuevoRol };
    console.log(`${id_usuario} cambiar al rol ${nuevoRol}`);

   await actualizarRolUsuario(id_usuario, objeto);

    setMsg("✅ Rol actualizado correctamente.");
    fetchUsuarios();
  } catch (error) {
    console.error("❌ Error al cambiar el rol:", error);
    setMsg(
      error.response?.data?.message ||
        "❌ Ocurrió un error al actualizar el rol."
    );
  }finally {
    // 🕒 Limpiar el mensaje después de 5 segundos
    setTimeout(() => setMsg(null), 5000);
  }
};

  return (
    <div className="p-6 w-full max-w-7xl mx-auto bg-white mt-10 rounded-2xl shadow-md relative">
      {/* 🔹 Filtro global */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre, documento o correo"
          className="border px-3 py-2 rounded-lg flex-1 text-sm"
          value={filtroTexto}
          onChange={(e) => {
            setFiltroTexto(e.target.value);
            setPaginaActual(1);
          }}
        />
      </div>

      {/* 🧾 Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="border px-3 py-2 text-left">ID</th>
              <th className="border px-3 py-2 text-left">Tipo Documento</th>
              <th className="border px-3 py-2 text-left">Número Documento</th>
              <th className="border px-3 py-2 text-left">Nombre</th>
              <th className="border px-3 py-2 text-left">Teléfono</th>
              <th className="border px-3 py-2 text-left">Correo</th>
              <th className="border px-3 py-2 text-left">Rol</th>
              {usuarioLogueado?.rol === "ADMIN" && (
                <th className="border px-3 py-2 text-center">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {usuariosPagina.map((u) => (
              <tr key={u.id_usuario} className="hover:bg-blue-50">
                <td className="border px-3 py-2">{u.id_usuario}</td>
                <td className="border px-3 py-2">{u.tipoDocumento}</td>
                <td className="border px-3 py-2">{u.numeroDocumento}</td>
                <td className="border px-3 py-2">{u.nombre}</td>
                <td className="border px-3 py-2">{u.telefono}</td>
                <td className="border px-3 py-2">{u.correo}</td>
                <td className="border px-3 py-2">{u.rol}</td>
                {usuarioLogueado?.rol === "ADMIN" && (
                  <td className="border px-3 py-2 text-center">
                    <select
                      className="border px-2 py-1 rounded text-sm"
                      value={u.rol}
                      onChange={(e) =>
                        handleCambiarRol(u.id_usuario, e.target.value)
                      }
                    >
                      <option value="CIUDADANO">CIUDADANO</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="GESTOR">GESTOR</option>
                      <option value="SUPERVISOR">SUPERVISOR</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Paginación e info */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-gray-500 text-sm">
          Mostrando {usuariosPagina.length} de {usuariosFiltrados.length}
        </span>

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

        <div className="flex items-center space-x-2">
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            ◀
          </button>
          <span className="text-gray-700 text-sm">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
