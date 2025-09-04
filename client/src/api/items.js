import { api } from "./client";


export const listItems = async () => (await api.get("/api/items")).data;
export const getItem = async (id) => (await api.get(`/api/items/${id}`)).data;
export const createItem = async (payload) => (await api.post("/api/items", payload)).data;
export const updateItem = async ({ id, payload }) => (await api.put(`/api/items/${id}`, payload)).data;
export const deleteItem = async (id) => (await api.delete(`/api/items/${id}`)).data;