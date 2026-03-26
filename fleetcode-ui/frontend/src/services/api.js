import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; 

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const FleetCodeAPI = {
  // --- AUTHENTICATION & HANDSHAKE ---
  login: async (username, password) => {
    const response = await apiClient.post('/auth/login', { username, password });
    return response.data; 
  },

  register: async (username, password, leetcodeUsername) => {
    // Included leetcodeUsername as per our Handshake Protocol requirements
    const response = await apiClient.post('/auth/register', { 
      username, 
      password, 
      leetcode_username: leetcodeUsername 
    });
    return response.data; 
  },

  verifyUser: async (username) => {
    console.log("Polling backend for verification status...");
    // This is the polling endpoint for the Handshake Radar screen
    const response = await apiClient.get(`/auth/verify/${username}`);
    return response.data; 
  },

  // --- DASHBOARD & STATS ---
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

  // --- SQUAD MANAGEMENT ---
  createSquad: async (fleetCodeId, squadName) => {
    const response = await apiClient.post('/squad/create', { 
      username: fleetCodeId, 
      squad_name: squadName 
    });
    return response.data;
  },

  joinSquad: async (fleetCodeId, squadId) => {
    // Note: squadId here could be the Name or the Unique ID depending on backend logic
    const response = await apiClient.post('/squad/join', { 
      username: fleetCodeId, 
      squad_id: squadId 
    });
    return response.data;
  },

leaveSquad: async (username) => {
    const response = await axios.post(`${API_URL}/squad/leave`, { username });
    return response.data;
  },

  // --- SOCIAL MECHANICS ---
  spotTeammate: async (rescuer, target, squadId) => {
    const response = await apiClient.post('/mechanics/spot', {
      rescuer_username: rescuer,
      target_username: target,
      squad_id: squadId,
    });
    return response.data;
  }
};