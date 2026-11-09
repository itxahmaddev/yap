/** Relative heights of the seven bars in the Yap mark. */
const HEIGHTS = [0.3, 0.55, 0.45, 1, 0.45, 0.55, 0.3];

/**
 * The Yap waveform, drawn in CSS so it can move. `animated` makes the bars
 * dance like a voice; at rest it matches the logo. Uses the text color.
 */
const YapWave = ({
  height = 48,
  animated = false,
  className = "",
}: {
  /** Height of the tallest bar, in px. */
  height?: number;
  animated?: boolean;
  className?: string;
}) => {
  const bar = Math.max(3, Math.round(height / 7));
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center ${className}`}
      style={{ height, gap: Math.round(bar * 0.6) }}
    >
      {HEIGHTS.map((h, i) => (
        <span
          key={i}
          className={`block rounded-full bg-current origin-center ${animated ? "animate-bars motion-reduce:animate-none" : ""}`}
          style={{
            width: bar,
            height: Math.round(height * h),
            animationDelay: `${i * 110}ms`,
            animationDuration: `${900 + ((i * 137) % 400)}ms`,
          }}
        />
      ))}
    </span>
  );
};

export default YapWave;
