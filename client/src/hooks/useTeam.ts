import {
  addTeamMember,
  createTeam,
  deleteTeam,
  getTeams,
  removeTeamMember,
} from "@/api/teams";
import { Team } from "@/types/team";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useTeam() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
    select: (data) => data.teams as Team[],
  });

  const teams: Team[] = query.data ?? [];

  const allMembers = Array.from(
    new Map(
      teams.flatMap((t) => t.members).map((m) => [m.user.id, m.user]),
    ).values(),
  );

  const createMutation = useMutation({
    mutationFn: createTeam,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });

  const addMemberMutation = useMutation({
    mutationFn: addTeamMember,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });

  const removeMemberMutation = useMutation({
    mutationFn: removeTeamMember,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });

  const deleteTeamMutation = useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });

  return {
    teams,
    allMembers,
    isLoading: query.isLoading,

    createTeam: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    addMember: addMemberMutation.mutateAsync,
    isAddingMember: addMemberMutation.isPending,

    removeMember: removeMemberMutation.mutate,
    deleteTeam: deleteTeamMutation.mutate,
  };
}
