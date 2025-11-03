import { useEffect, useState, useMemo } from "react";
import { getTramites } from "../services/tramitesService";
import { AnimatePresence } from "framer-motion";
import TramiteDetalle from "./TramiteDetalle";
import TramitesEstadisticas from "./TramitesEstadisticas";
import { Eye, BarChart3 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LoadingOverlay from "../components/LoadingOverlay";

export default function TramiteLista() {
  const { usuario } = useAuth();
  const [tramites, setTramites] = useState([]);

  // 🔹 Filtros
  const [filtroId, setFiltroId] = useState("");
  const [filtroSolicitante, setFiltroSolicitante] = useState("");
  const [filtroMunicipio, setFiltroMunicipio] = useState("Todos");
  const [filtroGestor, setFiltroGestor] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);
  const [porPagina] = useState(5);
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState(null);
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);
   const [cargando, setCargando] = useState(true);

  // 🔹 Cargar datos
  const fetchData = async () => {
    const res = await getTramites();
    setTramites(res.data || []);
    setCargando(false)
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Helpers
  const obtenerMunicipio = (t) =>
    t.inmuebles?.[0]?.municipio?.nombre || "Sin municipio";

  const municipios = useMemo(
    () => ["Todos", ...new Set(tramites.map((t) => obtenerMunicipio(t)))],
    [tramites]
  );

  const gestores = useMemo(
    () => [
      "Todos",
      ...new Set(
        tramites.map((t) => t.gestorAsignado?.nombre || "Sin asignar")
      ),
    ],
    [tramites]
  );

  const estados = useMemo(
    () => ["Todos", ...new Set(tramites.map((t) => t.estado || "-"))],
    [tramites]
  );

  // 🔹 Filtrado principal
  const tramitesFiltrados = useMemo(() => {
    return tramites.filter((t) => {
      const fecha = new Date(t.fechaCreacion);
      if (fechaInicio && fecha < new Date(fechaInicio)) return false;
      if (fechaFin && fecha > new Date(fechaFin)) return false;
      if (filtroId && !t.id.toString().includes(filtroId)) return false;
      if (filtroSolicitante) {
        const texto = filtroSolicitante.toLowerCase();
        const nombre = t.solicitante?.nombre?.toLowerCase() || "";
        const documento = t.solicitante?.numeroDocumento?.toLowerCase() || "";
        if (!nombre.includes(texto) && !documento.includes(texto)) return false;
      }
      if (
        filtroMunicipio !== "Todos" &&
        obtenerMunicipio(t) !== filtroMunicipio
      )
        return false;
      if (
        filtroGestor !== "Todos" &&
        (t.gestorAsignado?.nombre || "Sin asignar") !== filtroGestor
      )
        return false;
      if (filtroEstado !== "Todos" && (t.estado || "-") !== filtroEstado)
        return false;
      return true;
    });
  }, [
    tramites,
    filtroId,
    filtroSolicitante,
    filtroMunicipio,
    filtroGestor,
    filtroEstado,
    fechaInicio,
    fechaFin,
  ]);

  // 🔹 Paginación
  const indiceInicial = (paginaActual - 1) * porPagina;
  const tramitesPagina = tramitesFiltrados.slice(
    indiceInicial,
    indiceInicial + porPagina
  );
  const totalPaginas = Math.ceil(tramitesFiltrados.length / porPagina);
  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas)
      setPaginaActual(nuevaPagina);
  };

  const actualizarTramite = () => fetchData();

  return (
    <div className="p-6 w-full max-w-7xl mx-auto bg-white mt-10 rounded-2xl shadow-md relative">
    {cargando && <LoadingOverlay text="Cargando Trámites, por favor espere..." />}
      {/* 🔹 Filtros */}
      <div className="flex flex-col">
        {/* ID del Trámite */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4 text-sm w-full">
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 text-xs">ID del Trámite</label>
            <input
              type="text"
              placeholder="ID"
              className="border px-2 py-1 rounded-lg text-xs"
              value={filtroId}
              onChange={(e) => {
                setFiltroId(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>

          {/* Solicitante */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 text-xs">Solicitante</label>
            <input
              type="text"
              placeholder="Nombre o Documento"
              className="border px-2 py-1 rounded-lg text-xs"
              value={filtroSolicitante}
              onChange={(e) => {
                setFiltroSolicitante(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>

          {/* Municipio */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 text-xs">Municipio</label>
            <select
              className="border px-2 py-1 rounded-lg text-xs"
              value={filtroMunicipio}
              onChange={(e) => {
                setFiltroMunicipio(e.target.value);
                setPaginaActual(1);
              }}
            >
              {municipios.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Gestor */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 text-xs">Gestor</label>
            <select
              className="border px-2 py-1 rounded-lg text-xs"
              value={filtroGestor}
              onChange={(e) => {
                setFiltroGestor(e.target.value);
                setPaginaActual(1);
              }}
            >
              {gestores.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 text-xs">Estado</label>
            <select
              className="border px-2 py-1 rounded-lg text-xs"
              value={filtroEstado}
              onChange={(e) => {
                setFiltroEstado(e.target.value);
                setPaginaActual(1);
              }}
            >
              {estados.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Fechas */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 text-xs">Fecha Inicio</label>
            <input
              type="date"
              className="border px-2 py-1 rounded-lg text-xs mb-1"
              value={fechaInicio}
              onChange={(e) => {
                setFechaInicio(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-6 gap-3 mb-4 text-sm w-full">
          {/* Cabecera: ocupa 5 columnas */}
          <div className="col-span-5 flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
            {/* Botón estadísticas a la izquierda */}
            {usuario?.rol !== "CIUDADANO" && (
              <div className="col-span-1 flex flex-col">
                <button
                  onClick={() => setMostrarEstadisticas(true)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                >
                  <BarChart3 className="w-5 h-5" />
                  Ver estadísticas
                </button>
              </div>
            )}

            {/* Título centrado */}
            <h2 className="text-2xl font-bold text-gray-800 flex-1 text-center">
              Listado de Trámites
            </h2>
          </div>

          {/* Fecha fin: ocupa 1 columna */}
          <div className="col-span-1 flex flex-col">
            <label className="text-gray-600 mb-1 text-xs">Fecha Fin</label>
            <input
              type="date"
              className="border px-2 py-1 rounded-lg text-xs"
              value={fechaFin}
              onChange={(e) => {
                setFechaFin(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* 🧾 Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="border px-3 py-2 text-left">ID</th>
              <th className="border px-3 py-2 text-left">Tipo Trámite</th>
              <th className="border px-3 py-2 text-left">Tipo Solicitud</th>
              <th className="border px-3 py-2 text-left">Solicitante</th>
              <th className="border px-3 py-2 text-left">Gestor</th>
              <th className="border px-3 py-2 text-left">Estado</th>
              <th className="border px-3 py-2 text-left">Municipio</th>
              <th className="border px-3 py-2 text-left">Fecha</th>
              <th className="border px-3 py-2 text-center">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {tramitesPagina.map((t) => (
              <tr
                key={t.id}
                className={`hover:bg-blue-50 ${
                  tramiteSeleccionado?.id === t.id ? "bg-blue-50" : ""
                }`}
              >
                <td className="border px-3 py-2">{t.id}</td>
                <td className="border px-3 py-2">
                  {t.tramiteRelacion?.tramiteTipo?.nombre || "-"}
                </td>
                <td className="border px-3 py-2">
                  {t.tramiteRelacion?.solicitudTipo?.nombre || "-"}
                </td>
                <td className="border px-3 py-2">{t.solicitante?.nombre}</td>
                <td className="border px-3 py-2">
                  {t.gestorAsignado?.nombre || "Sin asignar"}
                </td>
                <td className="border px-3 py-2">{t.estado}</td>
                <td className="border px-3 py-2">{obtenerMunicipio(t)}</td>
                <td className="border px-3 py-2">
                  {new Date(t.fechaActualizacion).toLocaleDateString("es-CO")}
                </td>
                <td className="border px-3 py-2 text-center">
                  <button
                    onClick={() => setTramiteSeleccionado(t)}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 flex items-center justify-center"
                    title="Ver detalle"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Paginación e info */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-gray-500 text-sm">
          Mostrando {tramitesPagina.length} de {tramitesFiltrados.length}
        </span>
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

      {/* 🔹 Panel lateral animado */}
      <AnimatePresence>
        {tramiteSeleccionado && (
          <TramiteDetalle
            tramite={tramiteSeleccionado}
            onClose={() => setTramiteSeleccionado(null)}
            onActualizar={actualizarTramite}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mostrarEstadisticas && (
          <TramitesEstadisticas
            tramites={tramites}
            onCloseEstadistica={() => setMostrarEstadisticas(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
