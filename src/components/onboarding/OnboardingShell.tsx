import YapWave from "../icons/YapWave";
import React from "react";
import { useTranslation } from "react-i18next";

interface OnboardingShellProps {
  /** Where this screen is in the flow; no dashes on a standalone screen. */
  progress?: { index: number; count: number };
  /** Top right: Welcome's menu language. */
  pill?: React.ReactNode;
  children: React.ReactNode;
  /** The footer's left slot; replaces Back. */
  left?: React.ReactNode;
  onBack?: () => void;
  hint?: React.ReactNode;
  /** Warnings read as warnings, not hints. */
  hintTone?: "quiet" | "warning";
  primary?: React.ReactNode;
}

/** Frame for every onboarding screen: progress dashes, screen, footer. */
export const OnboardingShell: React.FC<OnboardingShellProps> = ({
  progress,
  pill,
  children,
  left,
  onBack,
  hint,
  hintTone = "quiet",
  primary,
}) => {
  const { t } = useTranslation();
  return (
    <div
      data-onboarding=""
      className="h-screen w-full flex overflow-hidden bg-background select-none cursor-default"
    >
      {/* Disabled buttons go neutral so the only filled one is the next step.
          The column is capped so a long row truncates instead of widening. */}
      <div className="relative m-auto flex h-[600px] w-[720px] shrink-0 font-ui text-body leading-[1.6] text-text antialiased [&_button:disabled]:border-line [&_button:disabled]:bg-wash [&_button:disabled]:text-ink-3 [&_button:disabled]:opacity-100 [&_button:disabled]:shadow-none">
        {/* Dark rail: the mark, a vertical step tracker, and the step count */}
        <aside className="relative m-2 me-0 flex w-[76px] shrink-0 flex-col items-center justify-between overflow-hidden rounded-[20px] bg-text py-5 text-background">
          <span className="grid size-10 place-items-center rounded-[12px] bg-background/10">
            <YapWave height={18} animated />
          </span>
          {progress ? (
            <div
              className="flex flex-col items-center gap-[6px]"
              role="img"
              aria-label={t("onboarding.shell.progress", {
                step: progress.index + 1,
                count: progress.count,
              })}
            >
              {Array.from({ length: progress.count }, (_, i) => (
                <i
                  key={i}
                  className={`w-[6px] rounded-full transition-[height,background-color] duration-500 ease-glide ${
                    i === progress.index
                      ? "h-[34px] bg-background"
                      : i < progress.index
                        ? "h-[6px] bg-background/60"
                        : "h-[6px] bg-background/20"
                  }`}
                />
              ))}
            </div>
          ) : (
            <span />
          )}
          <span className="font-mono text-[11px] font-semibold tabular-nums text-background/60">
            {progress ? `${progress.index + 1}/${progress.count}` : ""}
          </span>
        </aside>

        <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)] grid-rows-[52px_1fr_76px]">
          <div className="relative flex items-center justify-end ps-[24px] pe-[20px]">
            {pill}
          </div>
          <div className="min-h-0">{children}</div>
          <div className="flex items-center justify-between gap-[16px] px-[24px] pb-[4px]">
            {left ??
              (onBack ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="-ms-[10px] inline-flex cursor-pointer items-center gap-1.5 rounded-[10px] border border-transparent px-[12px] py-[8px] text-body font-medium text-ink-2 transition-colors hover:bg-text/[0.07] hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-text/40"
                >
                  <span aria-hidden="true" className="rtl:rotate-180">
                    &larr;
                  </span>
                  {t("onboarding.shell.back")}
                </button>
              ) : (
                <span />
              ))}
            <div
              className={`ms-auto min-w-0 text-small ${hintTone === "warning" ? "text-warning" : "text-ink-3"}`}
            >
              {hint}
            </div>
            {primary}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Horizontal alignment; text is always centred. */
const ALIGN = {
  center: "items-center",
  stretch: "items-stretch",
} as const;

/** Gap between header and content, per layout. */
const GAP = {
  center: "min-h-lead max-h-lead-max flex-[1_1_0]",
  top: "h-lead flex-none",
} as const;

/** A screen's main block: header, gap, content. */
export const ScreenMain = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: keyof typeof ALIGN;
    /** Usually a ScreenHeader. */
    header?: React.ReactNode;
    /** "center" centres everything; "top" pins the header and content fills. */
    layout?: keyof typeof GAP;
  }
>(
  (
    {
      children,
      align = "center",
      header,
      layout = "center",
      className = "",
      ...rest
    },
    ref,
  ) => (
    <div
      ref={ref}
      {...rest}
      className={`flex h-full min-h-0 min-w-0 flex-col ${layout === "center" ? "justify-center-safe" : ""} text-center px-gutter ${className}`}
    >
      {header}
      {header && <div aria-hidden="true" className={GAP[layout]} />}
      <div
        className={`flex min-h-0 w-full flex-col ${layout === "top" ? "flex-1" : ""} ${ALIGN[align]}`}
      >
        {children}
      </div>
    </div>
  ),
);
ScreenMain.displayName = "ScreenMain";

/** A screen's title and subtitle; pass as ScreenMain's header. */
export const ScreenHeader: React.FC<{
  title: React.ReactNode;
  sub?: React.ReactNode;
  subClassName?: string;
  /** Note above the title, out of flow so it doesn't push the title down. */
  above?: React.ReactNode;
}> = ({ title, sub, subClassName, above }) => (
  <div className="relative w-full flex-none text-start">
    {above && (
      <div className="absolute inset-x-0 bottom-full mb-[12px]">{above}</div>
    )}
    <ScreenTitle>{title}</ScreenTitle>
    {sub && <ScreenSub className={subClassName}>{sub}</ScreenSub>}
  </div>
);

export const ScreenTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <h1
    className={`m-0 font-display text-[28px] leading-[1.1] tracking-[-0.03em] text-balance font-bold ${className}`}
  >
    {children}
  </h1>
);

export const ScreenSub: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <p
    className={`mt-[6px] mb-0 text-[14px] text-ink-2 text-pretty ${className}`}
  >
    {children}
  </p>
);
