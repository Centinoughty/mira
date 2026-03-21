import { TeamMember } from "@/types/team";
import { UserMinus } from "lucide-react";
import Image from "next/image";

interface MemberAvatarProps {
  member: TeamMember;
  onRemove: () => void;
  isOwner: boolean;
}

export default function MemberAvatar({
  member,
  onRemove,
  isOwner,
}: MemberAvatarProps) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 group">
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

      {isOwner ? (
        <span className="text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
          Owner
        </span>
      ) : (
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
        >
          <UserMinus size={15} />
        </button>
      )}
    </div>
  );
}
