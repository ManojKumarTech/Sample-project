import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const api = {
  // Organizations
  discoverOrganization: async (name) => {
    const response = await apiClient.post('/organizations/discover', { name });
    return response.data;
  },

  listOrganizations: async (skip = 0, limit = 50) => {
    const response = await apiClient.get('/organizations', { params: { skip, limit } });
    return response.data;
  },

  getOrganization: async (id) => {
    const response = await apiClient.get(`/organizations/${id}`);
    return response.data;
  },

  getOrganizationApps: async (id) => {
    const response = await apiClient.get(`/organizations/${id}/apps`);
    return response.data;
  },

  getOrganizationDashboard: async (id) => {
    const response = await apiClient.get(`/organizations/${id}/dashboard`);
    return response.data;
  },

  // Applications
  getApp: async (appId) => {
    const response = await apiClient.get(`/apps/${appId}`);
    return response.data;
  },

  syncApp: async (appId, limit = 50) => {
    const response = await apiClient.post(`/apps/${appId}/sync`, null, { params: { limit } });
    return response.data;
  },

  getSentiment: async (appId) => {
    const response = await apiClient.get(`/apps/${appId}/sentiment`);
    return response.data;
  },

  getThemes: async (appId) => {
    const response = await apiClient.get(`/apps/${appId}/themes`);
    return response.data;
  },

  getTrends: async (appId) => {
    const response = await apiClient.get(`/apps/${appId}/trends`);
    return response.data;
  },

  // Reviews
  getReviews: async (appId, { page = 1, page_size = 20, sentiment = null, min_rating = null, max_rating = null } = {}) => {
    const params = { page, page_size };
    if (sentiment) params.sentiment = sentiment;
    if (min_rating) params.min_rating = min_rating;
    if (max_rating) params.max_rating = max_rating;

    const response = await apiClient.get(`/apps/${appId}/reviews`, { params });
    return response.data;
  },
};

export default api;
