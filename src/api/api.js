import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5086/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("booktales_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;

    if (
      error.response?.status === 401 &&
      message === "Your account has been blocked."
    ) {
      localStorage.removeItem("booktales_token");
      localStorage.removeItem("booktales_user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;