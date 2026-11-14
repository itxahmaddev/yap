import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "compact";
}

export const Textarea: React.FC<TextareaProps> = ({
  className = "",
  variant = "default",
  ...props
}) => {
  const baseClasses =
    "px-2 py-1 text-[13px] bg-muted/60 border border-border rounded-xl text-start placeholder:text-muted-foreground transition-[background-color,border-color,box-shadow] duration-200 hover:border-input focus:outline-none focus:bg-background focus:border-ring/60 focus:ring-[3px] focus:ring-ring/15 resize-y";

  const variantClasses = {
    default: "px-3 py-2 min-h-[100px]",
    compact: "px-2 py-1 min-h-[80px]",
  };

  return (
    <textarea
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
};
