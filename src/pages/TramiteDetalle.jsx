import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, UserCog } from "lucide-react";
import EdicionEstadoCard from "./EdicionEstadoCard";
import TrazabilidadCard from "./TrazabilidadCard";
import DocumentosCard from "./DocumentosCard";
import { useAuth } from "../context/AuthContext";
import {
  getTramiteById,
  actualizarInmuebleTramite,
} from "../services/tramitesService";

import InmuebleFormEdit from "../components/TramiteForm/InmuebleFormEdit";
import TitularForm from "../components/TramiteForm/TitularForm";
import LoadingOverlay from "../components/LoadingOverlay";

export default function TramiteDetalle({ tramite, onClose, onActualizar }) {
  const [tramiteLocal, setTramiteLocal] = useState(tramite);
  const { usuario } = useAuth();
  const [verTrazabilidad, setVerTrazabilidad] = useState(false);
  const [verEdicion, setVerEdicion] = useState(false);
  const [verDocunentos, SetVerDocumentos] = useState(false);

  const [editarInmueble, setEditarInmueble] = useState(false);
  const [editarTitulares, setEditarTitulares] = useState(false);
  const [nuevoInmueble, setNuevoInmueble] = useState([]);
  const [nuevosTitulares, setNuevosTitulares] = useState(
    tramiteLocal.titulares || []
  );
  const [cargando, setCargando] = useState(false);
  const [msg, setMsg] = useState(null);

  /*  useEffect(() => {
  console.log("🧩 nuevoInmueble actualizado:", nuevoInmueble);
}, [nuevoInmueble]); */



useEffect(() => {
  if (msg) {
    const timer = setTimeout(() => setMsg(null), 3000);
    return () => clearTimeout(timer);
  }
}, [msg]);


  //console.log (tramiteLocal)
  if (!tramiteLocal) return null;

  const refrescarTramite = async () => {
    try {
      const res = await getTramiteById(tramiteLocal.id);
      setTramiteLocal(res.data);
    } catch (err) {
      console.error("❌ Error al refrescar el trámite:", err);
    }
    onActualizar();
  };

  const puedeEditar =
    usuario?.rol !== "CIUDADANO" ||
    (usuario?.rol === "CIUDADANO" && tramiteLocal.estado === "RECHAZADO");

  const actualizarDatosInmueble = async () => {
    setCargando(true);
    const inmuebleId = tramiteLocal.inmuebles?.[0]?.id;

    if (!inmuebleId) {
      console.error("❌ No se encontró el ID del inmueble.");
      return;
    }

    if (!nuevoInmueble) {
      console.error("❌ No hay datos nuevos del inmueble.");
      return;
    }

    // Payload dinámico (devuelto desde InmuebleFormEdit)
    const payload = {
      tipo: nuevoInmueble?.[0]?.tipo || null,
      municipio_id: nuevoInmueble?.[0]?.municipio_id || null,
      ficha: nuevoInmueble?.[0]?.ficha || null,
      matricula: nuevoInmueble?.[0]?.matricula || null,
    };

    //console.log("✅ Enviando actualización de inmueble...");
    //console.log("🆔 ID del inmueble:", inmuebleId);
   // console.log("📦 Payload:", payload);

    try {
      const res = await actualizarInmuebleTramite(inmuebleId, payload);
      //console.log (res)
      if (res.success) {
        setCargando(false);
        setMsg(res.message);
      } else {
        setMsg(`⚠️ ${res.message || "No se pudo actualizar el municipio"}`);
      }
    } catch (err) {
      console.error("❌ Error al acltualizar el inmueble", err);
    }

    setEditarInmueble(false);
    refrescarTramite();
  };

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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 overflow-y-auto max-h-[90vh]"
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

          {cargando && (
            <LoadingOverlay text="Actualizand Inmueble , por favor espere..." />
          )}

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
              <strong>Tipo Solicitante:</strong>{" "}
              {tramiteLocal.solicitanteTipo?.nombre || "-"}
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
              {new Date(tramiteLocal.fechaActualizacion).toLocaleString(
                "es-CO"
              )}
            </p>
          </div>

          {/* Observación */}
          {tramiteLocal.razones && (
            <div className="mt-4">
              <strong>Razón solicitud:</strong>
              <p className="bg-gray-50 border p-3 rounded-lg mt-1 text-gray-700">
                {tramiteLocal.razones}
              </p>
            </div>
          )}

          <div className="mt-6">
            {/* Línea 1: título + botón editar */}
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-800">
                Datos del Inmueble
              </h4>

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

              {["ADMIN", "GESTOR", "ATENCION_AL_USUARIO"].includes(
                usuario?.rol
              ) && (
                <button
                  onClick={() => setEditarInmueble(true)}
                  className="text-green-600 hover:text-green-800 flex items-center gap-1"
                  title="Editar datos del inmueble"
                >
                  <Edit3 size={18} />
                  Editar
                </button>
              )}
            </div>

            {/* Línea 2: datos del inmueble */}
            <div className="flex justify-between text-sm text-gray-700 mt-2">
              <p className="flex-1">
                <strong>Municipio:</strong>{" "}
                {tramiteLocal.inmuebles?.[0]?.municipio?.nombre || "-"}
              </p>
              <p className="flex-1">
                <strong>Tipo suelo:</strong>{" "}
                {tramiteLocal.inmuebles?.[0]?.tipo || "-"}
              </p>
              <p className="flex-1">
                <strong>Ficha Catastral:</strong>{" "}
                {tramiteLocal.inmuebles?.[0]?.ficha || "Sin asignar"}
              </p>
              <p className="flex-1">
                <strong>Matrícula inmobiliaria:</strong>{" "}
                {tramiteLocal.inmuebles?.[0]?.matricula || "-"}
              </p>
            </div>
          </div>

          {/* 🔹 Titulares */}
          {tramiteLocal.titulares && tramiteLocal.titulares.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-gray-800">
                  Titulares del Trámite
                </h4>
                {/*   {["ADMIN", "GESTOR", "ATENCION_AL_USUARIO"].includes(usuario?.rol) && (
    <button
      onClick={() => setEditarTitulares(true)}
      className="text-green-600 hover:text-green-800 flex items-center gap-1"
      title="Editar titulares"
    >
      <UserCog size={18} />
      Editar
    </button>
  )} */}
              </div>

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

          {/* Botones */}
          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={() => SetVerDocumentos(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              📄 Ver Documentos
            </button>

            <button
              onClick={() => setVerTrazabilidad(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              📊 Ver Trazabilidad
            </button>

            {puedeEditar && (
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

      {/* Modales */}
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
        {verDocunentos && (
          <DocumentosCard
            cod={tramiteLocal.codigoAso}
            docs={tramiteLocal.documentos}
            onClose={() => SetVerDocumentos(false)}
          />
        )}

        {editarInmueble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          >
            <div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-2xl">
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h4 className="text-xl font-semibold text-gray-800">
                  Editar Datos del Inmueble
                </h4>
                <button
                  onClick={() => setEditarInmueble(false)}
                  className="text-red-600 hover:text-red-800 text-lg font-semibold"
                >
                  ✖
                </button>
              </div>

              <InmuebleFormEdit
                inmueble={tramiteLocal.inmuebles?.[0]}
                setInmueble={setNuevoInmueble}
              />

              <div className="flex justify-end mt-4 gap-3">
                <button
                  onClick={() => setEditarInmueble(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={actualizarDatosInmueble}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {editarTitulares && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          >
            <div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-2xl">
              <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h4 className="text-xl font-semibold text-gray-800">
                  Editar Titulares del Trámite
                </h4>
                <button
                  onClick={() => setEditarTitulares(false)}
                  className="text-red-600 hover:text-red-800 text-lg font-semibold"
                >
                  ✖
                </button>
              </div>

              <TitularForm
                titulares={nuevosTitulares}
                setTitulares={setNuevosTitulares}
              />

              <div className="flex justify-end mt-4 gap-3">
                <button
                  onClick={() => setEditarTitulares(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Aquí llamas a tu endpoint para actualizar los titulares
                    console.log("Nuevos titulares:", nuevosTitulares);
                    setEditarTitulares(false);
                    refrescarTramite();
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
