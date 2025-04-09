import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Create a mock store since the actual store module is missing
const mockStore = {
  getState: () => ({
    auth: {
      token: null
    }
  }),
  dispatch: (action: any) => {}
};

// Use the mock store instead of the missing one
const store = mockStore;

// Mock logout function since the actual one is missing
const logout = () => ({ type: 'LOGOUT' });

const BASE_URL = 'https://api.yourdomain.com'; // Replace with your actual API URL

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle token expiration
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      store.dispatch(logout());
      // You might want to redirect to login here
      return Promise.reject(error);
    }

    // Handle other errors
    if (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
      error.message = error.response.data.message as string;
    }

    return Promise.reject(error);
  }
);

export default api; 