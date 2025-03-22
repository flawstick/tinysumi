"use client";
import type React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  const { data: session } = useSession();
  const [loggedIn, setLoggedIn] = useState(!!session);

  useEffect(() => {
    setLoggedIn(!!session);
  }, [session]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed inset-x-0 top-4 z-[100] mx-auto flex max-w-fit items-center justify-center space-x-4 rounded-full border border-pink-200 bg-white/80 py-2 pl-2 pr-2 shadow-[0px_2px_3px_-1px_rgba(236,72,153,0.1),0px_1px_0px_0px_rgba(236,72,153,0.05),0px_0px_0px_1px_rgba(236,72,153,0.1)] backdrop-blur-sm dark:border-pink-400/30",
        className,
        !loggedIn && "pl-4",
      )}
    >
      {/* User Avatar Dropdown - Now on the left */}
      {loggedIn && (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar className="h-8 w-8 border-2 border-pink-200 hover:border-pink-300">
              <AvatarImage
                src={session?.user?.image ?? undefined}
                alt={session?.user?.name ?? "User"}
              />
              <AvatarFallback className="bg-pink-100 text-pink-700">
                {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="z-[5000] w-48 border-pink-100 bg-white/95 backdrop-blur-sm"
          >
            <DropdownMenuItem
              onClick={() => void signOut()}
              className="cursor-pointer text-pink-700 hover:bg-pink-50 hover:text-pink-800"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {navItems.map((navItem: any, idx: number) => (
        <Link
          key={`link=${idx}`}
          href={navItem.link}
          className={cn(
            "relative flex items-center space-x-1 text-pink-700 hover:text-pink-500 dark:text-pink-300 dark:hover:text-pink-200",
          )}
        >
          <span className="block sm:hidden">{navItem.icon}</span>
          <span className="hidden text-sm font-medium sm:block">
            {navItem.name}
          </span>
        </Link>
      ))}
      <Link
        href={loggedIn ? "/game" : "/login"}
        className="relative rounded-full border border-pink-300 px-4 py-2 text-sm font-medium text-pink-700 transition-colors hover:bg-pink-50 dark:border-pink-400/30 dark:text-pink-200"
      >
        <span>{loggedIn ? "Play" : "Log in"}</span>
        <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
      </Link>
    </motion.div>
  );
};
