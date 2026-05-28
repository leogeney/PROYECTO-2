import { useState } from 'react'
import { useLogin } from './useLogin'
import { Icon } from '../ui/Icon'
import { T } from '../../styles/tokens'

const inp = {
  width: '100%', padding: '10px 12px 10px 36px',
  background: T.bg,
  border: `1px solid ${T.border}`,
  borderRadius: 9, color: T.text,
  fontSize: 13, fontFamily: 'inherit',
  outline: 'none', transition: 'all 0.2s',
  boxSizing: 'border-box',
}

export default function Login({ onLoginSuccess }) {
  const [mode, setMode] = useState('login')
  const [showTerms, setShowTerms] = useState(false)

  const {
    form, errors, loading, googleLoading, serverError,
    handleChange, handleSubmit, handleGoogleLogin,
    handleRegister, registerLoading, registerSuccess,
    handleReset, resetLoading, resetSent,
  } = useLogin(onLoginSuccess)

  const isLogin    = mode === 'login'
  const isRegister = mode === 'register'
  const isReset    = mode === 'reset'

  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif", padding: 16,
    }}>
      <div style={{
        position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
      }}>
        {[
          { color: T.green, size: 420, t: '-120px', l: '-100px', d: '0s' },
          { color: T.blue, size: 320, t: 'auto', b: '-80px', l: 'auto', r: '-80px', d: '-3s' },
          { color: T.gold, size: 260, t: '50%', l: '55%', d: '-5s' },
        ].map((blob, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: blob.size, height: blob.size,
            borderRadius: '50%',
            background: blob.color, opacity: 0.12,
            top: blob.t, left: blob.l, bottom: blob.b, right: blob.r,
            filter: 'blur(80px)',
            animation: 'login-float 8s ease-in-out infinite',
            animationDelay: blob.d,
          }} />
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: 380, position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48,
            background: T.green, borderRadius: 14,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, marginBottom: 10, color: '#000',
            boxShadow: `0 4px 20px ${T.green}44`,
          }}><i className="fa-solid fa-motorcycle"></i></div>
          <div style={{ fontSize: 20, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>
            TRANSI<span style={{ color: T.green }}>+</span>
          </div>
          <div style={{ fontSize: 12, color: T.faint, marginTop: 3 }}>
            Aprende las normas de tránsito
          </div>
        </div>

        <div style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 16, padding: '28px 28px 24px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}>
          {!isReset && (
            <div style={{
              display: 'flex', background: T.bg,
              borderRadius: 10, padding: 3, marginBottom: 24,
            }}>
              {[['login', 'Iniciar sesión'], ['register', 'Registrarse']].map(([val, lbl]) => (
                <button key={val} onClick={() => setMode(val)} style={{
                  flex: 1, padding: '7px', borderRadius: 8,
                  background: mode === val ? T.surface : 'transparent',
                  border: mode === val ? `1px solid ${T.border}` : '1px solid transparent',
                  color: mode === val ? T.text : T.faint,
                  fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>{lbl}</button>
              ))}
            </div>
          )}

          {isReset && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `${T.green}18`, display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, color: T.green, marginBottom: 8,
                }}>
                  <i className="fa-solid fa-key"></i>
                </div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: '0 0 4px' }}>
                  Recuperar contraseña
                </h2>
                <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>
                  Te enviaremos un enlace a tu correo
                </p>
              </div>

              {resetSent ? (
                <div style={{
                  padding: '16px', background: `${T.green}11`,
                  border: `1px solid ${T.green}44`, borderRadius: 10,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.green, marginBottom: 4 }}>
                    <i className="fa-regular fa-circle-check" style={{ marginRight: 6 }}></i>
                    ¡Correo enviado!
                  </div>
                  <div style={{ fontSize: 12, color: T.muted }}>
                    Revisa tu bandeja de entrada y sigue las instrucciones.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Field label="Correo electrónico" error={errors.email} icon={<i className="fa-regular fa-envelope"></i>}>
                    <input
                      name="email" type="email" placeholder="tu@correo.com"
                      value={form.email} onChange={handleChange}
                      style={{ ...inp, borderColor: errors.email ? T.red : T.border }}
                      onFocus={e => { e.currentTarget.style.borderColor = T.green; e.currentTarget.style.boxShadow = `0 0 0 3px ${T.green}22` }}
                      onBlur={e => { e.currentTarget.style.borderColor = errors.email ? T.red : T.border; e.currentTarget.style.boxShadow = 'none' }}
                    />
                  </Field>
                  {serverError && <ErrorMsg msg={serverError} />}
                  <SubmitBtn loading={resetLoading} label="Enviar enlace" />
                </form>
              )}

              <button onClick={() => setMode('login')} style={{
                display: 'block', width: '100%', marginTop: 14,
                background: 'transparent', border: 'none',
                color: T.muted, fontSize: 12, cursor: 'pointer',
                fontFamily: 'inherit', padding: '6px',
              }}>
                <i className="fa-solid fa-arrow-left" style={{ marginRight: 4 }}></i>
                Volver al inicio de sesión
              </button>
            </>
          )}

          {isLogin && (
            <>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="Correo electrónico" error={errors.email} icon={<i className="fa-regular fa-envelope"></i>}>
                  <input
                    name="email" type="email" placeholder="tu@correo.com"
                    value={form.email} onChange={handleChange} autoComplete="email"
                    style={{ ...inp, borderColor: errors.email ? T.red : T.border }}
                    onFocus={e => { e.currentTarget.style.borderColor = T.green; e.currentTarget.style.boxShadow = `0 0 0 3px ${T.green}22` }}
                    onBlur={e => { e.currentTarget.style.borderColor = errors.email ? T.red : T.border; e.currentTarget.style.boxShadow = 'none' }}
                  />
                </Field>
                <Field label="Contraseña" error={errors.password} icon={<i className="fa-solid fa-lock"></i>}>
                  <PasswordInput name="password" value={form.password} onChange={handleChange} error={errors.password} />
                </Field>

                <div style={{ textAlign: 'right', marginTop: -6 }}>
                  <button type="button" onClick={() => setMode('reset')} style={{
                    background: 'none', border: 'none', color: T.green,
                    fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'opacity 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    <i className="fa-regular fa-circle-question" style={{ marginRight: 4 }}></i>
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {serverError && <ErrorMsg msg={serverError} />}
                <SubmitBtn loading={loading} label="Iniciar sesión" />
              </form>

              <Divider />
              <GoogleBtn loading={googleLoading} onClick={handleGoogleLogin} />
            </>
          )}

          {isRegister && (
            <>
              {registerSuccess ? (
                <div style={{
                  padding: '16px', background: `${T.green}11`,
                  border: `1px solid ${T.green}44`, borderRadius: 10,
                  textAlign: 'center',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${T.green}18`, display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, color: T.green, marginBottom: 8,
                  }}>
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.green, marginBottom: 4 }}>
                    ¡Cuenta creada!
                  </div>
                  <div style={{ fontSize: 12, color: T.muted }}>
                    Ya puedes iniciar sesión con tu nuevo acceso.
                  </div>
                  <button onClick={() => setMode('login')} style={{
                    marginTop: 14, padding: '8px 20px',
                    background: T.green, color: '#000',
                    border: 'none', borderRadius: 8,
                    fontSize: 12, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
                  }}>
                    Ir al inicio de sesión
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Field label="Nombre completo" error={errors.name} icon={<i className="fa-regular fa-user"></i>}>
                    <input
                      name="name" type="text" placeholder="Tu nombre"
                      value={form.name || ''} onChange={handleChange} autoComplete="name"
                      style={{ ...inp, borderColor: errors.name ? T.red : T.border }}
                      onFocus={e => { e.currentTarget.style.borderColor = T.green; e.currentTarget.style.boxShadow = `0 0 0 3px ${T.green}22` }}
                      onBlur={e => { e.currentTarget.style.borderColor = errors.name ? T.red : T.border; e.currentTarget.style.boxShadow = 'none' }}
                    />
                  </Field>
                  <Field label="Correo electrónico" error={errors.email} icon={<i className="fa-regular fa-envelope"></i>}>
                    <input
                      name="email" type="email" placeholder="tu@correo.com"
                      value={form.email} onChange={handleChange} autoComplete="email"
                      style={{ ...inp, borderColor: errors.email ? T.red : T.border }}
                      onFocus={e => { e.currentTarget.style.borderColor = T.green; e.currentTarget.style.boxShadow = `0 0 0 3px ${T.green}22` }}
                      onBlur={e => { e.currentTarget.style.borderColor = errors.email ? T.red : T.border; e.currentTarget.style.boxShadow = 'none' }}
                    />
                  </Field>
                  <Field label="Contraseña" error={errors.password} icon={<i className="fa-solid fa-lock"></i>}>
                    <PasswordInput name="password" value={form.password} onChange={handleChange} error={errors.password} />
                  </Field>
                  <Field label="Confirmar contraseña" error={errors.confirmPassword} icon={<i className="fa-solid fa-lock"></i>}>
                    <PasswordInput name="confirmPassword" value={form.confirmPassword || ''} onChange={handleChange} error={errors.confirmPassword} placeholder="Repite tu contraseña" />
                  </Field>

                  {serverError && <ErrorMsg msg={serverError} />}
                  <SubmitBtn loading={registerLoading} label="Crear cuenta" />
                </form>
              )}

              <Divider />
              <GoogleBtn loading={googleLoading} onClick={handleGoogleLogin} />
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: T.faint, marginTop: 16 }}>
          Al continuar aceptas los{' '}
          <span onClick={() => setShowTerms(true)} style={{ color: T.muted, textDecoration: 'underline', cursor: 'pointer' }}>
            Términos de uso
          </span>
        </p>
      </div>

      {/* Terms modal */}
      {showTerms && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(7,9,15,0.92)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }} onClick={() => setShowTerms(false)}>
          <div style={{
            background: T.surface, border: `1px solid ${T.border}`, borderRadius: 18,
            maxWidth: 520, width: '100%', maxHeight: '80vh', overflowY: 'auto',
            padding: '28px 32px',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: T.text, margin: 0 }}>Términos de uso</h2>
              <button onClick={() => setShowTerms(false)} style={{
                background: 'none', border: 'none', color: T.muted, fontSize: 20, cursor: 'pointer', padding: 4,
              }}>✕</button>
            </div>
            <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p>Al utilizar esta plataforma, aceptas los siguientes términos y condiciones:</p>
              <p><strong style={{ color: T.text }}>1. Uso responsable</strong><br />
              La información proporcionada es con fines educativos sobre seguridad vial y normas de tránsito en Colombia. No constituye asesoría legal.</p>
              <p><strong style={{ color: T.text }}>2. Privacidad</strong><br />
              Tus datos personales se almacenan de forma segura y no se comparten con terceros sin tu consentimiento explícito.</p>
              <p><strong style={{ color: T.text }}>3. Contenido generado</strong><br />
              Eres responsable del contenido que publicas en el foro y reportes. No se permite contenido ofensivo, engañoso o ilegal.</p>
              <p><strong style={{ color: T.text }}>4. Precisión</strong><br />
              Aunque nos esforzamos por mantener la información actualizada, las normas de tránsito pueden cambiar. Verifica siempre con fuentes oficiales.</p>
              <p><strong style={{ color: T.text }}>5. Modificaciones</strong><br />
              Nos reservamos el derecho de actualizar estos términos en cualquier momento. Los cambios serán notificados en la plataforma.</p>
              <p style={{ fontSize: 11, color: T.faint, marginTop: 8 }}>Última actualización: mayo 2025</p>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes login-float { 0%,100% { transform: translateY(0) scale(1) } 50% { transform: translateY(-24px) scale(1.06) } }`}</style>
    </div>
  )
}

function Field({ label, error, children, icon }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: T.muted }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {icon && <span style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          fontSize: 13, color: T.faint, pointerEvents: 'none', zIndex: 1, display: 'flex',
        }}>{icon}</span>}
        {children}
      </div>
      {error && <span style={{ fontSize: 11, color: T.red }}>{error}</span>}
    </div>
  )
}

function PasswordInput({ name, value, onChange, error, placeholder = '••••••••' }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <input
        name={name} type={show ? 'text' : 'password'}
        placeholder={placeholder} value={value} onChange={onChange}
        autoComplete={name === 'password' ? 'current-password' : 'new-password'}
        style={{ ...inp, paddingRight: 40, borderColor: error ? T.red : T.border }}
        onFocus={e => { e.currentTarget.style.borderColor = T.green; e.currentTarget.style.boxShadow = `0 0 0 3px ${T.green}22` }}
        onBlur={e => { e.currentTarget.style.borderColor = error ? T.red : T.border; e.currentTarget.style.boxShadow = 'none' }}
      />
      <span style={{
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        fontSize: 13, color: T.faint, pointerEvents: 'none', zIndex: 1, display: 'flex',
      }}><i className="fa-solid fa-lock"></i></span>
      <button type="button" onClick={() => setShow(s => !s)} style={{
        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', color: T.faint,
        fontSize: 14, padding: 0, display: 'flex', alignItems: 'center',
      }}>
        {show ? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
      </button>
    </div>
  )
}

function ErrorMsg({ msg }) {
  return (
    <div style={{
      padding: '10px 12px', background: `${T.red}11`,
      border: `1px solid ${T.red}33`, borderRadius: 8,
      fontSize: 12, color: T.red,
    }}>
      {msg}
    </div>
  )
}

function SubmitBtn({ loading, label }) {
  return (
    <button type="submit" disabled={loading} style={{
      width: '100%', padding: '11px',
      background: loading ? T.faint : T.green,
      color: '#000', border: 'none', borderRadius: 10,
      fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
      cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      opacity: loading ? 0.5 : 1,
    }}>
      {loading ? <Spinner /> : label}
    </button>
  )
}

function GoogleBtn({ loading, onClick }) {
  return (
    <button type="button" onClick={onClick} disabled={loading} style={{
      width: '100%', padding: '10px', background: 'transparent',
      border: `1px solid ${T.border}`, borderRadius: 10,
      color: T.text, fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
      cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      opacity: loading ? 0.6 : 1,
    }}
      onMouseEnter={e => !loading && (e.currentTarget.style.borderColor = T.blue)}
      onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
    >
      {loading ? <Spinner /> : (
        <>
          <svg width="16" height="16" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.2 6.5 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8.9 20-20 0-1.3-.1-2.7-.4-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.2 6.5 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.7 39.7 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.2-2.3 4-4.2 5.3l6.2 5.2c-.4.3 5.7-4.2 5.7-14.5 0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Continuar con Google
        </>
      )}
    </button>
  )
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0' }}>
      <div style={{ flex: 1, height: 1, background: T.border }} />
      <span style={{ fontSize: 11, color: T.faint }}>o</span>
      <div style={{ flex: 1, height: 1, background: T.border }} />
    </div>
  )
}

function Spinner() {
  return (
    <span style={{
      display: 'inline-block', width: 14, height: 14,
      border: '2px solid rgba(0,0,0,0.15)',
      borderTopColor: '#000', borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  )
}