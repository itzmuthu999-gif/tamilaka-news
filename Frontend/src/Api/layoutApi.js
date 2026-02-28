import api from "./axiosConfig";

export const getLayout = async () => {
  const response = await api.get("/layout");
  return response.data;
};

export const saveLayout = async (payload) => {
  const response = await api.put("/layout", payload);
  return response.data;
};
