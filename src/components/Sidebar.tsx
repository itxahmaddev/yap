import React from "react";
import { useTranslation } from "react-i18next";
import YapWave from "./icons/YapWave";
import {
  AboutIcon,
  AppearanceIcon,
  AudioIcon,
  DebugIcon,
  DictationIcon,
  HistoryIcon,
  HomeIcon,
  LanguagesIcon,
  ModelsIcon,
  OutputIcon,
  SparkleIcon,
  SystemIcon,
  type NavIconProps,
} from "./icons/NavIcons";
import Footer from "./footer";
import { useSettings } from "../hooks/useSettings";
import {
  HistorySettings,
  AboutSettings,
  PostProcessingSettings,
  ModelsSettings,
} from "./settings";
import { DictationPage } from "./settings/pages/DictationPage";
import { AudioPage } from "./settings/pages/AudioPage";
import { LanguagesPage } from "./settings/pages/LanguagesPage";
import { OutputPage } from "./settings/pages/OutputPage";
import { AppearancePage } from "./settings/pages/AppearancePage";
import { SystemPage } from "./settings/pages/SystemPage";

export type SidebarSection = keyof typeof SECTIONS_CONFIG;

type NavGroup = "workspace" | "preferences" | "app";

interface SectionConfig {
  group: NavGroup;
  labelKey: string;
  subtitleKey: string;
  icon: React.ComponentType<NavIconProps>;
  /** `null` when App renders the section itself, with its handlers. */
  component: React.ComponentType | null;
  enabled: (settings: any) => boolean;
}

export const SECTIONS_CONFIG = {
  home: {
    group: "workspace",
    labelKey: "sidebar.home",
    subtitleKey: "pages.home.subtitle",
    icon: HomeIcon,
    component: null,
    enabled: () => true,
  },
  history: {
    group: "workspace",
    labelKey: "sidebar.history",
    subtitleKey: "pages.history.subtitle",
    icon: HistoryIcon,
    component: HistorySettings,
    enabled: () => true,
  },
  models: {
    group: "workspace",
    labelKey: "sidebar.models",
    subtitleKey: "pages.models.subtitle",
    icon: ModelsIcon,
    component: ModelsSettings,
    enabled: () => true,
  },
  dictation: {
    group: "preferences",
    labelKey: "sidebar.dictation",
    subtitleKey: "pages.dictation.subtitle",
    icon: DictationIcon,
    component: DictationPage,
    enabled: () => true,
  },
  audio: {
    group: "preferences",
    labelKey: "sidebar.audio",
    subtitleKey: "pages.audio.subtitle",
    icon: AudioIcon,
    component: AudioPage,
    enabled: () => true,
  },
  languages: {
    group: "preferences",
    labelKey: "sidebar.languages",
    subtitleKey: "pages.languages.subtitle",
    icon: LanguagesIcon,
    component: LanguagesPage,
    enabled: () => true,
  },
  output: {
    group: "preferences",
    labelKey: "sidebar.output",
    subtitleKey: "pages.output.subtitle",
    icon: OutputIcon,
    component: OutputPage,
    enabled: () => true,
  },
  postprocessing: {
    group: "preferences",
    labelKey: "sidebar.postProcessing",
    subtitleKey: "pages.postProcessing.subtitle",
    icon: SparkleIcon,
    component: PostProcessingSettings,
    enabled: (settings) => settings?.post_process_enabled ?? false,
  },
  appearance: {
    group: "app",
    labelKey: "sidebar.appearance",
    subtitleKey: "pages.appearance.subtitle",
    icon: AppearanceIcon,
    component: AppearancePage,
    enabled: () => true,
  },
  system: {
    group: "app",
    labelKey: "sidebar.system",
    subtitleKey: "pages.system.subtitle",
    icon: SystemIcon,
    component: SystemPage,
    enabled: () => true,
  },
  debug: {
    group: "app",
    labelKey: "sidebar.debug",
    subtitleKey: "pages.debug.subtitle",
    icon: DebugIcon,
    component: null,
    enabled: (settings) => settings?.debug_mode ?? false,
  },
  about: {
    group: "app",
    labelKey: "sidebar.about",
    subtitleKey: "pages.about.subtitle",
    icon: AboutIcon,
    component: AboutSettings,
    enabled: () => true,
  },
} as const satisfies Record<string, SectionConfig>;

const GROUPS: NavGroup[] = ["workspace", "preferences", "app"];

interface SidebarProps {
  activeSection: SidebarSection;
  onSectionChange: (section: SidebarSection) => void;
  onShowHistory: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  onShowHistory,
}) => {
  const { t } = useTranslation();
  const { settings } = useSettings();

  const availableSections = Object.entries(SECTIONS_CONFIG)
    .filter(([_, config]) => config.enabled(settings))
    .map(([id, config]) => ({ id: id as SidebarSection, ...config }));

  let order = 0;

  return (
    <nav className="flex h-full w-[212px] shrink-0 flex-col bg-text/[0.025] ps-3 pe-2 pt-4 pb-3">
      <div className="mb-4 flex items-center gap-2.5 px-2">
        <span className="grid size-8 place-items-center rounded-[10px] bg-text text-background">
          <YapWave height={14} />
        </span>
        {/* eslint-disable-next-line i18next/no-literal-string */}
        <span className="text-[16px] font-bold tracking-[-0.03em]">yap</span>
      </div>

      <div className="-me-1 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pe-1">
        {GROUPS.map((group) => {
          const items = availableSections.filter((s) => s.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className="flex flex-col gap-px">
              <span className="px-2 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-3">
                {t(`sidebar.groups.${group}`)}
              </span>
              {items.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                const delay = order++ * 25;
                return (
                  <button
                    type="button"
                    key={section.id}
                    aria-current={isActive ? "page" : undefined}
                    style={{ animationDelay: `${delay}ms` }}
                    className={`group flex h-[34px] w-full cursor-pointer items-center gap-2.5 rounded-[10px] px-1.5 text-start animate-rise [animation-fill-mode:backwards] motion-reduce:animate-none transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-text/30 ${
                      isActive
                        ? "bg-surface text-text shadow-[0_1px_2px_rgb(0_0_0/0.08),0_0_0_1px_var(--color-line)]"
                        : "text-ink-2 hover:bg-text/[0.05] hover:text-text"
                    }`}
                    onClick={() => onSectionChange(section.id)}
                  >
                    <span
                      className={`grid size-6 shrink-0 place-items-center rounded-[7px] transition-colors duration-150 ${
                        isActive
                          ? "bg-text text-background"
                          : "text-current group-hover:bg-text/[0.06]"
                      }`}
                    >
                      <Icon width={15} height={15} />
                    </span>
                    <span
                      className={`truncate text-[13px] ${isActive ? "font-semibold" : "font-medium"}`}
                      title={t(section.labelKey)}
                    >
                      {t(section.labelKey)}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <Footer onShowHistory={onShowHistory} />
    </nav>
  );
};
