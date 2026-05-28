// components/Login/Login.jsx
import { useState } from 'react'
import { useLogin } from './useLogin'
import { Icon } from '../ui/Icon'
import { T } from '../../styles/tokens'

const C = T

const inp = {
  width: '100%', padding: '10px 12px',
  background: '#0d1117',
  border: `1px solid ${C.border}`,
  borderRadius: 8, color: C.text,
  fontSize: 13, fontFamily: 'inherit',
  outline: 'none', transition: 'border-color 0.2s',
  boxSizing: 'border-box',
}

export default function Login({ onLoginSuccess }) {
  const [mode, setMode] = useState('login') // 'login' | 'register' | 'reset'

  const {
    form, errors, loading, googleLoading, serverError,
    handleChange, handleSubmit, handleGoogleLogin,
    // register
    handleRegister, registerLoading, registerSuccess,
    // reset
    handleReset, resetLoading, resetSent,
  } = useLogin(onLoginSuccess)

  const isLogin    = mode === 'login'
  const isRegister = mode === 'register'
  const isReset    = mode === 'reset'

  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Sora', 'Segoe UI', sans-serif", padding: 16,
    }}>
      {/* Fondo decorativo */}
      <div style={{
        position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0,
      }}>
        {['#3fb95015', '#58a6ff10', '#e3b34108'].map((c, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 400 + i * 100, height: 400 + i * 100,
            borderRadius: '50%', background: c,
            top: `${10 + i * 25}%`, left: `${5 + i * 30}%`,
            filter: 'blur(80px)',
          }} />
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: 380, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, background: C.greenDk, borderRadius: 14,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, marginBottom: 10, boxShadow: '0 4px 20px rgba(63,185,80,0.3)',
          }}><Icon icon="☸" size={26} /></div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text, letterSpacing: '-0.02em' }}>
            TRANSI<span style={{ color: C.green }}>+</span>
          </div>
          <div style={{ fontSize: 12, color: C.faint, marginTop: 3 }}>
            Aprende las normas de tránsito
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 16, padding: '28px 28px 24px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}>
          {/* Tabs Login / Registro */}
          {!isReset && (
            <div style={{
              display: 'flex', background: '#0d1117',
              borderRadius: 10, padding: 3, marginBottom: 24,
            }}>
              {[['login', 'Iniciar sesión'], ['register', 'Registrarse']].map(([val, lbl]) => (
                <button key={val} onClick={() => setMode(val)} style={{
                  flex: 1, padding: '7px', borderRadius: 8,
                  background: mode === val ? C.surface : 'transparent',
                  border: mode === val ? `1px solid ${C.border}` : '1px solid transparent',
                  color: mode === val ? C.text : C.faint,
                  fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>{lbl}</button>
              ))}
            </div>
          )}

          {/* ── MODO RESET ─────────────────────────────────── */}
          {isReset && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 28 }}><Icon icon="🔑" size={28} /></div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: '6px 0 4px' }}>
                  Recuperar contraseña
                </h2>
                <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
                  Te enviamos un correo con el enlace
                </p>
              </div>

              {resetSent ? (
                <div style={{
                  padding: '14px', background: 'rgba(63,185,80,0.1)',
                  border: '1px solid rgba(63,185,80,0.3)', borderRadius: 10,
                  textAlign: 'center', fontSize: 13, color: C.green,
                }}>
                  <Icon icon="✅" size={14} /> ¡Correo enviado! Revisa tu bandeja.
                </div>
              ) : (
                <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Field label="Correo electrónico" error={errors.email}>
                    <input
                      name="email" type="email" placeholder="tu@correo.com"
                      value={form.email} onChange={handleChange}
                      style={{ ...inp, borderColor: errors.email ? C.red : C.border }}
                      onFocus={e => e.target.style.borderColor = C.green}
                      onBlur={e => e.target.style.borderColor = errors.email ? C.red : C.border}
                    />
                  </Field>
                  {serverError && <ErrorMsg msg={serverError} />}
                  <SubmitBtn loading={resetLoading} label="Enviar enlace" />
                </form>
              )}

              <button onClick={() => setMode('login')} style={{
                display: 'block', width: '100%', marginTop: 14,
                background: 'transparent', border: 'none',
                color: C.muted, fontSize: 12, cursor: 'pointer',
                fontFamily: 'inherit', padding: '6px',
              }}>
                ← Volver al inicio de sesión
              </button>
            </>
          )}

          {/* ── MODO LOGIN ─────────────────────────────────── */}
          {isLogin && (
            <>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="Correo electrónico" error={errors.email}>
                  <input
                    name="email" type="email" placeholder="tu@correo.com"
                    value={form.email} onChange={handleChange} autoComplete="email"
                    style={{ ...inp, borderColor: errors.email ? C.red : C.border }}
                    onFocus={e => e.target.style.borderColor = C.green}
                    onBlur={e => e.target.style.borderColor = errors.email ? C.red : C.border}
                  />
                </Field>
                <Field label="Contraseña" error={errors.password}>
                  <PasswordInput name="password" value={form.password} onChange={handleChange} error={errors.password} />
                </Field>

                <div style={{ textAlign: 'right', marginTop: -6 }}>
                  <button type="button" onClick={() => setMode('reset')} style={{
                    background: 'none', border: 'none', color: C.muted,
                    fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                    textDecoration: 'underline',
                  }}>
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

          {/* ── MODO REGISTRO ──────────────────────────────── */}
          {isRegister && (
            <>
              {registerSuccess ? (
                <div style={{
                  padding: '16px', background: 'rgba(63,185,80,0.1)',
                  border: '1px solid rgba(63,185,80,0.3)', borderRadius: 10,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}><Icon icon="🎉" size={28} /></div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.green, marginBottom: 4 }}>
                    ¡Cuenta creada!
                  </div>
                  <div style={{ fontSize: 12, color: C.muted }}>
                    Ya puedes iniciar sesión con tu nuevo acceso.
                  </div>
                  <button onClick={() => setMode('login')} style={{
                    marginTop: 14, padding: '8px 20px',
                    background: C.greenDk, color: '#fff',
                    border: 'none', borderRadius: 8,
                    fontSize: 12, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
                  }}>
                    Ir al inicio de sesión
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Field label="Nombre completo" error={errors.name}>
                    <input
                      name="name" type="text" placeholder="Tu nombre"
                      value={form.name || ''} onChange={handleChange} autoComplete="name"
                      style={{ ...inp, borderColor: errors.name ? C.red : C.border }}
                      onFocus={e => e.target.style.borderColor = C.green}
                      onBlur={e => e.target.style.borderColor = errors.name ? C.red : C.border}
                    />
                  </Field>
                  <Field label="Correo electrónico" error={errors.email}>
                    <input
                      name="email" type="email" placeholder="tu@correo.com"
                      value={form.email} onChange={handleChange} autoComplete="email"
                      style={{ ...inp, borderColor: errors.email ? C.red : C.border }}
                      onFocus={e => e.target.style.borderColor = C.green}
                      onBlur={e => e.target.style.borderColor = errors.email ? C.red : C.border}
                    />
                  </Field>
                  <Field label="Contraseña" error={errors.password}>
                    <PasswordInput name="password" value={form.password} onChange={handleChange} error={errors.password} />
                  </Field>
                  <Field label="Confirmar contraseña" error={errors.confirmPassword}>
                    <PasswordInput name="confirmPassword" value={form.confirmPassword || ''} onChange={handleChange} error={errors.confirmPassword} placeholder="Repite tu contraseña" />
                  </Field>

                  {serverError && <ErrorMsg msg={serverError} />}
                  <SubmitBtn loading={registerLoading} label="Crear cuenta" color={C.greenDk} />
                </form>
              )}

              <Divider />
              <GoogleBtn loading={googleLoading} onClick={handleGoogleLogin} />
            </>
          )}
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: 11, color: C.faint, marginTop: 16 }}>
          Al continuar aceptas los <span style={{ color: C.muted, textDecoration: 'underline', cursor: 'pointer' }}>Términos de uso</span>
        </p>
      </div>
    </div>
  )
}

