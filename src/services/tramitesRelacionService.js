// src/services/tramitesRelacionService.js
import apiClient from './apiClient';
import { formatTramites } from '../utils/formatTramites';

export const getTramitesRelacion = async () => {
  try {
    const response = await apiClient.get('/tramites_relacion');
    const { data, status, message } = response.data;

    if (!data || data.length === 0) {
      console.warn('⚠️ No hay trámites relación disponibles');
      return {
        success: false,
        message: 'No hay registros disponibles',
        data: [],
      };
    }

    const formatted = formatTramites(data);

    return {
      success: status,
      message: message || 'Consulta exitosa',
      data: formatted,
    };
  } catch (error) {
    console.error('❌ Error al obtener trámites relación:', error);
    throw {
      success: false,
      message:
        error.response?.data?.message ||
        'Error al conectar con el servidor',
      statusCode: error.response?.status || 500,
    };
  }
};
