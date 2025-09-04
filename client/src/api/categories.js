import { api } from "./client";

export const listCategories = async () => (await api.get("/api/categories")).data;
export const createCategory = async (name) =>
  (await api.post("/api/categories", { name })).data;
