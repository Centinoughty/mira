"use client";

import Title from "@/components/ui/Title";
import TaskForm, {
  AssignableMember,
  TaskFormValue,
} from "@/components/common/TaskForm";
import useTeam from "@/hooks/useTeam";
import useTask from "@/hooks/useTask";
import { Team, TeamMember } from "@/types/team";
import {
  Loader2,
  Plus,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { FormEvent, useState } from "react";

function CreateTeamModal({
  open,
  onClose,
  onCreate,
  isCreating,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (v: {
    name: string;
    description?: string;
    memberEmails: string[];
  }) => Promise<void>;
  isCreating: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [emailError, setEmailError] = useState("");

  function addEmail() {
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Invalid email address");
      return;
    }
    if (emails.includes(trimmed)) {
      setEmailError("Already added");
      return;
    }
    setEmails((prev) => [...prev, trimmed]);
    setEmailInput("");
    setEmailError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await onCreate({
      name: name.trim(),
      description: description.trim() || undefined,
      memberEmails: emails,
    });
    setName("");
    setDescription("");
    setEmails([]);
    setEmailInput("");
    onClose();
  }

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-6 bg-[#f6f6f8] border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create Team</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Team Name
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder="e.g. Frontend Squad"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Description{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm h-20 resize-none"
              placeholder="What is this team for?"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Invite Members{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="mt-1 flex gap-2">
              <input
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  setEmailError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addEmail();
                  }
                }}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                placeholder="colleague@email.com"
              />
              <button
                type="button"
                onClick={addEmail}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
            {emailError && (
              <p className="text-xs text-red-500 mt-1">{emailError}</p>
            )}

            {emails.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-2">
                {emails.map((email) => (
                  <li
                    key={email}
                    className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() =>
                        setEmails((p) => p.filter((e) => e !== email))
                      }
                    >
                      <X size={11} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg text-gray-500 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-60 flex items-center gap-2"
            >
              {isCreating && <Loader2 size={14} className="animate-spin" />}
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddMemberModal({
  open,
  onClose,
  onAdd,
  isAdding,
  teamName,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (email: string) => Promise<void>;
  isAdding: boolean;
  teamName: string;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    try {
      await onAdd(trimmed);
      setEmail("");
      setError("");
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Something went wrong");
    }
  }

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-5 bg-[#f6f6f8] border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-semibold">
            Add Member to <span className="text-indigo-600">{teamName}</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder="member@email.com"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg text-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAdding}
              className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white disabled:opacity-60 flex items-center gap-2"
            >
              {isAdding && <Loader2 size={13} className="animate-spin" />}
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MemberAvatar({
  member,
  onRemove,
  isOwner,
}: {
  member: TeamMember;
  onRemove: () => void;
  isOwner: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-3">
        {member.user.avatar ? (
          <Image
            src={member.user.avatar}
            alt={member.user.name}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600">
            {member.user.name[0].toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-800">
            {member.user.name}
          </p>
          <p className="text-xs text-gray-400">{member.user.email}</p>
        </div>
      </div>
      {!isOwner && hovered && (
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-300 hover:text-red-500 transition-colors"
        >
          <UserMinus size={15} />
        </button>
      )}
      {isOwner && (
        <span className="text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
          Owner
        </span>
      )}
    </div>
  );
}

function TeamCard({
  team,
  currentUserId,
  onAddMember,
  onRemoveMember,
  onDelete,
  onAssignTask,
}: {
  team: Team;
  currentUserId: string;
  onAddMember: () => void;
  onRemoveMember: (memberId: string) => void;
  onDelete: () => void;
  onAssignTask: () => void;
}) {
  const isOwner = team.ownerId === currentUserId;
  const [showMembers, setShowMembers] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{team.name}</h3>
          {team.description && (
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
              {team.description}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            <span className="font-medium text-gray-600">
              {team.members.length}
            </span>{" "}
            member{team.members.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onAssignTask}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={13} />
            Assign Task
          </button>

          {isOwner && (
            <button
              type="button"
              onClick={onDelete}
              className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 px-2 py-2">
        <button
          type="button"
          onClick={() => setShowMembers((p) => !p)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-700"
        >
          <span className="flex items-center gap-1.5">
            <Users size={12} /> Members
          </span>
          <span className="text-gray-300">{showMembers ? "▲" : "▼"}</span>
        </button>

        {showMembers && (
          <div className="mt-1 flex flex-col">
            {team.members.map((member) => (
              <MemberAvatar
                key={member.id}
                member={member}
                isOwner={member.user.id === team.ownerId}
                onRemove={() => onRemoveMember(member.id)}
              />
            ))}

            {isOwner && (
              <button
                type="button"
                onClick={onAddMember}
                className="mx-3 mt-2 mb-1 flex items-center gap-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium py-1"
              >
                <UserPlus size={13} />
                Add member
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
                onRemoveMember={(memberId) =>
                  removeMember({ teamId: team.id, memberId })
                }
                onDelete={() => deleteTeam(team.id)}
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
