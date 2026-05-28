import { useState, useEffect } from 'react'
import { Firestore } from '../services/firestore'
import { T } from '../styles/tokens'

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function timeAgo(ts) {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'ahora'
  if (min < 60) return `${min}m`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d`
  return formatTime(ts)
}

const ACTION_ICONS = {
  login: 'fa-solid fa-right-to-bracket',
  logout: 'fa-solid fa-right-from-bracket',
  'lesson_completed': 'fa-solid fa-check-circle',
  'game_played': 'fa-solid fa-gamepad',
  'support_report': 'fa-solid fa-headset',
  'xp_gained': 'fa-solid fa-bolt',
}

function getActionIcon(action) {
  return ACTION_ICONS[action] || 'fa-solid fa-circle'
}

function UserDetail({ user, onBack }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const all = await Firestore.list('activity_log', 'timestamp')
        setLogs(all.filter(l => l.uid === user.id).slice(0, 50))
      } catch {}
      setLoading(false)
    })()
  }, [user.id])

  return (
    <div>
      <button onClick={onBack} style={{
        background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`,
        borderRadius: 8, color: T.muted, cursor: 'pointer', fontSize: 12,
        padding: '6px 14px', fontFamily: 'inherit', marginBottom: 16,
      }}>
        <i className="fa-solid fa-arrow-left" style={{ marginRight: 6 }}></i>
        Volver a usuarios
      </button>

      <div style={{
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: 14, padding: 20, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: `${T.green}18`, border: `1px solid ${T.green}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: T.green,
          }}>
            {user.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{user.name}</div>
            <div style={{ fontSize: 12, color: T.muted }}>{user.email}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            { label: 'XP total', value: (user.xp || 0).toLocaleString(), color: T.green },
            { label: 'Racha', value: `${user.streak || 0} días`, color: T.orange },
            { label: 'Lecciones', value: (user.completedLessons?.length || 0).toString(), color: T.blue },
          ].map(s => (
            <div key={s.label} style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 10, color: T.faint, fontWeight: 600, letterSpacing: '0.03em', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: s.color, fontFamily: "'Space Mono', monospace" }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: 14, padding: 18,
      }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="fa-solid fa-clock-rotate-left" style={{ color: T.cyan }}></i>
          Registro de actividad
        </h3>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 20, color: T.faint, fontSize: 12 }}>Cargando...</div>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20, color: T.faint, fontSize: 12 }}>Sin actividad registrada</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {logs.map(l => (
              <div key={l.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 8,
                background: 'rgba(255,255,255,0.02)', fontSize: 12,
              }}>
                <i className={getActionIcon(l.action)} style={{ width: 16, color: T.faint, fontSize: 12 }}></i>
                <span style={{ color: T.text, fontWeight: 600, minWidth: 120 }}>{l.action.replace(/_/g, ' ')}</span>
                {l.detail?.lesson && <span style={{ color: T.muted }}>{l.detail.lesson}</span>}
                {l.detail?.xp && <span style={{ color: T.green }}>+{l.detail.xp} XP</span>}
                <span style={{ flex: 1 }} />
                <span style={{ color: T.faint, fontSize: 10, fontFamily: "'Space Mono', monospace", flexShrink: 0 }}>{timeAgo(l.timestamp)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function PageAdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await Firestore.list('users')
        setUsers(data.sort((a, b) => (b.xp || 0) - (a.xp || 0)))
      } catch {}
    })()
  }, [])

  if (selected) return <UserDetail user={selected} onBack={() => setSelected(null)} />

  const filtered = users.filter(u =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <i className="fa-solid fa-users" style={{ color: T.blue }}></i>
          Usuarios
        </h1>
        <p style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{users.length} registrados</p>
      </div>

      <div style={{
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: 14, padding: 14, marginBottom: 16,
      }}>
        <div style={{ position: 'relative' }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.faint, fontSize: 13 }}></i>
          <input
            placeholder="Buscar usuario..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 34px',
              background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`,
              borderRadius: 10, color: T.text, fontSize: 13,
              fontFamily: 'inherit', outline: 'none',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.map(u => (
          <button key={u.id} onClick={() => setSelected(u)} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px', borderRadius: 12,
            background: T.card, border: `1px solid ${T.border}`,
            color: T.text, cursor: 'pointer', width: '100%',
            textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = T.surface }}
            onMouseLeave={e => { e.currentTarget.style.background = T.card }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: `${T.green}12`, border: `1px solid ${T.green}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: T.green,
            }}>
              {u.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
              <div style={{ fontSize: 11, color: T.muted }}>{u.email}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.green, fontFamily: "'Space Mono', monospace" }}>{u.xp || 0}</div>
              <div style={{ fontSize: 10, color: T.faint }}>XP</div>
            </div>
            <i className="fa-solid fa-chevron-right" style={{ color: T.faint, fontSize: 12, marginLeft: 8 }}></i>
          </button>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 30, color: T.faint, fontSize: 13 }}>
            <i className="fa-solid fa-users-slash" style={{ fontSize: 24, marginBottom: 8, display: 'block' }}></i>
            No se encontraron usuarios
          </div>
        )}
      </div>
    </div>
  )
}
