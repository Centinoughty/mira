import { getTasks } from "@/api/tasks";
import { TaskItemProps } from "@/types/task";
import { useQuery } from "@tanstack/react-query";

const EMPTY_TASKS: TaskItemProps[] = [];

export default function useTask() {
  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const tasks: TaskItemProps[] = query.data ?? EMPTY_TASKS;

  return {
    tasks,

    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
