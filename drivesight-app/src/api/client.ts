import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  signup: (email: string, password: string) =>
    api.post('/auth/signup', { email, password }),
  refreshToken: (token: string) =>
    api.post('/auth/refresh', { token }),
};

export const questionsAPI = {
  getByState: (state: string) =>
    api.get(`/questions/${state}`),
  getCategories: (state: string) =>
    api.get(`/questions/${state}/categories`),
  getByCategory: (state: string, category: string) =>
    api.get(`/questions/${state}/category/${category}`),
};

export const signAPI = {
  identify: (formData: FormData) =>
    api.post('/sign/identify', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: () => api.get('/signs'),
  getById: (id: string) => api.get(`/signs/${id}`),
  getByCategory: (category: string) =>
    api.get(`/signs/category/${category}`),
};

export const analyticsAPI = {
  submitPerformance: (data: any) =>
    api.post('/analytics/performance', data),
  getUserStats: () => api.get('/analytics/stats'),
};

export default api;
