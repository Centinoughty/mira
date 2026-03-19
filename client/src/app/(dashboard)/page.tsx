"use client";

import TaskForm from "@/components/common/TaskForm";
import TaskItem from "@/components/ui/TaskItem";
import Title from "@/components/ui/Title";
import useTask from "@/hooks/useTask";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState<boolean>(false);

  const { tasks, createTask } = useTask();

  return (
    <>
      <main className="p-4 flex flex-col gap-6">
        <div>
          <Title text="Dashboard" />

          <p className="text-sm text-gray-400">
            You have {tasks.length} tasks pending for today.
          </p>
        </div>

        <div>
          <Title text="Today" className="text-lg" />

          {tasks.map((task) => (
            <TaskItem
              title={task.title}
              description={task.description}
              priority={task.priority}
              dueDate={task.dueDate}
              checked
            />
          ))}
        </div>

        <div>
          <Title text="Next 7 Days" className="text-lg" />
        </div>
      </main>

      <TaskForm
        open={open}
        onClose={() => setOpen(false)}
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
