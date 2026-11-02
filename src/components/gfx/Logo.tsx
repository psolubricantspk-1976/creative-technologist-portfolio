export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className="gfx-logo" aria-label="GlobalForgeX home">
      <span className="gfx-logo-mark" aria-hidden="true">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="gfxMarkGrad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffd2a3" />
              <stop offset="0.5" stopColor="#ff8a2b" />
              <stop offset="1" stopColor="#e05300" />
            </linearGradient>
          </defs>
          <path d="M4.6 4.6 19.4 19.4" stroke="url(#gfxMarkGrad)" strokeWidth="3.4" strokeLinecap="round" />
          <path d="M19.4 4.6 4.6 19.4" stroke="url(#gfxMarkGrad)" strokeWidth="3.4" strokeLinecap="round" opacity="0.55" />
          <path d="M12 9.3 14.7 12 12 14.7 9.3 12 12 9.3Z" fill="#fff8f0" />
        </svg>
      </span>
      {!compact && (
        <span className="gfx-logo-word">
          GLOBAL<b>FORGE</b>
          <i>X</i>
        </span>
      )}
    </a>
  );
}
