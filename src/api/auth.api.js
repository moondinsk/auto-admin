import axios from "./axios";

// 로그인 API
export const loginApi = (payload) => {
  return axios.post("/auth/login", payload);
};
