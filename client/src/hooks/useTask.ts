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

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default function useTask() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    select: (data) => data.tasks as TaskItemProps[],
  });

  const tasks: TaskItemProps[] = query.data ?? EMPTY_TASKS;

  const todayStart = startOfDay(new Date());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  const weekEnd = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000);

  const todayTasks = tasks.filter((t) => {
    const d = startOfDay(new Date(t.dueDate));
    return d >= todayStart && d < todayEnd;
  });

  const upcomingTasks = tasks.filter((t) => {
    const d = startOfDay(new Date(t.dueDate));
    return d >= todayEnd && d < weekEnd;
  });

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
    todayTasks,
    upcomingTasks,

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
