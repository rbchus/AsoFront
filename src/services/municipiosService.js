// src/services/solicitantesTiposService.js
import apiClient from './apiClient';

export const getMunicipios= async () => {
  try {
    const response = await apiClient.get('/municipios');
    const { data, status, message } = response.data;

    if (!data || data.length === 0) {
      console.warn('⚠️ No hay municipios disponibles');
      return {
        success: false,
        message: 'No hay registros disponibles',
        data: [],
      };
    }

    return {
      success: status,
      message: message || 'Consulta exitosa',
      data,
    };
  } catch (error) {
    console.error('❌ Error al obtener municipios:', error);
    throw {
      success: false,
      message:
        error.response?.data?.message ||
        'Error al conectar con el servidor',
      statusCode: error.response?.status || 500,
    };
  }
};
