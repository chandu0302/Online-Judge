import axios from "axios";

const normalizeBaseUrl = (configuredBaseUrl) => {
  if (!configuredBaseUrl) {
    return "";
  }

  const trimmedBaseUrl = configuredBaseUrl.trim().replace(/\/+$/, "");

  if (!trimmedBaseUrl) {
    return "";
  }

  if (trimmedBaseUrl === "/api") {
    return "";
  }

  if (trimmedBaseUrl.endsWith("/api")) {
    return trimmedBaseUrl.slice(0, -4);
  }

  return trimmedBaseUrl;
};

const apiClient = axios.create({
  baseURL: normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    return Promise.reject(error);
  },
);

export default apiClient;
