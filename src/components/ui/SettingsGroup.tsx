import React from "react";

interface SettingsGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const SettingsGroup: React.FC<SettingsGroupProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <section className="space-y-2 w-full animate-rise motion-reduce:animate-none">
      {title && (
        <div className="px-2">
          <h2 className="text-[13px] font-medium text-ink-2 tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-ink-3 mt-1">{description}</p>
          )}
        </div>
      )}
      <div className="bg-surface border border-line rounded-xl overflow-visible">
        <div className="divide-y divide-line">{children}</div>
      </div>
    </section>
  );
};
