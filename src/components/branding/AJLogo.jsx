/**
 * Approved Concept 01, traced as three flat silhouettes.
 * Keep the geometry in sync with public/branding/aj-monogram.svg.
 *
 * Named: <AJLogo label="Amal Jith — home" className="h-8 w-auto text-accent" />
 * Inside an already labeled link: <AJLogo decorative className="h-8 w-auto" />
 */
export default function AJLogo({
  className,
  label = "Amal Jith",
  decorative = false,
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 360 224"
      width="90"
      height="56"
      preserveAspectRatio="xMidYMid meet"
      fill="currentColor"
      className={className}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
    >
      <path d="M6 218 145 11 151 7H182L188 11 262 127H209L165 59 61 218Z" />
      <path d="M143 141H309V10L315 6H355V149L320 186H172Z" />
      <path d="M101 197 105 191 111 188H128V212Q128 218 122 218H107Q101 218 101 212Z" />
    </svg>
  );
}
