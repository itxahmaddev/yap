import React from "react";

/** A small rounded word beside a name ("Recommended", "Old format"). */
export const Tag: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  className = "",
  ...props
}) => (
  <span
    className={`shrink-0 whitespace-nowrap rounded-[6px] border px-[6px] font-mono text-[10.5px] leading-[18px] font-medium border-border bg-muted text-muted-foreground ${className}`}
    {...props}
  />
);
