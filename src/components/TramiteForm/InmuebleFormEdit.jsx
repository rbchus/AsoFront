import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, FilePlus2 } from "lucide-react";
import SelectMunicipio from "./SelectMunicipio";
import { getMunicipios } from "../../services/municipiosService.js";

export default function InmuebleFormEdit({ inmueble, setInmueble }) {
  const [formData, setFormData] = useState({});
  const [open, setOpen] = useState(true);

  const [tipoInmueble, setTipoInmueble] = useState("");
  const [fichaCatrastal, setFichaCatrastal] = useState("");
  const [matriculaInmobiliaria, setMatriculaInmobiliaria] = useState("");
  const [idMunicipio, setIdMunicipio] = useState("");
  const [municipios, setMunicipios] = useState([]);

  const fetchMunicipios = async () => {
    const res = await getMunicipios();
    setMunicipios(res.data);
  };

  useEffect(() => {
    fetchMunicipios();
  }, []);

  // 🟢 Cargar datos iniciales del inmueble
  useEffect(() => {
    if (inmueble) {
      setTipoInmueble(inmueble.tipo || "");
      setFichaCatrastal(inmueble.ficha || "");
      setMatriculaInmobiliaria(inmueble.matricula || "");
      setIdMunicipio(inmueble.municipio?.id || "");
    }
  }, [inmueble]);

  // 🟢 Sincronizar cambios hacia el padre
  useEffect(() => {
    const data = {
      tipo: tipoInmueble,
      municipio_id: idMunicipio,
      ficha: fichaCatrastal,
      matricula: matriculaInmobiliaria,
    };
    setFormData(data);
    setInmueble([data]);
  }, [tipoInmueble, idMunicipio, fichaCatrastal, matriculaInmobiliaria]);

  return (
    <div className="border rounded-2xl mb-6 shadow-sm overflow-hidden bg-white">
      {/* Encabezado */}
      <div
        className="flex justify-between items-center bg-blue-50 border-b border-blue-200 px-4 py-3 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2 text-blue-700 font-semibold">
          <FilePlus2 className="w-5 h-5 text-blue-600" />
          <span>Datos del inmueble</span>
        </div>
        <button className="text-blue-600 hover:text-blue-800 transition">
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="p-6 bg-gray-50 transition-all duration-300 space-y-6">
          {/* Tipo de inmueble, municipio, ficha y matrícula */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {/* Tipo de suelo */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de suelo
              </label>
              <select
                id="tipoInmueble"
                value={tipoInmueble}
                onChange={(e) => setTipoInmueble(e.target.value)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione...</option>
                <option value="RURAL">Rural</option>
                <option value="URBANO">Urbano</option>
              </select>
            </div>

            {/* Municipio */}
            <div className="md:col-span-1">
              <SelectMunicipio
                municipiosList={municipios}
                selectId={setIdMunicipio}
                selectedId={idMunicipio} // 👈 Para preseleccionar
              />
              {/* Mostrar el nombre actual si ya viene cargado */}
              {inmueble?.municipio?.nombre && (
                <p className="text-xs text-gray-500 mt-1">
                  Actual: {inmueble.municipio.nombre}
                </p>
              )}
            </div>

            {/* Ficha Catastral */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                FICHA CATASTRAL
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fichaCatrastal}
                  onChange={(e) => {
                    let value = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9-]/g, "");
                    if (value.length <= 30) setFichaCatrastal(value);
                  }}
                  className={`w-full border rounded-lg p-2 focus:ring-2 ${
                    fichaCatrastal.length >= 30
                      ? "border-red-500 ring-red-300"
                      : "focus:ring-blue-500"
                  } uppercase`}
                  placeholder="Ej. 54058-000-000-0123-000"
                  maxLength={30}
                />

                <span
                  className={`absolute right-2 bottom-1 text-xs ${
                    fichaCatrastal.length >= 30
                      ? "text-red-500 font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {fichaCatrastal.length}/30
                </span>
              </div>
            </div>

            {/* Matrícula Inmobiliaria */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MATRÍCULA INMOBILIARIA
              </label>
              <input
                type="text"
                value={matriculaInmobiliaria}
                onChange={(e) => {
                  let value = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9-]/g, "");
                  setMatriculaInmobiliaria(value);
                }}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="Ej. 260-12345"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
