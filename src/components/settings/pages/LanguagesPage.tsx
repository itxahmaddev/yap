import React from "react";
import { useTranslation } from "react-i18next";
import { SettingsGroup } from "../../ui/SettingsGroup";
import { useSettings } from "../../../hooks/useSettings";
import { isChinese } from "@/lib/utils/languageSuggestions";
import { PreferredLanguages } from "../PreferredLanguages";
import { ChineseScriptSetting } from "../ChineseScript";
import { ModelSettingsCard } from "../general/ModelSettingsCard";

/** Spoken languages, script, and the current model's language options. */
export const LanguagesPage: React.FC = () => {
  const { t } = useTranslation();
  const { getSetting } = useSettings();
  // Only for Chinese speakers, or anyone who already picked a script.
  const speaksChinese =
    (getSetting("spoken_languages") ?? []).some(isChinese) ||
    (getSetting("chinese_script") ?? "as_transcribed") !== "as_transcribed";

  return (
    <>
      <SettingsGroup title={t("pages.groups.spoken")}>
        <PreferredLanguages descriptionMode="tooltip" grouped={true} />
        {speaksChinese && (
          <ChineseScriptSetting descriptionMode="tooltip" grouped={true} />
        )}
      </SettingsGroup>
      <ModelSettingsCard />
    </>
  );
};
