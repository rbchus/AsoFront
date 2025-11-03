
import apiClient from './apiClient';

export const getTrazabilidadByTramite = async (id) => {
  try {
    const response = await apiClient.get(`/tramites/${id}/trazabilidad`);
   // console.log("✅ Endpoint:", `/tramites/${id}/trazabilidad`);
   //console.log("📦 Respuesta:=>", response.data);

    // Desestructura correctamente
    const { historial, tramiteId, totalRegistros } = response.data;

    if (!historial || historial.length === 0) {
      //console.warn(`⚠️ No hay trazabilidad disponible para el trámite ${id}`);
      return {
        success: false,
        message: "No hay registros disponibles !!!",
        data: [],
      };
    }

    return {
      success: true,
      message: "Consulta exitosa",
      tramiteId,
      totalRegistros,
      data: response.data, // ✅ Aquí devolvemos el historial como data
      statusCode: 200,
    };
  } catch (error) {
    console.error(`❌ Error al obtener trazabilidad del trámite ${id}:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al conectar con el servidor",
      statusCode: error.response?.status || 500,
      data: [],
    };
  }
};
