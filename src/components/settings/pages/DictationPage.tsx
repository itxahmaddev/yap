import React from "react";
import { useTranslation } from "react-i18next";
import { type } from "@tauri-apps/plugin-os";
import { SettingsGroup } from "../../ui/SettingsGroup";
import { ShortcutInput } from "../ShortcutInput";
import { ShortcutActivationSetting } from "../ShortcutActivation";
import { VoiceActivityDetection } from "../VoiceActivityDetection";
import { LongFormChunking } from "../LongFormChunking";
import { FillerWordRemoval } from "../FillerWordRemoval";
import { AppendTrailingSpace } from "../AppendTrailingSpace";
import { CustomWords } from "../CustomWords";

/** Shortcuts, and how speech becomes text. */
export const DictationPage: React.FC = () => {
  const { t } = useTranslation();
  // The cancel shortcut stays hidden on Linux: dynamic shortcuts are unstable there.
  const isLinux = type() === "linux";

  return (
    <>
      <SettingsGroup title={t("pages.groups.shortcut")}>
        <ShortcutInput shortcutId="transcribe" grouped={true} />
        <ShortcutActivationSetting descriptionMode="tooltip" grouped={true} />
        {!isLinux && <ShortcutInput shortcutId="cancel" grouped={true} />}
      </SettingsGroup>
      <SettingsGroup title={t("pages.groups.transcription")}>
        <VoiceActivityDetection descriptionMode="tooltip" grouped={true} />
        <LongFormChunking descriptionMode="tooltip" grouped={true} />
        <FillerWordRemoval descriptionMode="tooltip" grouped={true} />
        <AppendTrailingSpace descriptionMode="tooltip" grouped={true} />
        <CustomWords descriptionMode="tooltip" grouped />
      </SettingsGroup>
    </>
  );
};
