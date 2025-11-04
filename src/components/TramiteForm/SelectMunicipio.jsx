import { useEffect, useState } from "react";


export default function SelectMunicipio({municipiosList, selectId}) {
 
  const [selected, setSelected] = useState("");

 


    const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value);
    const tipo = municipiosList.find((t) => t.id === Number(value));
     selectId(tipo.id)
    //console.log("%c✅ Municipio seleccionado:", "color: green;", tipo);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Municipio
      </label>
      <select
        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        value={selected}
        onChange={handleChange}
      >
        <option value="">Seleccione...</option>
        {municipiosList.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
