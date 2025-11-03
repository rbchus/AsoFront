import { useEffect, useState } from "react";
import { getMunicipios } from "../../services/municipiosService";

export default function SelectMunicipio({selectId}) {
  const [municipios, setMunicipios] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
     const fetchMunicipios = async () => {
       const res = await getMunicipios();
       //console.log("%c🧑‍💼 Municipios:", "color: red;", res);
       setMunicipios(res.data);
     };
     fetchMunicipios();
   }, []);


    const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value);
    const tipo = municipios.find((t) => t.id === Number(value));
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
        {municipios.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
