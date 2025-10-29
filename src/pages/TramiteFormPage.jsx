import React, { useState, useEffect } from "react";
import TramiteSelector from "../components/TramiteForm/TramiteSelector";
import InmuebleForm from "../components/TramiteForm/InmuebleForm";
import TitularForm from "../components/TramiteForm/TitularForm";
import ArchivosUpload from "../components/TramiteForm/ArchivosUpload";

const TramiteFormPage = () => {
  const [tramite, setTramite] = useState(null);


   useEffect(() => {
      console.log(`... desde TramiteFormPage ${tramite}`)
    }, [tramite]);


  return (
    <div>
      <TramiteSelector onSelect={setTramite} />
 
     
    </div>
  );
};

export default TramiteFormPage;
