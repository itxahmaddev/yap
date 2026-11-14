import React from "react";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
} from "@/components/icons/devigner";

type AlertVariant = "error" | "warning" | "info" | "success";

interface AlertProps {
  variant?: AlertVariant;
  /** When true, removes rounded corners for use inside containers */
  contained?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<
  AlertVariant,
  { container: string; icon: string; text: string }
> = {
  error: {
    container: "bg-error-wash border border-error/25",
    icon: "text-error",
    text: "text-error",
  },
  warning: {
    container: "bg-warning-wash border border-warning/25",
    icon: "text-warning",
    text: "text-warning",
  },
  info: {
    container: "bg-muted/60 border border-border",
    icon: "text-primary",
    text: "text-ink-2",
  },
  success: {
    container: "bg-moss-wash border border-moss/25",
    icon: "text-moss",
    text: "text-moss",
  },
};

const variantIcons: Record<AlertVariant, React.ElementType> = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

export const Alert: React.FC<AlertProps> = ({
  variant = "error",
  contained = false,
  children,
  className = "",
}) => {
  const styles = variantStyles[variant];
  const Icon = variantIcons[variant];

  return (
    <div
      className={`flex items-start gap-3 p-3.5 text-[13px] ${styles.container} ${contained ? "" : "rounded-xl"} ${className}`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${styles.icon}`} />
      <p className={`text-sm ${styles.text}`}>{children}</p>
    </div>
  );
};
