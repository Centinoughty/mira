"use client";

import Modal from "@/components/ui/Modal";
import { Loader2, X } from "lucide-react";
import { SyntheticEvent, useState } from "react";

export interface CreateTeamValues {
  name: string;
  description: string;
  emailInput: string;
  memberEmails: string[];
}

const initialValues: CreateTeamValues = {
  name: "",
  description: "",
  emailInput: "",
  memberEmails: [],
};

interface CreateTeamModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (values: CreateTeamValues) => Promise<void>;
  isCreating: boolean;
  currentUserEmail: string;
}

export default function CreateTeamModal({
  open,
  onClose,
  onCreate,
  isCreating,
  currentUserEmail,
}: CreateTeamModalProps) {
  const [values, setValues] = useState<CreateTeamValues>(initialValues);
  const [emailError, setEmailError] = useState("");

  function handleChange(key: keyof CreateTeamValues, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function addEmail() {
    const trimmed = values.emailInput.trim().toLowerCase();
    if (!trimmed) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Invalid email address");
      return;
    }
    if (trimmed === currentUserEmail.toLowerCase()) {
      setEmailError("You are already the owner of this team");
      return;
    }
    if (values.memberEmails.includes(trimmed)) {
      setEmailError("This email has already been added");
      return;
    }

    setValues((prev) => ({
      ...prev,
      emailInput: "",
      memberEmails: [...prev.memberEmails, trimmed],
    }));
    setEmailError("");
  }

  function removeEmail(email: string) {
    setValues((prev) => ({
      ...prev,
      memberEmails: prev.memberEmails.filter((e) => e !== email),
    }));
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    await onCreate(values);
    setValues(initialValues);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6 bg-[#f6f6f8] border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Create Team</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-gray-700">Team Name</label>
          <input
            required
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            placeholder="e.g. Frontend Squad"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Description{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={values.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm h-20 resize-none"
            placeholder="What is this team for?"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Invite Members{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>

          <div className="mt-1 flex gap-2">
            <input
              value={values.emailInput}
              onChange={(e) => {
                handleChange("emailInput", e.target.value);
                setEmailError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addEmail();
                }
              }}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
              placeholder="colleague@email.com"
            />
            <button
              type="button"
              onClick={addEmail}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
            >
              Add
            </button>
          </div>

          {emailError && (
            <p className="text-xs text-red-500 mt-1">{emailError}</p>
          )}

          {values.memberEmails.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2">
              {values.memberEmails.map((email) => (
                <li
                  key={email}
                  className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full"
                >
                  {email}
                  <button type="button" onClick={() => removeEmail(email)}>
                    <X size={11} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg text-gray-500 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-60 flex items-center gap-2"
          >
            {isCreating && <Loader2 size={14} className="animate-spin" />}
            Create Team
          </button>
        </div>
      </form>
    </Modal>
  );
}
