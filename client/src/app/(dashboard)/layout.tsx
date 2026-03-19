import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className="grow flex flex-col overflow-y-auto">
        <Navbar />
        <div className="grow bg-[#f6f6f8]">{children}</div>
      </div>
    </>
  );
}
