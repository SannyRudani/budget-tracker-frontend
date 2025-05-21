import axios from "axios";
import toast from "react-hot-toast";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // your backend base url
});

// Add auth token interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // assuming JWT stored here
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error("Unauthorized. Please login again.");
      // Optional: redirect to login page
    } else {
      toast.error(error.response?.data?.message || "API Error");
    }
    return Promise.reject(error);
  }
);

export default instance;
