import { useState, useEffect } from 'react'
import { Firestore } from '../services/firestore'
import { T } from '../styles/tokens'

export function PageAdminStats() {
  const [data, setData] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const [users, logs, forum] = await Promise.all([
          Firestore.list('users'),
          Firestore.list('activity_log', 'timestamp'),
          Firestore.list('forum_posts'),
        ])
        const now = Date.now()
        const day = 86400000
        const weekUsers = users.filter(u => now - (u.lastLogin || 0) < 7 * day).length
        const todayLogs = logs.filter(l => now - l.timestamp < day).length
        const xpTotal = users.reduce((s, u) => s + (u.xp || 0), 0)
        const xpAvg = users.length ? Math.round(xpTotal / users.length) : 0
        const lessonsDone = users.reduce((s, u) => s + (u.completedLessons?.length || 0), 0)

        const actionsByDay = {}
        logs.forEach(l => {
          const d = new Date(l.timestamp).toLocaleDateString('es-ES')
          actionsByDay[d] = (actionsByDay[d] || 0) + 1
        })
        const days = Object.entries(actionsByDay).slice(-14).map(([d, c]) => ({ day: d.slice(0, 5), count: c }))

        const actionTypes = {}
        logs.forEach(l => { actionTypes[l.action] = (actionTypes[l.action] || 0) + 1 })
        const topActions = Object.entries(actionTypes).sort((a, b) => b[1] - a[1]).slice(0, 8)

        setData({ users, logs, forum, weekUsers, todayLogs, xpTotal, xpAvg, lessonsDone, days, topActions })
      } catch {}
    })()
  }, [])

  if (!data) return <div style={{ textAlign: 'center', padding: 40, color: T.faint }}>Cargando estadísticas...</div>

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <i className="fa-solid fa-chart-bar" style={{ color: T.gold }}></i> Estadísticas
        </h1>
        <p style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Basado en {data.logs.length} acciones registradas</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 20 }}>
        {[
          { icon: 'fa-solid fa-users', label: 'Usuarios', value: data.users.length, color: T.blue },
          { icon: 'fa-solid fa-clock', label: 'Activos (7d)', value: data.weekUsers, color: T.green },
          { icon: 'fa-solid fa-bolt', label: 'Acciones hoy', value: data.todayLogs, color: T.orange },
          { icon: 'fa-solid fa-star', label: 'XP total', value: data.xpTotal.toLocaleString(), color: T.gold },
          { icon: 'fa-solid fa-chart-line', label: 'XP promedio', value: data.xpAvg.toLocaleString(), color: T.cyan },
          { icon: 'fa-solid fa-book', label: 'Lecciones hechas', value: data.lessonsDone.toLocaleString(), color: T.green },
          { icon: 'fa-solid fa-comments', label: 'Foro', value: data.forum.length, color: T.blue },
        ].map(s => (
          <div key={s.label} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, color: T.faint, fontWeight: 600, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className={s.icon} style={{ color: s.color }}></i> {s.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.text, fontFamily: "'Space Mono', monospace" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 18 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: T.text, margin: '0 0 12px' }}>
            <i className="fa-solid fa-calendar-day" style={{ color: T.green, marginRight: 6 }}></i>
            Actividad últimos 14 días
          </h3>
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 100 }}>
            {data.days.map(d => {
              const max = Math.max(...data.days.map(x => x.count), 1)
              const h = (d.count / max) * 90
              return (
                <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <div style={{ width: '100%', background: T.green, borderRadius: '3px 3px 0 0', height: Math.max(h, 2), opacity: 0.7 + (h / 90) * 0.3, transition: 'height 0.3s' }} />
                  <div style={{ fontSize: 8, color: T.faint }}>{d.day}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 18 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: T.text, margin: '0 0 12px' }}>
            <i className="fa-solid fa-bolt" style={{ color: T.orange, marginRight: 6 }}></i>
            Acciones más comunes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {data.topActions.map(([action, count]) => {
              const max = data.topActions[0][1]
              const pct = (count / max) * 100
              return (
                <div key={action}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: T.muted, marginBottom: 3 }}>
                    <span>{action.replace(/_/g, ' ')}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", color: T.text }}>{count}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: T.green, borderRadius: 3 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
