import { LucideIcon } from "lucide-react";

interface InputProps {
  label?: string;
  name: string;
  type?: "submit" | "text" | "email" | "password" | "number" | "date";
  icon: LucideIcon;
  placeholder: string;
  className?: string;
}

export default function Input({
  label,
  name,
  type = "text",
  icon: Icon,
  placeholder,
  className = "",
}: InputProps) {
  return (
    <>
      <div className={`flex flex-col gap-1 ${className}`}>
        <label>{label}</label>

        <div className="px-4 py-2 flex gap-4 border border-gray-200 rounded-full">
          <Icon className="text-gray-400" />

          <input
            name={name}
            placeholder={placeholder}
            type={type}
            className="outline-none tracking-wide"
          />
        </div>
      </div>
    </>
  );
}
