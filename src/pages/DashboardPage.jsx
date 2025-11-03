import { motion } from "framer-motion";
import { Building2, FileText, Users, MapPin } from "lucide-react";

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
        className="max-w-4xl text-center mb-12"
      >
        <p className="text-gray-700 leading-relaxed text-lg">
          Bienvenido al sistema de información diseñado para optimizar la gestión de trámites 
          catastrales en los municipios del Catatumbo. Desde esta plataforma podrás 
          consultar, registrar y hacer seguimiento de los procesos de manera ágil, 
          segura y transparente.
        </p>
      </motion.div>

      {/* Tarjetas de funcionalidades */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="grid md:grid-cols-4 sm:grid-cols-2 gap-6 max-w-5xl"
      >
        {[
          {
            icon: <FileText className="w-10 h-10 text-green-600" />,
            title: "Gestión de Trámites",
            desc: "Crea, revisa y actualiza los trámites de manera sencilla y centralizada.",
          },
          {
            icon: <Users className="w-10 h-10 text-green-600" />,
            title: "Asignación de Gestores",
            desc: "Asigna gestores responsables para cada solicitud y controla el flujo de trabajo.",
          },
          {
            icon: <MapPin className="w-10 h-10 text-green-600" />,
            title: "Trazabilidad Geográfica",
            desc: "Monitorea la ubicación y estado de cada trámite asociado a inmuebles.",
          },
          {
            icon: <Building2 className="w-10 h-10 text-green-600" />,
            title: "Interoperabilidad Municipal",
            desc: "Conecta los municipios del Catatumbo bajo una misma plataforma.",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-center"
          >
            <div className="flex justify-center mb-4">{card.icon}</div>
            <h3 className="font-semibold text-lg mb-2 text-green-700">{card.title}</h3>
            <p className="text-sm text-gray-600">{card.desc}</p>
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
