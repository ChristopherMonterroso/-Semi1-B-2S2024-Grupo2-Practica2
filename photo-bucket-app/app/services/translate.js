import { API_BASE_URL, ENDPOINTS } from './config';

export const translate = async (text) => {
    try {

        const req = {
            text: text
        }

        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.TRANSLATE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener traduccion', error);
        throw error;
    }
};