import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getGestores } from "../services/tramitesService";
import { actualizarEstadoTramite } from "../services/tramitesService";

export default function EdicionEstadoCard({ tramite, onClose, onUpdated }) {
  const { usuario } = useAuth();
  const [gestores, setGestores] = useState([]);
  const [nuevoEstado, setNuevoEstado] = useState(tramite.estado || "");
  const [nuevoGestor, setNuevoGestor] = useState(
    tramite.gestorAsignado?.id_usuario || ""
  );
  const [observacion, setObservacion] = useState("");
  const [archivos, setArchivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const estados = [
    "ASIGNADO",
    "EN EJECUCION",
    "FINALIZADO",
    "GENERADO",
    "RADICADO",
    "SI RECHAZO",
  ];

  useEffect(() => {
    const fetchGestores = async () => {
      try {
        const res = await getGestores();
        setGestores(res.data || []);
      } catch (err) {
        console.error("❌ Error al cargar gestores:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGestores();
  }, []);

  const handleFileChange = (e) => {
    setArchivos(Array.from(e.target.files));
  };

  const handleActualizar = async () => {
    try {
      setSaving(true);

      const payload = {
        estado: nuevoEstado,
        gestorAsignadoId: parseInt(nuevoGestor),
        observacion,
        usuarioLogueado: {
          id: usuario?.id,
          nombre: usuario?.nombre,
          correo: usuario?.correo,
          rol: usuario?.rol,
        },
      };

      console.log("✅ Actualización:", tramite.id, payload);
      const res = await actualizarEstadoTramite(tramite.id, payload);
      console.log("✅ Actualización:", res.data);

      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      console.error("❌ Error actualizando trámite:", err);
    } finally {
      setSaving(false);
    }
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
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-xl font-semibold text-gray-800">
            ✏️ Editar Estado del Trámite #{tramite.id}
          </h3>
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800 font-semibold text-lg"
          >
            ✖
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-10">
            Cargando gestores...
          </p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Estado del Trámite
              </label>
              <select
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                {estados.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Gestor Asignado
              </label>
              <select
                value={nuevoGestor}
                onChange={(e) => setNuevoGestor(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Seleccionar Gestor</option>
                {gestores.map((g) => (
                  <option key={g.id_usuario} value={g.id_usuario}>
                    {g.nombre} ({g.correo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Observación (máx. 250 caracteres)
              </label>
              <textarea
                value={observacion}
                onChange={(e) =>
                  e.target.value.length <= 250 && setObservacion(e.target.value)
                }
                className="w-full border rounded-lg p-2 h-24"
                placeholder="Escribe una observación sobre el cambio..."
              />
              <p className="text-xs text-gray-500 text-right">
                {observacion.length}/250
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Adjuntar archivos
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf,image/*"
                className="w-full border rounded-lg p-2"
              />
              {archivos.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {archivos.length} archivo(s) seleccionado(s)
                </p>
              )}
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleActualizar}
                disabled={saving}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
