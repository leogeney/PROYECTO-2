import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Firestore } from '../services/firestore'
import { T } from '../styles/tokens'

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function PageAdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const [users, reports, logs] = await Promise.all([
          Firestore.list('users'),
          Firestore.list('support_reports', 'date'),
          Firestore.list('activity_log', 'timestamp'),
        ])
        const now = Date.now()
        const today = users.filter(u => {
          const t = u.lastLogin || u.updatedAt?.toMillis?.() || 0
          return now - t < 86400000
        })
        setStats({
          totalUsers: users.length,
          activeToday: today.length,
          totalReports: reports.length,
          totalActions: logs.length,
          totalXp: users.reduce((s, u) => s + (u.xp || 0), 0),
        })
        setRecentActivity(logs.slice(0, 20))
      } catch {}
    })()
  }, [])

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <i className="fa-solid fa-shield-halved" style={{ color: T.green }}></i>
          Panel de administración
        </h1>
        <p style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>Control general de la plataforma</p>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { icon: 'fa-solid fa-users', label: 'Usuarios totales', value: stats.totalUsers, color: T.blue },
            { icon: 'fa-solid fa-clock', label: 'Activos hoy', value: stats.activeToday, color: T.green },
            { icon: 'fa-solid fa-headset', label: 'Reportes', value: stats.totalReports, color: T.orange },
            { icon: 'fa-solid fa-bolt', label: 'Acciones registradas', value: stats.totalActions, color: T.cyan },
            { icon: 'fa-solid fa-star', label: 'XP total', value: stats.totalXp.toLocaleString(), color: T.gold },
          ].map(s => (
            <div key={s.label} style={{
              background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 14, padding: '16px 18px',
            }}>
              <div style={{ fontSize: 11, color: T.faint, fontWeight: 600, letterSpacing: '0.04em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className={s.icon} style={{ color: s.color }}></i>
                {s.label}
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: T.text, fontFamily: "'Space Mono', monospace" }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: 18,
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="fa-solid fa-bolt" style={{ color: T.green }}></i>
            Actividad reciente
          </h3>
          {recentActivity.length === 0 ? (
            <div style={{ fontSize: 12, color: T.faint, padding: '20px 0', textAlign: 'center' }}>Sin actividad aún</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {recentActivity.map(a => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 8px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.02)', fontSize: 11,
                  color: T.muted,
                }}>
                  <i className="fa-solid fa-circle" style={{ fontSize: 6, color: T.green }}></i>
                  <span style={{ fontWeight: 600, color: T.text, minWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
                  <span style={{ flex: 1 }}>{a.action}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", color: T.faint, fontSize: 10, flexShrink: 0 }}>{formatTime(a.timestamp)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: 18,
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="fa-solid fa-compass" style={{ color: T.blue }}></i>
            Acceso rápido
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: 'fa-solid fa-users', label: 'Gestionar usuarios', to: '/dashboard/admin/usuarios', color: T.blue },
              { icon: 'fa-solid fa-headset', label: 'Reportes y soporte', to: '/dashboard/admin/soporte', color: T.orange },
            ].map(item => (
              <button key={item.to} onClick={() => navigate(item.to)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}`,
                color: T.text, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                fontFamily: 'inherit', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
              >
                <span style={{ width: 28, height: 28, borderRadius: 8, background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, fontSize: 13 }}>
                  <i className={item.icon}></i>
                </span>
                {item.label}
                <span style={{ flex: 1 }} />
                <i className="fa-solid fa-chevron-right" style={{ fontSize: 10, color: T.faint }}></i>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
