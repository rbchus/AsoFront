import { useEffect, useState } from "react";
import { getTramites } from "../../services/tramitesService";
export default function TramiteContenedor() {
 const [tramites, setTramites] = useState([]);
useEffect(() => {
    const fetchData = async () => {
      const res = await getTramites();
      setTramites(res.data);
    };
    fetchData();
  }, []);

useEffect(() => {
   // console.log(tramites)
  }, [tramites]);

return (
    <> Hola soy tramites</>
  );
}
