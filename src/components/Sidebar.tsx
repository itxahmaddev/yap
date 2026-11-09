import React from "react";
import { useTranslation } from "react-i18next";
import { Cog, FlaskConical, History, Info, Sparkles, Cpu } from "lucide-react";
import YapWave from "./icons/YapWave";
import YapHand from "./icons/YapHand";
import { useSettings } from "../hooks/useSettings";
import {
  GeneralSettings,
  AdvancedSettings,
  HistorySettings,
  AboutSettings,
  PostProcessingSettings,
  ModelsSettings,
} from "./settings";

export type SidebarSection = keyof typeof SECTIONS_CONFIG;

interface IconProps {
  width?: number | string;
  height?: number | string;
  size?: number | string;
  className?: string;
  [key: string]: any;
}

interface SectionConfig {
  labelKey: string;
  icon: React.ComponentType<IconProps>;
  /** `null` when App renders the section itself (Debug, with its handlers). */
  component: React.ComponentType | null;
  enabled: (settings: any) => boolean;
}

export const SECTIONS_CONFIG = {
  general: {
    labelKey: "sidebar.general",
    icon: YapHand,
    component: GeneralSettings,
    enabled: () => true,
  },
  history: {
    labelKey: "sidebar.history",
    icon: History,
    component: HistorySettings,
    enabled: () => true,
  },
  models: {
    labelKey: "sidebar.models",
    icon: Cpu,
    component: ModelsSettings,
    enabled: () => true,
  },
  advanced: {
    labelKey: "sidebar.advanced",
    icon: Cog,
    component: AdvancedSettings,
    enabled: () => true,
  },
  postprocessing: {
    labelKey: "sidebar.postProcessing",
    icon: Sparkles,
    component: PostProcessingSettings,
    enabled: (settings) => settings?.post_process_enabled ?? false,
  },
  debug: {
    labelKey: "sidebar.debug",
    icon: FlaskConical,
    component: null,
    enabled: (settings) => settings?.debug_mode ?? false,
  },
  about: {
    labelKey: "sidebar.about",
    icon: Info,
    component: AboutSettings,
    enabled: () => true,
  },
} as const satisfies Record<string, SectionConfig>;

interface SidebarProps {
  activeSection: SidebarSection;
  onSectionChange: (section: SidebarSection) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const { t } = useTranslation();
  const { settings } = useSettings();

  const availableSections = Object.entries(SECTIONS_CONFIG)
    .filter(([_, config]) => config.enabled(settings))
    .map(([id, config]) => ({ id: id as SidebarSection, ...config }));

  return (
    <nav className="flex h-full w-52 shrink-0 flex-col border-e border-line bg-surface px-3 pb-3 pt-4">
      <div className="mb-5 flex items-center gap-2.5 px-2.5">
        <YapWave height={18} />
        <span className="text-[15px] font-semibold tracking-tight">Yap</span>
      </div>
      <div className="flex w-full flex-col gap-0.5">
        {availableSections.map((section, index) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <button
              type="button"
              key={section.id}
              aria-current={isActive ? "page" : undefined}
              style={{ animationDelay: `${index * 30}ms` }}
              className={`group relative flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-start animate-rise [animation-fill-mode:backwards] motion-reduce:animate-none transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-text/30 ${
                isActive
                  ? "bg-text/[0.07] text-text"
                  : "text-ink-2 hover:bg-text/[0.04] hover:text-text"
              }`}
              onClick={() => onSectionChange(section.id)}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute -start-3 top-2 bottom-2 w-[3px] rounded-e-full bg-text"
                />
              )}
              <Icon width={17} height={17} className="shrink-0" />
              <span
                className="truncate text-[13px] font-medium"
                title={t(section.labelKey)}
              >
                {t(section.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
