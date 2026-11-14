import React from "react";
import {
  bindingKeys,
  isOnlyModifiers,
  keycapLabel,
  keycapLabels,
  type OSType,
} from "@/lib/utils/keyboard";

interface KeycapsProps {
  /** The binding to draw, e.g. "option+space". */
  binding: string;
  osType: OSType;
  /** sm: standalone; screen: Demo's drawn screen; line: inline in body text. */
  size?: "sm" | "screen" | "line";
  /** Draw every key as held down. */
  pressed?: boolean;
  /** A combination still being captured: dashed, no drop. */
  partial?: boolean;
  /** Raise the keys on hover/focus of a parent `group/keycaps` control. */
  lift?: boolean;
  className?: string;
}

const SIZES = {
  sm: "h-[28px] min-w-[28px] px-[8px] rounded-[7px] text-[12px]",
  screen: "h-[22px] min-w-[22px] px-[6px] rounded-[5px] text-[10.5px]",
  line: "h-[23px] min-w-[23px] px-[6px] rounded-[6px] text-[12px]",
};

/** A shortcut binding drawn as physical keycaps. */
export const Keycaps: React.FC<KeycapsProps> = ({
  binding,
  osType,
  size = "sm",
  pressed = false,
  partial = false,
  lift = false,
  className = "",
}) => {
  const labels = keycapLabels(binding, osType);
  const state = pressed
    ? "translate-y-[2px] shadow-none bg-primary text-primary-foreground border-primary"
    : partial
      ? "translate-y-[2px] shadow-none border-dashed bg-primary/10 text-primary border-primary/60"
      : `shadow-[0_2px_0_0_var(--color-line-strong)] bg-muted text-foreground border-input ${
          lift
            ? "group-hover/keycaps:-translate-y-[1px] group-hover/keycaps:border-primary/50 group-hover/keycaps:shadow-[0_3px_0_0_var(--color-primary)] group-focus-visible/keycaps:-translate-y-[1px] group-focus-visible/keycaps:shadow-[0_3px_0_0_var(--color-primary)]"
            : ""
        }`;

  return (
    <span
      className={`inline-flex items-center gap-[4px] align-middle ${className}`}
      role="img"
      aria-label={keycapLabel(binding, osType)}
    >
      {labels.map((label, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`relative inline-flex items-center justify-center border font-mono font-medium leading-none select-none transition-[transform,box-shadow,background-color,border-color] duration-100 ease-out ${SIZES[size]} ${state}`}
        >
          {label}
        </span>
      ))}
    </span>
  );
};

const SLOT_SIZES = {
  sm: "h-[28px] min-w-[88px] px-[8px] rounded-[7px] text-[12px]",
  line: "h-[23px] min-w-[64px] px-[7px] rounded-[6px] text-[12px]",
};

/** Placeholder key shown while a shortcut is being captured. */
export const KeySlot: React.FC<
  React.HTMLAttributes<HTMLSpanElement> & { size?: "sm" | "line" }
> = ({ size = "sm", className = "", children, ...rest }) => (
  <span
    aria-hidden={children ? undefined : true}
    {...rest}
    className={`inline-flex translate-y-[2px] items-center justify-center whitespace-nowrap border border-dashed border-primary/60 bg-primary/5 font-mono font-medium leading-none text-primary animate-key-slot motion-reduce:animate-none ${SLOT_SIZES[size]} ${className}`}
  >
    {children}
  </span>
);

/** The instruction while capturing: modifiers alone still need a key. */
export const captureHintKey = (partial: string) =>
  isOnlyModifiers(bindingKeys(partial))
    ? "onboarding.demo.addKey"
    : "onboarding.demo.pressKeys";

/** While capturing: the keys pressed so far, dashed, or an empty slot before any. */
export const CapturedKeys: React.FC<{
  partial: string;
  osType: OSType;
  size?: "sm" | "line";
  /** On the keys and the slot alike. */
  className?: string;
  keysClassName?: string;
  slotClassName?: string;
  /** Words in the empty slot, announced. */
  slotLabel?: string;
}> = ({
  partial,
  osType,
  size = "sm",
  className = "",
  keysClassName = "",
  slotClassName = "",
  slotLabel,
}) =>
  bindingKeys(partial).length ? (
    <Keycaps
      binding={partial}
      osType={osType}
      size={size}
      partial
      className={`${className} ${keysClassName}`}
    />
  ) : (
    <KeySlot
      size={size}
      role={slotLabel ? "status" : undefined}
      className={`${className} ${slotClassName}`}
    >
      {slotLabel}
    </KeySlot>
  );
