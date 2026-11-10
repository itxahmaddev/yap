import React, { createContext, useContext } from "react";

/** Whether settings inside the current group render as grid tiles. */
const TileContext = createContext(false);

export const useSettingTile = () => useContext(TileContext);

interface SettingsGroupProps {
  title?: string;
  description?: string;
  /** "grid" lays settings out as tiles; "list" keeps full-width rows for editors. */
  layout?: "grid" | "list";
  children: React.ReactNode;
}

export const SettingsGroup: React.FC<SettingsGroupProps> = ({
  title,
  description,
  layout = "grid",
  children,
}) => {
  return (
    <section className="w-full animate-rise motion-reduce:animate-none">
      {title && (
        <div className="mb-3 flex items-center gap-3">
          <h2 className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            {title}
          </h2>
          <span aria-hidden="true" className="h-px flex-1 bg-line" />
        </div>
      )}
      {description && (
        <p className="-mt-1 mb-3 text-xs text-ink-3">{description}</p>
      )}
      {layout === "grid" ? (
        <TileContext.Provider value={true}>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3">
            {children}
          </div>
        </TileContext.Provider>
      ) : (
        <div className="overflow-visible rounded-[16px] border border-line bg-surface">
          <div className="divide-y divide-line">{children}</div>
        </div>
      )}
    </section>
  );
};
