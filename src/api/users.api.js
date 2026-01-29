import axios from "./axios";

export const getUsersApi = () => {
  return axios.get("/admin/users");
};

export const deleteUserApi = (userId) => {
  return axios.delete(`/admin/users/${userId}`);
};
