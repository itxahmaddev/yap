import React from "react";
import { useTranslation } from "react-i18next";
import { SettingsGroup } from "../../ui/SettingsGroup";
import { useSettings } from "../../../hooks/useSettings";
import { useOsType } from "../../../hooks/useOsType";
import { useModelStore } from "../../../stores/modelStore";
import { formatKeyCombination } from "../../../lib/utils/keyboard";
import YapWave from "../../icons/YapWave";
import { ArrowRightIcon, HistoryIcon, ModelsIcon } from "../../icons/NavIcons";
import { MicrophoneSelector } from "../MicrophoneSelector";
import { AudioFeedback } from "../AudioFeedback";
import { MuteWhileRecording } from "../MuteWhileRecording";
import { ThemeSelector } from "../ThemeSelector";

interface HomePageProps {
  onOpenModels: () => void;
  onOpenHistory: () => void;
}

/** A shortcut card: label, value, and an arrow button that opens a page. */
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
    className="group flex min-w-0 cursor-pointer items-center gap-3 rounded-[16px] border border-line bg-surface p-4 text-start transition-[border-color,box-shadow,transform] duration-200 hover:border-text/25 hover:shadow-[0_8px_24px_-14px_rgb(0_0_0/0.35)] active:translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-text/30"
  >
    <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-text/[0.06] text-text">
      {icon}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-3">
        {label}
      </span>
      <span className="block truncate text-[14px] font-semibold">{value}</span>
      <span className="block text-[12px] text-ink-2">{action}</span>
    </span>
    <ArrowRightIcon
      width={16}
      height={16}
      className="shrink-0 text-ink-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-text rtl:rotate-180"
    />
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
      {/* Hero: inverted card with the live waveform and the shortcut */}
      <section className="relative w-full overflow-hidden rounded-[22px] bg-text p-6 text-background animate-pop motion-reduce:animate-none">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-6 -top-6 text-background/10"
        >
          <YapWave height={180} animated />
        </div>
        <div className="relative flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-background/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-background/70">
            <span className="size-1.5 rounded-full bg-background/70" />
            {t("pages.home.onDevice")}
          </span>
          <div className="max-w-[440px]">
            <h2 className="m-0 text-[24px] font-semibold leading-tight tracking-[-0.02em]">
              {t("pages.home.readyTitle")}
            </h2>
            <p className="mt-2 mb-0 text-[13.5px] leading-relaxed text-background/70">
              {t("pages.home.readyBody")}
            </p>
          </div>
          {keys.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-background/55">
                {t("pages.home.shortcut")}
              </span>
              {keys.map((key, index) => (
                <kbd
                  key={`${key}-${index}`}
                  className="inline-flex h-8 min-w-8 items-center justify-center rounded-[9px] border border-background/20 bg-background/10 px-2.5 font-ui text-[13px] font-semibold text-background shadow-[inset_0_-2px_0_rgb(0_0_0/0.25)]"
                >
                  {key}
                </kbd>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3">
        <LinkCard
          icon={<ModelsIcon width={20} height={20} />}
          label={t("pages.home.model")}
          value={modelName}
          action={t("pages.home.manageModels")}
          onClick={onOpenModels}
        />
        <LinkCard
          icon={<HistoryIcon width={20} height={20} />}
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
