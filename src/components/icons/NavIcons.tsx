import React from "react";
import {
  IconArrowRight,
  IconBoxCube,
  IconBug,
  IconHistory,
  IconHome,
  IconInfoCircle,
  IconMagicStickSparkles,
  IconMicrophone,
  IconPalette,
  IconSettings,
  IconTextAlignJustifyLeft,
  IconTranslate,
  IconVolumeLoud,
} from "@devigner-ui/icons";

/**
 * Yap's page icons, drawn by Devigner Icons (https://icons.devigner.cc).
 * Each takes a variant, so the active page can switch from the Outline
 * drawing to the filled Bulk one. Every icon uses currentColor.
 */
export type NavIconVariant = "Outline" | "TwoTone" | "Bold" | "Bulk" | "Broken";

export interface NavIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  variant?: NavIconVariant;
}

type DevignerIcon = React.ComponentType<
  React.SVGProps<SVGSVGElement> & {
    variant?: NavIconVariant;
    strokeWidth?: string | number;
  }
>;

const make = (Glyph: DevignerIcon): React.FC<NavIconProps> => {
  const NavIcon: React.FC<NavIconProps> = ({
    width = 18,
    height = 18,
    className = "",
    variant = "Outline",
  }) => (
    <Glyph
      width={width}
      height={height}
      className={className}
      variant={variant}
      aria-hidden="true"
    />
  );
  return NavIcon;
};

export const HomeIcon = make(IconHome);
export const DictationIcon = make(IconMicrophone);
export const AudioIcon = make(IconVolumeLoud);
export const LanguagesIcon = make(IconTranslate);
export const OutputIcon = make(IconTextAlignJustifyLeft);
export const ModelsIcon = make(IconBoxCube);
export const HistoryIcon = make(IconHistory);
export const AppearanceIcon = make(IconPalette);
export const SystemIcon = make(IconSettings);
export const AboutIcon = make(IconInfoCircle);
export const SparkleIcon = make(IconMagicStickSparkles);
export const DebugIcon = make(IconBug);
export const ArrowRightIcon = make(IconArrowRight);
