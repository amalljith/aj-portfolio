// The collage extends the existing orange plane and AJ-like negative cut.
// Its layers separate entrance transforms from pointer/scroll ownership.
function Letterform({ simple = false }) {
  return (
    <>
      <g data-art-fragment="plane">
        <g data-v2-fragment="plane">
          <path d="M0 30 30 0H440V250L410 280H0Z" fill="var(--color-orange)" />
          {!simple && <path d="M16 44H424M16 236H424M44 16V264M392 16V264" stroke="var(--color-graphite)" strokeOpacity=".3" strokeWidth="1" data-art-draw />}
        </g>
      </g>
      <g data-v2-fragment="cut">
        <path d="M150 0H230L72 280H0Z" fill="var(--color-graphite)" />
        <path d="M114 0 0 210M258 0 100 280" stroke="var(--color-ivory)" strokeOpacity=".65" strokeWidth="1" data-art-draw />
      </g>
      <g data-art-fragment="corner">
        <g data-v2-fragment="bridge">
          <path d="M162 189H323V64H372V231H140Z" fill="var(--color-ivory)" />
          <path d="M206 23H406V189M122 256H406" stroke="var(--color-graphite)" strokeWidth="1" data-art-draw />
          {!simple && <path d="M396 23H416M406 13V33M396 256H416M406 246V266" stroke="var(--color-graphite)" strokeWidth="1.5" />}
        </g>
      </g>
    </>
  );
}

export default function HeroArtwork() {
  return (
    <figure className="hero-v2__art" aria-hidden="true">
      <div className="hero-v2__art-scroll">
        <div className="hero-v2__art-pointer">
          <svg className="hero-v2__collage hero-v2__collage--desktop" viewBox="0 0 680 280" width="680" height="280" fill="none" focusable="false">
            <Letterform />
            <g data-art-fragment="grid">
              <g data-art-scroll>
                <path d="M460 23H526L558 55H666M460 256H560L592 224H666" stroke="var(--color-orange)" strokeWidth="1.25" data-art-draw />
                <path d="M478 76V122H550L582 154H666M478 200H524" stroke="var(--color-ivory)" strokeOpacity=".38" strokeWidth="1" data-art-draw />
                <path d="M646 10V36M633 23H659M646 211V237M633 224H659" stroke="var(--color-orange)" strokeWidth="1" data-art-draw />
                <rect x="663" y="52" width="6" height="6" fill="var(--color-orange)" />
                <rect x="663" y="151" width="6" height="6" fill="var(--color-ivory)" />
              </g>
            </g>
          </svg>
          <svg className="hero-v2__collage hero-v2__collage--mobile" viewBox="0 0 440 280" width="440" height="280" fill="none" focusable="false">
            <Letterform simple />
          </svg>
        </div>
      </div>
      <figcaption>FIG. 01 / LETTERFORM AS ARCHITECTURE</figcaption>
    </figure>
  );
}
