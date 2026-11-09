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

  const activeIndex = Math.max(
    0,
    availableSections.findIndex((section) => section.id === activeSection),
  );

  return (
    <nav className="shrink-0 p-3 ps-3 pe-0">
      <div className="flex h-full w-48 flex-col rounded-3xl border border-line bg-surface p-3 shadow-card">
        <div className="group flex items-center justify-center pb-4 pt-3">
          <YapTextLogo
            width={60}
            className="transition-transform duration-500 ease-spring group-hover:scale-110"
          />
        </div>
        <div className="relative flex w-full flex-col gap-1">
          {/* The active pill slides between items. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-11 rounded-2xl bg-text shadow-pop transition-transform duration-500 ease-spring"
            style={{ transform: `translateY(${activeIndex * 48}px)` }}
          />
          {availableSections.map((section, index) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                type="button"
                key={section.id}
                aria-current={isActive ? "page" : undefined}
                style={{ animationDelay: `${index * 40}ms` }}
                className={`group relative flex h-11 w-full cursor-pointer items-center gap-3 rounded-2xl px-3.5 text-start animate-rise [animation-fill-mode:backwards] motion-reduce:animate-none transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-text/40 active:scale-[0.97] motion-reduce:active:scale-100 ${
                  isActive
                    ? "text-background"
                    : "text-ink-2 hover:text-text hover:bg-text/5"
                }`}
                onClick={() => onSectionChange(section.id)}
              >
                <Icon
                  width={19}
                  height={19}
                  className="shrink-0 transition-transform duration-300 ease-spring group-hover:scale-110"
                />
                <span
                  className="truncate text-sm font-semibold tracking-tight"
                  title={t(section.labelKey)}
                >
                  {t(section.labelKey)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
