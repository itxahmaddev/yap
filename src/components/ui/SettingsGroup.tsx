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
    <section className="space-y-3 w-full animate-rise motion-reduce:animate-none">
      {title && (
        <div className="px-2">
          <h2 className="text-[11px] font-semibold text-ink-3 uppercase tracking-[0.12em]">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-ink-3 mt-1">{description}</p>
          )}
        </div>
      )}
      <div className="bg-surface border border-line rounded-3xl shadow-card overflow-visible">
        <div className="divide-y divide-line/70">{children}</div>
      </div>
    </section>
  );
};
