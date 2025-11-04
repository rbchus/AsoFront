import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getGestores,
  actualizarGestorMunicipios,
  actualizarGestorMunicipio,
} from "../services/tramitesService";
import { getMunicipios } from "../services/municipiosService";
import LoadingOverlay from "../components/LoadingOverlay";

export default function AsignarGestorMunicipio() {
  const [gestores, setGestores] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(false);
   const [msg, setMsg] = useState(null);
  const [selectedGestores, setSelectedGestores] = useState({}); // guarda el nuevo gestor por municipio

  // 🔹 Cargar gestores y municipios al iniciar
  const fetchData = async () => {
      try {
        setLoading(true);
        const [resMunicipios, resGestores] = await Promise.all([
          getMunicipios(),
          getGestores(),
        ]);
        setMunicipios(resMunicipios.data || []);
        setGestores(resGestores.data || []);
      } catch (err) {
        console.error("❌ Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };
  
  useEffect(() => {
    
    fetchData();
  }, []);

  // 🔹 Maneja selección de nuevo gestor
  const handleChangeGestor = (municipioId, gestorId) => {
    setSelectedGestores((prev) => ({
      ...prev,
      [municipioId]: gestorId,
    }));
  };

  const handleGuardar = async (municipio) => {
  const nuevoGestorId = selectedGestores[municipio.id];

  if (!nuevoGestorId) {
    console.warn("⚠️ Debes seleccionar un gestor para este municipio");
    return;
  }

 /*  console.log("🟢 Asignando gestor:", {
    municipioId: municipio.id,
    gestorAsignadoId: parseInt(nuevoGestorId),
  }); */

  try {
    setLoading(true);

    // 🔹 Payload según tu endpoint
    const payload = {
      gestorAsignadoId: parseInt(nuevoGestorId),
      observacion: "Asignación masiva de trámites de este municipio al gestor.",
    };
   
    const payloadMun = {
      gestorAsignadoId: parseInt(nuevoGestorId),
      
    };
   
    

    await actualizarGestorMunicipio(municipio.id, payloadMun);


    // 🔹 Llamada a tu servicio
    const res = await actualizarGestorMunicipios(municipio.id, payload);
    //console.log("✅ Resultado:", res);
    // 🔹 Mostrar mensaje del backend
    if (res.success) {
      setMsg("✅ " + res.data.message);
      
    } else {
      setMsg(`⚠️ ${res.message || "No se pudo actualizar el municipio"}`);
    }
  } catch (error) {
    console.error("❌ Error al asignar gestor:", error);
    setMsg("❌ Error al asignar el gestor al municipio");
  } finally {
    setLoading(false);
    fetchData();
  }
};



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-5xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        👷‍♂️ Asignar Gestor a Municipios
      </h2>

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

      {loading ? (
        <LoadingOverlay text="Cargando Datos, por favor espere..." />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Municipio</th>
                <th className="px-4 py-2 text-left">Gestor Actual</th>
                <th className="px-4 py-2 text-left">Nuevo Gestor</th>
                <th className="px-4 py-2 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {municipios.map((m, index) => {
                const nuevoGestorId = selectedGestores[m.id] || "";
                const disabled = !nuevoGestorId;

                return (
                  <tr
                    key={m.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 font-medium text-gray-800">
                      {m.nombre}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {m.gestorAsignado
                        ? m.gestorAsignado.nombre
                        : "Sin asignar"}
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={nuevoGestorId}
                        onChange={(e) =>
                          handleChangeGestor(m.id, e.target.value)
                        }
                        className="border rounded-lg px-2 py-1 w-full"
                      >
                        <option value="">Seleccionar...</option>
                        {gestores.map((g) => (
                          <option key={g.id_usuario} value={g.id_usuario}>
                            {g.rol} ({g.nombre})
                          </option>
                        ))}

                         <option value={null}>
                             Sin Asignar
                          </option>

                      </select>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleGuardar(m)}
                        disabled={disabled}
                        className={`px-4 py-1.5 rounded-lg transition font-medium ${
                          disabled
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        Asignar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
