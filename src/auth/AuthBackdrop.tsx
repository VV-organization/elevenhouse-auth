import { useEffect, useRef } from 'react'

/** A still optical field: fine strands, two folded ribbons, no animation loop.
 * Reference: the supplied light-ribbon study, recoloured to the landing palette.
 * Draw on resize only; capped DPR and passive, fully disposed ResizeObserver. */
export function AuthBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    let frame = 0
    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, width, height)
      const sx = width / 1440
      const sy = height / 960
      context.scale(sx, sy)
      // Broad light beneath fine filaments gives the ribbon its folded volume.
      for (let ribbon = 0; ribbon < 2; ribbon++) {
        for (let i = 0; i < 160; i++) {
          const t = i / 159
          const wave = Math.sin(t * Math.PI)
          const warm = ribbon === 0
          const gradient = context.createLinearGradient(0, 120, 1100, 900)
          gradient.addColorStop(0, warm ? 'rgba(89,126,174,0)' : 'rgba(170,195,229,0)')
          gradient.addColorStop(.27, warm ? `rgba(138,174,209,${.06 + wave * .08})` : `rgba(94,148,209,${wave * .16})`)
          gradient.addColorStop(.5, warm ? `rgba(237,210,148,${.08 + wave * .15})` : `rgba(122,174,223,${wave * .24})`)
          gradient.addColorStop(.74, warm ? `rgba(191,156,92,${.08 + wave * .12})` : `rgba(113,151,199,${wave * .1})`)
          gradient.addColorStop(1, 'rgba(97,136,177,0)')
          context.strokeStyle = gradient
          context.lineWidth = i % 7 === 0 ? 1 : .45
          context.beginPath()
          if (warm) {
            context.moveTo(-220, 235 + t * 100)
            context.bezierCurveTo(330 + t * 190, 930 - t * 370, 45 + t * 300, 930 + t * 145, 710 + t * 160, 625 + t * 52)
            context.bezierCurveTo(1150 - t * 230, 445 + t * 115, 980 + t * 220, 1075, 1520, 1020 + t * 150)
          } else {
            context.moveTo(390 + t * 230, -200)
            context.bezierCurveTo(240 + t * 200, 430, 875 - t * 340, 165 + t * 225, 420 + t * 310, 555 + t * 105)
            context.bezierCurveTo(95 + t * 340, 845 + t * 45, 60 - t * 135, 910, -180, 1060 + t * 100)
          }
          context.stroke()
        }
      }
      // Sparse intersections echo the landing's luminous terrain, not a star wallpaper.
      for (let i = 0; i < 60; i++) {
        const x = 80 + ((i * 131.3) % 650)
        const y = 550 + Math.sin(x / 150) * 80 + ((i * 31) % 150)
        context.fillStyle = `rgba(238,211,148,${.1 + (i % 5) * .06})`
        context.beginPath()
        context.arc(x, y, i % 9 === 0 ? 1.2 : .65, 0, Math.PI * 2)
        context.fill()
      }
    }
    const resize = new ResizeObserver(() => { cancelAnimationFrame(frame); frame = requestAnimationFrame(draw) })
    resize.observe(canvas)
    draw()
    return () => { resize.disconnect(); cancelAnimationFrame(frame) }
  }, [])
  return <div className="eh-auth__atmosphere" aria-hidden="true"><div className="eh-auth__light" /><canvas ref={canvasRef} /><div className="eh-auth__grain" /></div>
}
