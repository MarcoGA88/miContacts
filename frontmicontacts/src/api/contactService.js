import axios from 'axios';

// Base URL actualizada
const BASE_URL = 'http://localhost:5000/api/contacts';

export const getContacts = async () => {
  const response = await axios.get(`${BASE_URL}`);  // El backend ya filtra por isintrash
  return response.data;
};

export const createContact = async (contactData) => {
  try {
    // Filtrar números de teléfono vacíos y asegurarse de que `phone` sea un array
    const validPhones = contactData.phone.filter(p => p && p.trim());

    // Verificar que el teléfono esté en formato array
    if (validPhones.length === 0) {
      throw new Error('Se requiere al menos un número de teléfono válido');
    }

    const dataToSend = {
      ...contactData,
      phone: validPhones  // Asegurarse de que `phone` sea un array
    };

    const response = await axios.post(BASE_URL, dataToSend);
    return response.data;
  } catch (error) {
    console.error('Error en createContact:', error);
    if (error.response) {
      throw new Error(error.response.data.message || 'Error al crear el contacto');
    }
    throw error;
  }
};

export const getContactById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    const data = response.data;

    // Si phone es un array con un solo valor, devuélvelo como string
    if (Array.isArray(data.phone) && data.phone.length === 1) {
      data.phone = data.phone[0];
    }

    return data;
  } catch (error) {
    console.error('Error fetching contact:', error);
    throw error;
  }
};

export const updateContact = async (id, contactData) => {
  try {
    // Verificar que phone esté definido y sea un array, luego filtrar los números vacíos
    const validPhones = Array.isArray(contactData.phone) ? 
      contactData.phone.filter(p => p && p.trim()) : [];

    if (validPhones.length === 0) {
      throw new Error('Se requiere al menos un número de teléfono válido');
    }

    // Preparar los datos para enviar al backend
    const dataToSend = {
      ...contactData,
      phone: validPhones,  // Asegurarse de que `phone` sea un array válido
    };

    // Enviar la solicitud PUT al backend para actualizar el contacto
    const response = await axios.put(`${BASE_URL}/${id}`, dataToSend);  // Aquí ya incluye el /api

    return response.data;  // Retorna la respuesta de la actualización
  } catch (error) {
    console.error('Error en updateContact:', error);
    if (error.response) {
      // Verifica si la respuesta contiene un mensaje de error
      throw new Error(error.response.data.message || 'Error al actualizar el contacto');
    } else {
      // En caso de otros tipos de errores (como problemas de red)
      throw new Error('Error desconocido al actualizar el contacto');
    }
  }
};

export const moveContactToTrash = async (id) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}/trash`);  // Correct URL
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('No se pudo mover el contacto a la papelera');
    }
  } catch (error) {
    console.error('Error al mover el contacto a la papelera:', error.response ? error.response.data : error.message);
    throw new Error('Error al mover el contacto a la papelera');
  }
};

export const restoreFromTrash = async (id) => {
  try {
    const response = await axios.post(`${BASE_URL}/${id}/restore`);  // Correct URL
    return response.data;
  } catch (error) {
    console.error('Error al restaurar el contacto:', error);
    throw new Error('Error al restaurar el contacto desde la papelera');
  }
};

export const getTrashedContacts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trash/all`);  // Correct URL
    return response.data;
  } catch (error) {
    console.error('Error al obtener contactos de la papelera:', error);
    throw new Error('Error al obtener los contactos en la papelera');
  }
};

export const deleteContactPermanently = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);  // Correct URL
    return response.data;
  } catch (error) {
    console.error('Error al eliminar contacto permanentemente:', error);
    throw new Error('Error al eliminar contacto permanentemente');
  }
};


// Endpoint para marcar/desmarcar como favorito
export const toggleFavorite = async (id) => {
  const response = await axios.put(`${BASE_URL}/${id}/favorite`);
  return response.data;
};


// Función para obtener los contactos filtrados por nombre, teléfono o correo
export const getContactsByQuery = async (query) => {
  const response = await axios.get(`${BASE_URL}?search=${query}`);  // Se agrega un parámetro de búsqueda genérico
  return response.data;
};

export const getRecentContacts = async () => {
  const response = await axios.get(`${BASE_URL}/recent/all`);  // Aquí ya incluye el /api
  return response.data;
};


export const markFavorite = async (id) => {
  const response = await axios.put(`${BASE_URL}/${id}/favorite/mark`);
  return response.data;
};

export const unmarkFavorite = async (id) => {
  const response = await axios.put(`${BASE_URL}/${id}/favorite/unmark`);
  return response.data;
};