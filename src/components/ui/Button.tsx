"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "gold" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  disabled?: boolean;
  target?: "_blank" | "_self";
}

const variants = {
  gold: "btn-gold text-white drop-shadow-md",
  outline: "bg-transparent text-[#a66d03] border border-[#a66d03] hover:bg-[#a66d03] hover:text-white",
  ghost: "bg-transparent text-white border border-white/30 hover:bg-white/10 hover:border-white/60",
  dark: "bg-[#1E1810] text-white border border-[#1E1810] hover:bg-[#2d2418]",
};

const sizes = {
  sm: "px-5 py-2.5 text-xs tracking-widest",
  md: "px-7 py-3.5 text-sm tracking-widest",
  lg: "px-10 py-4.5 text-sm tracking-widest",
};

export default function Button({
  children,
  variant = "gold",
  size = "md",
  href,
  onClick,
  className,
  icon,
  iconPosition = "right",
  fullWidth = false,
  disabled = false,
  target,
}: ButtonProps) {
  const baseClasses = cn(
    "inline-flex items-center justify-center gap-2.5 rounded-full font-semibold uppercase transition-all duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a66d03] focus-visible:ring-offset-2",
    "select-none cursor-pointer",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    disabled && "opacity-50 pointer-events-none",
    className
  );

  const content = (
    <>
      {icon && iconPosition === "left" && (
        <span className="flex-shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="flex-shrink-0">{icon}</span>
      )}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        className={baseClasses}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {content}
    </motion.button>
  );
}
