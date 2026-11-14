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
    "text-[13px] font-medium bg-muted/60 border border-border rounded-lg text-start placeholder:text-muted-foreground transition-[border-color,box-shadow,background-color] duration-200";

  const interactiveClasses = disabled
    ? "opacity-50 cursor-not-allowed bg-wash border-line"
    : "hover:border-input focus:outline-none focus:bg-background focus:border-ring/60 focus:ring-[3px] focus:ring-ring/15";

  const variantClasses = {
    default: "px-3 py-1.5",
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
