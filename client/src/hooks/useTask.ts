import { createTask, getTasks, toggleTaskStatus } from "@/api/tasks";
import { TaskFormValue } from "@/components/common/TaskForm";
import { TaskItemProps } from "@/types/task";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const EMPTY_TASKS: TaskItemProps[] = [];

export default function useTask() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    select: (data) => data.tasks as TaskItemProps[],
  });

  const tasks: TaskItemProps[] = query.data ?? EMPTY_TASKS;

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const toggleMutation = useMutation({
    mutationFn: toggleTaskStatus,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const createItem = (values: TaskFormValue) => createMutation.mutate(values);
  const toggleItem = (id: string) => toggleMutation.mutate(id);

  return {
    tasks,

    createTask: createItem,
    toggleTask: toggleItem,

    isCreating: createMutation.isPending,

    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
