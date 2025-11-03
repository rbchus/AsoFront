import React from "react";
import centro from "/centro.svg";
import circular from "/circular.svg";

export default function LoadingOverlay({ text = "Cargando..." }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="relative w-32 h-32">
          {/* SVG del centro */}
          <img
            src={centro}
            alt="Centro"
            className="absolute inset-0 w-20 h-20 m-auto z-10"
          />
          {/* SVG circular giratorio */}
          <img
            src={circular}
            alt="Circular"
            className="absolute inset-0 w-full h-full animate-spin-slow"
          />
        </div>

        {/* Texto */}
        <span className="text-white text-base font-medium drop-shadow-md">
          {text}
        </span>
      </div>
    </div>
  );
}
