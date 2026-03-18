import { getTasks } from "@/api/tasks";
import { useQuery } from "@tanstack/react-query";

const EMPTY_TASKS: [] = [];

export default function useTask() {
  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const tasks = query.data ?? EMPTY_TASKS;

  return {
    tasks,

    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
