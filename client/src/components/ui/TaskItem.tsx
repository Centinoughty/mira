import { TaskItemProps } from "@/types/task";
import { Clock, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

interface TaskItemExtendedProps extends TaskItemProps {
  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function TaskItem({
  title,
  priority,
  dueDate,
  checked,
  members,
  onToggle,
  onEdit,
  onDelete,
}: TaskItemExtendedProps) {
  return (
    <>
      <div
        className={`px-4 py-2 flex items-center justify-between bg-white rounded-lg border-2 transition-colors ${
          checked ? "border-green-200 opacity-60" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-4">
          <div>
            <input
              type="checkbox"
              onClick={onToggle}
              className={`h-4 w-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                checked
                  ? "bg-green-500 border-green-500"
                  : "border-gray-400 bg-white"
              }`}
            />
          </div>

          <div>
            <h3 className="font-medium">{title}</h3>

            <div className="flex items-center gap-4">
              <span
                className={`text-xs px-2 rounded-full ${priority === "low" ? "bg-green-100 text-green-500" : priority === "medium" ? "bg-blue-100 text-blue-500" : "bg-red-100 text-red-500"}`}
              >
                {priority}
              </span>

              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock size={14} />
                Due{" "}
                {new Date(Date.now()).getDate() === new Date(dueDate).getDate()
                  ? new Date(dueDate).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })
                  : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ul className="flex items-center">
            {members?.slice(0, 5).map((member, idx) => (
              <li key={idx} className={`${idx !== 0 ? "-ml-3" : ""} relative`}>
                <Image
                  src={member.user.avatar!}
                  alt={member.user.name}
                  width={33}
                  height={33}
                  className="rounded-full border-2 border-gray-200"
                />
              </li>
            ))}

            <span className="text-xs ml-1">
              {members && members.length > 5
                ? `+ ${members.length - 5} more`
                : ""}
            </span>
          </ul>

          <button
            type="button"
            onClick={onEdit}
            className="p-1.5 rounded-md text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
          >
            <Pencil size={15} />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </>
  );
}
