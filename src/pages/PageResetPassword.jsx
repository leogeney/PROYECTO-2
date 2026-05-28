import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth'
import { auth } from '../config/firebase'
import { T } from '../styles/tokens'

function getOobCode() {
  const hash = window.location.hash.replace(/^#/, '')
  const hashParams = new URLSearchParams(hash)
  const query = new URLSearchParams(window.location.search)
  const code = hashParams.get('oobCode') || query.get('oobCode')
  if (code && window.location.hash) window.history.replaceState(null, '', window.location.pathname)
  return code
}

export default function PageResetPassword() {
  const navigate = useNavigate()
  const [oobCode] = useState(() => getOobCode())

  const [status, setStatus] = useState('verifying')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!oobCode) { setStatus('no-code'); return }
    verifyPasswordResetCode(auth, oobCode)
      .then(e => { setEmail(e); setStatus('ready') })
      .catch(() => setStatus('invalid'))
  }, [oobCode])

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (password.length < 6) { setError('Mínimo 6 caracteres'); return }
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
    try {
      await confirmPasswordReset(auth, oobCode, password)
      setDone(true)
    } catch {
      setError('El enlace expiró o ya fue usado. Solicita uno nuevo.')
    }
  }

  const inp = {
    width: '100%', padding: '10px 12px 10px 36px',
    background: T.bg, border: `1px solid ${T.border}`,
    borderRadius: 9, color: T.text, fontSize: 13,
    fontFamily: 'inherit', outline: 'none', transition: 'all 0.2s',
    boxSizing: 'border-box',
  }

  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif", padding: 16,
    }}>
      <div style={{
        position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
      }}>
        <div style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', background: T.green, opacity: 0.1, top: '-120px', left: '-100px', filter: 'blur(80px)', animation: 'rp-float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: T.blue, opacity: 0.1, bottom: '-80px', right: '-80px', filter: 'blur(80px)', animation: 'rp-float 8s ease-in-out infinite', animationDelay: '-3s' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 380, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, background: T.green, borderRadius: 14,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, marginBottom: 10, color: '#000',
            boxShadow: `0 4px 20px ${T.green}44`,
          }}><i className="fa-solid fa-motorcycle"></i></div>
          <div style={{ fontSize: 20, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>
            TRANSI<span style={{ color: T.green }}>+</span>
          </div>
        </div>

        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 16, padding: '28px 28px 24px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}>
          {status === 'verifying' && (
            <div style={{ textAlign: 'center', padding: '20px 0', color: T.muted, fontSize: 13 }}>
              <div style={{ width: 20, height: 20, border: `2px solid ${T.faint}`, borderTopColor: T.green, borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
              Verificando enlace...
            </div>
          )}

          {status === 'no-code' && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T.green}18`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: T.green, marginBottom: 8 }}>
                <i className="fa-regular fa-envelope"></i>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>Revisa tu correo</div>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 16 }}>
                Te enviamos un enlace para restablecer tu contraseña. Si ya lo usaste, puedes volver al inicio.
              </div>
              <button onClick={() => navigate('/login')} style={{
                padding: '9px 20px', background: T.green, color: '#000',
                border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
                fontFamily: 'inherit', cursor: 'pointer',
              }}>Ir al inicio de sesión</button>
            </div>
          )}

          {status === 'invalid' && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T.red}18`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: T.red, marginBottom: 8 }}>
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>Enlace inválido</div>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 16 }}>Este enlace expiró o no es válido.</div>
              <button onClick={() => navigate('/login')} style={{
                padding: '9px 20px', background: T.green, color: '#000',
                border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
                fontFamily: 'inherit', cursor: 'pointer',
              }}>Ir al inicio</button>
            </div>
          )}

          {done && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T.green}18`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: T.green, marginBottom: 8 }}>
                <i className="fa-solid fa-check"></i>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.green, marginBottom: 4 }}>Contraseña actualizada</div>
              <div style={{ fontSize: 12, color: T.muted, marginBottom: 16 }}>Ya puedes iniciar sesión con tu nueva contraseña.</div>
              <button onClick={() => navigate('/login')} style={{
                padding: '9px 20px', background: T.green, color: '#000',
                border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
                fontFamily: 'inherit', cursor: 'pointer',
              }}>Ir al inicio</button>
            </div>
          )}

          {status === 'ready' && !done && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T.green}18`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: T.green, marginBottom: 8 }}>
                  <i className="fa-solid fa-lock-open"></i>
                </div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: '0 0 4px' }}>
                  Restablecer contraseña
                </h2>
                <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>
                  Para {email}
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: T.muted }}>Nueva contraseña</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: T.faint, pointerEvents: 'none', zIndex: 1, display: 'flex' }}><i className="fa-solid fa-lock"></i></span>
                    <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={inp} autoFocus />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: T.muted }}>Confirmar contraseña</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: T.faint, pointerEvents: 'none', zIndex: 1, display: 'flex' }}><i className="fa-solid fa-lock"></i></span>
                    <input type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} style={inp} />
                  </div>
                </div>

                {error && (
                  <div style={{ padding: '10px 12px', background: `${T.red}11`, border: `1px solid ${T.red}33`, borderRadius: 8, fontSize: 12, color: T.red }}>{error}</div>
                )}

                <button type="submit" style={{
                  width: '100%', padding: '11px', background: T.green,
                  color: '#000', border: 'none', borderRadius: 10,
                  fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                  cursor: 'pointer', transition: 'opacity 0.2s', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  Restablecer contraseña
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`@keyframes rp-float { 0%,100% { transform: translateY(0) scale(1) } 50% { transform: translateY(-24px) scale(1.06) } }`}</style>
    </div>
  )
}
