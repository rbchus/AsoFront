// src/services/uploadService.js
import apiClient from "./apiClient";

export const uploadFile = async (archivo, codigoAso) => {
  try {
    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("codigoAso", codigoAso);

    const response = await apiClient.post("/upload-files", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const { data, status, message } = response.data;

    return {
      success: status || true,
      message: message || "Archivo subido correctamente",
      data,
    };
  } catch (error) {
    console.error("❌ Error al subir archivo:", error);
    throw {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al conectar con el servidor durante la carga de archivos",
      statusCode: error.response?.status || 500,
    };
  }
};
