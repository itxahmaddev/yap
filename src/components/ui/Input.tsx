import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "compact";
}

export const Input: React.FC<InputProps> = ({
  className = "",
  variant = "default",
  disabled,
  ...props
}) => {
  const baseClasses =
    "text-[13px] font-medium bg-text/[0.05] border border-transparent rounded-[10px] text-start transition-[border-color,box-shadow,background-color] duration-150";

  const interactiveClasses = disabled
    ? "opacity-50 cursor-not-allowed bg-wash border-line"
    : "hover:bg-text/[0.08] focus:outline-none focus:bg-surface focus:border-text/40 focus:ring-4 focus:ring-text/[0.06]";

  const variantClasses = {
    default: "px-3 py-2",
    compact: "px-2 py-1",
  } as const;

  return (
    <input
      className={`${baseClasses} ${variantClasses[variant]} ${interactiveClasses} ${className}`}
      disabled={disabled}
      {...props}
    />
  );
};
