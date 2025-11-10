import { motion } from "framer-motion";
import { FileText, PlusCircle, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col items-center justify-center text-gray-800 px-6 py-12">
      {/* Header institucional */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <img
          src="/asomunicipios.svg"
          alt="Logo Asociación de Municipios del Catatumbo"
          className="w-32 h-32 mx-auto mb-4 rounded-full shadow-md"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-2">
          Sistema de Trámites Catastrales
        </h1>
        <p className="text-lg text-gray-600">
          Asociación de Municipios del Catatumbo – Plataforma de gestión y seguimiento
        </p>
      </motion.div>

      {/* Sección informativa */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="max-w-3xl text-center mb-12"
      >
        <p className="text-gray-700 leading-relaxed text-lg">
          Bienvenido al sistema de información diseñado para optimizar la gestión de trámites 
          catastrales en los municipios del Catatumbo. Desde aquí puedes acceder rápidamente 
          a tus trámites, crear nuevas solicitudes y actualizar tu información personal.
        </p>
      </motion.div>

      {/* Tarjetas principales */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 max-w-4xl"
      >
        {[
          {
            icon: <FileText className="w-10 h-10 text-green-600" />,
            title: "Mis Trámites",
            desc: "Consulta y gestiona tus trámites registrados de forma sencilla.",
            path: "/dashboard/tramites",
          },
          {
            icon: <PlusCircle className="w-10 h-10 text-green-600" />,
            title: "Nuevo Trámite",
            desc: "Registra un nuevo trámite catastral y sigue su proceso.",
            path: "/dashboard/tramites/nuevo",
          },
          {
            icon: <User className="w-10 h-10 text-green-600" />,
            title: "Mi Perfil",
            desc: "Consulta y actualiza tu información personal y de contacto.",
            path: "/dashboard/perfil",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-center"
          >
            <Link to={card.path} className="block focus:outline-none">
              <div className="flex justify-center mb-4">{card.icon}</div>
              <h3 className="font-semibold text-lg mb-2 text-green-700">{card.title}</h3>
              <p className="text-sm text-gray-600">{card.desc}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-16 text-center text-sm text-gray-500"
      >
        © {new Date().getFullYear()} Asociación de Municipios del Catatumbo — 
        <span className="text-green-600 font-semibold"> Todos los derechos reservados</span>.
      </motion.footer>
    </section>
  );
}
