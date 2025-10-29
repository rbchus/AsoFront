import { useState } from "react";
import { FilePlus2, ChevronUp, ChevronDown } from "lucide-react";

export default function FileUploader({ archivos, setArchivos }) {
  const [files, setFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  const handleFileChange = (e) => {
    const nuevos = Array.from(e.target.files);
    setArchivos([...archivos, ...nuevos]);
  };

  return (
    <div className="border rounded-2xl mb-6 shadow-sm overflow-hidden bg-white">
      {/* Encabezado azul con icono y botón desplegable */}
      <div
        className="flex justify-between items-center bg-blue-50 border-b border-blue-200 px-4 py-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-blue-700 font-semibold">
          <FilePlus2 className="w-5 h-5 text-blue-600" />
          <span>  Adjuntar archivos</span>
        </div>
        <button className="text-blue-600 hover:text-blue-800 transition">
          {isOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Contenido desplegable */}
      {isOpen && (
        <div className="p-6 bg-gray-50 transition-all duration-300 space-y-6">
         {/*  <label className="block text-sm font-medium text-gray-700 mb-1">
            Adjuntar archivos
          </label> */}

          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition">
            <div className="flex flex-col items-center justify-center pt-7">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4m-4 12a9 9 0 100-18 9 9 0 000 18z"
                />
              </svg>
              <p className="text-sm text-gray-500 mt-2">
                Haz clic o arrastra archivos
              </p>
            </div>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {archivos.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-gray-600">
              {archivos.map((a, i) => (
                <li key={i}>📄 {a.name}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
