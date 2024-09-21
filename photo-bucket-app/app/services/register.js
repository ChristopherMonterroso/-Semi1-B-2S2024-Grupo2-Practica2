import { API_BASE_URL, ENDPOINTS } from './config';

export const register = async (userName, email, password, profilePhoto) => {
  try {
    const formData = new FormData();
    formData.append('username', userName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('profile_image', profilePhoto);

    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.REGISTER}`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error al crear usuario', error);
    throw error; 
  }
};