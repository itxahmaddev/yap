import YapMask from "./YapMask";
import mark from "@/assets/brand/yap-mark-black.png";

/** The Yap waveform mark; the outline follows the theme text color. */
const YapMascot = ({ className = "" }: { className?: string }) => (
  <YapMask src={mark} aspect={716 / 466} className={className} />
);

export default YapMascot;
