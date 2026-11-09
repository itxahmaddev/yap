import YapMask from "./YapMask";
import mark from "@/assets/brand/yap-mark-black.png";

/** The Yap waveform mark. Kept under its old name for existing imports. */
const YapHand = ({
  width,
  height,
  className,
}: {
  width?: number | string;
  height?: number | string;
  className?: string;
}) => (
  <YapMask
    src={mark}
    aspect={716 / 466}
    width={width}
    height={height}
    className={className}
  />
);

export default YapHand;
