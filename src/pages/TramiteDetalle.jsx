import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { Edit3 } from "lucide-react"; // 📘 Ícono de edición
import EdicionEstadoCard from "./EdicionEstadoCard"; // Importa el nuevo modal
import TrazabilidadCard from "./TrazabilidadCard";
import { useAuth } from "../context/AuthContext";
import { getTramiteById } from "../services/tramitesService";


export default function TramiteDetalle({
  tramite,
  onClose,
  onActualizar,
}) {
  const [tramiteLocal, setTramiteLocal] = useState(tramite);
  const { usuario } = useAuth();
  const [verTrazabilidad, setVerTrazabilidad] = useState(false);
  const [verEdicion, setVerEdicion] = useState(false);

  if (!tramiteLocal) return null;

  console.log('...Detalle Tramite' , tramite);

  const refrescarTramite = async () => {
  try {
    const res = await getTramiteById(tramiteLocal.id);
    console.log('refrecar tramite' , res.data);
    setTramiteLocal(res.data);
  } catch (err) {
    console.error("❌ Error al refrescar el trámite:", err);
  }
  onActualizar()
};


  //console.log(tramite);

  return (
    <>
      <motion.div
        key={tramiteLocal.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      >
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 overflow-y-auto max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="text-2xl font-semibold text-gray-800">
              Detalle del Trámite #{tramiteLocal.codigoAso}
            </h3>
            <button
              onClick={onClose}
              className="text-red-600 hover:text-red-800 font-semibold text-lg"
            >
              ✖
            </button>
          </div>

          {/* Información */}
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
            <p>
              <strong>Tipo Trámite:</strong>{" "}
              {tramiteLocal.tramiteRelacion?.tramiteTipo?.nombre || "-"}
            </p>
            <p>
              <strong>Tipo Solicitud:</strong>{" "}
              {tramiteLocal.tramiteRelacion?.solicitudTipo?.nombre || "-"}
            </p>
            <p>
              <strong>Solicitante:</strong> {tramiteLocal.solicitante?.nombre}
            </p>
            <p>
              <strong>Municipio:</strong>{" "}
              {tramiteLocal.inmuebles?.[0]?.municipio?.nombre || "-"}
            </p>
            <p>
              <strong>Gestor Asignado:</strong>{" "}
              {tramiteLocal.gestorAsignado?.nombre || "Sin asignar"}
            </p>
            <p>
              <strong>Estado Actual:</strong> {tramiteLocal.estado}
            </p>
            <p>
              <strong>Fecha creación:</strong>{" "}
              {new Date(tramiteLocal.fechaCreacion).toLocaleString("es-CO")}
            </p>
            <p>
              <strong>Última actualización:</strong>{" "}
              {new Date(tramiteLocal.fechaActualizacion).toLocaleString("es-CO")}
            </p>
          </div>

          {/* Observación */}
          {tramiteLocal.razones && (
            <div className="mt-4">
              <strong>Razon solicitud:</strong>
              <p className="bg-gray-50 border p-3 rounded-lg mt-1 text-gray-700">
                {tramiteLocal.razones}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-700 mt-4">
            <p>
              <strong>Tipo suelo:</strong> {tramiteLocal.inmuebles?.[0]?.tipo || "-"}
            </p>
            <p>
              <strong>Ficha Catrastal:</strong>{" "}
              {tramiteLocal.inmuebles?.[0]?.ficha || "Sin asignar"}
            </p>
            <p>
              <strong>Matricula inmobiliaria:</strong>{" "}
              {tramiteLocal.inmuebles?.[0]?.matricula}
            </p>
          </div>

          {/* 🔹 Tabla de Titulares */}
          {tramiteLocal.titulares && tramiteLocal.titulares.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Titulares del Trámite
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                    <tr>
                      <th className="px-4 py-2 border">Nombre</th>
                      <th className="px-4 py-2 border">Apellido</th>
                      <th className="px-4 py-2 border">TD</th>
                      <th className="px-4 py-2 border">Número</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-800">
                    {tramiteLocal.titulares.map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{t.nombre}</td>
                        <td className="px-4 py-2 border">{t.apellido}</td>
                        <td className="px-4 py-2 border text-center">
                          {t.tipoDocumento}
                        </td>
                        <td className="px-4 py-2 border text-center">
                          {t.numeroDocumento}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Formulario */}
       <div className="flex justify-center gap-6 mt-6">
  <button
    onClick={() => setVerTrazabilidad(true)}
    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
  >
    📄 Ver trazabilidad
  </button>

  {usuario?.rol !== "CIUDADANO" && (
    <button
      onClick={() => setVerEdicion(true)}
      className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
      title="Editar estado y gestor"
    >
      <Edit3 size={20} />
      Editar
    </button>
  )}
</div>

        </motion.div>
      </motion.div>
      {/* 🧾 Modal trazabilidad */}

      {/* 🧾 Modal trazabilidad */}
      <AnimatePresence>
        {verTrazabilidad && (
          <TrazabilidadCard
            tramiteId={tramiteLocal.id}
            onClose={() => setVerTrazabilidad(false)}
          />
        )}
        {verEdicion && (
          <EdicionEstadoCard
            tramite={tramiteLocal}
            onClose={() => setVerEdicion(false)}
            onUpdated={refrescarTramite}
          />
        )}
      </AnimatePresence>
    </>
  );
}
