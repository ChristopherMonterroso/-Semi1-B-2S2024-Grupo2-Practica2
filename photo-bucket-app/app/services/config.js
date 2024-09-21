export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const ENDPOINTS = {
  REGISTER: '/users/register',
  LOGIN: '/auth/login',
  UPDATE_USER: '/users/profile',
  REMOVE: '/users/delete',
  USER: '/users',
  ALBUMS : '/albums',
  ETIQUETAS: '/get-labels',
  LOGIN_FACE_RECOGNITION: '/users/facial-recognition/auth'
};
