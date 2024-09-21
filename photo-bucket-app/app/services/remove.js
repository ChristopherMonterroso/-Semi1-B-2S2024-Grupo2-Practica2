import { API_BASE_URL, ENDPOINTS } from './config';

export const remove = async (id, password) => {
    try {
        const payload = {
            password
        }
        
        console.log('Payload:', payload);

        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.REMOVE}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error al eliminar cuenta', error);
        throw error; 
    }
};
