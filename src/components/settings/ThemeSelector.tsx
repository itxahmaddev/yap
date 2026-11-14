import React from "react";
import { useTranslation } from "react-i18next";
import { IconMonitor, IconMoon, IconSun } from "@devigner-ui/icons";
import { Tabs } from "../ui/devigner/tabs";
import { SettingContainer } from "../ui/SettingContainer";
import { useSettings } from "@/hooks/useSettings";
import { applyTheme, THEME_OPTIONS } from "@/lib/utils/theme";
import type { Theme } from "@/bindings";

interface ThemeSelectorProps {
  descriptionMode?: "inline" | "tooltip";
  grouped?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = React.memo(
  ({ descriptionMode = "tooltip", grouped = false }) => {
    const { t } = useTranslation();
    const { settings, updateSetting } = useSettings();

    const currentTheme: Theme = settings?.theme ?? "system";

    const ICONS = { system: IconMonitor, light: IconSun, dark: IconMoon };
    const themeOptions = THEME_OPTIONS.map((value) => {
      const Icon = ICONS[value];
      return {
        value,
        label: t(`theme.options.${value}`),
        icon: <Icon variant="Outline" />,
        activeIcon: <Icon variant="Bulk" />,
      };
    });

    const handleThemeChange = (value: string) => {
      const theme = value as Theme;
      applyTheme(theme);
      updateSetting("theme", theme);
    };

    return (
      <SettingContainer
        title={t("theme.title")}
        description={t("theme.description")}
        descriptionMode={descriptionMode}
        grouped={grouped}
      >
        <Tabs
          options={themeOptions}
          value={currentTheme}
          onValueChange={handleThemeChange}
          label={t("theme.title")}
          size="md"
          classNames={{ indicator: "bg-accent border border-border" }}
        />
      </SettingContainer>
    );
  },
);

ThemeSelector.displayName = "ThemeSelector";
