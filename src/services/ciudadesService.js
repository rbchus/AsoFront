// src/services/solicitantesTiposService.js
import apiClient from './apiClient';

export const getCiudades = async () => {
  try {
    const response = await apiClient.get('/ciudades');
    const { data, status, message } = response.data;

    if (!data || data.length === 0) {
      console.warn('⚠️ No hay ciudades disponibles');
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
    console.error('❌ Error al obtener ciudades:', error);
    throw {
      success: false,
      message:
        error.response?.data?.message ||
        'Error al conectar con el servidor',
      statusCode: error.response?.status || 500,
    };
  }
};
