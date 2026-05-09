// App.jsx
import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './config/firebase'
import Login from './components/Login/Login'
import { AchievementsProvider } from './games/GameAchievements'

import { DashboardLayout } from './components/layout/DashboardLayout'

const T = {
  bg: '#07090f', surface: '#0e1118', card: '#131720',
  border: 'rgba(255,255,255,0.06)', green: '#00e676', faint: '#3a4455', text: '#f0f4f8',
}

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; color: ${T.text}; font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.faint}; border-radius: 99px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .mono { font-family: 'Space Mono', monospace; }
`

function GlobalStyles() {
  return <style>{GLOBAL_CSS}</style>
}

function Logo({ small }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <div style={{
        width: small ? 24 : 30, height: small ? 24 : 30,
        borderRadius: 7, background: T.green,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: small ? 14 : 18, color: '#000', fontWeight: 900,
        boxShadow: '0 0 16px rgba(0,230,118,0.35)',
      }}>☸</div>
      <span className="mono" style={{
        fontSize: small ? 13 : 15, fontWeight: 700, color: T.text, letterSpacing: '0.08em',
      }}>
        TRANSI<span style={{ color: T.green }}>+</span>
      </span>
    </div>
  )
}

function Loader() {
  return (
    <>
      <GlobalStyles />
      <div style={{
        minHeight: '100vh', background: T.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 20,
      }}>
        <Logo />
        <div style={{
          width: 20, height: 20, border: `2px solid ${T.faint}`,
          borderTopColor: T.green, borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    </>
  )
}

function App() {
  const [user, setUser]         = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fb) => {
      setUser(fb ? { email: fb.email, name: fb.displayName || fb.email } : null)
      setChecking(false)
    })
    return unsub
  }, [])

  if (checking) return <Loader />

  return (
    <>
      <GlobalStyles />
      <Routes>
        <Route path="/login"       element={user ? <Navigate to="/dashboard/inicio" replace /> : <Login />} />
        <Route path="/dashboard/*" element={user ? <DashboardLayout user={user} onLogout={() => signOut(auth)} /> : <Navigate to="/login" replace />} />
        <Route path="*"            element={<Navigate to={user ? '/dashboard/inicio' : '/login'} replace />} />
      </Routes>
    </>
  )
}

export default App