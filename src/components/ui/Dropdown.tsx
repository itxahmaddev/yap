import React, { useEffect, useRef, useState } from "react";
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
  const chosen = tone === "neutral" ? "bg-line" : "bg-text/[0.08]";

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
        className={`h-9 px-3 text-[13px] font-medium bg-text/[0.06] border border-transparent rounded-[10px] min-w-[180px] w-full text-start grid grid-cols-[1fr_auto] gap-2 items-center transition-[background-color,border-color,box-shadow] duration-150 aria-expanded:bg-surface aria-expanded:border-text/40 aria-expanded:ring-4 aria-expanded:ring-text/[0.06] ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : `hover:bg-text/[0.1] cursor-pointer`
        }`}
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <svg
          className="w-4 h-4 text-ink-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9.5l4-4 4 4M8 14.5l4 4 4-4"
          />
        </svg>
      </button>
      {isOpen && !disabled && (
        <div
          className={`absolute ${placement === "above" ? "bottom-full mb-1" : "top-full mt-1"} bg-surface border border-line rounded-[12px] shadow-pop z-50 animate-drop max-h-64 overflow-y-auto p-1.5 ${
            menuClassName ?? "left-0 right-0"
          }`}
        >
          {options.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-ink-3">
              {t("common.noOptionsFound")}
            </div>
          ) : (
            options.map((option) => {
              const isChosen = selectedValue === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`flex w-full items-center gap-2 rounded-[8px] px-2.5 text-[13px] text-start transition-colors duration-150 ${
                    option.description ? "py-2" : "py-1.5"
                  } ${isChosen ? chosen : "hover:bg-wash"} ${
                    option.disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => handleSelect(option.value)}
                  disabled={option.disabled}
                >
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block whitespace-normal break-words ${
                        isChosen ? "font-semibold" : ""
                      }`}
                    >
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="mt-0.5 block whitespace-normal text-xs font-normal leading-snug text-ink-3">
                        {option.description}
                      </span>
                    )}
                  </span>
                  {isChosen && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="shrink-0 text-ink-2"
                    >
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
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