// ── Helpers UI ────────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: 11, color: C.red }}>{error}</span>}
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
        style={{ ...inp, paddingRight: 40, borderColor: error ? C.red : C.border }}
        onFocus={e => e.target.style.borderColor = C.green}
        onBlur={e => e.target.style.borderColor = error ? C.red : C.border}
      />
      <button type="button" onClick={() => setShow(s => !s)} style={{
        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', color: C.faint,
        fontSize: 14, padding: 0, display: 'flex', alignItems: 'center',
      }}>
        {show ? <Icon icon="🙈" size={14} /> : <Icon icon="👁️" size={14} />}
      </button>
    </div>
  )
}

function ErrorMsg({ msg }) {
  return (
    <div style={{
      padding: '10px 12px', background: 'rgba(248,81,73,0.1)',
      border: '1px solid rgba(248,81,73,0.3)', borderRadius: 8,
      fontSize: 12, color: C.red,
    }}>
      {msg}
    </div>
  )
}

function SubmitBtn({ loading, label }) {
  return (
    <button type="submit" disabled={loading} style={{
      width: '100%', padding: '11px', background: loading ? '#21262d' : C.greenDk,
      color: '#fff', border: 'none', borderRadius: 10,
      fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
      cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>
      {loading ? <Spinner /> : label}
    </button>
  )
}

function GoogleBtn({ loading, onClick }) {
  return (
    <button type="button" onClick={onClick} disabled={loading} style={{
      width: '100%', padding: '10px', background: 'transparent',
      border: `1px solid ${C.border}`, borderRadius: 10,
      color: C.text, fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
      cursor: loading ? 'not-allowed' : 'pointer', transition: 'border-color 0.2s',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      opacity: loading ? 0.6 : 1,
    }}
      onMouseEnter={e => !loading && (e.currentTarget.style.borderColor = '#58a6ff')}
      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
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
      <div style={{ flex: 1, height: 1, background: C.border }} />
      <span style={{ fontSize: 11, color: C.faint }}>o</span>
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  )
}

function Spinner() {
  return (
    <span style={{
      display: 'inline-block', width: 14, height: 14,
      border: '2px solid rgba(255,255,255,0.2)',
      borderTopColor: '#fff', borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </span>
  )
}