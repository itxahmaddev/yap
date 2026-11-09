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
      className={`flex items-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <input
        type="checkbox"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        value=""
        className="sr-only peer"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="relative h-[22px] w-[40px] rounded-full bg-text/20 transition-colors duration-300 ease-glide peer-focus-visible:ring-2 peer-focus-visible:ring-text/50 peer-checked:bg-background-ui peer-checked:ring-0 peer-disabled:opacity-40 after:absolute after:start-[3px] after:top-[3px] after:size-4 after:rounded-full after:bg-surface after:content-[''] after:transition-transform after:duration-200 after:ease-glide peer-checked:after:translate-x-[18px] peer-checked:after:bg-on-accent rtl:peer-checked:after:-translate-x-[18px]"></div>
    </label>
  );
};
