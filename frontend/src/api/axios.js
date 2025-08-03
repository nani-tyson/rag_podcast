import axios from 'axios';

const api = axios.create({
  baseURL: 'https://rag-podcast.onrender.com', // or your deployed backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
