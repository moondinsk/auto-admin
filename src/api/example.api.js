import axios from "./axios";

export const getProductsApi = (params) => {
  return axios.get("/products", { params });
};

export const createProductApi = (payload) => {
  return axios.post("/products", payload);
};

export const deleteProductApi = (id) => {
  return axios.delete(`/products/${id}`);
};
