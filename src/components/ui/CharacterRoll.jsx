import "./CharacterRoll.css";

/**
 * Put `character-roll-trigger` on the owning link or button.
 * The accessible label stays whole; only the decorative visual layer moves.
 */
export default function CharacterRoll({ text, className = "" }) {
  return (
    <span className={`character-roll ${className}`}>
      <span className="sr-only">{text}</span>
      <span className="character-roll__visual" aria-hidden="true">
        {Array.from(text).map((character, index) => (
          <span
            key={`${index}-${character}`}
            className="character-roll__character"
            style={{ "--roll-delay": `${Math.min(index * 12, 60)}ms` }}
          >
            <span className="character-roll__original">
              {character === " " ? "\u00a0" : character}
            </span>
            <span className="character-roll__copy" aria-hidden="true">
              {character === " " ? "\u00a0" : character}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
