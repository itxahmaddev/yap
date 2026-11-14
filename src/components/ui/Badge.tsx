import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  className = "",
}) => {
  const variantClasses = {
    // The blue "New" chip from ui.devigner.cc
    primary:
      "border border-primary/40 bg-gradient-to-b from-primary/30 to-primary/10 text-primary shadow-[inset_0_1px_0_rgb(255_255_255/0.15)]",
    secondary: "border border-border bg-muted text-muted-foreground",
  };

  return (
    <span
      className={`inline-flex items-center px-2 h-5 rounded-full text-[10.5px] font-semibold ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
