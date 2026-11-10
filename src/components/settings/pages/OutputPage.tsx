import React from "react";
import { useTranslation } from "react-i18next";
import { SettingsGroup } from "../../ui/SettingsGroup";
import { PasteMethodSetting } from "../PasteMethod";
import { TypingToolSetting } from "../TypingTool";
import { ClipboardHandlingSetting } from "../ClipboardHandling";
import { AutoSubmit } from "../AutoSubmit";

/** How finished text reaches the app you're typing in. */
export const OutputPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <SettingsGroup title={t("pages.groups.pasting")}>
      <PasteMethodSetting descriptionMode="tooltip" grouped={true} />
      <TypingToolSetting descriptionMode="tooltip" grouped={true} />
      <ClipboardHandlingSetting descriptionMode="tooltip" grouped={true} />
      <AutoSubmit descriptionMode="tooltip" grouped={true} />
    </SettingsGroup>
  );
};
