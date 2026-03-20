export interface TaskItemProps {
  id?: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  dueDate: Date;
  checked: boolean;
  user?: Collaborator;
  collaborators?: Collaborator[];
}

export interface Collaborator {
  name: string;
  email: string;
  avatar: string;
}
