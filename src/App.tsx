import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { platform } from "@tauri-apps/plugin-os";
import {
  checkAccessibilityPermission,
  checkMicrophonePermission,
} from "tauri-plugin-macos-permissions-api";
import "./App.css";
import SecureInputWarning from "./components/SecureInputWarning";
import { HomePage } from "./components/settings/pages/HomePage";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import ModelMigration from "./components/onboarding/ModelMigration";
import {
  ReplaceModel,
  ReturningPermissions,
} from "./components/onboarding/StandaloneScreens";
import {
  clearOnboardingProgress,
  type OnboardingStep as OnboardingPreviewStep,
} from "./components/onboarding/onboardingStore";
import { DebugSettings, ModelsSettings } from "./components/settings";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { FileDropOverlay } from "./components/FileDropOverlay";
import { Sidebar, SidebarSection, SECTIONS_CONFIG } from "./components/Sidebar";
import { WhatsNewGate } from "./components/whats-new";
import { useSettings } from "./hooks/useSettings";
import { useSettingsStore } from "./stores/settingsStore";
import { commands } from "@/bindings";
import { deleteRetiredModel } from "@/lib/models/retired";
import { NoticePanel } from "@/components/notices/NoticePanel";
import { getLanguageDirection, initializeRTL } from "@/lib/utils/rtl";
import { SelectionFrame } from "@/components/ui/SelectionFrame";
import { ChevronDown } from "@/components/icons/devigner";

// flow is first-run onboarding; the rest are single screens for returning users.
type OnboardingStep =
  "flow" | "permissions" | "migration" | "replaceModel" | "done";

const renderSettingsContent = (
  section: SidebarSection,
  onPreviewOnboarding: (step: OnboardingPreviewStep) => void,
  onRunOnboarding: () => void,
  onRunModelMigration: () => void,
  onSectionChange: (section: SidebarSection) => void,
) => {
  if (section === "home") {
    return (
      <HomePage
        onOpenModels={() => onSectionChange("models")}
        onOpenHistory={() => onSectionChange("history")}
      />
    );
  }
  if (section === "models") {
    return (
      <ModelsSettings onChangeLanguages={() => onSectionChange("languages")} />
    );
  }
  if (section === "debug") {
    return (
      <DebugSettings
        onPreviewOnboarding={onPreviewOnboarding}
        onRunOnboarding={onRunOnboarding}
        onRunModelMigration={onRunModelMigration}
      />
    );
  }

  const ActiveComponent = SECTIONS_CONFIG[section]?.component;
  return ActiveComponent ? <ActiveComponent /> : null;
};

/** Page title with its icon tile and one-line description. */
const PageHeader: React.FC<{ section: SidebarSection }> = ({ section }) => {
  const { t } = useTranslation();
  const config = SECTIONS_CONFIG[section];
  if (!config) return null;
  const Icon = config.icon;
  return (
    <header className="flex items-center gap-4 pt-2">
      <SelectionFrame className="shrink-0">
        <span className="grid size-12 place-items-center bg-primary/10 text-primary">
          <Icon width={24} height={24} variant="Bulk" />
        </span>
      </SelectionFrame>
      <div className="min-w-0">
        <h1 className="m-0 truncate text-[26px] font-semibold leading-tight tracking-[-0.035em]">
          {t(config.labelKey)}
        </h1>
        <p className="m-0 mt-0.5 truncate text-[13px] text-muted-foreground">
          {t(config.subtitleKey)}
        </p>
      </div>
    </header>
  );
};

