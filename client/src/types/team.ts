export interface TeamMember {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
}

export interface Team {
  id: string;
  name: string;
  description?: string | null;
  ownerId: string;
  members: TeamMember[];
  createdAt: string;
}
