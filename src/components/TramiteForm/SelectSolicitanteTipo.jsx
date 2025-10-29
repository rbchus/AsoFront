// src/components/TramiteForm/SelectSolicitanteTipo.jsx
import { useEffect, useState } from "react";
import { getSolicitantesTipos } from "../../services/solicitantesTiposService";

export default function SelectSolicitanteTipo({ onSelect }) {
  const [tipos, setTipos] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const fetchTipos = async () => {
      const res = await getSolicitantesTipos();
      //console.log("%c🧑‍💼 Tipos de solicitante:", "color: teal;", res);
      setTipos(res.data);
    };
    fetchTipos();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value);
    const tipo = tipos.find((t) => t.id === Number(value));
    onSelect(tipo.id);
    //console.log("%c✅ Solicitante tipo seleccionado:", "color: red;", tipo);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tipo de solicitante
      </label>
      <select
        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        value={selected}
        onChange={handleChange}
      >
        <option value="">Seleccione...</option>
        {tipos.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
