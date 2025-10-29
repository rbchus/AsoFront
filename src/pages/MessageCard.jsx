import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function MessageCard({ rta, onClose }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(rta);
    setLoading(false);
  }, [rta]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 overflow-y-auto max-h-[80vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-xl font-semibold text-gray-800">
            🕓 Respuesta del sistema
          </h3>
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800 font-semibold text-lg"
          >
            ✖
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-10">
            Cargando respuesta...
          </p>
        ) : (
          <div className="flex flex-col items-center gap-2 py-10">
            <div className="flex items-center gap-2">
              {rta.icono ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              <span
                className={`text-sm font-semibold ${
                  rta.icono ? "text-blue-700" : "text-red-500"
                }`}
              >
                {rta.msj}
              </span>
            </div>

            {rta.link && (
              <Link
                to={rta.link.url}
                className="text-sm font-medium text-blue-600 hover:underline mt-2 flex items-center gap-1"
              >
                {rta.link.text}
              </Link>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
