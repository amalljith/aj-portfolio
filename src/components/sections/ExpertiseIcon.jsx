// Brand marks remain separate from all decorative motion layers.
export default function ExpertiseIcon({ technology, featured = false }) {
  return (
    <div className={featured ? "expertise__icon-scene" : "expertise__index-icon"} aria-hidden="true">
      {featured && (
        <svg className="expertise__icon-accents" viewBox="0 0 280 240" fill="none" focusable="false">
          {technology === "python" && <>
            <path data-python-corner d="M38 72V30H80" /><path data-python-corner d="M200 210H242V168" />
            <path data-python-corner d="M38 174V210H74" /><path data-python-corner d="M206 30H242V66" />
          </>}
          {technology === "django" && <>
            <path data-expertise-draw d="M26 206V34H98M182 34H254V206" />
            <path data-expertise-draw d="M26 190H254M44 222H236" />
          </>}
          {technology === "fastapi" && <path data-expertise-draw data-fastapi-trace d="M48 76H100L164 24L124 106H214L156 214L172 140H70" />}
          {technology === "react" && <g data-react-orbit>
            <ellipse cx="140" cy="120" rx="123" ry="86" strokeDasharray="2 11" />
            <path d="M254 82H266V94H254Z" fill="currentColor" stroke="none" />
          </g>}
          {technology === "postgresql" && <path data-expertise-draw d="M32 48H80V30H114M248 192H200V210H166" />}
        </svg>
      )}
      <div className="expertise__brand-mask" data-brand-mask>
        <img src={`/icons/technologies/${technology}.svg`} width="128" height="128" alt="" decoding="async" />
      </div>
    </div>
  );
}
