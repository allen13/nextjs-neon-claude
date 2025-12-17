"use client";

import { Github, Hexagon } from "lucide-react";
import Link from "next/link";
import { UserButton } from "@/components/auth/user-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { authClient } from "@/lib/auth/client";

interface NavItem {
  title: string;
  href: string;
}

const baseNavItems: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Notes", href: "/notes" },
];

const authNavItems: NavItem[] = [{ title: "Organizations", href: "/org" }];

const adminNavItems: NavItem[] = [{ title: "Users", href: "/admin" }];

export function Navbar() {
  const { data: session } = authClient.useSession();
  const isAuthenticated = !!session;
  const isAdmin = session?.user?.role === "admin";

  // Build navigation items based on user state
  const navItems = [
    ...baseNavItems,
    ...(isAuthenticated ? authNavItems : []),
    ...(isAdmin ? adminNavItems : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Hexagon className="h-6 w-6" />
          <span className="text-xl font-bold">Starter</span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href={item.href}>{item.title}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/allen13/nextjs-neon-claude"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
}
