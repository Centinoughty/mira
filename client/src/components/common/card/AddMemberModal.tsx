"use client";

import Modal from "@/components/ui/Modal";
import { Loader2, X } from "lucide-react";
import { SyntheticEvent, useState } from "react";

interface AddMemberValues {
  email: string;
}

const initialValues: AddMemberValues = {
  email: "",
};

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (email: string) => Promise<void>;
  isAdding: boolean;
  teamName: string;
}

export default function AddMemberModal({
  open,
  onClose,
  onAdd,
  isAdding,
  teamName,
}: AddMemberModalProps) {
  const [values, setValues] = useState<AddMemberValues>(initialValues);
  const [error, setError] = useState("");

  function handleChange(key: keyof AddMemberValues, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await onAdd(values.email.trim().toLowerCase());
      setValues(initialValues);
      setError("");
      onClose();
    } catch (err) {
      const message =
        err instanceof Error
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      setError(message ?? "Something went wrong");
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-5 bg-[#f6f6f8] border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-base font-semibold">
          Add Member to <span className="text-indigo-600">{teamName}</span>
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            required
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            placeholder="member@email.com"
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg text-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isAdding}
            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white disabled:opacity-60 flex items-center gap-2"
          >
            {isAdding && <Loader2 size={13} className="animate-spin" />}
            Add Member
          </button>
        </div>
      </form>
    </Modal>
  );
}
