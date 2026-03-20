import { api } from "./axios";

export async function getTeams() {
  const { data } = await api.get("/team");
  return data;
}

export async function createTeam(values: {
  name: string;
  description?: string;
  memberEmails: string[];
}) {
  const { data } = await api.post("/team", values);
  return data;
}

export async function addTeamMember({
  teamId,
  email,
}: {
  teamId: string;
  email: string;
}) {
  const { data } = await api.post(`/team/${teamId}/members`, { email });
  return data;
}

export async function removeTeamMember({
  teamId,
  memberId,
}: {
  teamId: string;
  memberId: string;
}) {
  const { data } = await api.delete(`/team/${teamId}/members/${memberId}`);
  return data;
}

export async function deleteTeam(id: string) {
  const { data } = await api.delete(`/team/${id}`);
  return data;
}
