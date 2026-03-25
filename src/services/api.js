import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; 

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const FleetCodeAPI = {
  login: async (username, password) => {
    const response = await apiClient.post('/auth/login', { username, password });
    return response.data; 
  },

  register: async (username, password) => {
    const response = await apiClient.post('/auth/register', { username, password });
    return response.data; 
  },
  verifyUser: async (username) => {
    const response = await apiClient.get(`/auth/verify/${username}`);
    return response.data; 
  },

  getDashboard: async (username) => {
    const response = await apiClient.get(`/dashboard/${username}`);
    return response.data; 
  },

  getLeaderboard: async () => {
    const response = await apiClient.get('/leaderboard');
    return response.data; 
  },

  getUserRadar: async (username) => {
    const response = await apiClient.get(`/radar/${username}`);
    return response.data; 
  },

  spotTeammate: async (rescuer, target, squadId) => {
    const response = await apiClient.post('/mechanics/spot', {
      rescuer_username: rescuer,
      target_username: target,
      squad_id: squadId,
    });
    return response.data;
  }
};