"use client";

import TaskItem from "@/components/ui/TaskItem";
import Title from "@/components/ui/Title";
import useTask from "@/hooks/useTask";

export default function Home() {
  const { tasks } = useTask();

  return (
    <>
      <main className="p-4 flex flex-col gap-6">
        <div>
          <Title text="Dashboard" />

          <p className="text-sm text-gray-400">You </p>
        </div>

        <div>
          <Title text="Today" className="text-lg" />

          {tasks.map((task) => (
            <TaskItem
              title={task.title}
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
    </>
  );
}
