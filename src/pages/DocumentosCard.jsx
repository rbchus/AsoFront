import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  FileText,
  Image,
  FileArchive,
  File,
  FileType,
  X,
  Download,
} from "lucide-react";

import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useState, useMemo } from "react";

export default function DocumentosCard({ cod, docs = [], onClose }) {
  const basePHAT = import.meta.env.VITE_BASE_URL;
  const { usuario } = useAuth();

  // 🔹 Filtrar documentos según rol
  const documentosFiltrados =
    usuario?.rol === "CIUDADANO"
      ? docs.filter((doc) =>
          ["CIUDADANO_", "ATENCION_AL_USUARIO_", "ADMIN_"].some((prefijo) =>
            doc.nombre_archivo.startsWith(prefijo)
          )
        )
      : docs;

  // 🔹 Estado para la paginación
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;
  const totalPaginas = Math.ceil(documentosFiltrados.length / porPagina);

  const documentosPaginados = useMemo(() => {
    const inicio = (pagina - 1) * porPagina;
    return documentosFiltrados.slice(inicio, inicio + porPagina);
  }, [documentosFiltrados, pagina]);

  // 🔹 Formatear la fecha
  const formatearFecha = (fecha) => {
    const f = new Date(fecha);
    return f.toLocaleString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // 🔹 Determinar ícono por tipo de archivo
  const getIcono = (tipo) => {
    switch (tipo?.toUpperCase()) {
      case "PDF":
        return <FileText className="text-red-500 w-5 h-5" />;
      case "DOC":
      case "DOCX":
        return <FileType className="text-blue-600 w-5 h-5" />;
      case "IMG":
      case "PNG":
      case "JPG":
      case "JPEG":
        return <Image className="text-green-600 w-5 h-5" />;
      case "ZIP":
      case "RAR":
        return <FileArchive className="text-yellow-500 w-5 h-5" />;
      default:
        return <File className="text-gray-500 w-5 h-5" />;
    }
  };

  // 🔹 Función para forzar descarga individual
  const handleDownload = async (nombre) => {
    try {
      const url = `${basePHAT}/dataset/${cod}/${nombre}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const blob = await res.blob();
      saveAs(blob, nombre);
    } catch (err) {
      console.error("Error descargando archivo:", nombre, err);
      alert(
        `No se pudo descargar "${nombre}". Puede que el archivo no exista o hubo un error en el servidor.`
      );
    }
  };

  // 🔹 Descargar todos los documentos en un ZIP
  const descargarZip = async () => {
    const zip = new JSZip();
    const failed = [];

    for (const doc of documentosFiltrados) {
      try {
        const url = `${basePHAT}/dataset/${cod}/${doc.nombre_archivo}`;
        const res = await fetch(url);

        if (!res.ok) {
          failed.push(doc.nombre_archivo);
          console.error("HTTP error", res.status, "->", doc.nombre_archivo);
          continue;
        }

        const blob = await res.blob();
        zip.file(doc.nombre_archivo, blob);
      } catch (error) {
        console.error("Error descargando archivo:", doc.nombre_archivo, error);
        failed.push(doc.nombre_archivo);
      }
    }

    if (Object.keys(zip.files).length === 0) {
      alert("No se pudieron descargar los archivos.");
      return;
    }

    const contenido = await zip.generateAsync({ type: "blob" });
    saveAs(contenido, `documentos_${cod}.zip`);

    if (failed.length) {
      alert(
        `No se pudieron descargar los siguientes archivos: ${failed.join(", ")}`
      );
    }
  };

  // 🔹 Cambiar página
  const cambiarPagina = (nueva) => {
    if (nueva >= 1 && nueva <= totalPaginas) setPagina(nueva);
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
        {/* 🔹 Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          {documentosFiltrados.length > 1 && (
            <button
              onClick={descargarZip}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Descargar todos en ZIP
            </button>
          )}
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            📂 Documentos del Trámite
          </h3>
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800 font-semibold text-lg"
          >
            <X />
          </button>
        </div>

        {/* 🔹 Lista de documentos */}
        {documentosFiltrados.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No hay documentos disponibles
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {documentosPaginados.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-center border border-gray-200 rounded-xl p-3 bg-gray-50 shadow-sm hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    {getIcono(doc.tipo)}
                    <span
                      className="text-gray-800 text-sm font-medium truncate max-w-[180px] block"
                      title={doc.nombre_archivo}
                    >
                      {doc.nombre_archivo}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {formatearFecha(doc.fecha_subida)}
                    </span>
                    <button
                      onClick={() => handleDownload(doc.nombre_archivo)}
                      className="text-gray-600 hover:text-blue-600 transition"
                      title="Descargar archivo"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 🔹 Paginación */}
            {totalPaginas > 1 && (
              <div className="flex justify-center items-center mt-4 gap-2">
                <button
                  disabled={pagina === 1}
                  onClick={() => cambiarPagina(pagina - 1)}
                  className={`px-3 py-1 rounded ${
                    pagina === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  ⬅️
                </button>
                <span className="text-sm text-gray-600">
                  Página {pagina} de {totalPaginas}
                </span>
                <button
                  disabled={pagina === totalPaginas}
                  onClick={() => cambiarPagina(pagina + 1)}
                  className={`px-3 py-1 rounded ${
                    pagina === totalPaginas
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  ➡️
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
