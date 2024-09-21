import { API_BASE_URL, ENDPOINTS } from './config';

export const login = async (emailOrUsername, password) => {
    try {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrUsername);

        const payload = isEmail 
            ? { email: emailOrUsername, password } 
            : { username: emailOrUsername, password };

        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error al iniciar sesión', error);
        throw error; 
    }
};


export const loginWithFaceRecognition = async (formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.LOGIN_FACE_RECOGNITION}`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al iniciar sesión con reconocimiento facial', error);
        throw error;
    }
};