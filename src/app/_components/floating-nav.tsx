"use client";
import type React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed inset-x-0 top-4 z-[5000] mx-auto flex max-w-fit items-center justify-center space-x-4 rounded-full border border-pink-200 bg-white/80 py-2 pl-8 pr-2 shadow-[0px_2px_3px_-1px_rgba(236,72,153,0.1),0px_1px_0px_0px_rgba(236,72,153,0.05),0px_0px_0px_1px_rgba(236,72,153,0.1)] backdrop-blur-sm dark:border-pink-400/30",
        className,
      )}
    >
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
        href="/game"
        className="relative rounded-full border border-pink-300 px-4 py-2 text-sm font-medium text-pink-700 transition-colors hover:bg-pink-50 dark:border-pink-400/30 dark:text-pink-200"
      >
        <span>Play</span>
        <span className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
      </Link>
    </motion.div>
  );
};
