import api from "./axiosConfig";

export const getAllNews = async () => {
  const response = await api.get("/news");
  return response.data;
};

export const createNews = async (payload) => {
  const response = await api.post("/news", payload);
  return response.data;
};

export const updateNews = async (id, payload) => {
  const response = await api.put(`/news/${id}`, payload);
  return response.data;
};

export const deleteNews = async (id) => {
  const response = await api.delete(`/news/${id}`);
  return response.data;
};
