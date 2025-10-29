// src/services/solicitantesTiposService.js
import apiClient from './apiClient';

export const getSolicitantesTipos = async () => {
  try {
    const response = await apiClient.get('/solicitantes_tipos');
    const { data, status, message } = response.data;

    if (!data || data.length === 0) {
      console.warn('⚠️ No hay tipos de solicitantes disponibles');
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
    console.error('❌ Error al obtener tipos de solicitantes:', error);
    throw {
      success: false,
      message:
        error.response?.data?.message ||
        'Error al conectar con el servidor',
      statusCode: error.response?.status || 500,
    };
  }
};
