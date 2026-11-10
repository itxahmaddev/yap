import React from "react";
import { useTranslation } from "react-i18next";
import { SettingsGroup } from "../../ui/SettingsGroup";
import { useSettings } from "../../../hooks/useSettings";
import { StartHidden } from "../StartHidden";
import { AutostartToggle } from "../AutostartToggle";
import { ModelUnloadTimeoutSetting } from "../ModelUnloadTimeout";
import { ExperimentalToggle } from "../ExperimentalToggle";
import { ShowWhatsNewOnUpdate } from "../ShowWhatsNewOnUpdate";
import { HistoryLimit } from "../HistoryLimit";
import { RecordingRetentionPeriodSelector } from "../RecordingRetentionPeriod";
import { AppDataDirectory } from "../AppDataDirectory";
import { LogDirectory } from "../debug";
import { PostProcessingToggle } from "../PostProcessingToggle";
import { KeyboardImplementationSelector } from "../debug/KeyboardImplementationSelector";
import { AccelerationSelector } from "../AccelerationSelector";
import { LazyStreamClose } from "../LazyStreamClose";
import { AirPodsMode } from "../AirPodsMode";
import { VadBackendSelector } from "../VadBackendSelector";
import { LanguageDetection } from "../LanguageDetection";

/** Startup, updates, storage, and experimental switches. */
export const SystemPage: React.FC = () => {
  const { t } = useTranslation();
  const { getSetting } = useSettings();
  const experimentalEnabled = getSetting("experimental_enabled") || false;

  return (
    <>
      <SettingsGroup title={t("pages.groups.behavior")}>
        <StartHidden descriptionMode="tooltip" grouped={true} />
        <AutostartToggle descriptionMode="tooltip" grouped={true} />
        <ModelUnloadTimeoutSetting descriptionMode="tooltip" grouped={true} />
        <ExperimentalToggle descriptionMode="tooltip" grouped={true} />
      </SettingsGroup>
      <SettingsGroup title={t("pages.groups.updates")}>
        <ShowWhatsNewOnUpdate descriptionMode="tooltip" grouped={true} />
      </SettingsGroup>
      <SettingsGroup title={t("pages.groups.storage")}>
        <HistoryLimit descriptionMode="tooltip" grouped={true} />
        <RecordingRetentionPeriodSelector
          descriptionMode="tooltip"
          grouped={true}
        />
        <AppDataDirectory descriptionMode="tooltip" grouped={true} />
        <LogDirectory grouped={true} />
      </SettingsGroup>
      {experimentalEnabled && (
        <SettingsGroup title={t("settings.advanced.groups.experimental")}>
          <PostProcessingToggle descriptionMode="tooltip" grouped={true} />
          <KeyboardImplementationSelector
            descriptionMode="tooltip"
            grouped={true}
          />
          <AccelerationSelector descriptionMode="tooltip" grouped={true} />
          <LazyStreamClose descriptionMode="tooltip" grouped={true} />
          <AirPodsMode descriptionMode="tooltip" grouped={true} />
          <VadBackendSelector descriptionMode="tooltip" grouped={true} />
          <LanguageDetection descriptionMode="tooltip" grouped={true} />
        </SettingsGroup>
      )}
    </>
  );
};
