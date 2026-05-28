import { useState, useEffect } from 'react'
import { Firestore } from '../services/firestore'
import { T } from '../styles/tokens'
import { MODULES } from '../data/lessons'

export function PageAdminLessons() {
  const [users, setUsers] = useState([])
  const [moduleStatus, setModuleStatus] = useState({})
  const [toggling, setToggling] = useState(null)

  useEffect(() => {
    Firestore.list('users').then(setUsers).catch(() => {})
    Firestore.get('config', 'modules').then(d => {
      if (d?.status) setModuleStatus(d.status)
    }).catch(() => {})
  }, [])

  const toggleModule = async (moduleId) => {
    const newStatus = { ...moduleStatus, [moduleId]: !moduleStatus[moduleId] }
    setModuleStatus(newStatus)
    setToggling(moduleId)
    await Firestore.set('config', 'modules', { status: newStatus }).catch(() => {})
    setToggling(null)
  }

  const totalCompletions = {}
  users.forEach(u => {
    (u.completedLessons || []).forEach(l => {
      const id = typeof l === 'object' ? l.id : l
      totalCompletions[id] = (totalCompletions[id] || 0) + 1
    })
  })

  const allLessons = MODULES.flatMap(m => 
    Array.from({ length: m.lessons }, (_, i) => ({ moduleId: m.id, moduleTitle: m.title, lessonId: i + 1, completed: totalCompletions[`${m.id}-${i + 1}`] || 0 }))
  )

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <i className="fa-solid fa-pen-to-square" style={{ color: T.green }}></i> Lecciones y módulos
        </h1>
        <p style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{MODULES.length} módulos · {allLessons.length} lecciones · {users.length} estudiantes</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {MODULES.map(function(m) {
          const unlocked = moduleStatus[m.id] !== undefined ? moduleStatus[m.id] : m.unlocked
          return <div key={m.id} style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 14, padding: '16px 18px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 24 }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{m.title}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{m.lessons} lecciones</div>
              </div>
              <button onClick={() => toggleModule(m.id)} disabled={toggling === m.id} style={{
                fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 8, cursor: 'pointer',
                fontFamily: 'inherit', border: 'none', transition: 'all 0.15s',
                background: unlocked ? `${T.red}12` : `${T.green}12`,
                color: unlocked ? T.red : T.green,
              }}>{toggling === m.id ? '...' : unlocked ? '🔓 Bloquear' : '🔒 Desbloquear'}</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {Array.from({ length: m.lessons }, (_, i) => {
                const lid = i + 1
                const c = totalCompletions[`${m.id}-${lid}`] || 0
                const pct = users.length ? Math.round((c / users.length) * 100) : 0
                return (
                  <div key={lid} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.02)', fontSize: 12 }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: `${T.green}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: T.green, flexShrink: 0 }}>{lid}</span>
                    <span style={{ flex: 1, color: T.text }}>Lección {lid}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", color: T.blue }}>{c}/{users.length}</span>
                    <div style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: T.green, borderRadius: 2 }} />
                    </div>
                    <span style={{ color: T.faint, width: 30, textAlign: 'right' }}>{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        })}
      </div>
    </div>
  )
}
