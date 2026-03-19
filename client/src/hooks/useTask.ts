import { createTask, getTasks } from "@/api/tasks";
import { TaskFormValue } from "@/components/common/TaskForm";
import { TaskItemProps } from "@/types/task";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const EMPTY_TASKS: TaskItemProps[] = [];

export default function useTask() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    select: (data) => data.tasks,
  });

  const tasks: TaskItemProps[] = query.data ?? EMPTY_TASKS;

  const createMutation = useMutation({
    mutationFn: createTask,

    onMutate: async (values: TaskFormValue) => {
      await qc.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = qc.getQueryData<TaskItemProps[]>(["tasks"]) ?? [];

      const optimisticTask: TaskItemProps = {
        title: values.title,
        checked: false,
        description: values.description,
        priority: values.priority,
        dueDate: values.dueDate,
      };

      qc.setQueryData<TaskItemProps[]>(["tasks"], (old = []) => [
        optimisticTask,
        ...old,
      ]);

      return { previousTasks };
    },

    onError: (_err, _values, context) => {
      if (context?.previousTasks) {
        qc.setQueryData(["tasks"], context.previousTasks);
      }
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    tasks,

    createTask: createMutation.mutate,

    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
