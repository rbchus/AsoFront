import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getTrazabilidadByTramite } from "../services/tramitesTrazabilidadService";
import { useAuth } from "../context/AuthContext";

export default function TrazabilidadCard({ tramiteId, onClose }) {
  const { usuario } = useAuth();
  const [trazabilidad, setTrazabilidad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 4; // 🔹 Mostrar 4 registros por página

  useEffect(() => {
    const fetchTrazabilidad = async () => {
      try {
        const res = await getTrazabilidadByTramite(tramiteId);
        setTrazabilidad(res.data);
      } catch (error) {
        console.error("Error obteniendo trazabilidad:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrazabilidad();
  }, [tramiteId]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      >
        <p className="text-gray-100 text-lg font-medium">Cargando historial...</p>
      </motion.div>
    );
  }

  const historial = trazabilidad?.historial || [];
  const totalPaginas = Math.ceil(historial.length / porPagina);

  // Calcular índices de la página actual
  const inicio = (paginaActual - 1) * porPagina;
  const fin = inicio + porPagina;
  const registrosActuales = historial.slice(inicio, fin);

  const handleSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const handleAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 overflow-y-auto max-h-[80vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-xl font-semibold text-gray-800">
            🕓 Historial de Trazabilidad
          </h3>
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800 font-semibold text-lg"
          >
            ✖
          </button>
        </div>

        {historial.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No hay registros disponibles
          </p>
        ) : (
          <>
            {/* 🔹 Listado de trazabilidades */}
            <div className="space-y-4">
              {registrosActuales.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-blue-700">
                      Estado: {item.estado}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.fecha).toLocaleString("es-CO")}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    {item.observacion}
                  </p>

                  {usuario?.rol !== "CIUDADANO" && (
                  <div className="text-xs text-gray-600">
                    <p>
                      <strong>Quien Asigna:</strong> {item.usuario?.nombre} 
                    </p>
                    <p>
                      <strong>Asignado A:</strong> {item.gestor?.nombre} 
                    </p>
                  </div>
                  )}

                </motion.div>
              ))}
            </div>

            {/* 🔹 Paginación */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={handleAnterior}
                disabled={paginaActual === 1}
                className={`px-4 py-2 rounded-lg border ${
                  paginaActual === 1
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-blue-600 border-blue-400 hover:bg-blue-50"
                }`}
              >
                ◀ Anterior
              </button>

              <span className="text-gray-700 text-sm font-medium">
                Página {paginaActual} de {totalPaginas}
              </span>

              <button
                onClick={handleSiguiente}
                disabled={paginaActual === totalPaginas}
                className={`px-4 py-2 rounded-lg border ${
                  paginaActual === totalPaginas
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-blue-600 border-blue-400 hover:bg-blue-50"
                }`}
              >
                Siguiente ▶
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
