import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// API Services
export const authService = {
  // New signin endpoint
  signin: async (username: string, password: string) => {
    const response = await api.post('/accounts/signin/', { username, password });
    return response.data;
  },
  // New signup endpoint
  signup: async (userData: any) => {
    const response = await api.post('/accounts/signup/', userData);
    return response.data;
  },
  // Legacy login endpoint (JWT token)
  login: async (username: string, password: string) => {
    const response = await api.post('/token/', { username, password });
    return response.data;
  },
  // Legacy register endpoint
  register: async (userData: any) => {
    const response = await api.post('/accounts/users/register/', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/accounts/users/me/');
    return response.data;
  },
};

export const destinationService = {
  getAll: async () => {
    const response = await api.get('/trip-assistant/destinations/');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/trip-assistant/destinations/${id}/`);
    return response.data;
  },
};

export const serviceService = {
  getAll: async (params?: any) => {
    const response = await api.get('/trip-assistant/services/', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/trip-assistant/services/${id}/`);
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get('/trip-assistant/categories/');
    return response.data;
  },
};

export const bookingService = {
  create: async (bookingData: any) => {
    const response = await api.post('/trip-assistant/bookings/', bookingData);
    return response.data;
  },
  getMyBookings: async () => {
    const response = await api.get('/trip-assistant/bookings/');
    return response.data;
  },
};

export const communityService = {
  getPosts: async () => {
    const response = await api.get('/community/posts/');
    return response.data;
  },
  getEvents: async () => {
    const response = await api.get('/community/events/');
    return response.data;
  },
  getMerchandise: async () => {
    const response = await api.get('/community/merchandise/');
    return response.data;
  },
  likePost: async (postId: number) => {
    const response = await api.post(`/community/posts/${postId}/like/`);
    return response.data;
  },
  registerForEvent: async (eventId: number) => {
    const response = await api.post(`/community/events/${eventId}/register/`);
    return response.data;
  },
};

export const businessService = {
  applyForPartnership: async (applicationData: any) => {
    const response = await api.post('/business/applications/', applicationData);
    return response.data;
  },
  getPartnerships: async () => {
    const response = await api.get('/business/partnerships/');
    return response.data;
  },
  getSponsoredContent: async () => {
    const response = await api.get('/business/sponsored/');
    return response.data;
  },
};
