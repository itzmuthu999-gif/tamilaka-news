import api from "./axiosConfig";

export const getAdminConfig = async () => {
  const response = await api.get("/admin");
  return response.data;
};

export const updateAdminConfig = async (payload) => {
  const response = await api.put("/admin", payload);
  return response.data;
};
