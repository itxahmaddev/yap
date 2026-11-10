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
    "inline-flex items-center justify-center gap-1.5 font-medium rounded-[10px] border focus:outline-none transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-glide active:translate-y-px motion-reduce:active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none whitespace-nowrap";

  const variantClasses = {
    // Solid ink with a soft top highlight
    primary:
      "text-on-accent bg-background-ui border-background-ui shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_1px_2px_rgb(0_0_0/0.2)] hover:bg-background-ui/88 focus-visible:ring-4 focus-visible:ring-text/15",
    "primary-soft":
      "text-text bg-text/[0.08] border-transparent hover:bg-text/[0.12] focus-visible:ring-4 focus-visible:ring-text/10",
    // Filled, borderless
    secondary:
      "text-text bg-text/[0.06] border-transparent hover:bg-text/[0.1] focus-visible:ring-4 focus-visible:ring-text/10",
    // For screens where a fill reads as disabled (onboarding)
    outline:
      "text-text bg-transparent border-text/25 hover:border-text/60 hover:bg-text/[0.04] focus-visible:ring-4 focus-visible:ring-text/10",
    // Neutral resting look; hover/focus use the semantic warning color
    warning:
      "text-text bg-text/[0.06] border-transparent hover:bg-warning-wash hover:border-warning focus-visible:ring-2 focus-visible:ring-warning",
    danger:
      "text-background bg-error border-error hover:bg-error/85 focus-visible:ring-4 focus-visible:ring-error/25",
    "danger-ghost":
      "text-error border-transparent hover:bg-error-wash focus:bg-error-wash",
    ghost:
      "text-current border-transparent hover:bg-text/[0.07] focus-visible:bg-text/[0.07]",
  };

  const sizeClasses = {
    sm: "h-7 px-2.5 text-xs",
    md: "h-9 px-3.5 text-[13px]",
    lg: "h-11 px-5 text-sm",
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
