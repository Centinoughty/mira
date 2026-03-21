import { TaskFormValue } from "@/components/common/TaskForm";
import { api } from "./axios";

export async function getTasks() {
  const { data } = await api.get("/task");
  return data;
}

export async function createTask({
  values,
  teamId,
}: {
  values: TaskFormValue;
  teamId: string | undefined;
}) {
  const { data } = await api.post("/task/create", { ...values, teamId });
  return data;
}

export async function toggleTaskStatus(id: string) {
  const { data } = await api.patch(`/task/${id}/status`);
  return data;
}

export async function updateTask({
  id,
  values,
}: {
  id: string;
  values: TaskFormValue;
}) {
  const { data } = await api.patch(`/task/${id}`, values);
  return data;
}

export async function deleteTask(id: string) {
  const { data } = await api.delete(`/task/${id}`);
  return data;
}
