import { useEffect, useState } from "react";
import { getCiudades } from "../../services/ciudadesService";

export default function SelectCiudad({selectId}) {
  const [ciudades, setCiudades] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
     const fetchMunicipios = async () => {
       const res = await getCiudades();
       console.log("%c🧑‍💼 Ciudades:", "color: gray;", res);
       setCiudades(res.data);
     };
     fetchMunicipios();
   }, []);


    const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value);
    const tipo = ciudades.find((t) => t.id === Number(value));
    selectId(tipo.id)
    //console.log("%c✅ Ciudad seleccionado:", "color: red;", tipo);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Ciudad
      </label>
      <select
        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
        value={selected}
        onChange={handleChange}
      >
        <option value="">Seleccione...</option>
        {ciudades.map((t) => (
          <option key={t.id} value={t.id}>
            {t.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
