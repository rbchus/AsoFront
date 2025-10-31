// src/services/tramitesRelacionService.js
import apiClient from './apiClient';


export const getUsuarios = async () => {
  try {
    const response = await apiClient.get('/usuarios');
    const { data, status, message } = response.data;

    if (!data || data.length === 0) {
      console.warn('⚠️ No hay usuarios disponibles');
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
    console.error('❌ Error al obtener usuarios:', error);
    throw {
      success: false,
      message:
        error.response?.data?.message ||
        'Error al conectar con el servidor',
      statusCode: error.response?.status || 500,
    };
  }
};



export const actualizarRolUsuario = async (id, payload) => {
     try {
    const response = await apiClient.put(`/usuarios/${id}/`, payload);
    console.log("✅ Estado actualizado", response.data);

    return {
      success: true,
      message: "Estado actializadpo exitosamente",
      data: response.data,
    };
  } catch (error) {
    console.error("❌ Error al actualizar  Estado:", error);
    throw {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al actializar  el Estado",
      statusCode: error.response?.status || 500,
    };
  }
    
};
