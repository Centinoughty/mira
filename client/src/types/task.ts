export interface TaskMember {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
}

export interface TaskItemProps {
  id?: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  dueDate: Date;
  checked: boolean;
  members?: TaskMember[];
}
