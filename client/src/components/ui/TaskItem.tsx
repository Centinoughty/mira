import { TaskItemProps } from "@/types/task";
import { Clock, EllipsisVertical } from "lucide-react";
import Image from "next/image";

export default function TaskItem({
  title,
  priority,
  dueDate,
  collaborators,
}: TaskItemProps) {
  return (
    <>
      <div className="px-4 py-2 flex items-center justify-between bg-white rounded-lg border-2 border-gray-200">
        <div className="flex items-center gap-4">
          <div>
            <input
              type="checkbox"
              className="appearance-none h-4 w-4 rounded-md border-2 border-gray-400"
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
                {new Date(Date.now()).getDate() === dueDate.getDate()
                  ? dueDate.toLocaleTimeString("en-US", {
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
            {collaborators?.slice(0, 5).map((collaborator, idx) => (
              <li key={idx} className={`${idx !== 0 ? "-ml-3" : ""} relative`}>
                <Image
                  src={collaborator.avatar}
                  alt={collaborator.name}
                  width={33}
                  height={33}
                  className="rounded-full border-2 border-gray-200"
                />
              </li>
            ))}

            <span className="text-xs ml-1">
              {collaborators && collaborators.length > 5
                ? `+ ${collaborators.length - 5} more`
                : ""}
            </span>
          </ul>

          <div>
            <EllipsisVertical className="text-gray-400" />
          </div>
        </div>
      </div>
    </>
  );
}
