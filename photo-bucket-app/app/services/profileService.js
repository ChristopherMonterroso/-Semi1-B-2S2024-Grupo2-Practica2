import { API_BASE_URL, ENDPOINTS } from './config';

export const updateUser = async (id, updatedUser) => {
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.UPDATE_USER}/${id}`, {
      method: 'PUT',
      body: updatedUser,
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error al actualizar usuario', error);
    throw error; 
  }
};
