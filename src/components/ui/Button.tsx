import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "primary-soft"
    | "secondary"
    | "outline"
    | "warning"
    | "danger"
    | "danger-ghost"
    | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-1.5 font-medium rounded-lg border focus:outline-none transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-glide active:scale-[0.98] motion-reduce:active:scale-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer select-none";

  const variantClasses = {
    primary:
      "text-on-accent bg-background-ui border-background-ui hover:bg-background-ui/85 focus-visible:ring-2 focus-visible:ring-text/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "primary-soft":
      "text-text bg-text/10 border-transparent hover:bg-text/15 focus-visible:ring-2 focus-visible:ring-text/30",
    secondary:
      "text-text bg-surface border-line-strong/60 hover:bg-wash hover:border-text/50 focus-visible:ring-2 focus-visible:ring-text/30",
    // For screens where secondary's fill reads as disabled (onboarding)
    outline:
      "text-text bg-transparent border-line-strong hover:border-text hover:bg-surface focus-visible:ring-2 focus-visible:ring-text/30",
    // Neutral resting look, but hover/focus use the semantic warning color,
    // for buttons sitting on warning surfaces like SecureInputWarning
    warning:
      "text-text bg-surface border-line hover:bg-warning-wash hover:border-warning focus-visible:ring-2 focus-visible:ring-warning",
    danger:
      "text-background bg-error border-error hover:bg-error/85 focus-visible:ring-2 focus-visible:ring-error",
    "danger-ghost":
      "text-error border-transparent hover:bg-error-wash focus:bg-error-wash",
    ghost:
      "text-current border-transparent hover:bg-text/10 focus-visible:bg-text/10",
  };

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3.5 py-1.5 text-sm",
    lg: "px-5 py-2 text-[15px]",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
