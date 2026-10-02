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
          <linearGradient id="auth-cold-light" gradientUnits="userSpaceOnUse" x1="470" y1="80" x2="650" y2="880">
            <stop stopColor="#405975" stopOpacity="0" />
            <stop offset=".3" stopColor="#779bbc" stopOpacity=".12" />
            <stop offset=".53" stopColor="#a3cce7" stopOpacity=".55" />
            <stop offset=".67" stopColor="#628bad" stopOpacity=".22" />
            <stop offset="1" stopColor="#38526d" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="auth-warm-light" gradientUnits="userSpaceOnUse" x1="80" y1="960" x2="1440" y2="760">
            <stop stopColor="#405b79" stopOpacity="0" />
            <stop offset=".28" stopColor="#8b9da8" stopOpacity=".14" />
            <stop offset=".47" stopColor="#ddc995" stopOpacity=".5" />
            <stop offset=".64" stopColor="#b7a879" stopOpacity=".3" />
            <stop offset=".84" stopColor="#869db7" stopOpacity=".38" />
            <stop offset="1" stopColor="#456582" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="auth-halo">
            <stop stopColor="#345572" stopOpacity=".19" />
            <stop offset="1" stopColor="#142b43" stopOpacity="0" />
          </radialGradient>
          <filter id="auth-bloom" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation="32" /></filter>
          <filter id="auth-silk" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation="9" /></filter>
          <filter id="auth-glint" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation="2.5" /></filter>
          {/* Filled, tapering folds: broad diffusion plus a small optical highlight. */}
          <path id="auth-cool-fold" d="M440 -160 C370 135 440 224 555 333 C679 450 700 547 620 658 C499 825 242 901 -110 1100 L-180 1060 C202 834 498 780 594 625 C667 507 632 445 528 336 C404 205 337 91 440 -160Z" />
          <path id="auth-gold-fold" d="M-180 610 C128 693 193 916 447 905 C683 894 777 670 989 692 C1227 717 1191 924 1740 1100 L1760 1170 C1191 989 1188 766 978 736 C778 703 685 929 452 928 C186 949 104 726 -180 610Z" />
        </defs>
        <ellipse cx="1080" cy="620" rx="750" ry="610" fill="url(#auth-halo)" />
        <g filter="url(#auth-bloom)" opacity=".9">
          <use href="#auth-cool-fold" fill="url(#auth-cold-light)" />
          <use href="#auth-gold-fold" fill="url(#auth-warm-light)" />
        </g>
        <g filter="url(#auth-silk)" opacity=".7">
          <use href="#auth-cool-fold" fill="url(#auth-cold-light)" />
          <use href="#auth-gold-fold" fill="url(#auth-warm-light)" />
        </g>
        <g filter="url(#auth-glint)">
          <path d="M555 333 C679 450 700 547 620 658 C657 580 682 512 641 437 C615 389 578 355 555 333Z" fill="url(#auth-cold-light)" opacity=".72" />
          <path d="M210 845 C350 965 492 921 618 848 C532 908 450 932 366 911 C297 894 247 865 210 845Z" fill="url(#auth-warm-light)" opacity=".85" />
        </g>
        <g>{stars}</g>
      </svg>
      <div className="eh-auth__atmosphere-shade" />
    </div>
  )
}
