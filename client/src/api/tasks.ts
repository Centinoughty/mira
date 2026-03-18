import { api } from "./axios";

export async function getTasks() {
  const { data } = await api.get("/tasks");
  return data;
}
