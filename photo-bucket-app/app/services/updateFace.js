import { API_BASE_URL, ENDPOINTS } from './config';

export const updateFaceRecog = async (id, updatedFace) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.UPDATE_RECOGNITION}/${id}`, {
      method: 'PUT',
      body: updatedFace,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error al actualizar Face-recognition', error);
    throw error; 
  }
};
