export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const ENDPOINTS = {
  REGISTER: '/users/register',
  LOGIN: '/auth/login',
  UPDATE_USER: '/users/profile',
  REMOVE: '/users/delete',
  USER: '/users',
  ALBUMS : '/albums',
  ETIQUETAS: '/get-labels',
  TRANSLATE: '/translate-text',
  RECOGNITION: '/users/facial-recognition/data',
  UPDATE_RECOGNITION: '/users/facial-recognition/update',
  LOGIN_FACE_RECOGNITION: '/users/facial-recognition/auth'
};
