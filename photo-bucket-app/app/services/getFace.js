import { API_BASE_URL, ENDPOINTS } from './config';

export const GetRecognition = async (id) => {
    try {
        
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.RECOGNITION}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error al obtener imafen de cara', error);
        throw error; 
    }
};