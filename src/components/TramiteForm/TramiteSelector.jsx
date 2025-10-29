import { useEffect, useState } from "react";
import { getTramitesRelacion } from "../../services/tramitesRelacionService";
import FileUploader from "./FileUploader";
import InmuebleForm from "./InmuebleForm";
import TitularForm from "./TitularForm";
import MessageCard from "../../pages/MessageCard"

import SelectSolicitanteTipo from "./SelectSolicitanteTipo";

import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

import { createTramite } from "../../services/tramitesService";

import { useAuth } from "../../context/AuthContext";

export default function TramiteSelector() {

   const { usuario } = useAuth();

   const [archivos, setArchivos] = useState([]);
  const [tramites, setTramites] = useState([]);
  const [tipoTramite, setTipoTramite] = useState("");
  const [subTramite, setSubTramite] = useState("");
  const [relacionId, setRelacionId] = useState(null);
  const [solicitanteTipo, setSolicitanteTipo] = useState(null);
  const [titulares, setTitulares] = useState([]);
  const [razon, setRazon] = useState("");
 const [inmueble, setInmueble] = useState([]);
  const [rtaBack, setRtaBack] = useState(null);
  const maxLength = 250;

  useEffect(() => {
    const fetchData = async () => {
      const res = await getTramitesRelacion();
      setTramites(res.data);
    };
    fetchData();
  }, []);

  const tramiteSeleccionado = tramites.find((t) => t.nombre === tipoTramite);
  const subTramiteSeleccionado = tramiteSeleccionado?.subtramites.find(
    (s) => s.nombre === subTramite
  );

  useEffect(() => {
    if (subTramiteSeleccionado) {
      setRelacionId(subTramiteSeleccionado.id);
    } else {
      setRelacionId(null);
    }
  }, [subTramiteSeleccionado]);

  // 🟢 Nuevo useEffect: muestra los IDs y nombres en consola
  useEffect(() => {
    if (tramiteSeleccionado) {
      //console.log("🧾 Tipo de Trámite Seleccionado:");
      //console.log(`ID: ${tramiteSeleccionado.id}, Nombre: ${tramiteSeleccionado.nombre}`);
    }

    if (subTramiteSeleccionado) {
      //console.log("📄 SubTrámite Seleccionado:");
      //console.log(`ID: ${subTramiteSeleccionado.id}, Nombre: ${subTramiteSeleccionado.nombre}`);
      console.log(`🔗 Tramite y subTramite (tramiteRelacionId): ${relacionId}`);
      console.log(
        "%c✅ Solicitante tipo seleccionado (solicitanteTipoId):",
        "color: green;",
        solicitanteTipo
      );
      console.log("%c✅ titulares :", "color: green;", titulares);
      console.log("%c✅ inmbiueble :", "color: blue;", inmueble);
    }
  }, [
    tramiteSeleccionado,
    subTramiteSeleccionado,
    relacionId,
    solicitanteTipo,
    titulares,
    inmueble
  ]);


  //.........................

// ✅ Validar campos mínimos para activar botón
  const camposMinimos = [
    tipoTramite,
    subTramite,
    solicitanteTipo,
    titulares[0]?.tipoDocumento,
    titulares[0]?.numeroDocumento,
    titulares[0]?.nombre,
    titulares[0]?.apellido,
    inmueble[0]?.tipo,
    inmueble[0]?.municipio_id,
    archivos.length > 0,
  ];

  const puedeEnviar = camposMinimos.every(Boolean);

  // 🧱 Construir el JSON final simulado
  const generarJSON = async () => {
    const jsonFinal = {
      estado: "EN PROCESO",
      tramiteRelacionId: relacionId,
      solicitanteId: usuario.id,
      gestorAsignadoId: null,
      razones: razon,
      solicitanteTipoId: solicitanteTipo,
      inmuebles: inmueble,
      titulares: titulares,
      documentos: archivos.map((a) => ({
        nombre_archivo: a.name,
        ruta: URL.createObjectURL(a),
        tipo: a.type || "PDF",
      })),
      trazabilidades: [
        {
          estado: "EN PROCESO",
          observacion: "POR EL USUARUO: " + razon,
        },
      ],
    };

    //console.log("%c🧾 JSON listo para backend:", "color: blue; font-weight: bold;");
    console.log(jsonFinal);

     try {
    const res = await createTramite(jsonFinal);
    console.log("✅ Respuesta del backend:", res);
    //alert("Trámite creado correctamente 🎉");
    setRtaBack({
      icono:true, 
      msj:"Trámite creado correctamente 🎉", 
      link: {
    url: "/dashboard/tramites",
    text: "Ir a trámites"
  }})
  } catch (error) {
    console.error("❌ Error al enviar trámite:", error);
    //alert("Error al crear el trámite. Revisa la consola.");
     setRtaBack({icono:false, msj:"Error al crear el trámite :(", link: null})
  }

  };

  //.........................

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8 transition-all duration-300">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
        Gestión de Trámites Catastrales
      </h1>

      {/* Selección de tipo de trámite */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de trámite
          </label>
          <select
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            value={tipoTramite}
            onChange={(e) => {
              setTipoTramite(e.target.value);
              setSubTramite("");
              setRelacionId(null);
              setSolicitanteTipo(null);
              setTitulares([]);
            }}
          >
            <option value="">Seleccione...</option>
            {tramites.map((t) => (
              <option key={t.id} value={t.nombre}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Subtrámite + tipo solicitante */}
        {tipoTramite && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub trámite
              </label>
              <select
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                value={subTramite}
                onChange={(e) => {
                  setSubTramite(e.target.value);
                  setSolicitanteTipo(null);
                  setTitulares([]);
                }}
              >
                <option value="">Seleccione...</option>
                {tramiteSeleccionado?.subtramites.map((sub) => (
                  <option key={sub.id} value={sub.nombre}>
                    {sub.nombre}
                  </option>
                ))}
              </select>
            </div>

            {subTramite && (
              <div>
                <SelectSolicitanteTipo onSelect={setSolicitanteTipo} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mostrar TitularForm */}
      {solicitanteTipo && (
        <>
          <div className="mt-8 border-t pt-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="razones"
                className="block text-sm font-medium text-gray-700"
              >
                Razones para la solicitud
              </label>
              <span
                className={`text-xs ${
                  razon.length > maxLength ? "text-red-500" : "text-gray-500"
                }`}
              >
                {razon.length}/{maxLength}
              </span>
            </div>

            <textarea
              id="razones"
              rows="2"
              value={razon}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= maxLength) {
                  setRazon(value);
                } else {
                  // si quieres, puedes agregar una alerta o ignorar los caracteres extra
                }
              }}
              placeholder="Escribe aquí tus razones para la solicitud..."
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>

          <div className="mt-8 border-t pt-6 animate-fadeIn">
            <TitularForm titulares={titulares} setTitulares={setTitulares} />
          </div>
        </>
      )}

      {/* Mostrar InmuebleForm */}
      {solicitanteTipo && (
        <div className="mt-8 border-t pt-6 animate-fadeIn">
          <InmuebleForm
           setInmueble={setInmueble} 
          />
        </div>
      )}

       {solicitanteTipo && (
        <div className="mt-8 border-t pt-6 animate-fadeIn">
          {/* Archivos */}
          <FileUploader archivos={archivos} setArchivos={setArchivos} />
        </div>
      )}

        {solicitanteTipo && (
        <div className="mt-8 border-t pt-6 animate-fadeIn">
             {/* 🔹 Botón para generar JSON */}
      <div className="mt-10 text-center">
        <button
          disabled={!puedeEnviar}
          onClick={generarJSON}
          className={`px-8 py-3 rounded-lg font-semibold text-white transition ${
            puedeEnviar
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Generar JSON
        </button>
        {!puedeEnviar && (
          <p className="text-sm text-gray-600 mt-2">
            ⚠️ Complete los campos mínimos para habilitar el botón.
          </p>
        )}
      </div>
        </div>
      )}



    
     <AnimatePresence>
        {rtaBack && (
           <MessageCard 
           rta={rtaBack} 
           onClose={() => setRtaBack(null)}
           />
        )}
      </AnimatePresence>
    </div>
  );
}
