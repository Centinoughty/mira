import { TaskFormValue } from "@/components/common/TaskForm";
import { api } from "./axios";

export async function getTasks() {
  const { data } = await api.get("/task");
  return data;
}

export async function createTask(values: TaskFormValue) {
  const { data } = await api.post("/task/create", values);
  return data;
}

export async function toggleTaskStatus(id: string) {
  const { data } = await api.patch(`/task/${id}/status`);
  return data;
}
