import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Componente Tabs básico
const Tabs = ({ defaultValue, children }) => {
  const [active, setActive] = useState(defaultValue || children[0].props.value);
  return (
    <div>
      <div className="flex gap-2 mb-4">
        {children.map((tab) => (
          <button
            key={tab.props.value}
            onClick={() => setActive(tab.props.value)}
            className={`px-4 py-2 rounded-lg ${
              active === tab.props.value ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {tab.props.value}
          </button>
        ))}
      </div>
      {children.map((tab) => tab.props.value === active && tab)}
    </div>
  );
};

const TabsContent = ({ value, children }) => <div>{children}</div>;

export default function TramitesEstadisticas({ tramites = [], onCloseEstadistica }) {
  const [filtroGestor, setFiltroGestor] = useState("Todos");
  const [filtroMunicipio, setFiltroMunicipio] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroZona, setFiltroZona] = useState("Todos");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const obtenerGestor = (t) =>
    t.gestorAsignado?.nombre ||
    t.gestorAsignado?.name ||
    t.gestorAsignado?.nombre_usuario ||
    t.gestorAsignado?.usuario?.nombre ||
    "Sin asignar";

  const obtenerMunicipio = (t) =>
    t.inmuebles?.[0]?.municipio?.nombre || t.solicitante?.municipio?.nombre || "Sin municipio";

  const obtenerEstado = (t) => t.estado || "Desconocido";
  const obtenerZona = (t) => t.inmuebles?.[0]?.tipo || "Sin zona";

  const gestores = useMemo(() => ["Todos", ...new Set(tramites.map((t) => obtenerGestor(t)))], [tramites]);
  const municipios = useMemo(() => ["Todos", ...new Set(tramites.map((t) => obtenerMunicipio(t)))], [tramites]);
  const estados = useMemo(() => ["Todos", ...new Set(tramites.map((t) => obtenerEstado(t)))], [tramites]);
  const zonas = useMemo(() => ["Todos", ...new Set(tramites.map((t) => obtenerZona(t)))], [tramites]);

  const tramitesFiltrados = useMemo(
    () =>
      tramites.filter((t) => {
        const fecha = new Date(t.fechaCreacion);
        return (
          (filtroGestor === "Todos" || obtenerGestor(t) === filtroGestor) &&
          (filtroMunicipio === "Todos" || obtenerMunicipio(t) === filtroMunicipio) &&
          (filtroEstado === "Todos" || obtenerEstado(t) === filtroEstado) &&
          (filtroZona === "Todos" || obtenerZona(t) === filtroZona) &&
          (!fechaInicio || fecha >= new Date(fechaInicio)) &&
          (!fechaFin || fecha <= new Date(fechaFin))
        );
      }),
    [tramites, filtroGestor, filtroMunicipio, filtroEstado, filtroZona, fechaInicio, fechaFin]
  );

  const agrupar = (array, fn) => {
    const mapa = {};
    array.forEach((t) => {
      const key = fn(t);
      if (!mapa[key]) mapa[key] = { name: key, cantidad: 0 };
      mapa[key].cantidad++;
    });
    return Object.values(mapa);
  };

  const dataMunicipio = useMemo(() => agrupar(tramitesFiltrados, obtenerMunicipio), [tramitesFiltrados]);
  const dataGestor = useMemo(() => agrupar(tramitesFiltrados, obtenerGestor), [tramitesFiltrados]);
  const dataEstado = useMemo(() => agrupar(tramitesFiltrados, obtenerEstado), [tramitesFiltrados]);
  const dataZona = useMemo(() => agrupar(tramitesFiltrados, obtenerZona), [tramitesFiltrados]);
  const dataPorMes = useMemo(() => {
    const mapa = {};
    tramitesFiltrados.forEach((t) => {
      const fecha = new Date(t.fechaCreacion);
      const mes = fecha.toLocaleString("es-CO", { month: "short", year: "numeric" });
      if (!mapa[mes]) mapa[mes] = { mes, cantidad: 0 };
      mapa[mes].cantidad++;
    });
    return Object.values(mapa);
  }, [tramitesFiltrados]);

  const exportarExcel = () => {
    const libro = XLSX.utils.book_new();
    const agregarHoja = (nombre, datos) => {
      const hoja = XLSX.utils.json_to_sheet(datos);
      XLSX.utils.book_append_sheet(libro, hoja, nombre);
    };
    agregarHoja("Por Municipio", dataMunicipio);
    agregarHoja("Por Gestor", dataGestor);
    agregarHoja("Por Estado", dataEstado);
    agregarHoja("Por Zona", dataZona);
    agregarHoja("Por Mes", dataPorMes);
    XLSX.writeFile(libro, "estadisticas_tramites.xlsx");
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("📊 Reporte Estadístico de Trámites", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generado el ${new Date().toLocaleString("es-CO")}`, 14, 22);

    const agregarTabla = (titulo, data, startY) => {
      doc.setFontSize(12);
      doc.text(titulo, 14, startY);
      autoTable(doc, {
        startY: startY + 5,
        head: [["Nombre", "Cantidad"]],
        body: data.map((d) => [d.name, d.cantidad]),
        styles: { fontSize: 9 },
        theme: "striped",
      });
      return doc.lastAutoTable.finalY + 10;
    };

    let y = 30;
    y = agregarTabla("Por Municipio", dataMunicipio, y);
    y = agregarTabla("Por Gestor", dataGestor, y);
    y = agregarTabla("Por Estado", dataEstado, y);
    y = agregarTabla("Por Zona", dataZona, y);
    agregarTabla("Por Mes", dataPorMes, y);

    doc.save("estadisticas_tramites.pdf");
  };

  return (
    <motion.div
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl p-8 overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-2xl font-semibold text-gray-800">📊 Estadísticas de Trámites</h3>
          <button
            onClick={onCloseEstadistica}
            className="text-red-600 hover:text-red-800 font-semibold text-lg"
          >
            ✖
          </button>
        </div>

        <div className="flex justify-end gap-3 mb-6 flex-wrap">
          <button
            onClick={exportarExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            📗 Exportar Excel
          </button>
          <button
            onClick={exportarPDF}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            📄 Exportar PDF
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <label>Gestor:</label>
          <select className="border px-2 py-1 rounded-lg" value={filtroGestor} onChange={(e) => setFiltroGestor(e.target.value)}>
            {gestores.map((g) => (<option key={g}>{g}</option>))}
          </select>

          <label>Municipio:</label>
          <select className="border px-2 py-1 rounded-lg" value={filtroMunicipio} onChange={(e) => setFiltroMunicipio(e.target.value)}>
            {municipios.map((m) => (<option key={m}>{m}</option>))}
          </select>

          <label>Estado:</label>
          <select className="border px-2 py-1 rounded-lg" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            {estados.map((e) => (<option key={e}>{e}</option>))}
          </select>

          <label>Zona:</label>
          <select className="border px-2 py-1 rounded-lg" value={filtroZona} onChange={(e) => setFiltroZona(e.target.value)}>
            {zonas.map((z) => (<option key={z}>{z}</option>))}
          </select>

          <input type="date" className="border px-2 py-1 rounded-lg" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          <input type="date" className="border px-2 py-1 rounded-lg" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
        </div>

        {tramitesFiltrados.length === 0 ? (
          <p className="text-center text-gray-500">No hay datos para los filtros seleccionados.</p>
        ) : (
          <Tabs defaultValue="Por Municipio">
            {[
              { titulo: "Por Municipio", data: dataMunicipio, color: "#3B82F6" },
              { titulo: "Por Gestor", data: dataGestor, color: "#8B5CF6" },
              { titulo: "Por Estado", data: dataEstado, color: "#F59E0B" },
              { titulo: "Por Zona", data: dataZona, color: "#10B981" },
              { titulo: "Evolución Mensual", data: dataPorMes, color: "#2563EB", tipo: "linea" },
            ].map(({ titulo, data, color, tipo }, idx) => (
              <TabsContent key={titulo + idx} value={titulo}>
                <h3 className="text-lg font-semibold mb-3 text-gray-700">{titulo}</h3>
                <div className="w-full h-72 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {tipo === "linea" ? (
                      <LineChart data={data}>
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="cantidad" stroke={color} strokeWidth={2} />
                      </LineChart>
                    ) : (
                      <BarChart data={data}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="cantidad" fill={color} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </motion.div>
    </motion.div>
  );
}
