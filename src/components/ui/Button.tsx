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

/** Devigner-style pill button: blue primary, hairline secondaries. */
export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-1.5 rounded-full border font-medium whitespace-nowrap select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-[background-color,border-color,color,box-shadow,scale] duration-200 ease-glide active:scale-[0.97] motion-reduce:active:scale-100 disabled:cursor-not-allowed disabled:opacity-45 [&_svg]:shrink-0";

  const variantClasses = {
    // Solid blue pill with a lit top edge, as on ui.devigner.cc
    primary:
      "border-transparent bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_1px_2px_rgb(0_0_0/0.2),0_6px_16px_-8px_var(--color-primary)] hover:bg-primary/90",
    "primary-soft":
      "border-primary/25 bg-primary/12 text-primary hover:bg-primary/18",
    secondary:
      "border-border bg-muted text-foreground hover:bg-accent hover:border-input",
    outline:
      "border-input bg-transparent text-foreground hover:bg-accent hover:border-foreground/30",
    warning:
      "border-border bg-muted text-foreground hover:border-warning hover:bg-warning-wash hover:text-warning",
    danger:
      "border-transparent bg-error text-white hover:bg-error/90 shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]",
    "danger-ghost":
      "border-transparent text-error hover:bg-error-wash focus-visible:bg-error-wash",
    ghost:
      "border-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
  };

  const sizeClasses = {
    sm: "h-7 px-3 text-[12px] [&_svg]:size-3.5",
    md: "h-8 px-3.5 text-[13px] [&_svg]:size-4",
    lg: "h-10 px-5 text-[14px] [&_svg]:size-4",
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
