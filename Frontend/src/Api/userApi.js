import api from "./axiosConfig";

export const loginUser = async (payload) => {
  const response = await api.post("/users/login", payload);
  return response.data;
};

export const registerUser = async (payload) => {
  const response = await api.post("/users/register", payload);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const updateUser = async (id, payload) => {
  const response = await api.put(`/users/${id}`, payload);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
