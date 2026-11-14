import React, { createContext, useContext } from "react";

/** Whether settings inside the current group render as rows of its panel. */
const TileContext = createContext(false);

export const useSettingTile = () => useContext(TileContext);

interface SettingsGroupProps {
  title?: string;
  description?: string;
  /** Kept for callers; both layouts draw the same row panel now. */
  layout?: "grid" | "list";
  children: React.ReactNode;
}

/** Six dots: the panel's drag-handle mark, as on Devigner UI's panels. */
export const GripMark: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <span
    aria-hidden="true"
    className={`grid shrink-0 grid-cols-2 gap-[2px] text-muted-foreground/70 ${className}`}
  >
    {Array.from({ length: 6 }, (_, i) => (
      <i key={i} className="block size-[2.5px] rounded-full bg-current" />
    ))}
  </span>
);

/** A settings panel: a header with a grip and title, then hairline rows. */
export const SettingsGroup: React.FC<SettingsGroupProps> = ({
  title,
  description,
  children,
}) => (
  <section className="w-full animate-rise overflow-visible rounded-2xl border border-border bg-surface shadow-[0_1px_0_rgb(255_255_255/0.03)_inset,0_12px_32px_-20px_rgb(0_0_0/0.35)] motion-reduce:animate-none">
    {(title || description) && (
      <header className="flex min-h-11 items-center gap-2.5 border-b border-border px-4 py-2.5">
        <GripMark />
        <div className="min-w-0">
          {title && (
            <h2 className="m-0 truncate text-[13px] font-semibold tracking-[-0.01em] text-foreground">
              {title}
            </h2>
          )}
          {description && (
            <p className="m-0 text-[12px] leading-snug text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </header>
    )}
    <TileContext.Provider value={true}>
      <div className="divide-y divide-border">{children}</div>
    </TileContext.Provider>
  </section>
);
