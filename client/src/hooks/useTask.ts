import {
  createTask,
  deleteTask,
  getTasks,
  toggleTaskStatus,
  updateTask,
} from "@/api/tasks";
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

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const createItem = (values: TaskFormValue) => createMutation.mutate(values);
  const toggleItem = (id: string) => toggleMutation.mutate(id);
  const updateItem = ({ id, values }: { id: string; values: TaskFormValue }) =>
    updateMutation.mutate({ id, values });
  const deleteItem = (id: string) => deleteMutation.mutate(id);

  return {
    tasks,

    createTask: createItem,
    toggleTask: toggleItem,
    updateTask: updateItem,
    deleteTask: deleteItem,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
