import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // or your deployed backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
