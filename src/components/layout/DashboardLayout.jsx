// línea 1 de DashboardLayout.jsx
import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { Firestore } from '../../services/firestore'

import { PageModulo } from '../../pages/PageModulo'

import { GameHub } from '../../games/GameHub'
import { LessonHub } from '../../lessons/LessonHub'
import { PageBiblioteca } from '../../components/PageBiblioteca'
import { useProgress } from '../../context/ProgressContext'
import { ForumProvider } from '../../context/ForumContext'
import { SupportProvider } from '../../context/SupportContext'

// UI atoms
import { Logo } from '../ui/Logo'
import { XpBar } from '../ui/XpBar'
import { StatChip } from '../ui/Cards'
import { DashboardStyles } from './DashboardStyles'
import { PageNoticias } from '../../pages/PageNoticias'


// Pages
import { PageHome } from '../../pages/PageHome'
import { PageLecciones, PageLogros, PagePerfil } from '../../pages/PageLeccionesLogrosPeril'
import { PageRanking } from '../../pages/PageRanking'
import { PageForo } from '../../pages/PageForo'
import { PageSoporte } from '../../pages/PageSoporte'
import { PublicProfile } from '../../pages/PublicProfile'
import { PageBot } from '../../pages/PageChatbot'
import { T } from '../../styles/tokens'
import { useTheme } from '../../context/ThemeContext'
import { useAccessibility } from '../../context/AccessibilityContext'

const NAV_ITEMS = [
  { icon: <i className="fa-solid fa-house"></i>,       label: 'Inicio',    to: '/dashboard/inicio'    },
  { icon: <i className="fa-solid fa-pen-to-square"></i>, label: 'Pruebas',  to: '/dashboard/lecciones' },
  { icon: <i className="fa-solid fa-book"></i>,        label: 'Biblioteca',to: '/dashboard/biblioteca' },
  { icon: <i className="fa-solid fa-trophy"></i>,      label: 'Logros',    to: '/dashboard/logros'    },
  { icon: <i className="fa-solid fa-medal"></i>,       label: 'Ranking',   to: '/dashboard/ranking'   },
  { icon: <i className="fa-solid fa-user"></i>,        label: 'Perfil',    to: '/dashboard/perfil'    },
  { icon: <i className="fa-solid fa-gamepad"></i>,     label: 'Juegos',    to: '/dashboard/juegos'    },
  { icon: <i className="fa-solid fa-newspaper"></i>,   label: 'Noticias', to: '/dashboard/noticias' },
  { icon: <i className="fa-solid fa-comments"></i>,    label: 'Foro',     to: '/dashboard/foro'      },
  { icon: <i className="fa-solid fa-circle-question"></i>, label: 'Soporte', to: '/dashboard/soporte' },
  { icon: <i className="fa-solid fa-robot"></i>,       label: 'Chatbot',  to: '/dashboard/chatbot'   },
]

