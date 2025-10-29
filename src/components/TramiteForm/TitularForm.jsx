import { useState } from "react";
import { UserPlus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function TitularForm({ titulares, setTitulares }) {
  const [expanded, setExpanded] = useState(true);
  const [nuevoTitular, setNuevoTitular] = useState({
    tipoDocumento: "",
    numeroDocumento: "",
    nombre: "",
    apellido: "",
  });

  const agregarTitular = () => {
    if (
      !nuevoTitular.tipoDocumento ||
      !nuevoTitular.numeroDocumento ||
      !nuevoTitular.nombre ||
      !nuevoTitular.apellido
    ) {
      alert("⚠️ Complete todos los campos antes de agregar.");
      return;
    }

    setTitulares([...titulares, nuevoTitular]);
    setNuevoTitular({
      tipoDocumento: "",
      numeroDocumento: "",
      nombre: "",
      apellido: "",
    });
  };

  const eliminarTitular = (index) =>
    setTitulares(titulares.filter((_, i) => i !== index));

  return (
    <div className="border rounded-2xl mb-6 shadow-sm overflow-hidden bg-white">
      {/* Encabezado con azul suave */}
      <div
        className="flex justify-between items-center bg-blue-50 border-b border-blue-200 px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 text-blue-700 font-semibold">
          <UserPlus className="w-5 h-5 text-blue-600" />
          <span>Información del Titular</span>
        </div>
        <button className="text-blue-600 hover:text-blue-800 transition">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Contenido desplegable */}
      {expanded && (
        <div className="p-6 bg-gray-50 transition-all duration-300">
          {/* Campos del formulario */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de documento
              </label>
              <select
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                value={nuevoTitular.tipoDocumento}
                onChange={(e) =>
                  setNuevoTitular({
                    ...nuevoTitular,
                    tipoDocumento: e.target.value,
                  })
                }
              >
                <option value="">Seleccione...</option>
                {["CC", "TI", "PA", "NIT", "RC"].map((doc) => (
                  <option key={doc} value={doc}>
                    {doc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de documento
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                value={nuevoTitular.numeroDocumento}
                onChange={(e) =>
                  setNuevoTitular({
                    ...nuevoTitular,
                    numeroDocumento: e.target.value,
                  })
                }
                placeholder="Ej. 123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                value={nuevoTitular.nombre}
                onChange={(e) =>
                  setNuevoTitular({ ...nuevoTitular, nombre: e.target.value })
                }
                placeholder="Ej. Juan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                value={nuevoTitular.apellido}
                onChange={(e) =>
                  setNuevoTitular({ ...nuevoTitular, apellido: e.target.value })
                }
                placeholder="Ej. Pérez"
              />
            </div>
          </div>

          {/* Botón agregar */}
          <button
            onClick={agregarTitular}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Agregar titular
          </button>

          {/* Lista de titulares agregados */}
          {titulares.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-md font-semibold text-gray-700 mb-3">
                Titulares agregados:
              </h3>
              <ul className="space-y-2">
                {titulares.map((t, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm"
                  >
                    <div>
                      <span className="font-medium text-gray-800">
                        {t.nombre} {t.apellido}
                      </span>
                      <span className="text-sm text-gray-600 ml-2">
                        ({t.tipoDocumento} {t.numeroDocumento})
                      </span>
                    </div>
                    <button
                      onClick={() => eliminarTitular(i)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
