import React from "react";
import { GooSwitch } from "./devigner/goo-switch";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Names the switch for assistive tech when no visible label points at it. */
  ariaLabel?: string;
  /** The id of a visible label that names the switch. */
  ariaLabelledBy?: string;
}

/** The on/off switch on its own (Devigner's Goo Switch); ToggleSwitch puts it in a settings row. */
export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  ariaLabel,
  ariaLabelledBy,
}) => (
  <GooSwitch
    size="sm"
    checked={checked}
    onCheckedChange={onChange}
    disabled={disabled}
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledBy}
    className="shrink-0"
  />
);
