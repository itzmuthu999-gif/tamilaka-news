import api from "./axiosConfig";

export const getNewsPageConfig = async () => {
  const response = await api.get("/newspage");
  return response.data;
};

export const updateNewsPageConfig = async (payload) => {
  const response = await api.put("/newspage", payload);
  return response.data;
};
