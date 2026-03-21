import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { TaskItemProps } from "@/types/task";
import { Team } from "@/types/team";

export interface SearchResults {
  tasks: TaskItemProps[];
  teams: Team[];
}

export default function useSearch() {
  const [query, setQuery] = useState("");
  const qc = useQueryClient();

  const results: SearchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { tasks: [], teams: [] };

    const taskCache = qc.getQueryData<{ tasks: TaskItemProps[] }>(["tasks"]);
    const teamCache = qc.getQueryData<{ teams: Team[] }>(["teams"]);

    const tasks = (taskCache?.tasks ?? []).filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.priority.toLowerCase().includes(q),
    );

    const teams = (teamCache?.teams ?? []).filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.members.some(
          (m) =>
            m.user.name.toLowerCase().includes(q) ||
            m.user.email.toLowerCase().includes(q),
        ),
    );

    return { tasks, teams };
  }, [query, qc]);

  return {
    query,
    setQuery,
    results,
    hasResults: results.tasks.length > 0 || results.teams.length > 0,
    isSearching: query.trim().length > 0,
  };
}
