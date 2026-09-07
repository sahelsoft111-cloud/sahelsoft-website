import { useRef } from "react";

/**
 * A card that reacts to the pointer: a soft glow follows the cursor and the
 * card tilts slightly toward it (desktop/mouse only — see the CSS guards in
 * styles.css for touch devices and prefers-reduced-motion).
 *
 * Usage: <SpotlightCard as="article" className="...">...</SpotlightCard>
 * `as` lets the rendered tag match what semantic role the card plays
 * (article for a self-contained card, div otherwise).
 */
export function SpotlightCard({ as: Tag = "article", className = "", style, children, ...rest }) {
  const cardRef = useRef(null);

  const handlePointerMove = (event) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    card.style.setProperty("--spot-x", `${x}px`);
    card.style.setProperty("--spot-y", `${y}px`);
    card.style.setProperty("--tilt-x", `${((y - rect.height / 2) / rect.height) * -6}deg`);
    card.style.setProperty("--tilt-y", `${((x - rect.width / 2) / rect.width) * 6}deg`);
  };

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <Tag
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      className={`spotlight-card ${className}`}
      style={style}
      {...rest}
    >
      <span className="spotlight-glow" aria-hidden="true" />
      {children}
    </Tag>
  );
}
