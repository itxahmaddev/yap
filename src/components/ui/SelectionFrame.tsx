import React from "react";

interface SelectionFrameProps {
  children: React.ReactNode;
  className?: string;
  /** Draw the dashed edge between the handles. */
  edge?: boolean;
}

const HANDLES = [
  "-top-[3px] -start-[3px]",
  "-top-[3px] -end-[3px]",
  "-bottom-[3px] -start-[3px]",
  "-bottom-[3px] -end-[3px]",
];

/**
 * A design-tool selection box: a thin blue edge with square handles at the
 * corners, as Devigner draws around its specimens. Purely decorative.
 */
export const SelectionFrame: React.FC<SelectionFrameProps> = ({
  children,
  className = "",
  edge = true,
}) => (
  <span className={`relative inline-flex ${className}`}>
    {edge && (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] border border-primary/60"
      />
    )}
    {HANDLES.map((pos) => (
      <span
        key={pos}
        aria-hidden="true"
        className={`pointer-events-none absolute size-[6px] border border-primary bg-background ${pos}`}
      />
    ))}
    {children}
  </span>
);

/** A "+" crosshair, the mark Devigner puts where grid lines meet. */
export const Crosshair: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <span
    aria-hidden="true"
    className={`pointer-events-none absolute size-[9px] text-muted-foreground/50 ${className}`}
  >
    <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
    <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current" />
  </span>
);
