import { API_BASE_URL, ENDPOINTS } from './config';

export const GetAlbums = async (id) => {
    try {
        
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.USER}/${id}/albums`, {
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
        console.error('Error al obtener albums', error);
        throw error; 
    }
};
