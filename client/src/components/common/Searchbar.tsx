"use client";

import useSearch from "@/hooks/useSearch";
import { TaskItemProps } from "@/types/task";
import { Team } from "@/types/team";
import {
  CheckCircle2,
  Circle,
  Clock,
  Handshake,
  Search,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

function TaskResult({
  task,
  onClose,
}: {
  task: TaskItemProps;
  onClose: () => void;
}) {
  const due = new Date(task.dueDate);

  return (
    <button
      type="button"
      onClick={onClose}
      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
    >
      <div className="mt-0.5 shrink-0">
        {task.checked ? (
          <CheckCircle2 size={15} className="text-green-500" />
        ) : (
          <Circle size={15} className="text-gray-300" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium truncate ${
            task.checked ? "line-through text-gray-400" : "text-gray-800"
          }`}
        >
          {task.title}
        </p>

        {task.description && (
          <p className="text-xs text-gray-400 truncate mt-0.5">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-1">
          <span
            className={`text-xs px-1.5 rounded-full ${
              task.priority === "low"
                ? "bg-green-100 text-green-600"
                : task.priority === "medium"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-red-100 text-red-600"
            }`}
          >
            {task.priority}
          </span>

          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={11} />
            {due.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </button>
  );
}

function TeamResult({ team, onClose }: { team: Team; onClose: () => void }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        router.push("/teams");
        onClose();
      }}
      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
    >
      <div className="mt-0.5 shrink-0">
        <Handshake size={15} className="text-indigo-400" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-800 truncate">
          {team.name}
        </p>

        {team.description && (
          <p className="text-xs text-gray-400 truncate mt-0.5">
            {team.description}
          </p>
        )}

        <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
          <Users size={11} />
          {team.members.length} member{team.members.length !== 1 ? "s" : ""}
        </span>
      </div>
    </button>
  );
}

function SearchDropdown({
  results,
  hasResults,
  isSearching,
  onClose,
}: {
  results: ReturnType<typeof useSearch>["results"];
  hasResults: boolean;
  isSearching: boolean;
  onClose: () => void;
}) {
  if (!isSearching) return null;

  return (
    <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
      {!hasResults ? (
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-gray-400">No results found</p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
          {results.tasks.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Tasks
              </p>
              {results.tasks.map((task) => (
                <TaskResult key={task.id} task={task} onClose={onClose} />
              ))}
            </div>
          )}

          {results.teams.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Teams
              </p>
              {results.teams.map((team) => (
                <TeamResult key={team.id} team={team} onClose={onClose} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Searchbar() {
  const { query, setQuery, results, hasResults, isSearching } = useSearch();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setQuery]);

  return (
    <div ref={containerRef} className="relative">
      <div className="px-4 py-2 flex items-center gap-3 border border-gray-200 rounded-full bg-white">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tasks, teams, or more"
          className="outline-none tracking-wide text-sm w-64"
        />
        {isSearching && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-gray-300 hover:text-gray-500 transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <SearchDropdown
        results={results}
        hasResults={hasResults}
        isSearching={isSearching}
        onClose={() => setQuery("")}
      />
    </div>
  );
}
