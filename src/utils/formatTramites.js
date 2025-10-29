// src/utils/formatTramites.js

export const formatTramites = (data) => {
  const grouped = {};

  data.forEach((item) => {
    const tramiteId = item.tramiteTipo.id;
    const tramiteNombre = item.tramiteTipo.nombre;
    const solicitudId = item.solicitudTipo.id;
    const solicitudNombre = item.solicitudTipo.nombre;
    const relacionId = item.id;

    // Si no existe el grupo para ese tramiteTipo, lo creamos
    if (!grouped[tramiteId]) {
      grouped[tramiteId] = {
        id: tramiteId,
        nombre: tramiteNombre,
        subtramites: [],
      };
    }

    // Agregamos el subtrámite si no existe
    if (!grouped[tramiteId].subtramites.some((s) => s.id === solicitudId)) {
      grouped[tramiteId].subtramites.push({
        id: solicitudId,
        nombre: solicitudNombre,
        relacionId, // opcional: puedes usarlo si necesitas la relación directa
      });
    }
  });

  // Convertimos el objeto en array
  return Object.values(grouped);
};