export function DashboardLayout({ user, onLogout }) {
  const { xp, streak, levelInfo } = useProgress()
  const { theme, toggleTheme } = useTheme()
  const { settings, setOption } = useAccessibility()
  const [platform, setPlatform] = useState(null)

  useEffect(() => {
    Firestore.get('config', 'platform').then(d => {
      if (d) setPlatform(d)
    }).catch(() => {})
  }, [])

  const forumEnabled = platform?.forumEnabled !== false
  const newsEnabled = platform?.newsEnabled !== false
  const maintenanceMode = platform?.maintenanceMode === true

  const filteredNav = NAV_ITEMS.filter(n => {
    if (n.to === '/dashboard/foro') return forumEnabled
    if (n.to === '/dashboard/noticias') return newsEnabled
    return true
  })

  return (
    <>
      <DashboardStyles />
      {maintenanceMode && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
          background: '#ff5252', color: '#fff', textAlign: 'center',
          padding: '8px 16px', fontSize: 12, fontWeight: 600,
        }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: 6 }}></i>
          Modo mantenimiento activo — algunas funciones pueden no estar disponibles
        </div>
      )}
      <div style={{
        minHeight: '100vh', background: T.bg,
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gridTemplateRows: '56px 1fr',
        paddingTop: maintenanceMode ? 32 : 0,
      }}>
        {/* Header */}
        <header style={{
          gridColumn: '1 / -1',
          background: `linear-gradient(135deg, rgba(14,17,24,0.92), rgba(15,19,30,0.96))`,
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,230,118,0.06)',
          display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12,
          position: 'relative', zIndex: 10,
        }}>
          {/* Top subtle glow */}
          <div style={{
            position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
            background: `linear-gradient(90deg, transparent, ${T.green}22, transparent)`,
          }} />
          {/* Animated bottom glow line */}
          <div style={{
            position: 'absolute', bottom: 0, left: '5%', right: '5%', height: 1,
            background: `linear-gradient(90deg, transparent, ${T.green}44, transparent)`,
            animation: 'hdr-glow 3s ease-in-out infinite',
          }} />
          <Logo small />
          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.06)', margin: '0 4px' }} />
          <div style={{
            fontSize: 11, color: T.faint, fontWeight: 500, letterSpacing: '0.04em',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Dashboard
          </div>
          <div style={{ flex: 1 }} />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 10px', borderRadius: 10,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)',
          }}>
            <StatChip icon={<span style={{ fontSize: 13 }}>🔥</span>} value={streak} label="racha" color={T.orange} />
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.04)' }} />
            <StatChip icon={<span style={{ fontSize: 13 }}>❤️</span>} value="4/5"  color={T.red} />
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.04)' }} />
            <StatChip icon={<span style={{ fontSize: 13 }}>⚡</span>} value={xp}     label="xp"    color={T.green} />
          </div>
          {user.isAdmin && (
            <>
              <NavLink to="/admin" style={{
                fontSize: 11, color: T.green, textDecoration: 'none',
                padding: '5px 12px', borderRadius: 6,
                border: `1px solid ${T.green}33`,
                display: 'flex', alignItems: 'center', gap: 5,
                fontWeight: 600,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = T.green + '15' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <i className="fa-solid fa-shield-halved"></i>
                Panel Admin
              </NavLink>
              <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.06)' }} />
            </>
          )}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { toggleTheme(); setOption('lightMode', theme === 'dark') }}
              title={theme === 'dark' ? 'Modo claro (beta)' : 'Modo oscuro'}
              style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 8, color: T.faint, cursor: 'pointer',
                fontSize: 16, padding: '7px 10px', lineHeight: 1,
                transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = T.text; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = T.faint; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
            >
              {theme === 'dark' ? <i className="fa-regular fa-sun"></i> : <i className="fa-regular fa-moon"></i>}
            </button>
            <span style={{
              position: 'absolute', top: -6, right: -8,
              fontSize: 8, fontWeight: 800, letterSpacing: '0.04em',
              background: T.gold, color: '#000',
              padding: '1px 5px', borderRadius: 4,
              lineHeight: '14px',
            }}>BETA</span>
          </div>
          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.06)' }} />
          <button
            onClick={onLogout}
            style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8, color: T.faint, cursor: 'pointer',
              fontSize: 11, padding: '7px 14px', fontWeight: 500,
              transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = T.text; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = T.faint; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
          >
            Salir
          </button>
        </header>

        {/* Sidebar nav */}
        <nav style={{
          background: T.surface, borderRight: `1px solid ${T.border}`,
          padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto',
        }}>
          {filteredNav.map(n => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>{n.icon}</span>
              {n.label}
            </NavLink>
          ))}

          <div style={{ flex: 1 }} />

          {/* User card + XP */}
          <div style={{ padding: '12px', background: T.card, borderRadius: 10, border: `1px solid ${T.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
              {user.photo ? (
                <img
                  src={user.photo}
                  alt="Avatar"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0,
                    border: '1px solid rgba(0,230,118,0.28)',
                  }}
                />
              ) : (
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(0,230,118,0.12)', border: '1px solid rgba(0,230,118,0.28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: T.green,
                }}>{user.name?.[0]?.toUpperCase() ?? '?'}</div>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name.split(' ')[0]}
                </div>
                <div style={{ fontSize: 10, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Nivel {levelInfo.level}
                </div>
              </div>
            </div>
            <XpBar />
          </div>
        </nav>

        {/* Main content */}
        <main style={{ overflowY: 'auto', padding: '24px 28px' }}>
          <SupportProvider user={user}>
          <ForumProvider user={user}>
            <Routes>
              <Route index element={<Navigate to="inicio" replace />} />
              <Route path="inicio"      element={<PageHome user={user} />} />
              <Route path="lecciones"   element={<PageLecciones />} />
              <Route path="logros"      element={<PageLogros />} />
              <Route path="perfil"      element={<PagePerfil user={user} />} />
              <Route path="biblioteca"  element={<PageBiblioteca />} />
              <Route path="leccion/:id" element={<LessonHub />} />
              <Route path="juegos"      element={<GameHub />} />
              <Route path="modulo/:id" element={<PageModulo />} />
              <Route path="noticias" element={<PageNoticias />} />
              <Route path="ranking" element={<PageRanking user={user} />} />
              <Route path="perfil/:uid" element={<PublicProfile />} />
              <Route path="foro" element={<PageForo />} />
              <Route path="soporte" element={<PageSoporte />} />
              <Route path="chatbot" element={<PageBot />} />
            </Routes>
          </ForumProvider>
          </SupportProvider>
        </main>
      </div>
    </>
  )
}