import axios from "axios";
import { router } from "@/routes/router";
import { SEGMENT } from "@/routes/paths";
import { getStore } from "@/store";

const { userStore } = getStore();

// Axios 인스턴스 생성
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 설정
instance.interceptors.request.use(
  (config) => {
    const token = userStore.user?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터 설정
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      userStore.logout();
      router.navigate(`/${SEGMENT.LOGIN}`, { replace: true });
    }

    return Promise.reject(error);
  },
);

export default instance;
