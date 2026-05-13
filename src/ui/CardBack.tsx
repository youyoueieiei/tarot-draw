import { motion } from 'framer-motion'

export function CardBack(props: { size: 'sm' | 'md' }) {
  const { size } = props
  return (
    <motion.div
      layout
      className={[
        'relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-zinc-950 via-zinc-950/90 to-black shadow-soft',
        size === 'sm' ? 'p-0' : 'p-0',
      ].join(' ')}
    >
      <img
        src="/cards-normalized/tarot-card-back-generated.png"
        alt="塔羅牌背面"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(168,85,247,.22),transparent_55%),radial-gradient(circle_at_82%_12%,rgba(56,189,248,.16),transparent_55%),radial-gradient(circle_at_55%_100%,rgba(244,114,182,.10),transparent_60%)]" />

      {/* Crisp edges are intentionally "hard": no blur on borders */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 rounded-xl ring-2 ring-white/70" />
        <div className="absolute inset-[6px] rounded-[10px] ring-1 ring-white/25" />
        <div className="absolute inset-[10px] rounded-[8px] ring-1 ring-white/10" />
      </div>

      <div className="relative flex aspect-[2/3] w-full">
        <svg
          viewBox="0 0 300 500"
          className="h-full w-full"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="cb_g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="rgba(255,255,255,0.10)" />
              <stop offset="0.55" stopColor="rgba(255,255,255,0.02)" />
              <stop offset="1" stopColor="rgba(0,0,0,0)" />
            </linearGradient>
          </defs>

          {/* Inner frame for contrast */}
          <rect
            x="18"
            y="18"
            width="264"
            height="464"
            rx="18"
            fill="url(#cb_g)"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.2"
          />
          <rect
            x="28"
            y="28"
            width="244"
            height="444"
            rx="15"
            fill="transparent"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.0"
            strokeDasharray="2.5 6"
          />

          {/* Corner ornaments (4 corners, symmetric) */}
          {[
            { tx: 42, ty: 48, r: 0 },
            { tx: 258, ty: 48, r: 90 },
            { tx: 258, ty: 452, r: 180 },
            { tx: 42, ty: 452, r: 270 },
          ].map((c, i) => (
            <g
              key={i}
              transform={`translate(${c.tx} ${c.ty}) rotate(${c.r}) translate(-42 -48)`}
              opacity="0.9"
            >
              <path
                d="M42 48 C42 34, 52 28, 66 28"
                fill="none"
                stroke="rgba(255,255,255,0.50)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M42 48 C42 38, 49 34, 60 34"
                fill="none"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="1.0"
                strokeLinecap="round"
              />
              <circle cx="66" cy="28" r="2.2" fill="rgba(255,255,255,0.60)" />
            </g>
          ))}

          {/* Central mandala */}
          <g transform="translate(150 250)" opacity="0.95">
            <circle r="86" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" />
            <circle r="62" fill="none" stroke="rgba(255,255,255,0.26)" strokeWidth="1.2" />
            <circle r="40" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.1" />

            {Array.from({ length: 12 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 30})`}>
                <path
                  d="M0 -86 L0 -66"
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
                <path
                  d="M0 -62 C10 -54, 10 -46, 0 -40 C-10 -46, -10 -54, 0 -62 Z"
                  fill="rgba(255,255,255,0.06)"
                  stroke="rgba(255,255,255,0.24)"
                  strokeWidth="1.0"
                />
              </g>
            ))}

            {/* Star */}
            <g>
              <path
                d="M0 -26 L6 -6 L26 0 L6 6 L0 26 L-6 6 L-26 0 L-6 -6 Z"
                fill="rgba(255,255,255,0.10)"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
              <circle r="4" fill="rgba(255,255,255,0.70)" />
            </g>
          </g>
        </svg>
      </div>
    </motion.div>
  )
}

