import React from "react";
import { useSettingTile } from "./SettingsGroup";

interface SettingContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
  /** Kept for callers: the description now always sits under the title. */
  descriptionMode?: "inline" | "tooltip";
  grouped?: boolean;
  layout?: "horizontal" | "stacked";
  disabled?: boolean;
  tooltipPosition?: "top" | "bottom";
  /** Horizontal only: the control takes the row's free width, for content that fits itself to it. */
  grow?: boolean;
}

/**
 * One setting as a row of a Devigner-style panel: label and hint on the left,
 * the control on the right. Stacked settings put the control under the label.
 * Outside a SettingsGroup the row draws its own panel.
 */
export const SettingContainer: React.FC<SettingContainerProps> = ({
  title,
  description,
  children,
  grouped = false,
  layout = "horizontal",
  disabled = false,
  grow = false,
}) => {
  const inPanel = useSettingTile() || grouped;
  const stacked = layout === "stacked";

  const label = (
    <div className={`min-w-0 ${disabled ? "opacity-50" : ""}`}>
      <h3 className="m-0 text-[13px] font-medium leading-5 tracking-[-0.005em] text-foreground">
        {title}
      </h3>
      {description && (
        <p
          className="m-0 mt-0.5 line-clamp-2 text-[12px] leading-[1.45] text-muted-foreground"
          title={description}
        >
          {description}
        </p>
      )}
    </div>
  );

  const row = stacked ? (
    <div className="flex flex-col gap-3 px-4 py-3.5 transition-colors duration-200 hover:bg-foreground/[0.015]">
      {label}
      <div className="relative w-full min-w-0">{children}</div>
    </div>
  ) : (
    <div className="flex min-h-[56px] items-center justify-between gap-6 px-4 py-3 transition-colors duration-200 hover:bg-foreground/[0.015]">
      <div className={grow ? "max-w-[45%] shrink-0" : "min-w-0 flex-1"}>
        {label}
      </div>
      <div
        className={`relative flex min-w-0 items-center justify-end gap-2 ${
          grow ? "flex-1" : "shrink-0"
        }`}
      >
        {children}
      </div>
    </div>
  );

  if (inPanel) return row;
  return (
    <div className="overflow-visible rounded-2xl border border-border bg-surface">
      {row}
    </div>
  );
};
