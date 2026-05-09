// línea 1 de DashboardLayout.jsx
import { Routes, Route, Navigate, NavLink } from 'react-router-dom'

import { PageModulo } from '../../pages/PageModulo'

import { GameHub } from '../../games/GameHub'
import { LessonHub } from '../../lessons/LessonHub'
import { PageBiblioteca } from '../../components/PageBiblioteca'
import { useProgress } from '../../context/ProgressContext'

// UI atoms
import { Logo } from '../ui/Logo'
import { XpBar } from '../ui/XpBar'
import { StatChip } from '../ui/Cards'
import { DashboardStyles } from './DashboardStyles'

// Pages
import { PageHome } from '../../pages/PageHome'
import { PageLecciones, PageLogros, PagePerfil } from '../../pages/PageLeccionesLogrosPeril'
import { T } from '../../styles/tokens'

const NAV_ITEMS = [
  { icon: '⊞',  label: 'Inicio',    to: '/dashboard/inicio'    },
  { icon: '📚', label: 'Pruebas', to: '/dashboard/lecciones' },
  { icon: '🪧', label: 'Biblioteca',to: '/dashboard/biblioteca' },
  { icon: '🏆', label: 'Logros',    to: '/dashboard/logros'    },
  { icon: '👤', label: 'Perfil',    to: '/dashboard/perfil'    },
  { icon: '🎮', label: 'Juegos',    to: '/dashboard/juegos'    },
]

export function DashboardLayout({ user, onLogout }) {
  const { xp, streak, levelInfo } = useProgress()

  return (
    <>
      <DashboardStyles />
      <div style={{
        minHeight: '100vh', background: T.bg,
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        gridTemplateRows: '56px 1fr',
      }}>
        {/* Header */}
        <header style={{
          gridColumn: '1 / -1',
          background: T.surface, borderBottom: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12,
        }}>
          <Logo small />
          <div style={{ flex: 1 }} />
          <StatChip icon="🔥" value={streak} label="racha" color={T.orange} />
          <StatChip icon="❤️" value="4/5"  color={T.red}   />
          <StatChip icon="⚡" value={xp}     label="xp"    color={T.green}  />
          <button className="btn-ghost" onClick={onLogout} style={{ marginLeft: 4, fontSize: 11 }}>Salir</button>
        </header>

        {/* Sidebar nav */}
        <nav style={{
          background: T.surface, borderRight: `1px solid ${T.border}`,
          padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto',
        }}>
          {NAV_ITEMS.map(n => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>{n.icon}</span>
              {n.label}
            </NavLink>
          ))}

          <div style={{ flex: 1 }} />

          {/* User card + XP */}
          <div style={{ padding: '12px', background: T.card, borderRadius: 10, border: `1px solid ${T.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(0,230,118,0.12)', border: '1px solid rgba(0,230,118,0.28)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: T.green,
              }}>{user.name?.[0]?.toUpperCase() ?? '?'}</div>
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
          </Routes>
        </main>
      </div>
    </>
  )
}