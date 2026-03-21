"use client";

import Title from "@/components/ui/Title";
import TaskForm, {
  AssignableMember,
  TaskFormValue,
} from "@/components/common/TaskForm";
import useTeam from "@/hooks/useTeam";
import useTask from "@/hooks/useTask";
import { Team } from "@/types/team";
import { Loader2, Plus, Users } from "lucide-react";
import AddMemberModal from "@/components/common/card/AddMemberModal";
import { useState } from "react";
import CreateTeamModal from "@/components/common/card/CreateTeamModal";
import TeamCard from "@/components/common/card/TeamCard";

export default function TeamsPage() {
  const {
    teams,
    isLoading,
    createTeam,
    isCreating,
    addMember,
    isAddingMember,
    removeMember,
    deleteTeam,
  } = useTeam();

  const { createTask, isCreating: isCreatingTask } = useTask();

  const [createOpen, setCreateOpen] = useState(false);
  const [addMemberTarget, setAddMemberTarget] = useState<Team | null>(null);
  const [assignTaskTarget, setAssignTaskTarget] = useState<Team | null>(null);

  const currentUserId = teams.find((t) => t.ownerId)?.ownerId ?? "";

  const assignableMembers: AssignableMember[] = (
    assignTaskTarget?.members ?? []
  ).map((m) => ({
    id: m.user.id,
    name: m.user.name,
    email: m.user.email,
    avatar: m.user.avatar,
  }));

  return (
    <>
      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <Title text="Teams" />
            <p className="text-sm text-gray-400">
              {teams.length} team{teams.length !== 1 ? "s" : ""} · manage
              members and assign tasks
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            New Team
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-indigo-400" />
          </div>
        ) : teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
              <Users size={28} className="text-indigo-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-700">No teams yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Create your first team to start collaborating
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              Create a Team
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                currentUserId={currentUserId}
                onAddMember={() => setAddMemberTarget(team)}
                onRemoveMember={(memberId: string) =>
                  removeMember({ teamId: team.id, memberId })
                }
                onDelete={() => deleteTeam({ id: team.id })}
                onAssignTask={() => setAssignTaskTarget(team)}
              />
            ))}
          </div>
        )}
      </div>

      <CreateTeamModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createTeam}
        isCreating={isCreating}
      />

      <AddMemberModal
        open={!!addMemberTarget}
        onClose={() => setAddMemberTarget(null)}
        teamName={addMemberTarget?.name ?? ""}
        isAdding={isAddingMember}
        onAdd={(email) => {
          if (!addMemberTarget) return Promise.resolve();
          return addMember({ teamId: addMemberTarget.id, email });
        }}
      />

      <TaskForm
        open={!!assignTaskTarget}
        onClose={() => setAssignTaskTarget(null)}
        isSubmitting={isCreatingTask}
        availableMembers={assignableMembers}
        onSubmit={(values: TaskFormValue) => createTask(values)}
      />
    </>
  );
}
