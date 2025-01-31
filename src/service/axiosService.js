import axios from "axios";

const axiosServices = axios.create({
  baseURL: "http://localhost:8000/",
});

// Request interceptor to attach token
axiosServices.interceptors.request.use(
  async (config) => {
    const session = localStorage.getItem("token");

    if (session) {
      config.headers.Authorization = `Bearer ${session}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosServices;
