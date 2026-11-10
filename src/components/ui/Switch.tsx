import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Names the switch for assistive tech when no visible label points at it. */
  ariaLabel?: string;
  /** The id of a visible label that names the switch. */
  ariaLabelledBy?: string;
}

/** The on/off switch on its own; ToggleSwitch puts it in a settings row. */
export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  ariaLabel,
  ariaLabelledBy,
}) => {
  return (
    <label
      className={`group relative inline-flex shrink-0 items-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <input
        type="checkbox"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        value=""
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      {/* Squircle track; the square knob carries a check when on. */}
      <span className="relative block h-6 w-11 rounded-[8px] bg-text/12 transition-colors duration-200 ease-glide group-hover:bg-text/18 peer-checked:bg-text peer-checked:group-hover:bg-text/85 peer-focus-visible:ring-2 peer-focus-visible:ring-text/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background peer-disabled:opacity-40" />
      <span className="pointer-events-none absolute start-[3px] top-[3px] grid size-[18px] place-items-center rounded-[6px] bg-surface text-text shadow-[0_1px_2px_rgb(0_0_0/0.25)] transition-transform duration-200 ease-glide peer-checked:translate-x-5 peer-checked:bg-background rtl:peer-checked:-translate-x-5">
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`transition-opacity duration-150 ${checked ? "opacity-100" : "opacity-0"}`}
        >
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
    </label>
  );
};
