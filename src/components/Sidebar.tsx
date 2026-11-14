import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Search } from "./icons/devigner";
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
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // "/" jumps to the search field, as on ui.devigner.cc.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      )
        return;
      event.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const needle = query.trim().toLocaleLowerCase();
  const availableSections = Object.entries(SECTIONS_CONFIG)
    .filter(([_, config]) => config.enabled(settings))
    .map(([id, config]) => ({ id: id as SidebarSection, ...config }))
    .filter(
      (section) =>
        !needle ||
        t(section.labelKey).toLocaleLowerCase().includes(needle) ||
        t(section.subtitleKey).toLocaleLowerCase().includes(needle),
    );

  let order = 0;

  return (
    <nav className="flex h-full w-[220px] shrink-0 flex-col ps-3 pe-2 pt-4 pb-3">
      {/* Wordmark with a blue full stop and a boxed tag, like "devigner. UI" */}
      <div className="mb-4 flex items-center gap-2 px-1.5">
        <span className="grid size-7 place-items-center rounded-lg bg-foreground text-background">
          <YapWave height={12} />
        </span>
        {/* eslint-disable-next-line i18next/no-literal-string */}
        <span className="text-[17px] font-semibold tracking-[-0.04em]">
          yap<span className="text-primary">.</span>
        </span>
        {}
        <span className="rounded-[5px] border border-border bg-muted px-1 py-px font-mono text-[9.5px] font-medium leading-none text-muted-foreground">
          STT
        </span>
      </div>

      <label className="group/search mb-4 flex h-8 items-center gap-2 rounded-lg border border-border bg-muted/50 ps-2.5 pe-1.5 text-muted-foreground transition-[border-color,background-color,box-shadow] duration-200 focus-within:border-ring/50 focus-within:bg-background focus-within:ring-[3px] focus-within:ring-ring/12 hover:border-input">
        <Search size={14} className="shrink-0" />
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setQuery("");
              event.currentTarget.blur();
            }
            if (event.key === "Enter" && availableSections[0]) {
              onSectionChange(availableSections[0].id);
              setQuery("");
              event.currentTarget.blur();
            }
          }}
          placeholder={t("sidebar.search")}
          aria-label={t("sidebar.search")}
          className="min-w-0 flex-1 bg-transparent text-[12.5px] text-foreground placeholder:text-muted-foreground focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {}
        <kbd className="grid h-5 min-w-5 place-items-center rounded-[5px] border border-border bg-background px-1 font-mono text-[10px] leading-none text-muted-foreground group-focus-within/search:opacity-0">
          /
        </kbd>
      </label>

      <div className="-me-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pe-1">
        {availableSections.length === 0 && (
          <p className="px-2 font-mono text-[11px] text-muted-foreground">
            {t("sidebar.noResults")}
          </p>
        )}
        {GROUPS.map((group) => {
          const items = availableSections.filter((s) => s.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className="flex flex-col gap-0.5">
              <span className="flex items-baseline gap-1.5 px-2 pb-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                {t(`sidebar.groups.${group}`)}
                <span className="text-muted-foreground/55">{items.length}</span>
              </span>
              {items.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                const delay = order++ * 20;
                return (
                  <button
                    type="button"
                    key={section.id}
                    aria-current={isActive ? "page" : undefined}
                    style={{ animationDelay: `${delay}ms` }}
                    className={`group relative flex h-8 w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 text-start animate-rise [animation-fill-mode:backwards] motion-reduce:animate-none transition-colors duration-200 ease-glide focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }`}
                    onClick={() => {
                      onSectionChange(section.id);
                      setQuery("");
                    }}
                  >
                    {isActive && (
                      // The highlight glides between rows instead of jumping.
                      <motion.span
                        layoutId="sidebar-active"
                        aria-hidden="true"
                        transition={{
                          type: "spring",
                          stiffness: 520,
                          damping: 40,
                        }}
                        className="absolute inset-0 rounded-lg border border-border bg-accent shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]"
                      />
                    )}
                    <Icon
                      width={16}
                      height={16}
                      variant={isActive ? "Bulk" : "Outline"}
                      className={`relative shrink-0 transition-colors duration-200 ${
                        isActive ? "text-primary" : "text-current"
                      }`}
                    />
                    <span
                      className={`relative truncate text-[13px] ${isActive ? "font-medium" : ""}`}
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
