import { SyntheticEvent, useState } from "react";
import Modal from "../ui/Modal";
import { Calendar, NotepadText, ShieldAlert, TypeOutline } from "lucide-react";

interface CreateTaskProps {
  defaultValues?: TaskFormValue;
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValue) => void;
}

export interface TaskFormValue {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: Date;
}

const initialValues: TaskFormValue = {
  title: "",
  description: "",
  priority: "low",
  dueDate: new Date(),
};

export default function TaskForm({
  defaultValues,
  open,
  onClose,
  onSubmit,
}: CreateTaskProps) {
  const [values, setValues] = useState<TaskFormValue>(
    () => defaultValues ?? initialValues,
  );

  function formatDate(date: Date) {
    return date.toISOString().split("T")[0];
  }

  function handleChange(
    key: keyof TaskFormValue,
    value: (typeof values)[keyof TaskFormValue],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit(values);

    setValues(initialValues);
  }

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6 bg-[#f6f6f8] rounded-3xl">
            <h2 className="text-xl font-semibold">Create Task</h2>

            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <TypeOutline size={18} />
                Title
              </label>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
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
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 h-32"
                value={values.description}
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
                  type="date"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
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
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
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

            <div className="flex justify-end gap-3 pt-4 border-t border-t-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg font-medium text-gray-500"
              >
                Cancel
              </button>

              <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white">
                Create Task
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