function App() {
  const { t, i18n } = useTranslation();
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep | null>(
    null,
  );
  const [onboardingPreview, setOnboardingPreview] =
    useState<OnboardingPreviewStep | null>(null);
  // Set when a returning user's selected model is a retired (ONNX) model that
  // is still on disk: they must update it before the app can transcribe.
  const [migrationModelId, setMigrationModelId] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<SidebarSection>("home");
  const showHistory = useCallback(() => setCurrentSection("history"), []);
  const { settings, updateSetting } = useSettings();
  const direction = getLanguageDirection(i18n.language);
  const refreshAudioDevices = useSettingsStore(
    (state) => state.refreshAudioDevices,
  );
  const refreshOutputDevices = useSettingsStore(
    (state) => state.refreshOutputDevices,
  );
  const hasCompletedPostOnboardingInit = useRef(false);
  const settingsScrollRef = useRef<HTMLDivElement>(null);
  // Reset the scroll position whenever the active section changes.
  useLayoutEffect(() => {
    settingsScrollRef.current?.scrollTo({ top: 0 });
  }, [currentSection]);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  // Initialize RTL direction when language changes
  useEffect(() => {
    initializeRTL(i18n.language);
  }, [i18n.language]);

  // Initialize Enigo, shortcuts, and refresh audio devices when main app loads
  useEffect(() => {
    if (onboardingStep === "done" && !hasCompletedPostOnboardingInit.current) {
      hasCompletedPostOnboardingInit.current = true;
      Promise.all([
        commands.initializeEnigo(),
        commands.initializeShortcuts(),
      ]).catch((e) => {
        console.warn("Failed to initialize:", e);
      });
      refreshAudioDevices();
      refreshOutputDevices();
    }
  }, [onboardingStep, refreshAudioDevices, refreshOutputDevices]);

  // Handle keyboard shortcuts for debug mode toggle
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Shift+D (Windows/Linux) or Cmd+Shift+D (macOS)
      const isDebugShortcut =
        event.shiftKey &&
        event.key.toLowerCase() === "d" &&
        (event.ctrlKey || event.metaKey);

      if (isDebugShortcut) {
        event.preventDefault();
        const currentDebugMode = settings?.debug_mode ?? false;
        updateSetting("debug_mode", !currentDebugMode);
      }
    };

    // Add event listener when component mounts
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [settings?.debug_mode, updateSetting]);

  const revealMainWindowForPermissions = async () => {
    try {
      await commands.showMainWindowCommand();
    } catch (e) {
      console.warn("Failed to show main window for permission onboarding:", e);
    }
  };

  const getMigrationModelId = async (
    selectedModel: string,
  ): Promise<string | null> => {
    const retired = await commands.getRetiredModels();
    return retired.some((m) => m.id === selectedModel) ? selectedModel : null;
  };

  // Returning users land in the app unless their model needs updating. The
  // window may start hidden, so bring it forward for the update screen.
  const finishReturningUser = async (retiredModelId: string | null) => {
    if (retiredModelId) {
      await revealMainWindowForPermissions();
      setOnboardingStep("migration");
    } else {
      setOnboardingStep("done");
    }
  };

  const checkOnboardingStatus = async () => {
    try {
      const settingsResult = await commands.getAppSettings();
      const hasCompletedOnboarding =
        settingsResult.status === "ok" &&
        settingsResult.data.onboarding_completed === true;
      const currentPlatform = platform();

      if (hasCompletedOnboarding) {
        // Returning user - check if they need to grant permissions first
        const retiredModelId = await getMigrationModelId(
          settingsResult.data.selected_model ?? "",
        );
        setMigrationModelId(retiredModelId);

        if (currentPlatform === "macos") {
          try {
            const [hasAccessibility, hasMicrophone] = await Promise.all([
              checkAccessibilityPermission(),
              checkMicrophonePermission(),
            ]);
            if (!hasAccessibility || !hasMicrophone) {
              await revealMainWindowForPermissions();
              setOnboardingStep("permissions");
              return;
            }
          } catch (e) {
            console.warn("Failed to check macOS permissions:", e);
            // If we can't check, proceed to main app and let them fix it there
          }
        }

        if (currentPlatform === "windows") {
          try {
            const microphoneStatus =
              await commands.getWindowsMicrophonePermissionStatus();
            if (
              microphoneStatus.supported &&
              microphoneStatus.overall_access === "denied"
            ) {
              await revealMainWindowForPermissions();
              setOnboardingStep("permissions");
              return;
            }
          } catch (e) {
            console.warn("Failed to check Windows microphone permissions:", e);
            // If we can't check, proceed to main app and let them fix it there
          }
        }

        await finishReturningUser(retiredModelId);
      } else {
        // New user - start full onboarding
        setOnboardingStep("flow");
      }
    } catch (error) {
      console.error("Failed to check onboarding status:", error);
      setOnboardingStep("flow");
    }
  };

  // Debug: the real onboarding from Welcome, for testing it end to end.
  const runOnboarding = () => {
    clearOnboardingProgress();
    setOnboardingStep("flow");
  };

  // Debug: the real model migration screen. It leads with the selected model
  // if that's retired, otherwise with the first retired model on disk.
  const runModelMigration = async () => {
    const retired = await commands.getRetiredModels();
    if (retired.length === 0) {
      console.info("Model migration: no old-format models on disk");
      return;
    }
    const selected = settings?.selected_model;
    setMigrationModelId(
      retired.find((m) => m.id === selected)?.id ?? retired[0].id,
    );
    setOnboardingStep("migration");
  };

  const handleModelSelected = async () => {
    // Reached when the user picks a different model instead of updating.
    for (const model of await commands.getRetiredModels()) {
      await deleteRetiredModel(model.id);
    }
    setOnboardingStep("done");
  };

  // Still checking onboarding status
  if (onboardingStep === null) {
    return null;
  }

  // Select the content for the current step. NoticePanel is rendered once,
  // beside this node, so errors surface on every step, including onboarding.
  let content: ReactNode;
  if (onboardingPreview) {
    // Previews render in the same top-level slot as real onboarding, inert:
    // no prompts, downloads or setting writes.
    content = (
      <>
        <OnboardingFlow
          preview
          previewStep={onboardingPreview}
          onComplete={() => setOnboardingPreview(null)}
        />
        <button
          type="button"
          onClick={() => setOnboardingPreview(null)}
          className="fixed top-4 end-4 z-50 rounded-lg border border-line bg-background px-4 py-2 text-sm font-medium text-text shadow-lg hover:bg-logo-primary/20 cursor-pointer"
        >
          {t("settings.debug.onboardingPreview.exitButton")}
        </button>
      </>
    );
  } else if (onboardingStep === "flow") {
    content = <OnboardingFlow onComplete={() => setOnboardingStep("done")} />;
  } else if (onboardingStep === "permissions") {
    content = (
      <ReturningPermissions
        onComplete={() => finishReturningUser(migrationModelId)}
      />
    );
  } else if (onboardingStep === "migration" && migrationModelId) {
    content = (
      <ModelMigration
        inUseModelId={migrationModelId}
        onComplete={() => setOnboardingStep("done")}
        onChooseAnother={() => setOnboardingStep("replaceModel")}
      />
    );
  } else if (onboardingStep === "replaceModel") {
    content = (
      <ReplaceModel
        onBack={() => setOnboardingStep("migration")}
        onComplete={handleModelSelected}
      />
    );
  } else {
    content = (
      <div
        dir={direction}
        className="h-screen flex flex-col select-none cursor-default"
      >
        <ErrorBoundary context="What's New">
          <WhatsNewGate />
        </ErrorBoundary>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            activeSection={currentSection}
            onSectionChange={setCurrentSection}
            onShowHistory={showHistory}
          />
          {/* The page sits on a stage beside the sidebar: a dot grid under a
              soft blue glow, with a breadcrumb pill pinned to the top. */}
          <div className="relative my-2 me-2 flex flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-background">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,var(--color-line)_1px,transparent_1.2px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_340px)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-72 max-w-xl rounded-full bg-primary/12 blur-3xl"
            />
            <div
              ref={settingsScrollRef}
              className="relative flex-1 overflow-y-auto"
            >
              <div className="sticky top-0 z-20 flex justify-center pt-3 pb-1">
                <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-background/80 ps-3 pe-3 text-[12px] text-muted-foreground shadow-[0_4px_16px_-8px_rgb(0_0_0/0.4)] backdrop-blur-md">
                  {/* eslint-disable-next-line i18next/no-literal-string */}
                  <span>Yap</span>
                  <ChevronDown size={12} className="-rotate-90 rtl:rotate-90" />
                  <span className="font-medium text-foreground">
                    {t(SECTIONS_CONFIG[currentSection]?.labelKey ?? "")}
                  </span>
                </span>
              </div>
              <div
                key={currentSection}
                className={`mx-auto flex w-full max-w-[760px] flex-col gap-5 px-7 pt-3 pb-10 animate-rise motion-reduce:animate-none ${currentSection === "models" ? "h-full" : ""}`}
              >
                <PageHeader section={currentSection} />
                <SecureInputWarning />
                {renderSettingsContent(
                  currentSection,
                  setOnboardingPreview,
                  runOnboarding,
                  runModelMigration,
                  setCurrentSection,
                )}
              </div>
            </div>
          </div>
        </div>
        <FileDropOverlay onDropped={showHistory} />
      </div>
    );
  }

  return (
    <>
      {content}
      <NoticePanel />
    </>
  );
}

export default App;
