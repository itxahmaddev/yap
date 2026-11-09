import React from "react";
import { useTranslation } from "react-i18next";
import { Cog, FlaskConical, History, Info, Sparkles, Cpu } from "lucide-react";
import YapTextLogo from "./icons/YapTextLogo";
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
    <nav
      className="flex h-full w-48 shrink-0 flex-col border-e border-line bg-wash/50 px-3 pb-3"
    >
      <div className="flex items-center justify-center pb-3 pt-5">
        <YapTextLogo width={64} />
      </div>
      <div className="flex w-full flex-col gap-1 border-t border-line pt-3">
        {availableSections.map((section, index) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <button
              type="button"
              key={section.id}
              aria-current={isActive ? "page" : undefined}
              style={{ animationDelay: `${index * 30}ms` }}
              className={`group flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-start animate-rise [animation-fill-mode:backwards] motion-reduce:animate-none transition-[background-color,color,transform] duration-200 ease-glide focus:outline-none focus-visible:ring-2 focus-visible:ring-text/40 active:scale-[0.98] motion-reduce:active:scale-100 ${
                isActive
                  ? "bg-text text-background shadow-sm"
                  : "text-ink-2 hover:bg-line hover:text-text"
              }`}
              onClick={() => onSectionChange(section.id)}
            >
              <Icon
                width={20}
                height={20}
                className="shrink-0 transition-transform duration-200 ease-glide group-hover:scale-110"
              />
              <span
                className="truncate text-sm font-medium"
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
