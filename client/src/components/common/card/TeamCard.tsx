"use client";

import { Team } from "@/types/team";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import MemberAvatar from "../MemberAvatar";

interface TeamCardProps {
  team: Team;
  currentUserId: string;
  onAddMember: () => void;
  onRemoveMember: (memberId: string) => void;
  onDelete: () => void;
  onAssignTask: () => void;
}

export default function TeamCard({
  team,
  currentUserId,
  onAddMember,
  onRemoveMember,
  onDelete,
  onAssignTask,
}: TeamCardProps) {
  const isOwner = team.ownerId === currentUserId;
  const [showMembers, setShowMembers] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
      {/* Header */}
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
            <Users size={12} />
            Members
          </span>
          {showMembers ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
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
