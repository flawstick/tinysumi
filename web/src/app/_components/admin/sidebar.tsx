"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ListTodo,
  Camera,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Navigation items
const navItems = [
  {
    name: "Dashboard",
    href: "/daddy",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    name: "Tasks",
    href: "/daddy/tasks",
    icon: <ListTodo className="h-5 w-5" />,
  },
  {
    name: "Memories",
    href: "/daddy/memories",
    icon: <Camera className="h-5 w-5" />,
  },
  {
    name: "Settings",
    href: "/daddy/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed right-4 top-4 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="border-border bg-background"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-card transition-transform duration-200 ease-in-out md:translate-x-0",
          isMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="border-b border-border p-4">
            <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage your content</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    isActive ? "bg-secondary" : "hover:bg-secondary/50",
                  )}
                  onClick={() => {
                    router.push(item.href);
                    setIsMenuOpen(false);
                  }}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                  {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                </Button>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="border-t border-border p-4">
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Logged in as Daddy</p>
              <p>© dictate the life of your dog</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
