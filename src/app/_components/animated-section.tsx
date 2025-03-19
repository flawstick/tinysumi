"use client";

import type React from "react";
import { useRef, forwardRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}

export const AnimatedSection = forwardRef<HTMLDivElement, AnimatedSectionProps>(
  ({ children, className = "", delay = 0.2, id }, ref) => {
    const localRef = useRef(null);
    const actualRef = ref || localRef;
    const isInView = useInView(actualRef, { once: true, margin: "-100px" });

    return (
      <motion.div
        ref={actualRef}
        id={id}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  },
);

AnimatedSection.displayName = "AnimatedSection";
