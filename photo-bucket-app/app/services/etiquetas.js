import { API_BASE_URL, ENDPOINTS } from './config';

export const etiquetas = async (formData) => {
    try {
       


        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.ETIQUETAS}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener etiquetas', error);
        throw error;
    }
};