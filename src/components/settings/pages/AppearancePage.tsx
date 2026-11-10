import React from "react";
import { useTranslation } from "react-i18next";
import { SettingsGroup } from "../../ui/SettingsGroup";
import { ThemeSelector } from "../ThemeSelector";
import { AppLanguageSelector } from "../AppLanguageSelector";
import { ShowOverlay } from "../ShowOverlay";
import { ShowTrayIcon } from "../ShowTrayIcon";

/** Theme, menu language, and the recording dock. */
export const AppearancePage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <SettingsGroup title={t("pages.groups.look")}>
        <ThemeSelector descriptionMode="tooltip" grouped={true} />
        <AppLanguageSelector descriptionMode="tooltip" grouped={true} />
      </SettingsGroup>
      <SettingsGroup title={t("pages.groups.dock")}>
        <ShowOverlay descriptionMode="tooltip" grouped={true} />
        <ShowTrayIcon descriptionMode="tooltip" grouped={true} />
      </SettingsGroup>
    </>
  );
};
