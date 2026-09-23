import axios from "axios";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://my-market-backend.liara.run/api";

const cleanBaseUrl = rawBaseUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

const axiosInstance = axios.create({
  baseURL: `${cleanBaseUrl}/api`,
});

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});


export default axiosInstance;