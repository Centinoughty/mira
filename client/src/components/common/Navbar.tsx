"use client";

import { Bell, Search } from "lucide-react";
import Input from "../ui/Input";
import Image from "next/image";
import useUser from "@/hooks/useUser";
import Searchbar from "./Searchbar";

export default function Navbar() {
  const { user, isLoading } = useUser();

  if (isLoading || !user) return null;

  return (
    <>
      <nav className="p-2 flex items-center justify-between border-b border-b-gray-200">
        <div>
          <Searchbar />
        </div>

        <div className="flex items-center gap-6">
          <div className="p-2 rounded-full bg-gray-200 text-gray-700">
            <Bell strokeWidth={2.3} />
          </div>

          <div className="flex items-center gap-3">
            <p className="text-sm font-medium">{user.name}</p>

            <div className="relative" style={{ width: "42px", height: "42px" }}>
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="object-cover rounded-full border-2 border-gray-300"
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
