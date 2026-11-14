import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "@/components/icons/devigner";
import { useTranslation } from "react-i18next";

export interface DropdownOption {
  value: string;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  className?: string;
  menuClassName?: string;
  selectedValue: string | null;
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onOpen?: () => void;
  /** Where the menu opens: below the button (default), or above it. */
  placement?: "below" | "above";
  /** Highlight colour for hover and selection. */
  tone?: "brand" | "neutral";
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  className = "",
  menuClassName,
  placeholder = "Select an option...",
  disabled = false,
  onOpen,
  placement = "below",
  tone = "brand",
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // In the menu, hover is grey so it never looks chosen.
  const chosen = tone === "neutral" ? "bg-accent" : "bg-accent text-foreground";

  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen) onOpen?.();
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape" || !isOpen || disabled) return;
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div
      className={`relative ${className}`}
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        ref={triggerRef}
        className={`h-8 px-3 text-[13px] font-medium bg-muted/60 border border-border rounded-lg min-w-[180px] w-full text-start grid grid-cols-[1fr_auto] gap-2 items-center transition-[background-color,border-color,box-shadow] duration-200 ease-glide focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 aria-expanded:bg-background aria-expanded:border-ring/60 aria-expanded:ring-[3px] aria-expanded:ring-ring/15 ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : `hover:bg-accent hover:border-input cursor-pointer`
        }`}
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform duration-200 ease-glide ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && !disabled && (
        <div
          className={`absolute ${placement === "above" ? "bottom-full mb-1" : "top-full mt-1"} bg-popover border border-border rounded-xl shadow-pop z-50 animate-drop max-h-64 overflow-y-auto p-1 ${
            menuClassName ?? "left-0 right-0"
          }`}
        >
          {options.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              {t("common.noOptionsFound")}
            </div>
          ) : (
            options.map((option) => {
              const isChosen = selectedValue === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 text-[13px] text-start transition-colors duration-150 ${
                    option.description ? "py-2" : "py-1.5"
                  } ${isChosen ? chosen : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"} ${
                    option.disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleSelect(option.value)}
                  disabled={option.disabled}
                >
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block whitespace-normal break-words ${
                        isChosen ? "font-medium" : ""
                      }`}
                    >
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="mt-0.5 block whitespace-normal text-xs font-normal leading-snug text-muted-foreground">
                        {option.description}
                      </span>
                    )}
                  </span>
                  {isChosen && (
                    <Check size={15} className="shrink-0 text-primary" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
