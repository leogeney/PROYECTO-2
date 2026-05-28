import { useState } from 'react'
import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { PageAdminDashboard } from '../../pages/PageAdminDashboard'
import { PageAdminUsers } from '../../pages/PageAdminUsers'
import { PageAdminSupport } from '../../pages/PageAdminSupport'
import { PageAdminNews } from '../../pages/PageAdminNews'
import { PageAdminForum } from '../../pages/PageAdminForum'
import { PageAdminStats } from '../../pages/PageAdminStats'
import { PageAdminLessons } from '../../pages/PageAdminLessons'
import { PageAdminSettings } from '../../pages/PageAdminSettings'
import { SupportProvider } from '../../context/SupportContext'
import { T } from '../../styles/tokens'

const NAV = [
  { icon: 'fa-solid fa-chart-pie',        label: 'Dashboard',      to: '/admin' },
  { icon: 'fa-solid fa-users',            label: 'Usuarios',       to: '/admin/usuarios' },
  { icon: 'fa-solid fa-headset',          label: 'Soporte',        to: '/admin/soporte' },
  { icon: 'fa-solid fa-pen-to-square',    label: 'Lecciones',      to: '/admin/lecciones' },
  { icon: 'fa-solid fa-newspaper',        label: 'Noticias',       to: '/admin/noticias' },
  { icon: 'fa-solid fa-comments',         label: 'Foro',           to: '/admin/foro' },
  { icon: 'fa-solid fa-chart-simple',     label: 'Estadísticas',   to: '/admin/estadisticas' },
  { icon: 'fa-solid fa-gear',             label: 'Configuración',  to: '/admin/configuracion' },
]

export function AdminLayout({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      display: 'grid',
      gridTemplateColumns: collapsed ? '60px 1fr' : '220px 1fr',
      gridTemplateRows: '52px 1fr',
      transition: 'grid-template-columns 0.2s',
    }}>
      {/* Header */}
      <header style={{
        gridColumn: '1 / -1',
        background: `linear-gradient(135deg, #030714, #0a1022)`,
        borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10,
        position: 'relative', zIndex: 10,
      }}>
        <button onClick={() => setCollapsed(c => !c)} style={{
          background: 'none', border: 'none', color: T.faint, cursor: 'pointer',
          fontSize: 14, padding: 6, display: 'flex',
        }}>
          <i className={`fa-solid ${collapsed ? 'fa-bars' : 'fa-bars-staggered'}`}></i>
        </button>
        <div style={{
          width: 28, height: 28, borderRadius: 7, background: T.green,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, color: '#000', fontWeight: 900,
        }}><i className="fa-solid fa-shield-halved"></i></div>
        <span style={{ fontSize: 13, fontWeight: 700, color: T.text, letterSpacing: '0.04em' }}>
          Admin<span style={{ color: T.green }}>Panel</span>
        </span>
        <div style={{ flex: 1 }} />
        <NavLink to="/dashboard/inicio" style={{
          fontSize: 11, color: T.faint, textDecoration: 'none',
          padding: '5px 12px', borderRadius: 6,
          border: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', gap: 5,
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = T.text; e.currentTarget.style.borderColor = T.green + '44' }}
          onMouseLeave={e => { e.currentTarget.style.color = T.faint; e.currentTarget.style.borderColor = T.border }}
        >
          <i className="fa-solid fa-arrow-left"></i>
          {collapsed ? '' : 'Dashboard usuario'}
        </NavLink>
        <button onClick={onLogout} style={{
          background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`,
          borderRadius: 6, color: T.faint, cursor: 'pointer',
          fontSize: 11, padding: '5px 12px', fontFamily: 'inherit',
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = T.text; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
          onMouseLeave={e => { e.currentTarget.style.color = T.faint; e.currentTarget.style.borderColor = T.border }}
        >
          <i className="fa-solid fa-right-from-bracket" style={{ marginRight: 4 }}></i>
          {collapsed ? '' : 'Salir'}
        </button>
      </header>

      {/* Sidebar */}
      <nav style={{
        background: T.surface, borderRight: `1px solid ${T.border}`,
        padding: '10px 6px', display: 'flex', flexDirection: 'column', gap: 2,
        overflow: 'hidden',
      }}>
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} end={n.to === '/admin'} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '10px 0' : '9px 12px',
            borderRadius: 8, textDecoration: 'none',
            fontSize: 12, fontWeight: 500, color: T.muted,
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'all 0.15s',
          }}
            className={({ isActive }) => isActive ? 'admin-nav-active' : ''}
          >
            <i className={n.icon} style={{ fontSize: 15, width: 20, textAlign: 'center', flexShrink: 0 }}></i>
            {!collapsed && n.label}
          </NavLink>
        ))}
      </nav>

      {/* Content */}
      <main style={{ overflowY: 'auto', padding: '24px 28px' }}>
        <SupportProvider user={user}>
          <Routes>
            <Route index element={<PageAdminDashboard />} />
            <Route path="usuarios" element={<PageAdminUsers />} />
            <Route path="soporte" element={<PageAdminSupport />} />
            <Route path="lecciones" element={<PageAdminLessons />} />
            <Route path="noticias" element={<PageAdminNews />} />
            <Route path="foro" element={<PageAdminForum />} />
            <Route path="estadisticas" element={<PageAdminStats />} />
            <Route path="configuracion" element={<PageAdminSettings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </SupportProvider>
      </main>

      <style>{`
        .admin-nav-active {
          background: ${T.green}12 !important;
          color: ${T.green} !important;
          font-weight: 700 !important;
        }
        .admin-nav-active i {
          color: ${T.green} !important;
        }
      `}</style>
    </div>
  )
}
