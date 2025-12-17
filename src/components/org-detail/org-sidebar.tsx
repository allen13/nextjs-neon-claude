"use client";

import { Activity, LayoutDashboard, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface OrgSidebarProps {
  orgId: string;
}

const navItems = [
  {
    label: "Overview",
    href: "",
    icon: LayoutDashboard,
  },
  {
    label: "Members",
    href: "/members",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    label: "Activity",
    href: "/activity",
    icon: Activity,
  },
];

export function OrgSidebar({ orgId }: OrgSidebarProps) {
  const pathname = usePathname();
  const basePath = `/orgs/${orgId}`;

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const href = `${basePath}${item.href}`;
        const isActive =
          pathname === href || (item.href !== "" && pathname.startsWith(href));
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
