import React from "react";
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconArrowDown,
  IconArrowOutUpRightSquare,
  IconCheck,
  IconCheckCircle,
  IconChevronDown,
  IconClose,
  IconCopy,
  IconDocumentUpload,
  IconFolderOpen,
  IconGlobal,
  IconHistory,
  IconInfoCircle,
  IconKeyboard,
  IconLock,
  IconMicrophone,
  IconMusicNote,
  IconPause,
  IconPlay,
  IconQuestionCircle,
  IconRecordCircle,
  IconRefresh,
  IconRestart,
  IconMagnifier,
  IconSpinner,
  IconStar,
  IconTranslate,
  IconTrashBinLines,
} from "@devigner-ui/icons";

/**
 * Every small UI glyph in Yap, drawn by Devigner Icons
 * (https://icons.devigner.cc). Names follow the jobs they do in the app, so a
 * call site reads `<X />` or `<Trash2 />`. `size` sets width and height;
 * `variant` picks the drawing (Outline, TwoTone, Bold, Bulk, Broken).
 */
export type IconVariant = "Outline" | "TwoTone" | "Bold" | "Bulk" | "Broken";

export interface GlyphProps extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
  size?: number | string;
  variant?: IconVariant;
  strokeWidth?: number | string;
}

type DevignerIcon = React.ComponentType<
  React.SVGProps<SVGSVGElement> & {
    variant?: IconVariant;
    strokeWidth?: string | number;
  }
>;

const glyph = (Drawing: DevignerIcon, fallback: IconVariant = "Outline") => {
  const Glyph: React.FC<GlyphProps> = ({
    size = 16,
    variant = fallback,
    width,
    height,
    strokeWidth,
    ...rest
  }) => (
    <Drawing
      width={width ?? size}
      height={height ?? size}
      variant={variant}
      // Devigner draws at 1.5 on a 24px grid; bolder lucide-era weights are
      // capped so a glyph never turns heavy.
      strokeWidth={
        strokeWidth === undefined ? undefined : Math.min(Number(strokeWidth), 2)
      }
      {...rest}
    />
  );
  return Glyph;
};

export const X = glyph(IconClose);
export const Check = glyph(IconCheck);
export const ChevronDown = glyph(IconChevronDown);
export const Globe = glyph(IconGlobal);
export const ExternalLink = glyph(IconArrowOutUpRightSquare);
export const Keyboard = glyph(IconKeyboard, "Bulk");
export const Mic = glyph(IconMicrophone, "Bulk");
export const TriangleAlert = glyph(IconAlertTriangle);
export const AlertTriangle = glyph(IconAlertTriangle);
export const AlertCircle = glyph(IconAlertCircle);
export const CircleHelp = glyph(IconQuestionCircle);
export const Info = glyph(IconInfoCircle);
export const CheckCircle = glyph(IconCheckCircle);
export const Loader2 = glyph(IconSpinner);
export const Lock = glyph(IconLock);
export const Trash2 = glyph(IconTrashBinLines);
export const RefreshCw = glyph(IconRefresh);
export const RefreshCcw = glyph(IconRestart);
export const RotateCcw = glyph(IconRestart);
export const Play = glyph(IconPlay, "Bold");
export const PlayIcon = Play;
export const Pause = glyph(IconPause, "Bold");
export const ArrowDown = glyph(IconArrowDown);
export const Languages = glyph(IconTranslate);
export const Radio = glyph(IconRecordCircle);
export const Search = glyph(IconMagnifier);
export const Copy = glyph(IconCopy);
export const FileAudio = glyph(IconMusicNote);
export const FilePlus = glyph(IconDocumentUpload);
export const History = glyph(IconHistory);
export const FolderOpen = glyph(IconFolderOpen);
export const Star = glyph(IconStar);
