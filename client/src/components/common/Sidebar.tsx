"use client";

import { menuItems } from "@/config/menu";
import { Blocks } from "lucide-react";
import Item from "./Item";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="px-6 py-4 flex flex-col gap-8 border-r border-r-gray-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-full">
            <Blocks color="white" strokeWidth={2.3} />
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-xl">Mira</h3>
            <p className="text-sm text-gray-400">Premium Workspace</p>
          </div>
        </div>

        <div>
          <p className="text-gray-400 font-semibold uppercase text-xs tracking-wide">
            Main Menu
          </p>

          <ul className="my-2 flex flex-col gap-1">
            {menuItems.map((item, idx) => (
              <Item
                key={idx}
                name={item.name}
                icon={item.icon}
                href={item.href}
                className={`${pathname === item.href ? "bg-[#5048e5]/10 text-[#5048e5]" : ""}`}
              />
            ))}
          </ul>
        </div>

        <div>
          <p className="text-gray-400 font-semibold uppercase text-xs tracking-wide">
            Categories
          </p>
        </div>

        <div></div>
      </div>
    </>
  );
}
