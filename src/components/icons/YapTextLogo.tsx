import YapMask from "./YapMask";
import logo from "@/assets/brand/yap-logo-black.png";

/** The full Yap logo (waveform + wordmark), drawn in the current text color. */
const YapTextLogo = ({
  width,
  height,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) => (
  <YapMask
    src={logo}
    aspect={552 / 581}
    width={width}
    height={height}
    className={className}
    label="Yap"
  />
);

export default YapTextLogo;
