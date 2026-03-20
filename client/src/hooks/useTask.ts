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
    select: (data) => data.tasks as TaskItemProps[],
  });

  const tasks: TaskItemProps[] = query.data ?? EMPTY_TASKS;

  const createMutation = useMutation({
    mutationFn: createTask,

    onMutate: async (values: TaskFormValue) => {
      await qc.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = qc.getQueryData<TaskItemProps[]>(["tasks"]) ?? [];

      const optimisticTask: TaskItemProps = {
        id: crypto.randomUUID(),
        title: values.title,
        checked: false,
        description: values.description ?? undefined,
        priority: values.priority,
        dueDate: values.dueDate,
      };

      qc.setQueryData<TaskItemProps[]>(["tasks"], (old = []) => [
        optimisticTask,
        ...old,
      ]);

      console.log("kygdfgeiu");

      return { previousTasks };
    },

    onError: (_err, _values, context) => {
      if (context?.previousTasks) {
        qc.setQueryData(["tasks"], context.previousTasks);
        console.log("jdbflub");
      }
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      console.log("ljdbgfs");
    },
  });

  return {
    tasks,

    createTask: createMutation.mutate,
    isCreating: createMutation.isPending,

    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
