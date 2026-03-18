import { Handshake, LucideIcon, User } from "lucide-react";

export interface MenuItem {
  name: string;
  icon: LucideIcon;
  href: string;
}

export const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: User, href: "/" },
  { name: "Teams", icon: Handshake, href: "/teams" },
];
