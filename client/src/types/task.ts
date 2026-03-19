export interface TaskItemProps {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate: Date;
  checked: boolean;
  user?: Collaborator;
  collaborators?: Collaborator[];
}

interface Collaborator {
  name: string;
  email: string;
  avatar: string;
}
