import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuthStore } from '@/store/authStore';

const COOKIE_KEY = 'eds_token';

export function setToken(token: string) {
  Cookies.set(COOKIE_KEY, token, { secure: true, sameSite: 'strict' });
}

export function removeToken() {
  Cookies.remove(COOKIE_KEY);
}

export function getToken(): string | undefined {
  return Cookies.get(COOKIE_KEY);
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token ?? getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — clear auth and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
  me: () => api.get('/auth/me'),
};

export const expensesApi = {
  list: () => api.get('/expenses'),
  create: (data: { description: string; amount: number; date: string }) =>
    api.post('/expenses', data),
  remove: (id: string) => api.delete(`/expenses/${id}`),
  importCsv: (formData: FormData) =>
    api.post('/expenses/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const reportsApi = {
  get: (year: number, month: number) =>
    api.get(`/reports/${year}/${month}`),
  generate: (year: number, month: number) =>
    api.post(`/reports/${year}/${month}/generate`),
};

export const chatApi = {
  ask: (message: string) => api.post('/chat', { message }),
};

export default api;
