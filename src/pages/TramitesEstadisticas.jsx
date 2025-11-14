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

const Tabs = ({ defaultValue, children }) => {
  const [active, setActive] = useState(defaultValue || children[0].props.value);
  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {children.map((tab) => (
          <button
            key={tab.props.value}
            onClick={() => setActive(tab.props.value)}
            className={`px-4 py-2 rounded-lg ${
              active === tab.props.value
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
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

export default function TramitesEstadisticas({
  tramites = [],
  onCloseEstadistica,
}) {
  const [filtroGestor, setFiltroGestor] = useState("Todos");
  const [filtroMunicipio, setFiltroMunicipio] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroZona, setFiltroZona] = useState("Todos");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  //console.log(tramites)

  const obtenerGestor = (t) =>
    t.gestorAsignado?.nombre ||
    t.gestorAsignado?.name ||
    t.gestorAsignado?.nombre_usuario ||
    t.gestorAsignado?.usuario?.nombre ||
    "Sin asignar";

  const obtenerMunicipio = (t) =>
    t.inmuebles?.[0]?.municipio?.nombre ||
    t.solicitante?.municipio?.nombre ||
    "Sin municipio";

  const obtenerEstado = (t) => t.estado || "Desconocido";
  const obtenerZona = (t) => t.inmuebles?.[0]?.tipo || "Sin zona";

  const gestores = useMemo(
    () => ["Todos", ...new Set(tramites.map((t) => obtenerGestor(t)))],
    [tramites]
  );
  const municipios = useMemo(
    () => ["Todos", ...new Set(tramites.map((t) => obtenerMunicipio(t)))],
    [tramites]
  );
  const estados = useMemo(
    () => [...new Set(tramites.map((t) => obtenerEstado(t)))],
    [tramites]
  );
  const zonas = useMemo(
    () => ["Todos", ...new Set(tramites.map((t) => obtenerZona(t)))],
    [tramites]
  );

  const tramitesFiltrados = useMemo(
    () =>
      tramites.filter((t) => {
        const fecha = new Date(t.fechaCreacion);
        return (
          (filtroGestor === "Todos" || obtenerGestor(t) === filtroGestor) &&
          (filtroMunicipio === "Todos" ||
            obtenerMunicipio(t) === filtroMunicipio) &&
          (filtroEstado === "Todos" || obtenerEstado(t) === filtroEstado) &&
          (filtroZona === "Todos" || obtenerZona(t) === filtroZona) &&
          (!fechaInicio || fecha >= new Date(fechaInicio)) &&
          (!fechaFin || fecha <= new Date(fechaFin))
        );
      }),
    [
      tramites,
      filtroGestor,
      filtroMunicipio,
      filtroEstado,
      filtroZona,
      fechaInicio,
      fechaFin,
    ]
  );

  // Agrupar por función
  const agrupar = (array, fn) => {
    const mapa = {};
    array.forEach((t) => {
      const key = fn(t);
      if (!mapa[key]) mapa[key] = { name: key, cantidad: 0 };
      mapa[key].cantidad++;
    });
    return Object.values(mapa);
  };

  // Datos base
  const dataMunicipio = useMemo(
    () => agrupar(tramitesFiltrados, obtenerMunicipio),
    [tramitesFiltrados]
  );
  const dataGestor = useMemo(
    () => agrupar(tramitesFiltrados, obtenerGestor),
    [tramitesFiltrados]
  );
  const dataEstado = useMemo(
    () => agrupar(tramitesFiltrados, obtenerEstado),
    [tramitesFiltrados]
  );
  const dataZona = useMemo(
    () => agrupar(tramitesFiltrados, obtenerZona),
    [tramitesFiltrados]
  );

  const dataPorMes = useMemo(() => {
    const mapa = {};
    tramitesFiltrados.forEach((t) => {
      const fecha = new Date(t.fechaCreacion);
      const mes = fecha.toLocaleString("es-CO", {
        month: "short",
        year: "numeric",
      });
      if (!mapa[mes]) mapa[mes] = { mes, cantidad: 0 };
      mapa[mes].cantidad++;
    });
    return Object.values(mapa);
  }, [tramitesFiltrados]);

  // === 📗 EXCEL ===
  
  const exportarExcel = async () => {
  const libro = XLSX.utils.book_new();

  // === ENCABEZADO ===
  const encabezado = [
    ["Sistema de Trámites Catastrales"],
    ["Asociación de Municipios del Catatumbo – Plataforma de gestión y seguimiento"],
    ["Reporte General de Trámites"],
    [""],
    ["Generado el:", new Date().toLocaleString("es-CO")],
  ];
  const hojaPortada = XLSX.utils.aoa_to_sheet(encabezado);
  XLSX.utils.book_append_sheet(libro, hojaPortada, "Encabezado");

  // === UTILIDADES ===
  const agregarHoja = (nombre, datos) => {
    if (!datos.length) return;
    const nombreHoja = nombre.length > 31 ? nombre.slice(0, 31) : nombre; // <-- previene el error
    const hoja = XLSX.utils.json_to_sheet(datos);

    // ajustar ancho de columnas
    const columnas = Object.keys(datos[0]);
    hoja["!cols"] = columnas.map((col) => ({
      wch: Math.max(col.length + 2, 12),
    }));

    XLSX.utils.book_append_sheet(libro, hoja, nombreHoja);
  };

  const completarColumnas = (datos, estados) =>
    datos.map((d) => {
      const fila = { ...d };
      estados.forEach((e) => {
        if (fila[e] === undefined) fila[e] = 0;
      });
      return fila;
    });

  const estadosUnicos = [...new Set(tramitesFiltrados.map((t) => obtenerEstado(t)))];

  // === 1️⃣ Trámites por Municipio (con totales)
  const tramitesPorMunicipio = {};
  tramitesFiltrados.forEach((t) => {
    const muni = obtenerMunicipio(t);
    if (!tramitesPorMunicipio[muni]) tramitesPorMunicipio[muni] = 0;
    tramitesPorMunicipio[muni]++;
  });
  const dataMunicipio = Object.entries(tramitesPorMunicipio).map(([m, total]) => ({
    Municipio: m,
    Total: total,
  }));
  agregarHoja("Trámites_Municipio", dataMunicipio);

  // === 2️⃣ Trámites por Municipio (por Estado) — sin totales
  const municipiosPorEstado = {};
  tramitesFiltrados.forEach((t) => {
    const muni = obtenerMunicipio(t);
    const est = obtenerEstado(t);
    if (!municipiosPorEstado[muni]) municipiosPorEstado[muni] = {};
    municipiosPorEstado[muni][est] = (municipiosPorEstado[muni][est] || 0) + 1;
  });
  const dataMunicipioEstado = Object.entries(municipiosPorEstado).map(
    ([muni, ests]) => ({
      Municipio: muni,
      ...ests,
    })
  );
  agregarHoja(
    "Munic_Por_Estado",
    completarColumnas(dataMunicipioEstado, estadosUnicos)
  );

  // === 3️⃣ Trámites por Gestor (con totales)
  const tramitesPorGestor = {};
  tramitesFiltrados.forEach((t) => {
    const g = obtenerGestor(t);
    if (!tramitesPorGestor[g]) tramitesPorGestor[g] = 0;
    tramitesPorGestor[g]++;
  });
  const dataGestor = Object.entries(tramitesPorGestor).map(([g, total]) => ({
    Gestor: g,
    Total: total,
  }));
  agregarHoja("Trámites_Gestor", dataGestor);

  // === 4️⃣ Trámites por Gestor (por Estado) — sin totales
  const gestorPorEstado = {};
  tramitesFiltrados.forEach((t) => {
    const g = obtenerGestor(t);
    const est = obtenerEstado(t);
    if (!gestorPorEstado[g]) gestorPorEstado[g] = {};
    gestorPorEstado[g][est] = (gestorPorEstado[g][est] || 0) + 1;
  });
  const dataGestorEstado = Object.entries(gestorPorEstado).map(([g, ests]) => ({
    Gestor: g,
    ...ests,
  }));
  agregarHoja("Gestor_Por_Estado", completarColumnas(dataGestorEstado, estadosUnicos));

// === 5️⃣ Municipios vs Gestores — EXCEL (con gestor auxiliar) ===

// 1. Gestores únicos (principal o auxiliar)
let gestoresUnicos = [
  ...new Set([
    ...tramitesFiltrados.map((t) =>
      t.gestorAsignado ? t.gestorAsignado.nombre : "Sin gestor"
    ),
    ...tramitesFiltrados.map((t) =>
      t.gestorAuxiliar ? t.gestorAuxiliar.nombre : null
    ),
  ]),
].filter(Boolean);

// Agregar “Sin gestor”
if (!gestoresUnicos.includes("Sin gestor")) gestoresUnicos.push("Sin gestor");

// 2. Municipios únicos
let municipiosUnicos = [
  ...new Set(
    tramitesFiltrados.map((t) =>
      t.inmuebles?.[0]?.municipio?.nombre || "Sin municipio"
    )
  ),
];

// 3. Mapa: Gestor → Municipio → { principal, auxiliar }
const gestorMunicipioMap = {};

gestoresUnicos.forEach((g) => {
  gestorMunicipioMap[g] = {};
  municipiosUnicos.forEach((m) => {
    gestorMunicipioMap[g][m] = { principal: 0, auxiliar: 0 };
  });
});

tramitesFiltrados.forEach((t) => {
  const municipio =
    t.inmuebles?.[0]?.municipio?.nombre || "Sin municipio";

  // Principal
  const gPrincipal = t.gestorAsignado
    ? t.gestorAsignado.nombre
    : "Sin gestor";

  gestorMunicipioMap[gPrincipal][municipio].principal++;

  // Auxiliar
  if (t.gestorAuxiliar) {
    const gAux = t.gestorAuxiliar.nombre;

    if (!gestorMunicipioMap[gAux])
      gestorMunicipioMap[gAux] = {};

    if (!gestorMunicipioMap[gAux][municipio])
      gestorMunicipioMap[gAux][municipio] = { principal: 0, auxiliar: 0 };

    gestorMunicipioMap[gAux][municipio].auxiliar++;
  }
});

// 4. Convertir estructura a tabla Excel
const dataMuniGestor = gestoresUnicos.map((gestor) => {
  const fila = { Gestor: gestor };

  municipiosUnicos.forEach((m) => {
    const { principal, auxiliar } = gestorMunicipioMap[gestor][m];

    if (principal > 0 && auxiliar > 0)
      fila[m] = `${principal} (${auxiliar})`;

    else if (principal > 0)
      fila[m] = `${principal}`;

    else if (auxiliar > 0)
      fila[m] = `(${auxiliar})`;

    else fila[m] = "0";
  });

  return fila;
});

agregarHoja("Gestor_vs_Municipio", dataMuniGestor);

// Agregar nota en hoja aparte
agregarHoja("Notas", [
  { Nota: "(GA) indica cantidad de trámites donde el gestor figura como Gestor Auxiliar." },
]);


  // === GUARDAR ===
  XLSX.writeFile(libro, "Reporte_Tramites.xlsx");
};


  // === 📄 PDF ===

 const exportarPDF = async () => {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt" });

  // ------------------ LOGO INSTITUCIONAL ------------------
  try {
    const logoUrl = "/asomunicipios_negro.png"; // usar PNG o JPG, no SVG
    const imgBlob = await fetch(logoUrl).then((res) => res.blob());
    const imgData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(imgBlob);
    });

    // Mantener proporción del logo automáticamente
    const tempImg = new Image();
    tempImg.src = imgData;
    await new Promise((resolve) => (tempImg.onload = resolve));

    const originalWidth = tempImg.width;
    const originalHeight = tempImg.height;
    const logoHeight = 45; // ajusta si quieres más grande o pequeño
    const logoWidth = (originalWidth / originalHeight) * logoHeight;

    doc.addImage(imgData, "PNG", 40, 25, logoWidth, logoHeight);
  } catch (err) {
    console.warn("⚠️ No se pudo cargar el logo:", err);
  }

  // ------------------ ENCABEZADO ------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Sistema de Trámites Catastrales", 140, 45);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(
    "Asociación de Municipios del Catatumbo – Plataforma de gestión y seguimiento",
    140,
    62
  );
  doc.setFontSize(9);
  doc.text(`Generado el ${new Date().toLocaleString("es-CO")}`, 140, 78);
  doc.line(40, 90, 800, 90);

  let y = 110;

  // ------------------ PIE DE PÁGINA ------------------
  const addPieDePagina = () => {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Página ${i} de ${pageCount} · Sistema de Trámites Catastrales - Asomunicipios`,
        400,
        580,
        { align: "center" }
      );
    }
  };

  // ------------------ UTILITARIOS ------------------
  const addTable = (titulo, data) => {
    if (!data.length) return;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(titulo, 40, y);
    doc.setFont("helvetica", "normal");
    autoTable(doc, {
      startY: y + 10,
      head: [Object.keys(data[0])],
      body: data.map((d) => Object.values(d)),
      styles: { fontSize: 8 },
      theme: "striped",
      margin: { left: 40, right: 40 },
      didDrawPage: (data) => {
        y = data.cursor.y;
      },
    });
    y = doc.lastAutoTable.finalY + 25;
  };

  const completarColumnas = (datos, estados) =>
    datos.map((d) => {
      const fila = { ...d };
      estados.forEach((e) => {
        if (fila[e] === undefined) fila[e] = 0;
      });
      return fila;
    });

  // ------------------ DATOS BASE ------------------
  const estadosUnicos = [...new Set(tramitesFiltrados.map((t) => obtenerEstado(t)))];

  // === 1️⃣ Trámites por Municipio (con totales)
  const tramitesPorMunicipio = {};
  tramitesFiltrados.forEach((t) => {
    const muni = obtenerMunicipio(t);
    if (!tramitesPorMunicipio[muni]) tramitesPorMunicipio[muni] = 0;
    tramitesPorMunicipio[muni]++;
  });

  const dataMunicipio = Object.entries(tramitesPorMunicipio).map(([muni, total]) => ({
    Municipio: muni,
    Total: total,
  }));

  addTable("Trámites por Municipio", dataMunicipio);

  // === 2️⃣ Trámites por Municipio (por Estado) — sin totales
  const municipiosPorEstado = {};
  tramitesFiltrados.forEach((t) => {
    const muni = obtenerMunicipio(t);
    const est = obtenerEstado(t);
    if (!municipiosPorEstado[muni]) municipiosPorEstado[muni] = {};
    municipiosPorEstado[muni][est] = (municipiosPorEstado[muni][est] || 0) + 1;
  });

  const dataMunicipioEstado = Object.entries(municipiosPorEstado).map(
    ([muni, ests]) => ({
      Municipio: muni,
      ...ests,
    })
  );

  addTable(
    "Trámites por Municipio (por Estado)",
    completarColumnas(dataMunicipioEstado, estadosUnicos)
  );

  // === 3️⃣ Trámites por Gestor (con totales)
  const tramitesPorGestor = {};
  tramitesFiltrados.forEach((t) => {
    const g = obtenerGestor(t);
    if (!tramitesPorGestor[g]) tramitesPorGestor[g] = 0;
    tramitesPorGestor[g]++;
  });

  const dataGestor = Object.entries(tramitesPorGestor).map(([g, total]) => ({
    Gestor: g,
    Total: total,
  }));

  addTable("Trámites por Gestor", dataGestor);

  // === 4️⃣ Trámites por Gestor (por Estado) — sin totales
  const gestorPorEstado = {};
  tramitesFiltrados.forEach((t) => {
    const g = obtenerGestor(t);
    const est = obtenerEstado(t);
    if (!gestorPorEstado[g]) gestorPorEstado[g] = {};
    gestorPorEstado[g][est] = (gestorPorEstado[g][est] || 0) + 1;
  });

  const dataGestorEstado = Object.entries(gestorPorEstado).map(([g, ests]) => ({
    Gestor: g,
    ...ests,
  }));

  addTable(
    "Trámites por Gestor (por Estado)",
    completarColumnas(dataGestorEstado, estadosUnicos)
  );

 // === 5️⃣ Municipios vs Gestores — PDF (con auxiliar) ===

// 1. Gestores únicos
let gestoresUnicos = [
  ...new Set([
    ...tramitesFiltrados.map((t) =>
      t.gestorAsignado ? t.gestorAsignado.nombre : "Sin gestor"
    ),
    ...tramitesFiltrados.map((t) =>
      t.gestorAuxiliar ? t.gestorAuxiliar.nombre : null
    ),
  ]),
].filter(Boolean);

if (!gestoresUnicos.includes("Sin gestor"))
  gestoresUnicos.push("Sin gestor");

// 2. Municipios únicos
let municipiosUnicos = [
  ...new Set(
    tramitesFiltrados.map((t) =>
      t.inmuebles?.[0]?.municipio?.nombre || "Sin municipio"
    )
  ),
];

// 3. Crear mapa Gestor → Municipio → principal/auxiliar
const gestorMunicipioMap = {};

gestoresUnicos.forEach((g) => {
  gestorMunicipioMap[g] = {};
  municipiosUnicos.forEach((m) => {
    gestorMunicipioMap[g][m] = { principal: 0, auxiliar: 0 };
  });
});

tramitesFiltrados.forEach((t) => {
  const municipio =
    t.inmuebles?.[0]?.municipio?.nombre || "Sin municipio";

  // Principal
  const gPrincipal = t.gestorAsignado
    ? t.gestorAsignado.nombre
    : "Sin gestor";

  gestorMunicipioMap[gPrincipal][municipio].principal++;

  // Auxiliar
  if (t.gestorAuxiliar) {
    const gAux = t.gestorAuxiliar.nombre;

    if (!gestorMunicipioMap[gAux])
      gestorMunicipioMap[gAux] = {};

    if (!gestorMunicipioMap[gAux][municipio])
      gestorMunicipioMap[gAux][municipio] = { principal: 0, auxiliar: 0 };

    gestorMunicipioMap[gAux][municipio].auxiliar++;
  }
});

// 4. Tabla final para PDF
const dataMuniGestor = gestoresUnicos.map((gestor) => {
  const fila = { Gestor: gestor };

  municipiosUnicos.forEach((m) => {
    const { principal, auxiliar } = gestorMunicipioMap[gestor][m];

    if (principal > 0 && auxiliar > 0)
      fila[m] = `${principal} (${auxiliar})`;

    else if (principal > 0)
      fila[m] = `${principal}`;

    else if (auxiliar > 0)
      fila[m] = `(${auxiliar})`;

    else fila[m] = "0";
  });

  return fila;
});

// 5. PDF — con encabezados verticales
addTable(
  "Gestores vs Municipios (principal y auxiliar)",
  dataMuniGestor,
  {
    headStyles: {
      textDirection: "vertical",
      valign: "bottom",
    },
  }
);

// 6. Nota final
addTable("Nota", [
  { Detalle: "(GA) indica cantidad de trámites donde el gestor figura como Gestor Auxiliar." },
]);

  // ------------------ PIE FINAL ------------------
  addPieDePagina();
  doc.save("Reporte_Tramites.pdf");
};



  // === Render ===
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
          <h3 className="text-2xl font-semibold text-gray-800">
            📊 Estadísticas de Trámites
          </h3>
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

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-8">
          <label>Gestor:</label>
          <select
            className="border px-2 py-1 rounded-lg"
            value={filtroGestor}
            onChange={(e) => setFiltroGestor(e.target.value)}
          >
            {gestores.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>

          <label>Municipio:</label>
          <select
            className="border px-2 py-1 rounded-lg"
            value={filtroMunicipio}
            onChange={(e) => setFiltroMunicipio(e.target.value)}
          >
            {municipios.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          <label>Estado:</label>
          <select
            className="border px-2 py-1 rounded-lg"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            {["Todos", ...estados].map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>

          <label>Zona:</label>
          <select
            className="border px-2 py-1 rounded-lg"
            value={filtroZona}
            onChange={(e) => setFiltroZona(e.target.value)}
          >
            {zonas.map((z) => (
              <option key={z}>{z}</option>
            ))}
          </select>

          <input
            type="date"
            className="border px-2 py-1 rounded-lg"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          <input
            type="date"
            className="border px-2 py-1 rounded-lg"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>

        {/* Gráficas */}
        {tramitesFiltrados.length === 0 ? (
          <p className="text-center text-gray-500">
            No hay datos para los filtros seleccionados.
          </p>
        ) : (
          <Tabs defaultValue="Por Municipio">
            {[
              { titulo: "Por Municipio", data: dataMunicipio, color: "#3B82F6" },
              { titulo: "Por Gestor", data: dataGestor, color: "#8B5CF6" },
              { titulo: "Por Estado", data: dataEstado, color: "#F59E0B" },
              { titulo: "Por Zona", data: dataZona, color: "#10B981" },
              {
                titulo: "Evolución Mensual",
                data: dataPorMes,
                color: "#2563EB",
                tipo: "linea",
              },
            ].map(({ titulo, data, color, tipo }, idx) => (
              <TabsContent key={titulo + idx} value={titulo}>
                <h3 className="text-lg font-semibold mb-3 text-gray-700">
                  {titulo}
                </h3>
                <div className="w-full h-72 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {tipo === "linea" ? (
                      <LineChart data={data}>
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="cantidad"
                          stroke={color}
                          strokeWidth={2}
                        />
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
