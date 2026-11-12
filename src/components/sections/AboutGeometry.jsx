export default function AboutGeometry() {
  return (
    <div className="about__geometry" aria-hidden="true">
      <svg viewBox="0 0 440 160" width="440" height="160" fill="none" focusable="false">
        <g data-about-grid>
          <path data-about-stroke d="M24 122H144L206 32H404" stroke="var(--color-orange)" strokeWidth="1.5" />
          <path data-about-stroke d="M24 146H162L224 56H404" stroke="currentColor" strokeOpacity=".3" />
          <path data-about-stroke data-about-segment d="M24 42H110L170 102H286" stroke="currentColor" strokeOpacity=".22" />
          <path d="M14 122H34M24 112V132M394 32H414M404 22V42" stroke="var(--color-orange)" />
        </g>
        <g data-about-mark fill="var(--color-orange)">
          <path d="M326 88H350V112H326Z" />
          <path data-about-fragment d="M352 114H364V126H352Z" />
        </g>
      </svg>
      <p>STRUCTURE / IN PROGRESS</p>
    </div>
  );
}
