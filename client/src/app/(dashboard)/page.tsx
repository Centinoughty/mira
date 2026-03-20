"use client";

import TaskForm from "@/components/common/TaskForm";
import TaskItem from "@/components/ui/TaskItem";
import Title from "@/components/ui/Title";
import useTask from "@/hooks/useTask";
import { TaskItemProps } from "@/types/task";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<TaskItemProps | null>(null);

  const {
    todayTasks,
    upcomingTasks,
    createTask,
    toggleTask,
    updateTask,
    deleteTask,
    isCreating,
    isUpdating,
  } = useTask();

  return (
    <>
      <main className="p-4 flex flex-col gap-6">
        <div>
          <Title text="Dashboard" />

          <p className="text-sm text-gray-400">
            You have {todayTasks.length} tasks pending for today.
          </p>
        </div>

        <div>
          <Title text="Today" className="text-lg" />

          <ul className="flex flex-col gap-2">
            {todayTasks.map((task) => (
              <TaskItem
                key={task.id}
                title={task.title}
                description={task.description}
                priority={task.priority}
                dueDate={task.dueDate}
                checked={task.checked}
                onToggle={() => task.id && toggleTask(task.id)}
                onEdit={() => setEditing(task)}
                onDelete={() => task.id && deleteTask(task.id)}
              />
            ))}
          </ul>
        </div>

        <div>
          <Title text="Next 7 Days" className="text-lg" />

          <ul className="flex flex-col gap-2">
            {upcomingTasks.map((task) => (
              <TaskItem
                key={task.id}
                title={task.title}
                description={task.description}
                priority={task.priority}
                dueDate={task.dueDate}
                checked={task.checked}
                onToggle={() => task.id && toggleTask(task.id)}
                onEdit={() => setEditing(task)}
                onDelete={() => task.id && deleteTask(task.id)}
              />
            ))}
          </ul>
        </div>
      </main>

      <TaskForm
        open={!!editing}
        defaultValues={
          editing
            ? {
                title: editing.title,
                description: editing.description,
                priority: editing.priority,
                dueDate: new Date(editing.dueDate),
              }
            : undefined
        }
        onClose={() => setEditing(null)}
        isSubmitting={isUpdating}
        onSubmit={(values) => {
          if (editing?.id) updateTask({ id: editing.id, values });
        }}
      />

      <TaskForm
        open={open}
        onClose={() => setOpen(false)}
        isSubmitting={isCreating}
        onSubmit={(values) => createTask(values)}
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
