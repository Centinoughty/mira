import { SyntheticEvent, useEffect, useState } from "react";
import Modal from "../ui/Modal";
import {
  Calendar,
  Check,
  NotepadText,
  ShieldAlert,
  TypeOutline,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";

export interface TaskFormValue {
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  dueDate: Date;
  memberIds: string[];
}

export interface AssignableMember {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

interface TaskFormProps {
  defaultValues?: TaskFormValue;
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValue) => void;
  isSubmitting: boolean;
  availableMembers?: AssignableMember[];
}

const initialValues: TaskFormValue = {
  title: "",
  description: "",
  priority: "low",
  dueDate: new Date(),
  memberIds: [],
};

function formatDate(date: Date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function TaskForm({
  defaultValues,
  open,
  onClose,
  onSubmit,
  isSubmitting,
  availableMembers = [],
}: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValue>(initialValues);

  const isEditing = !!defaultValues;

  useEffect(() => {
    if (open) setValues(defaultValues ?? initialValues);
  }, [open, defaultValues]);

  function handleChange(
    key: keyof TaskFormValue,
    value: TaskFormValue[keyof TaskFormValue],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleMember(id: string) {
    setValues((prev) => ({
      ...prev,
      memberIds: prev.memberIds.includes(id)
        ? prev.memberIds.filter((m) => m !== id)
        : [...prev.memberIds, id],
    }));
  }

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(values);
    onClose();
    setValues(initialValues);
  }

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="flex rounded-3xl overflow-hidden bg-[#f6f6f8]">
          <div className="p-8 space-y-6 flex-1">
            <h2 className="text-xl font-semibold">
              {isEditing ? "Edit Task" : "Create Task"}
            </h2>

            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <TypeOutline size={18} />
                Title
              </label>
              <input
                required
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 bg-white"
                value={values.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <NotepadText size={18} />
                Description
              </label>
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 h-28 bg-white"
                value={values.description ?? ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar size={18} />
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 bg-white"
                  value={formatDate(values.dueDate)}
                  onChange={(e) =>
                    handleChange("dueDate", new Date(e.target.value))
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <ShieldAlert size={18} />
                  Priority
                </label>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 bg-white"
                  value={values.priority}
                  onChange={(e) =>
                    handleChange(
                      "priority",
                      e.target.value as TaskFormValue["priority"],
                    )
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg font-medium text-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-60"
              >
                {isEditing ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </div>

          <div className="w-56 border-l border-gray-200 bg-white p-5 flex flex-col gap-3">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700">
              <Users size={15} />
              Assign Members
            </h3>

            {availableMembers.length === 0 ? (
              <p className="text-xs text-gray-400 leading-relaxed">
                No team members yet. Create a team first to assign tasks.
              </p>
            ) : (
              <ul className="flex flex-col gap-2 overflow-y-auto max-h-72">
                {availableMembers.map((member) => {
                  const selected = values.memberIds.includes(member.id);
                  return (
                    <li key={member.id}>
                      <button
                        type="button"
                        onClick={() => toggleMember(member.id)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${
                          selected
                            ? "bg-indigo-50 border border-indigo-200"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}
                      >
                        <div className="relative shrink-0">
                          {member.avatar ? (
                            <Image
                              src={member.avatar}
                              alt={member.name}
                              width={28}
                              height={28}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
                              {member.name[0].toUpperCase()}
                            </div>
                          )}
                          {selected && (
                            <div className="absolute -top-1 -right-1 bg-indigo-600 rounded-full p-0.5">
                              <Check size={8} color="white" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {member.email}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {values.memberIds.length > 0 && (
              <div className="mt-auto pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {values.memberIds.length} assigned
                  </span>
                  <button
                    type="button"
                    onClick={() => handleChange("memberIds", [])}
                    className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
                  >
                    <X size={11} /> Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
