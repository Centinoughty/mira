import { api } from "./axios";

export interface CreateTeamValues {
  name: string;
  description?: string;
  memberEmails: string[];
}

export interface AddTeamMemberValues {
  teamId: string;
  email: string;
}

export interface RemoveTeamMemberValues {
  teamId: string;
  memberId: string;
}

export async function getTeams() {
  const { data } = await api.get("/team");
  return data;
}

export async function createTeam(values: CreateTeamValues) {
  const { data } = await api.post("/team", values);
  return data;
}

export async function addTeamMember(values: AddTeamMemberValues) {
  const { data } = await api.post(`/team/${values.teamId}/members`, {
    email: values.email,
  });
  return data;
}

export async function removeTeamMember(values: RemoveTeamMemberValues) {
  const { data } = await api.delete(
    `/team/${values.teamId}/members/${values.memberId}`,
  );
  return data;
}

export async function deleteTeam(values: { id: string }) {
  const { data } = await api.delete(`/team/${values.id}`);
  return data;
}
