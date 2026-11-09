import type { CSSProperties } from "react";

/**
 * Draws a brand image (a black, transparent PNG) in the current text color,
 * so it follows the light/dark theme without separate assets.
 */
const YapMask = ({
  src,
  aspect,
  width,
  height,
  className,
  label,
}: {
  src: string;
  aspect: number;
  width?: number | string;
  height?: number | string;
  className?: string;
  label?: string;
}) => {
  const style: CSSProperties = {
    width: width,
    height: height,
    aspectRatio: String(aspect),
    backgroundColor: "currentColor",
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  };
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-block shrink-0 ${className ?? ""}`}
      style={style}
    />
  );
};

export default YapMask;
