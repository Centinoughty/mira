import { MenuItem } from "@/config/menu";
import Link from "next/link";

export default function Item({
  name,
  icon: Icon,
  href,
  className,
}: MenuItem & { className?: string }) {
  return (
    <>
      <Link
        href={href}
        className={`px-4 py-2 flex items-center gap-2 rounded-full ${className}`}
      >
        <Icon />
        {name}
      </Link>
    </>
  );
}
