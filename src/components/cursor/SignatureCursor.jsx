import { useRef } from "react";
import { createPortal } from "react-dom";
import useSignalCursor from "../../hooks/useSignalCursor.js";
import "./cursor.css";

export default function SignatureCursor({ enabled = true }) {
  const rootRef = useRef(null);
  useSignalCursor(rootRef, enabled);
  return createPortal(
    <div ref={rootRef} className="signal-cursor" aria-hidden="true" data-visible="false">
      <canvas className="signal-cursor__trail" />
      <div className="signal-cursor__position">
        <span className="signal-cursor__pointer" />
        <span className="signal-cursor__label">
          {Array.from({ length: 16 }, (_, index) => <span data-signal-char key={index} />)}
        </span>
      </div>
    </div>, document.body,
  );
}
