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
   // console.log("✅ Trámite creado:", response.data);

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
   // console.log("✅ Trámite actualizado", response.data);

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

// insertar documentos tramite

export const insertarDocumentosTramite = async (id, documentosData) => {
  try {
    const response = await apiClient.post(`/documentos/${id}`, documentosData);
   // console.log(`✅ docuentos agragados a ${id}: `, response.data);

    return {
      success: true,
      message: "Documentos Agregados exitosamente",
      data: response.data,
    };
  } catch (error) {
    console.error("❌ Error al agregar documento:", error);
    throw {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al agregar  documentos",
      statusCode: error.response?.status || 500,
    };
  }
};

// 🟣 Subir archivos del trámite
export const uploadTramiteFiles = async (codigo, archivos) => {
  try {
    const formData = new FormData();
    archivos.forEach((file) => formData.append("archivos", file));

    const { data } = await apiClient.post(`/tramites/${codigo}/archivos`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    console.error("❌ Error al subir archivos:", error);
    throw error.response?.data || { success: false, message: "Error al subir archivos" };
  }
};

export const actualizarGestorMunicipios = async (id, tramiteData) => {
  try {
    const response = await apiClient.patch(`/tramites/asignar-por-municipio/${id}`, tramiteData);
   // console.log("✅ Trámite actualizado", response.data);

    return {
      success: true,
      message: "✅ Trámites asignados  exitosamente",
      data: response.data,
    };
  } catch (error) {
    console.error("❌ Error al asignar   trámites:", error);
    throw {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al asignar  trámites",
      statusCode: error.response?.status || 500,
    };
  }
};


export const actualizarGestorMunicipio = async (id, tramiteData) => {
  try {
    const response = await apiClient.put(`/municipios/${id}`, tramiteData);
   // console.log("✅ Trámite actualizado", response.data);

    return {
      success: true,
      message: "✅ Municipio Asigando correctamente",
      data: response.data,
    };
  } catch (error) {
    console.error("❌ Error al asignar   municiopio:", error);
    throw {
      success: false,
      message:  
        error.response?.data?.message ||
        "Error al asignar  municipio",
      statusCode: error.response?.status || 500,
    };
  }
};

export const actualizarInmuebleTramite = async (id, inmuebleData) => {
  try {
    const response = await apiClient.put(`/inmuebles/${id}`, inmuebleData);
   // console.log("✅ Trámite actualizado", response.data);

    return {
      success: true,
      message: "✅ Inmueble  Editado correctamente",
      data: response.data,
    };
  } catch (error) {
    console.error("❌ Error al editar  Inmueble:", error);
    throw {
      success: false,
      message:  
        error.response?.data?.message ||
        "Error al editar  inmueble",
      statusCode: error.response?.status || 500,
    };
  }
};


