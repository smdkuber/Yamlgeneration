import axios from "axios";

const API_BASE_URL =
  "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiService = {
  get: (url, config = {}) => {
    return api.get(url, config);
  },
  post: (url, data, config = {}) => {
    return api.post(url, data, config);
  },
  put: (url, data, config = {}) => {
    return api.put(url, data, config);
  },
  delete: (url, config = {}) => {
    return api.delete(url, config);
  },
};

export default apiService;