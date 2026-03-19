import { api } from "./axios";

export async function getUser() {
  const { data } = await api.get("/auth/me");
  return data;
}
