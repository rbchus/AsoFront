import React, { useState } from "react";
import "../../components/dashboard.css";


const ArchivosUpload = () => {
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    setFiles([...e.target.files]);
  };

  return (
    <div className="card">
      <h3>Adjuntar Archivos</h3>

      <div className="file-zone">
        <input type="file" multiple onChange={handleChange} />
        <p>Arrastra o selecciona tus archivos aquí</p>
      </div>

      <ul className="file-list">
        {files.map((f, i) => (
          <li key={i} className="file-item">
            📄 {f.name}
          </li>
        ))}
      </ul>

      <button type="button">Guardar Archivos</button>
    </div>
  );
};

export default ArchivosUpload;
