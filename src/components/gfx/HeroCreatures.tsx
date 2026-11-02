import { BULL_PATH, WHALE_PATH } from "./creature-paths";

/**
 * Decorative bull + whale that drift through the homepage hero.
 *
 * Purely presentational: the layer sits behind the hero content, ignores
 * pointer events, adds nothing to the accessibility tree and falls back to a
 * still frame for visitors who ask for reduced motion (handled in CSS).
 * Everything is inline SVG, so there is no extra request and it stays crisp
 * on any display.
 */
export function HeroCreatures() {
  return (
    <div className="gfx-creatures" aria-hidden="true">
      <div className="gfx-creatures-veil" />

      <div className="gfx-creature gfx-creature--bull">
        <svg viewBox="0 0 573 290" role="presentation" focusable="false">
          <defs>
            <linearGradient id="gfxBullFill" x1="0" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stopColor="#cfe3ff" />
              <stop offset="38%" stopColor="#4a8bf7" />
              <stop offset="100%" stopColor="#16336e" />
            </linearGradient>
            <linearGradient id="gfxBullEdge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#bcd8ff" />
              <stop offset="100%" stopColor="#3f7fe8" />
            </linearGradient>
          </defs>
          <path
            d={BULL_PATH}
            fill="url(#gfxBullFill)"
            fillOpacity={0.2}
            stroke="url(#gfxBullEdge)"
            strokeOpacity={0.38}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="gfx-creature gfx-creature--whale">
        <svg viewBox="0 0 528 202" role="presentation" focusable="false">
          <defs>
            <linearGradient id="gfxWhaleFill" x1="0" y1="0" x2="0.85" y2="1">
              <stop offset="0%" stopColor="#ffd7ad" />
              <stop offset="45%" stopColor="#ff8a2b" />
              <stop offset="100%" stopColor="#8a3708" />
            </linearGradient>
            <linearGradient id="gfxWhaleEdge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffd2a3" />
              <stop offset="100%" stopColor="#ff7a1f" />
            </linearGradient>
          </defs>
          <path
            d={WHALE_PATH}
            fill="url(#gfxWhaleFill)"
            fillOpacity={0.3}
            stroke="url(#gfxWhaleEdge)"
            strokeOpacity={0.55}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <span className="gfx-creature-bubbles">
          <i />
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}
