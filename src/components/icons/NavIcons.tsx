import React from "react";

/**
 * Yap's own icon set: rounded 1.75px strokes with a soft filled layer, so
 * an icon reads as one shape at small sizes. Every icon uses currentColor.
 */
export interface NavIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const Icon: React.FC<NavIconProps & { children: React.ReactNode }> = ({
  width = 18,
  height = 18,
  className = "",
  children,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    {children}
  </svg>
);

const SOFT = { fill: "currentColor", fillOpacity: 0.16, stroke: "none" };

export const HomeIcon: React.FC<NavIconProps> = (p) => (
  <Icon {...p}>
    <path
      {...SOFT}
      d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1z"
    />
    <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1z" />
  </Icon>
);

export const DictationIcon: React.FC<NavIconProps> = (p) => (
  <Icon {...p}>
    <rect {...SOFT} x="9" y="3" width="6" height="11" rx="3" />
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6" />
  </Icon>
);

export const AudioIcon: React.FC<NavIconProps> = (p) => (
  <Icon {...p}>
    <path {...SOFT} d="M4 9.5h3L11.5 5v14L7 14.5H4z" />
    <path d="M4 9.5h3L11.5 5v14L7 14.5H4z" />
    <path d="M15 9.5a3.5 3.5 0 0 1 0 5M17.8 7a7 7 0 0 1 0 10" />
  </Icon>
);

export const LanguagesIcon: React.FC<NavIconProps> = (p) => (
  <Icon {...p}>
    <circle {...SOFT} cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.2 3.5 8.5s-1.1 6.1-3.5 8.5M12 3.5C9.6 5.9 8.5 8.7 8.5 12s1.1 6.1 3.5 8.5" />
  </Icon>
);

export const OutputIcon: React.FC<NavIconProps> = (p) => (
  <Icon {...p}>
    <rect {...SOFT} x="3.5" y="5" width="17" height="14" rx="3" />
    <rect x="3.5" y="5" width="17" height="14" rx="3" />
    <path d="M8 10h5M8 14h3M16 9.5v5" />
  </Icon>
);

export const ModelsIcon: React.FC<NavIconProps> = (p) => (
  <Icon {...p}>
    <path {...SOFT} d="M12 3.5 19.5 7.5v9L12 20.5l-7.5-4v-9z" />
    <path d="M12 3.5 19.5 7.5v9L12 20.5l-7.5-4v-9z" />
    <path d="M4.5 7.5 12 11.5l7.5-4M12 11.5v9" />
  </Icon>
);

export const HistoryIcon: React.FC<NavIconProps> = (p) => (
  <Icon {...p}>
    <circle {...SOFT} cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
);

export const AppearanceIcon: React.FC<NavIconProps> = (p) => (
  <Icon {...p}>
    <path fill="currentColor" stroke="none" d="M12 3.5a8.5 8.5 0 0 1 0 17z" />
    <circle cx="12" cy="12" r="8.5" />
  </Icon>
);

export const SystemIcon: React.FC<NavIconProps> = (p) => (
  <Icon {...p}>
    <path d="M5 7h8M17 7h2M5 12h3M12 12h7M5 17h9M18 17h1" />
    <circle {...SOFT} cx="15" cy="7" r="2" />
    <circle cx="15" cy="7" r="2" />
    <circle {...SOFT} cx="10" cy="12" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle {...SOFT} cx="16" cy="17" r="2" />
    <circle cx="16" cy="17" r="2" />
  </Icon>
);

export const AboutIcon: React.FC<NavIconProps> = (p) => (
  <Icon {...p}>
    <rect {...SOFT} x="3.5" y="3.5" width="17" height="17" rx="5" />
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <path d="M12 11v5.5M12 7.75v.01" />
  </Icon>
);

export const SparkleIcon: React.FC<NavIconProps> = (p) => (
  <Icon {...p}>
    <path
      {...SOFT}
      d="M12 3.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5z"
    />
    <path d="M12 3.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5zM18.5 16.5v4M16.5 18.5h4" />
  </Icon>
);

export const DebugIcon: React.FC<NavIconProps> = (p) => (
  <Icon {...p}>
    <path
      {...SOFT}
      d="M9 3.5h6M10 3.5v5.5L5 18a1.7 1.7 0 0 0 1.5 2.5h11A1.7 1.7 0 0 0 19 18l-5-9V3.5"
    />
    <path d="M9 3.5h6M10 3.5v5.5L5 18a1.7 1.7 0 0 0 1.5 2.5h11A1.7 1.7 0 0 0 19 18l-5-9V3.5M7.5 14h9" />
  </Icon>
);

export const ArrowRightIcon: React.FC<NavIconProps> = (p) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);
