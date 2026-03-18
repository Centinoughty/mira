import { Bell, Search } from "lucide-react";
import Input from "../ui/Input";
import Image from "next/image";

export default function Navbar() {
  return (
    <>
      <nav className="p-2 flex items-center justify-between border-b border-b-gray-200">
        <div>
          <Input
            name="search"
            icon={Search}
            placeholder="Search tasks, teams, or more"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="p-2 rounded-full bg-gray-200 text-gray-700">
            <Bell strokeWidth={2.3} />
          </div>

          <div className="flex items-center gap-3">
            <div>
              <p>Name</p>

              <p className="text-sm text-gray-400">Name</p>
            </div>

            <div className="relative" style={{ width: "42px", height: "42px" }}>
              <Image
                src={"https://picsum.photos/200"}
                alt="Name"
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
