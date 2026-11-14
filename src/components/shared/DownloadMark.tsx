import React from "react";
import { ArrowDown } from "@/components/icons/devigner";

/**
 * Marks something not downloaded yet; turns solid while its `group` row is
 * hovered, in the accent color on rows that highlight in it.
 */
export const DownloadMark: React.FC<{ accent?: boolean }> = ({ accent }) => (
  <span
    aria-hidden="true"
    className={`grid size-[18px] shrink-0 place-items-center rounded-[6px] border-[1.5px] border-line-strong text-ink-3 transition-colors group-hover:border-solid ${
      accent
        ? "group-hover:border-logo-primary group-hover:text-logo-primary"
        : "group-hover:border-text group-hover:text-text"
    }`}
  >
    <ArrowDown className="size-[11px]" strokeWidth={2.75} />
  </span>
);
