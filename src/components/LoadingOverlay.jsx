import React from "react";

export default function LoadingOverlay({ text = "Cargando..." }) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Spinner circular */}
        <div className="relative w-20 h-20">
          <svg
            className="absolute inset-0 w-full h-full animate-spin text-blue-600"
            viewBox="0 0 50 50"
          >
            <circle
              cx="25"
              cy="25"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="90 150"
              fill="none"
            />
          </svg>
          <svg
            className="absolute inset-0 w-full h-full text-gray-300"
            viewBox="0 0 50 50"
          >
            <circle
              cx="25"
              cy="25"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
          </svg>
        </div>

        {/* Texto */}
        <span className="text-white text-base font-medium drop-shadow-md">
          {text}
        </span>
      </div>
    </div>
  );
}
