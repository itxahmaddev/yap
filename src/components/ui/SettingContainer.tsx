import React from "react";
import { InfoTooltip } from "./InfoTooltip";
import { useSettingTile } from "./SettingsGroup";

interface SettingContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
  descriptionMode?: "inline" | "tooltip";
  grouped?: boolean;
  layout?: "horizontal" | "stacked";
  disabled?: boolean;
  tooltipPosition?: "top" | "bottom";
  /** Horizontal only: the control takes the row's free width, for content that fits itself to it. */
  grow?: boolean;
}

export const SettingContainer: React.FC<SettingContainerProps> = ({
  title,
  description,
  children,
  descriptionMode = "tooltip",
  grouped = false,
  layout = "horizontal",
  disabled = false,
  tooltipPosition = "top",
  grow = false,
}) => {
  const tile = useSettingTile();

  // Grid tile: title and description on top, the control anchored below.
  // Wide content (stacked editors, controls that fill the row) spans the grid.
  if (tile) {
    const wide = layout === "stacked" || grow;
    return (
      <div
        className={`group/tile flex min-h-[124px] flex-col gap-3 rounded-[16px] border border-line bg-surface p-4 transition-[border-color,box-shadow] duration-200 hover:border-text/20 hover:shadow-[0_6px_20px_-12px_rgb(0_0_0/0.25)] ${
          wide ? "col-span-full" : ""
        }`}
      >
        <div className={`min-w-0 ${disabled ? "opacity-50" : ""}`}>
          <h3 className="text-[13.5px] font-semibold leading-snug tracking-tight text-text">
            {title}
          </h3>
          {description && (
            <p
              className="mt-1 line-clamp-3 text-[12px] leading-[1.45] text-ink-3"
              title={description}
            >
              {description}
            </p>
          )}
        </div>
        <div
          className={`relative mt-auto flex w-full min-w-0 items-center gap-2 ${
            wide ? "" : "justify-end"
          }`}
        >
          {wide ? <div className="w-full min-w-0">{children}</div> : children}
        </div>
      </div>
    );
  }

  const info = (
    <InfoTooltip
      text={description}
      placement={tooltipPosition === "bottom" ? "below" : "above"}
    />
  );

  const containerClasses = grouped
    ? "px-4 py-3"
    : "px-4 py-3 rounded-xl border border-line bg-surface";

  if (layout === "stacked") {
    if (descriptionMode === "tooltip") {
      return (
        <div className={containerClasses}>
          <div className="flex items-center gap-2 mb-2">
            <h3
              className={`text-sm font-medium ${disabled ? "opacity-50" : ""}`}
            >
              {title}
            </h3>
            {info}
          </div>
          <div className="w-full">{children}</div>
        </div>
      );
    }

    return (
      <div className={containerClasses}>
        <div className="mb-2">
          <h3 className={`text-sm font-medium ${disabled ? "opacity-50" : ""}`}>
            {title}
          </h3>
          <p className={`text-sm ${disabled ? "opacity-50" : ""}`}>
            {description}
          </p>
        </div>
        <div className="w-full">{children}</div>
      </div>
    );
  }

  // Horizontal layout (default)
  const horizontalContainerClasses = `${
    grouped
      ? "flex items-center justify-between gap-4 min-h-14 px-4 py-3"
      : "flex items-center justify-between gap-4 min-h-14 px-4 py-3 rounded-xl border border-line bg-surface"
  }${grow ? " gap-4" : ""}`;
  const titleClasses = grow ? "max-w-2/3 shrink-0" : "max-w-2/3";
  const controlClasses = grow
    ? "relative flex min-w-0 flex-1 justify-end"
    : "relative";

  if (descriptionMode === "tooltip") {
    return (
      <div className={horizontalContainerClasses}>
        <div className={titleClasses}>
          <div className="flex items-center gap-2">
            <h3
              className={`text-sm font-medium ${disabled ? "opacity-50" : ""}`}
            >
              {title}
            </h3>
            {info}
          </div>
        </div>
        <div className={controlClasses}>{children}</div>
      </div>
    );
  }

  return (
    <div className={horizontalContainerClasses}>
      <div className={titleClasses}>
        <h3 className={`text-sm font-medium ${disabled ? "opacity-50" : ""}`}>
          {title}
        </h3>
        <p className={`text-sm ${disabled ? "opacity-50" : ""}`}>
          {description}
        </p>
      </div>
      <div className={controlClasses}>{children}</div>
    </div>
  );
};
