import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, FilePlus2 } from "lucide-react";

import SelectMunicipio from "./SelectMunicipio";
import SelectCiudad from "./SelectCiudad";

export default function InmuebleForm({ tipoTramiteId, setInmueble }) {
  const [formData, setFormData] = useState([]);
  const [open, setOpen] = useState(true);
  const [propiedadHorizontal, setPropiedadHorizontal] = useState("");
  const [objetivoPeticion, setObjetivoPeticion] = useState("");

  const [tipoInmueble, setTipoInmueble] = useState("");
  const [mejoraMutacion, setMejoraMutacion] = useState("");
  const [valorTerreno, setValorTerreno] = useState("");
  const [valorConstruccion, setValorConstruccion] = useState("");
  const [valorTerrenoPesos, setValorTerrenoPesos] = useState("");
  const [valorConstruccionPesos, setValorConstruccionPesos] = useState("");
  const [valorAvaluoEstimado, setValorAvaluoEstimado] = useState("");

  const [valorEscrituraRPH, setValorEscrituraRPH] = useState("");
  const [valorAnioEscritura, setValorAnioEscritura] = useState("");
  const [valorNotaria, setValorNotaria] = useState("");

  const [tipoInscripcion, setTipoInscripcion] = useState("");
  const [motivoSolicitud, setMotivoSolicitud] = useState("");

  const [idMunicipio, setIdMunicipio] = useState("");
  const [idCiudad, setIdCiudad] = useState("");

  const [tiposInscripcion] = useState([
    "Primera inscripción",
    "Traslado de dominio",
    "Rectificación",
    "Modificación",
    "Cancelación",
  ]);

  const [motivosSolicitud] = useState([
    "Actualización de datos catastrales",
    "Rectificación de área o linderos",
    "Cambio de propietario",
    "Incorporación de construcción",
    "Cancelación o modificación de inscripción",
  ]);

  // Generar lista de años (últimos 60)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => currentYear - i);

  const handleNumberChange = (setter) => (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  // 💡 NUEVO: campos condicionales basados en ID del tipo de trámite
  const showPropiedadHorizontal = [2, 3, 7].includes(tipoTramiteId); // Segunda, Tercera, Modificaciones
  const showNotaria = [5, 6].includes(tipoTramiteId); // Quinta, Rectificaciones
  const showObjetivo = tipoTramiteId === 3; // Tercera
  const showValores = tipoTramiteId === 4; // Cuarta
  const showQuinta = tipoTramiteId === 5; // Quinta

  useEffect(() => {
    const data = {
      tipo: tipoInmueble,
      propiedad_horizontal: propiedadHorizontal,
      municipio_id: idMunicipio,
      ciudad_id: idCiudad,
      objetivoPeticion,
      mejoraMutacion,
      tipoInscripcion,
      motivoSolicitud,
      terreno_m2: valorTerreno,
      construccion_m2: valorConstruccion,
      avaluo_terreno: valorTerrenoPesos,
      avaluo_construccion: valorConstruccionPesos,
      valorAvaluoEstimado,
      escritura: valorEscrituraRPH,
      anoEscritura: valorAnioEscritura,
      notaria: valorNotaria,
    };

    setFormData(data);
    setInmueble([data]); // Enviar al padre
  }, [
    tipoInmueble,
    propiedadHorizontal,
    idMunicipio,
    objetivoPeticion,
    mejoraMutacion,
    tipoInscripcion,
    motivoSolicitud,
    valorTerreno,
    valorConstruccion,
    valorTerrenoPesos,
    valorConstruccionPesos,
    valorAvaluoEstimado,
    valorEscrituraRPH,
    valorAnioEscritura,
    valorNotaria,
    idCiudad,
  ]);

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
          {open ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {open && (
        <div className="p-6 bg-gray-50 transition-all duration-300 space-y-6">
          {/* Tipo de inmueble y municipio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
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
                <option value="Rural">Rural</option>
                <option value="Urbano">Urbano</option>
              </select>
            </div>

            <SelectMunicipio selectId={setIdMunicipio} />

            {showPropiedadHorizontal && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ¿Propiedad horizontal?
                </label>
                <select
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  value={propiedadHorizontal}
                  onChange={(e) => setPropiedadHorizontal(e.target.value)}
                >
                  <option value="">Seleccione...</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>
            )}
          </div>

          {/* Objetivo de la petición */}
          {showObjetivo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objetivo de la petición
                </label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={objetivoPeticion}
                  onChange={(e) => setObjetivoPeticion(e.target.value)}
                >
                  <option value="">Seleccione...</option>
                  <option value="Revisión de Avalúo">Revisión de Avalúo</option>
                  <option value="Corrección">Corrección</option>
                  <option value="Actualización">Actualización</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ¿Considera mejora de mutación?
                </label>
                <select
                  value={mejoraMutacion}
                  onChange={(e) => setMejoraMutacion(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione...</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          )}

          {/* Valores */}
          {showValores && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terreno (m²)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 text-sm">m²</span>
                    <input
                      type="text"
                      value={valorTerreno}
                      onChange={handleNumberChange(setValorTerreno)}
                      placeholder="Ej. 50"
                      className="w-full border rounded-lg p-2 pl-10 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Construcción (m²)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 text-sm">m²</span>
                    <input
                      type="text"
                      value={valorConstruccion}
                      onChange={handleNumberChange(setValorConstruccion)}
                      placeholder="Ej. 80"
                      className="w-full border rounded-lg p-2 pl-10 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terreno ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 text-sm">$</span>
                    <input
                      type="text"
                      value={valorTerrenoPesos}
                      onChange={handleNumberChange(setValorTerrenoPesos)}
                      placeholder="Ej. 150000000"
                      className="w-full border rounded-lg p-2 pl-7 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Construcción ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 text-sm">$</span>
                    <input
                      type="text"
                      value={valorConstruccionPesos}
                      onChange={handleNumberChange(setValorConstruccionPesos)}
                      placeholder="Ej. 120000000"
                      className="w-full border rounded-lg p-2 pl-7 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avalúo estimado ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 text-sm">$</span>
                    <input
                      type="text"
                      value={valorAvaluoEstimado}
                      onChange={handleNumberChange(setValorAvaluoEstimado)}
                      placeholder="Ej. 250000000"
                      className="w-full border rounded-lg p-2 pl-7 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Notaría */}
          {showNotaria && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  N° de escritura pública RPH
                </label>
                <input
                  type="text"
                  value={valorEscrituraRPH}
                  onChange={(e) => setValorEscrituraRPH(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej. 15638-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Año de la escritura
                </label>
                <select
                  value={valorAnioEscritura}
                  onChange={(e) => setValorAnioEscritura(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione...</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notaría otorgante (N°)
                </label>
                <input
                  type="number"
                  value={valorNotaria}
                  onChange={(e) => setValorNotaria(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej. 21"
                />
              </div>

              <SelectCiudad selectId={setIdCiudad} />
            </div>
          )}

          {/* Quinta */}
          {showQuinta && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de inscripción
                </label>
                <select
                  value={tipoInscripcion}
                  onChange={(e) => setTipoInscripcion(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione...</option>
                  {tiposInscripcion.map((tipo, i) => (
                    <option key={i} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo de la solicitud
                </label>
                <select
                  value={motivoSolicitud}
                  onChange={(e) => setMotivoSolicitud(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccione...</option>
                  {motivosSolicitud.map((motivo, i) => (
                    <option key={i} value={motivo}>
                      {motivo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
