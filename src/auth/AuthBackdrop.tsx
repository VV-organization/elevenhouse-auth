/** Quiet optical atmosphere inspired by the supplied aurora reference.
 * Resolution-independent filled light volumes, never stroked contours.
 * Static SVG: no textures, raster enlargement, animation or render loop. */
export function AuthBackdrop() {
  const stars = Array.from({ length: 74 }, (_, i) => {
    const x = ((i * 173 + 83) % 1600)
    const y = ((i * 293 + 37) % 1000)
    const behindCopy = x < 870 && y > 175 && y < 760
    return <circle key={i} cx={x} cy={y} r={i % 13 === 0 ? 1.05 : .55} fill={i % 7 === 0 ? '#d8c9a6' : '#bccbdd'} opacity={behindCopy ? .07 : .17 + (i % 4) * .055} />
  })
  return (
    <div className="eh-auth__atmosphere" aria-hidden="true">
      <svg className="eh-auth__aurora" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="auth-cold-light" x1="0" y1="0" x2="1" y2=".65">
            <stop stopColor="#19334b" stopOpacity="0" />
            <stop offset=".48" stopColor="#436b8a" stopOpacity=".13" />
            <stop offset=".76" stopColor="#7c9eb8" stopOpacity=".52" />
            <stop offset="1" stopColor="#233c56" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="auth-warm-light" x1="0" y1="1" x2="1" y2="0">
            <stop stopColor="#887955" stopOpacity="0" />
            <stop offset=".45" stopColor="#ad9870" stopOpacity=".28" />
            <stop offset=".74" stopColor="#6e7e8f" stopOpacity=".12" />
            <stop offset="1" stopColor="#1c2e43" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="auth-halo">
            <stop stopColor="#345572" stopOpacity=".28" />
            <stop offset="1" stopColor="#142b43" stopOpacity="0" />
          </radialGradient>
          <filter id="auth-soft-light" x="-35%" y="-35%" width="170%" height="170%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation="22" /></filter>
          <filter id="auth-distant-light" x="-35%" y="-35%" width="170%" height="170%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation="65" /></filter>
        </defs>
        <ellipse cx="1280" cy="400" rx="680" ry="730" fill="url(#auth-halo)" />
        <g filter="url(#auth-soft-light)">
          <path d="M780 -160 C950 110 1510 45 1430 330 C1350 600 1140 690 1790 850 L1800 1050 C1240 720 1110 710 1310 360 C1460 100 890 140 660 -160Z" fill="url(#auth-cold-light)" />
          <path d="M-220 1050 C290 760 440 1030 880 825 C1130 700 1280 770 1630 1000 L1660 1140 C1210 860 1090 865 875 925 C460 1100 240 870 -200 1200Z" fill="url(#auth-warm-light)" />
        </g>
        <path d="M1400 -100 C1580 110 1100 310 1430 580 L1700 740 L1740 -100Z" fill="url(#auth-cold-light)" opacity=".5" filter="url(#auth-distant-light)" />
        <g>{stars}</g>
      </svg>
      <div className="eh-auth__atmosphere-shade" />
    </div>
  )
}
