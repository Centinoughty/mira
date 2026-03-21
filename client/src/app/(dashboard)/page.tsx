"use client";

import TaskForm from "@/components/common/TaskForm";
import TaskItem from "@/components/ui/TaskItem";
import Title from "@/components/ui/Title";
import useTask from "@/hooks/useTask";
import useTeam from "@/hooks/useTeam";
import { TaskItemProps } from "@/types/task";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TaskItemProps | null>(null);

  const {
    todayTasks,
    upcomingTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    isCreating,
    isUpdating,
  } = useTask();

  const { allMembers } = useTeam();

  function renderTask(task: TaskItemProps) {
    return (
      <TaskItem
        key={task.id}
        {...task}
        onToggle={() => task.id && toggleTask(task.id)}
        onEdit={() => setEditing(task)}
        onDelete={() => task.id && deleteTask(task.id)}
      />
    );
  }

  return (
    <>
      <main className="p-4 flex flex-col gap-6">
        <div>
          <Title text="Dashboard" />
          <p className="text-sm text-gray-400">
            You have {todayTasks.length} task
            {todayTasks.length !== 1 ? "s" : ""} due today.
          </p>
        </div>

        <div>
          <Title text="Today" className="text-lg" />
          {todayTasks.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {todayTasks.map(renderTask)}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 mt-1">No tasks due today.</p>
          )}
        </div>

        <div>
          <Title text="Next 7 Days" className="text-lg" />
          {upcomingTasks.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {upcomingTasks.map(renderTask)}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 mt-1">
              No upcoming tasks this week.
            </p>
          )}
        </div>
      </main>

      <TaskForm
        key={editing?.id ?? "edit"}
        open={!!editing}
        defaultValues={
          editing
            ? {
                title: editing.title,
                description: editing.description,
                priority: editing.priority,
                dueDate: new Date(editing.dueDate),
                memberIds: editing.members?.map((m) => m.user.id) ?? [],
              }
            : undefined
        }
        onClose={() => setEditing(null)}
        isSubmitting={isUpdating}
        availableMembers={allMembers}
        onSubmit={(values) => {
          if (editing?.id) updateTask({ id: editing.id, values });
        }}
      />

      <TaskForm
        key="create"
        open={open}
        onClose={() => setOpen(false)}
        isSubmitting={isCreating}
        availableMembers={allMembers}
        onSubmit={(values) => createTask({ values, teamId: undefined })}
      />

      <button
        onClick={() => setOpen(true)}
        className="m-4 absolute right-5 bottom-5"
      >
        <div className="p-3 bg-blue-600 rounded-lg shadow-lg">
          <Plus color="white" strokeWidth={2.5} />
        </div>
      </button>
    </>
  );
}
