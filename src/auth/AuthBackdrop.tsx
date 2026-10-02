import auroraSky from '../assets/auth/aurora-sky.webp'

/** Original optical-aurora artwork in the landing's midnight / silver / champagne palette.
 * The supplied reference informs the folded light and translucent depth.
 * Static, compressed artwork: no canvas, frame loop or motion sensitivity. */
export function AuthBackdrop() {
  return (
    <div className="eh-auth__atmosphere" aria-hidden="true">
      <img className="eh-auth__aurora" src={auroraSky} alt="" width="1672" height="941" decoding="async" fetchPriority="high" />
      <div className="eh-auth__atmosphere-shade" />
    </div>
  )
}
