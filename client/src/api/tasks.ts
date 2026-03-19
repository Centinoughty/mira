import { api } from "./axios";

export async function getTasks() {
  const { data } = await api.get("/task");
  return data;
}
