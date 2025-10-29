// src/services/tramitesRelacionService.js
import apiClient from './apiClient';


export const getTramites = async () => {
  try {
    const response = await apiClient.get('/tramites');
    const { data, status, message } = response.data;

    if (!data || data.length === 0) {
      console.warn('⚠️ No hay trámites disponibles');
      return {
        success: false,
        message: 'No hay registros disponibles',
        data: [],
      };
    }

    return {
      success: status,
      message: message || 'Consulta exitosa',
      data: data,
    };
  } catch (error) {
    console.error('❌ Error al obtener trámites:', error);
    throw {
      success: false,
      message:
        error.response?.data?.message ||
        'Error al conectar con el servidor',
      statusCode: error.response?.status || 500,
    };
  }
};


export const getTramiteById = async (id) => {
  try {
    const response = await apiClient.get(`/tramites/${id}`);
    const { data, status, message } = response.data;

    if (!data) {
      console.warn('⚠️ No hay trámites disponibles');
      return {
        success: false,
        message: 'No hay registros disponibles',
        data: [],
      };
    }

    return {
      success: status,
      message: message || 'Consulta exitosa',
      data: data,
    };
  } catch (error) {
    console.error('❌ Error al obtener trámites:', error);
    throw {
      success: false,
      message:
        error.response?.data?.message ||
        'Error al conectar con el servidor',
      statusCode: error.response?.status || 500,
    };
  }
};


// 🟩 Crear un nuevo trámite
export const createTramite = async (tramiteData) => {
  try {
    const response = await apiClient.post("/tramites", tramiteData);
    console.log("✅ Trámite creado:", response.data);

    return {
      success: true,
      message: "Trámite creado exitosamente",
      data: response.data,
    };
  } catch (error) {
    console.error("❌ Error al crear trámite:", error);
    throw {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al crear el trámite",
      statusCode: error.response?.status || 500,
    };
  }
};


export const getGestores = async () => {
  try {
    const response = await apiClient.get('/usuarios/gestores');
    const { data, status, message } = response.data;

    if (!data || data.length === 0) {
      console.warn('⚠️ No hay trámites disponibles');
      return {
        success: false,
        message: 'No hay registros disponibles',
        data: [],
      };
    }

    return {
      success: status,
      message: message || 'Consulta exitosa',
      data: data,
    };
  } catch (error) {
    console.error('❌ Error al obtener trámites:', error);
    throw {
      success: false,
      message:
        error.response?.data?.message ||
        'Error al conectar con el servidor',
      statusCode: error.response?.status || 500,
    };
  }
};



export const actualizarEstadoTramite = async (id, tramiteData) => {
  try {
    const response = await apiClient.put(`/tramites/${id}/estado`, tramiteData);
    console.log("✅ Trámite actualizado", response.data);

    return {
      success: true,
      message: "Trámite actializadpo exitosamente",
      data: response.data,
    };
  } catch (error) {
    console.error("❌ Error al actualizar  trámite:", error);
    throw {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al actializar  el trámite",
      statusCode: error.response?.status || 500,
    };
  }
};