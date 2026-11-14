import React from "react";
import { ChevronDown } from "@/components/icons/devigner";

type ModelStatus =
  | "ready"
  | "loading"
  | "downloading"
  | "verifying"
  | "error"
  | "unloaded"
  | "none";

interface ModelStatusButtonProps {
  status: ModelStatus;
  displayText: string;
  isDropdownOpen: boolean;
  /** Ready, and transcribing in the background. */
  busy?: boolean;
  onClick: () => void;
  className?: string;
}

const ModelStatusButton: React.FC<ModelStatusButtonProps> = ({
  status,
  displayText,
  isDropdownOpen,
  busy = false,
  onClick,
  className = "",
}) => {
  const getStatusColor = (status: ModelStatus): string => {
    switch (status) {
      case "ready":
        return busy
          ? "bg-moss animate-pulse motion-reduce:animate-none"
          : "bg-moss";
      case "loading":
        return "bg-warning animate-pulse";
      case "downloading":
        return "bg-logo-primary animate-pulse";
      case "verifying":
        return "bg-background-ui animate-pulse";
      case "error":
        return "bg-error";
      case "unloaded":
        return "bg-ink-3";
      case "none":
        return "bg-error";
      default:
        return "bg-ink-3";
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isDropdownOpen}
      className={`flex min-w-0 max-w-full cursor-pointer items-center gap-2 rounded-sm transition-colors hover:text-text focus:outline-none focus-visible:ring-1 focus-visible:ring-logo-primary ${className}`}
      title={displayText}
    >
      <span
        className={`size-2 shrink-0 rounded-full ${getStatusColor(status)}`}
      />
      <span className="min-w-0 truncate">{displayText}</span>
      <ChevronDown
        size={12}
        className={`shrink-0 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
};

export default ModelStatusButton;
