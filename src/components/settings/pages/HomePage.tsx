import React from "react";
import { useTranslation } from "react-i18next";
import { SettingsGroup } from "../../ui/SettingsGroup";
import { useSettings } from "../../../hooks/useSettings";
import { useOsType } from "../../../hooks/useOsType";
import { useModelStore } from "../../../stores/modelStore";
import { formatKeyCombination } from "../../../lib/utils/keyboard";
import YapWave from "../../icons/YapWave";
import { ArrowRightIcon, HistoryIcon, ModelsIcon } from "../../icons/NavIcons";
import { Crosshair, SelectionFrame } from "../../ui/SelectionFrame";
import Badge from "../../ui/Badge";
import { Mic } from "../../icons/devigner";
import { MicrophoneSelector } from "../MicrophoneSelector";
import { AudioFeedback } from "../AudioFeedback";
import { MuteWhileRecording } from "../MuteWhileRecording";
import { ThemeSelector } from "../ThemeSelector";

interface HomePageProps {
  onOpenModels: () => void;
  onOpenHistory: () => void;
}

/** A link card: icon tile, mono label, value, and an arrow that slides on hover. */
const LinkCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  action: string;
  onClick: () => void;
}> = ({ icon, label, value, action, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group relative flex min-w-0 cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-surface p-4 text-start transition-[border-color,background-color,scale] duration-300 ease-glide hover:border-input hover:bg-accent/40 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
  >
    <span className="flex items-center justify-between">
      <span className="grid size-9 place-items-center rounded-xl border border-border bg-muted text-primary">
        {icon}
      </span>
      <span className="grid size-7 place-items-center rounded-full border border-border text-muted-foreground transition-[color,border-color,background-color] duration-300 group-hover:border-primary/50 group-hover:bg-primary group-hover:text-primary-foreground">
        <ArrowRightIcon
          width={14}
          height={14}
          className="transition-transform duration-300 ease-glide group-hover:-rotate-45 rtl:rotate-180"
        />
      </span>
    </span>
    <span className="min-w-0">
      <span className="block font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </span>
      <span className="mt-1 block truncate text-[14px] font-medium text-foreground">
        {value}
      </span>
      <span className="block truncate text-[12px] text-muted-foreground">
        {action}
      </span>
    </span>
  </button>
);

export const HomePage: React.FC<HomePageProps> = ({
  onOpenModels,
  onOpenHistory,
}) => {
  const { t } = useTranslation();
  const { getSetting } = useSettings();
  const osType = useOsType();
  const { currentModel, models } = useModelStore();

  const binding = getSetting("bindings")?.transcribe?.current_binding;
  const keys = binding
    ? formatKeyCombination(binding, osType)
        .split("+")
        .map((key) => key.trim())
        .filter(Boolean)
    : [];
  const modelName =
    models.find((model) => model.id === currentModel)?.name ??
    t("pages.home.noModel");

  return (
    <>
      {/* Hero: a grid-lined specimen board, as on the Devigner sites */}
      <section className="relative w-full overflow-hidden rounded-2xl border border-border bg-surface animate-pop motion-reduce:animate-none">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-line)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_75%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 end-10 h-56 w-72 rounded-full bg-primary/20 blur-3xl"
        />
        <Crosshair className="top-3 start-3" />
        <Crosshair className="top-3 end-3" />
        <Crosshair className="bottom-3 start-3" />
        <Crosshair className="bottom-3 end-3" />

        <div className="relative flex items-center gap-6 p-7">
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/70 py-[3px] ps-[3px] pe-3 text-[12px] text-muted-foreground backdrop-blur">
              <Badge className="gap-1">
                <span className="size-1.5 animate-pulse rounded-full bg-primary motion-reduce:animate-none" />
                <Mic size={11} variant="Bold" />
              </Badge>
              {t("pages.home.onDevice")}
            </span>
            <div className="max-w-[420px]">
              <h2 className="m-0 text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-foreground">
                {t("pages.home.readyTitle")}
              </h2>
              <p className="mt-2.5 mb-0 text-[13.5px] leading-relaxed text-muted-foreground">
                {t("pages.home.readyBody")}
              </p>
            </div>
            {keys.length > 0 && (
              // The shortcut as a terminal pill, like "$ npx devignerui init"
              <div className="inline-flex h-10 w-fit items-center gap-2 rounded-full border border-border bg-background/80 ps-4 pe-1.5 font-mono text-[12px] text-muted-foreground backdrop-blur">
                <span className="text-primary">$</span>
                <span className="lowercase">{t("pages.home.shortcut")}</span>
                <span className="flex items-center gap-1">
                  {keys.map((key, index) => (
                    <kbd
                      key={`${key}-${index}`}
                      className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-input bg-muted px-2.5 font-mono text-[11.5px] font-medium text-foreground shadow-[inset_0_-1.5px_0_var(--color-line-strong)]"
                    >
                      {key}
                    </kbd>
                  ))}
                </span>
              </div>
            )}
          </div>

          <SelectionFrame className="hidden shrink-0 rounded-2xl sm:inline-flex">
            <span className="grid size-[120px] place-items-center rounded-2xl bg-gradient-to-b from-muted to-background text-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]">
              <YapWave height={52} animated />
            </span>
          </SelectionFrame>
        </div>
      </section>

      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3">
        <LinkCard
          icon={<ModelsIcon width={18} height={18} variant="Bulk" />}
          label={t("pages.home.model")}
          value={modelName}
          action={t("pages.home.manageModels")}
          onClick={onOpenModels}
        />
        <LinkCard
          icon={<HistoryIcon width={18} height={18} variant="Bulk" />}
          label={t("sidebar.history")}
          value={t("pages.history.subtitle")}
          action={t("pages.home.openHistory")}
          onClick={onOpenHistory}
        />
      </div>

      <SettingsGroup title={t("pages.home.quickSettings")}>
        <MicrophoneSelector descriptionMode="tooltip" grouped={true} />
        <AudioFeedback descriptionMode="tooltip" grouped={true} />
        <MuteWhileRecording descriptionMode="tooltip" grouped={true} />
        <ThemeSelector descriptionMode="tooltip" grouped={true} />
      </SettingsGroup>
    </>
  );
};
