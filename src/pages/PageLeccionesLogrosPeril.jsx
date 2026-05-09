import { useState, useMemo } from 'react'
import { useProgress } from '../context/ProgressContext'
import { LessonRow } from '../components/ui/LessonRow'
import { XpBar } from '../components/ui/XpBar'

// ─────────────────────────────────────────────
// PageLecciones
// ─────────────────────────────────────────────
const LESSONS = [
  { id: 1, icon: '⛔', title: 'Señales reglamentarias',  diff: 'fácil',   time: '5 min',  xp: 50,  locked: false },
  { id: 2, icon: '⚠️', title: 'Señales preventivas',     diff: 'fácil',   time: '6 min',  xp: 60,  locked: false },
  { id: 3, icon: '🚦', title: 'Semáforos y prioridades', diff: 'medio',   time: '8 min',  xp: 80,  locked: false },
  { id: 4, icon: '🏎️', title: 'Velocidades máximas',     diff: 'fácil',   time: '7 min',  xp: 70,  locked: false },
  { id: 5, icon: '🛡️', title: 'Conducción defensiva',    diff: 'difícil', time: '10 min', xp: 100, locked: false },
]

export function PageLecciones() {
  const { completedLessons } = useProgress()
  const myLessons = LESSONS.map(l => ({ ...l, done: completedLessons.includes(l.id) }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="anim-fade" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <h2 style={{ fontSize: 12, fontWeight: 700, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
            🎯 Pruebas
          </h2>
          <p style={{ fontSize: 12, color: T.faint }}>{completedLessons.length} de {LESSONS.length} completadas</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {myLessons.map((l, i) => <LessonRow key={l.id} lesson={l} delay={i * 55} />)}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// PageLogros
// ─────────────────────────────────────────────
export function PageLogros() {
  const { xp, streak, completedLessons } = useProgress()

  const LOGROS = [
    { icon: '🎖️', title: 'Primera lección',    desc: 'Completaste tu primera lección',  done: completedLessons.length >= 1 },
    { icon: '🔥', title: 'Racha de 7 días',     desc: 'Mantuviste 7 días consecutivos',  done: streak >= 7 },
    { icon: '⚡', title: '1000 XP',              desc: 'Alcanzaste 1000 puntos',          done: xp >= 1000 },
    { icon: '🏆', title: 'Súper progreso',       desc: 'Llegaste al Nivel 5',             done: xp >= 1500 },
    { icon: '📚', title: 'Módulo completo',      desc: 'Completaste 3 pruebas',           done: completedLessons.length >= 3 },
    { icon: '🌟', title: 'Maestro del tránsito', desc: 'Completaste todas las pruebas',   done: completedLessons.length >= 5 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="anim-fade">
        <h2 style={{ fontSize: 12, fontWeight: 700, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
          🏆 Logros
        </h2>
        <p style={{ fontSize: 12, color: T.faint }}>{LOGROS.filter(l => l.done).length} de {LOGROS.length} logrados</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 10 }}>
        {LOGROS.map((l, i) => (
          <div key={i} className="card anim-up" style={{
            padding: '18px', animationDelay: `${i * 50}ms`,
            opacity: l.done ? 1 : 0.38,
            background: l.done ? 'rgba(255,215,64,0.04)' : T.card,
            borderColor: l.done ? 'rgba(255,215,64,0.2)' : T.border,
          }}>
            <div style={{ fontSize: 30, marginBottom: 10 }}>{l.done ? l.icon : '🔒'}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: l.done ? T.gold : T.muted, marginBottom: 4 }}>{l.title}</div>
            <div style={{ fontSize: 11, color: T.faint }}>{l.desc}</div>
            {l.done && (
              <div className="badge" style={{ marginTop: 12, color: T.gold, background: 'rgba(255,215,64,0.1)' }}>
                ✓ Logrado
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// PagePerfil — helpers
// ─────────────────────────────────────────────
const T = {
  green:  '#00e676',
  gold:   '#ffd740',
  purple: '#b39ddb',
  muted:  '#9e9e9e',
  faint:  '#616161',
  orange: '#ffb74d',
  danger: '#ef5350',
  card:   'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
}

const GOALS = [
  { value: 15,  label: '15 min / día' },
  { value: 30,  label: '30 min / día' },
  { value: 60,  label: '1 hora / día' },
  { value: 120, label: '2 horas / día' },
]

const NOTIF_DEFS = [
  { key: 'racha',  label: 'Recordatorio de racha', sub: 'Cada día a las 8 PM' },
  { key: 'logros', label: 'Nuevos logros',          sub: 'Cuando desbloquees algo' },
  { key: 'nuevos', label: 'Contenido nuevo',        sub: 'Nuevas lecciones disponibles' },
  { key: 'tips',   label: 'Consejos del día',       sub: 'Tips de aprendizaje' },
]

function Toast({ msg }) {
  if (!msg) return null
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      background: 'rgba(0,230,118,0.12)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(0,230,118,0.25)',
      color: T.green, padding: '10px 20px',
      borderRadius: 10, fontSize: 13, fontWeight: 600,
      zIndex: 999, whiteSpace: 'nowrap', pointerEvents: 'none',
      letterSpacing: '0.02em',
    }}>
      {msg}
    </div>
  )
}

function Toggle({ label, sub, checked, onChange }) {
  return (
    <div
      onClick={onChange}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px', borderRadius: 10, cursor: 'pointer',
        background: checked ? 'rgba(0,230,118,0.04)' : 'transparent',
        border: `1px solid ${checked ? 'rgba(0,230,118,0.15)' : 'rgba(255,255,255,0.06)'}`,
        marginBottom: 8, transition: 'all 0.2s',
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: checked ? '#fff' : T.muted }}>{label}</div>
        <div style={{ fontSize: 12, color: T.faint, marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{
        width: 42, height: 24, borderRadius: 100, flexShrink: 0, marginLeft: 16,
        background: checked ? T.green : 'rgba(255,255,255,0.1)',
        position: 'relative', transition: 'background 0.2s',
      }}>
        <div style={{
          position: 'absolute', top: 3,
          left: checked ? 21 : 3,
          width: 18, height: 18, borderRadius: '50%',
          background: '#fff', transition: 'left 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </div>
    </div>
  )
}

function StatCard({ val, lbl, color, icon }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, padding: '18px 12px', textAlign: 'center',
      flex: 1,
    }}>
      <div style={{ fontSize: 11, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{icon} {lbl}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color, lineHeight: 1 }}>{val}</div>
    </div>
  )
}

function ActivityGrid({ completedLessons }) {
  // Generate a stable grid based on completed count
  const cells = useMemo(() => Array.from({ length: 35 }, (_, i) => {
    const filled = i < completedLessons.length * 7
    const lvl = filled ? Math.floor(Math.random() * 3) + 1 : (Math.random() < 0.15 ? 1 : 0)
    const colors = ['rgba(255,255,255,0.06)', 'rgba(0,230,118,0.25)', 'rgba(0,230,118,0.55)', '#00e676']
    return { lvl, color: colors[lvl] }
  }), [completedLessons.length])

  return (
    <div>
      <div style={{ fontSize: 12, color: T.faint, marginBottom: 10 }}>Últimas 5 semanas</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
        {cells.map((c, i) => (
          <div key={i} style={{
            aspectRatio: '1', borderRadius: 4,
            background: c.color,
            transition: 'transform 0.15s',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 10, justifyContent: 'flex-end' }}>
        {['rgba(255,255,255,0.06)','rgba(0,230,118,0.25)','rgba(0,230,118,0.55)','#00e676'].map((c, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
        ))}
        <span style={{ fontSize: 11, color: T.faint, marginLeft: 2 }}>más actividad</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// PagePerfil
// ─────────────────────────────────────────────
export function PagePerfil({ user }) {
  const { xp, streak, levelInfo, completedLessons } = useProgress()
  const level    = levelInfo?.level   ?? 1
  const xpToNext = levelInfo?.xpToNext ?? 3000
  const xpPct    = Math.min(100, Math.round((xp / xpToNext) * 100))

  const [tab,    setTab]    = useState('info')
  const [toast,  setToast]  = useState('')
  const [editing, setEditing] = useState(false)
  const [form,   setForm]   = useState({
    name:  user?.name  ?? '',
    email: user?.email ?? '',
    bio:   user?.bio   ?? '',
    goal:  30,
  })
  const [draft,  setDraft]  = useState(form)
  const [notifs, setNotifs] = useState({ racha: true, logros: true, nuevos: false, tips: true })

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  const handleSave = () => {
    if (!draft.name.trim())         return showToast('El nombre no puede estar vacío')
    if (!draft.email.includes('@')) return showToast('Correo inválido')
    setForm(draft)
    setEditing(false)
    showToast('Perfil actualizado ✓')
  }

  const handleCancel = () => {
    setDraft(form)
    setEditing(false)
    showToast('Cambios descartados')
  }

  const initial = (form.name?.[0] ?? '?').toUpperCase()

  const inputStyle = {
    width: '100%', padding: '10px 14px', fontSize: 14,
    borderRadius: 10, outline: 'none', fontFamily: 'inherit',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff',
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 0,
      height: '100%', minHeight: '100vh',
      padding: '0 0 40px',
    }}>
      <Toast msg={toast} />

      {/* ── Hero header ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,230,118,0.08) 0%, rgba(0,0,0,0) 60%)',
        border: '1px solid rgba(0,230,118,0.12)',
        borderRadius: 18, padding: '28px 28px 24px', marginBottom: 16,
      }}>
        {/* Avatar + info */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 24 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(0,230,118,0.12)',
              border: '2px solid rgba(0,230,118,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 700, color: T.green,
            }}>
              {initial}
            </div>
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 20, height: 20, borderRadius: '50%',
              background: T.green, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 10,
              border: '2px solid #121212',
            }}>✓</div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 3, lineHeight: 1.2 }}>
              {form.name || 'Sin nombre'}
            </div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 12 }}>{form.email}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { label: `Nivel ${level}`,    bg: 'rgba(0,230,118,0.12)', color: T.green  },
                { label: `🔥 ${streak} días`, bg: 'rgba(255,183,77,0.12)', color: T.orange },
                { label: '⭐ Avanzado',        bg: 'rgba(179,157,219,0.12)', color: T.purple },
              ].map(b => (
                <span key={b.label} style={{
                  fontSize: 11, fontWeight: 600, padding: '4px 10px',
                  borderRadius: 100, background: b.bg, color: b.color,
                  border: `1px solid ${b.color}22`,
                }}>
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => { setEditing(!editing); setTab('info') }}
            style={{
              background: editing ? 'rgba(0,230,118,0.12)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${editing ? 'rgba(0,230,118,0.3)' : 'rgba(255,255,255,0.1)'}`,
              color: editing ? T.green : T.muted,
              padding: '8px 16px', borderRadius: 10, fontSize: 13,
              cursor: 'pointer', fontWeight: 600, flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            {editing ? '✕ Cancelar' : '✏️ Editar'}
          </button>
        </div>

        {/* XP bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: T.faint }}>Progreso al nivel {level + 1}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.green }}>{xp.toLocaleString()} / {xpToNext.toLocaleString()} XP</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 100, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${xpPct}%`,
              background: `linear-gradient(90deg, rgba(0,230,118,0.6), ${T.green})`,
              borderRadius: 100, transition: 'width 0.8s cubic-bezier(.4,0,.2,1)',
              boxShadow: '0 0 12px rgba(0,230,118,0.4)',
            }} />
          </div>
          <div style={{ fontSize: 11, color: T.faint, marginTop: 6, textAlign: 'right' }}>
            {xpToNext - xp} XP para el siguiente nivel
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10 }}>
          <StatCard val={xp.toLocaleString()} lbl="XP total"    icon="⚡" color={T.green}  />
          <StatCard val={streak}               lbl="Racha"       icon="🔥" color={T.orange} />
          <StatCard val={completedLessons.length} lbl="Completadas" icon="✅" color={T.purple} />
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        display: 'flex', gap: 4,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, padding: 4, marginBottom: 16,
      }}>
        {[['info','👤 Información'], ['actividad','📊 Actividad'], ['ajustes','⚙️ Ajustes']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              flex: 1, padding: '9px 8px', fontSize: 13, border: 'none',
              borderRadius: 9, cursor: 'pointer', fontWeight: tab === id ? 600 : 400,
              background: tab === id ? 'rgba(0,230,118,0.1)' : 'transparent',
              color: tab === id ? T.green : T.muted,
              border: tab === id ? '1px solid rgba(0,230,118,0.2)' : '1px solid transparent',
              transition: 'all 0.18s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Información ── */}
      {tab === 'info' && (
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: 24,
          display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          {editing ? (
            <>
              {[
                { label: 'Nombre completo', key: 'name',  type: 'text',  placeholder: 'Tu nombre' },
                { label: 'Correo',          key: 'email', type: 'email', placeholder: 'tu@correo.com' },
              ].map(f => (
                <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: '0.04em' }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={draft[f.key]}
                    placeholder={f.placeholder}
                    onChange={e => setDraft(d => ({ ...d, [f.key]: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: '0.04em' }}>Biografía</label>
                <textarea
                  rows={3}
                  value={draft.bio}
                  placeholder="Cuéntanos algo sobre ti..."
                  onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
                  style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: T.muted, letterSpacing: '0.04em' }}>Meta diaria</label>
                <select
                  value={draft.goal}
                  onChange={e => setDraft(d => ({ ...d, goal: Number(e.target.value) }))}
                  style={{ ...inputStyle }}
                >
                  {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
                <button onClick={handleCancel} style={{
                  padding: '10px 20px', fontSize: 13, borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent', color: T.muted, cursor: 'pointer',
                }}>
                  Cancelar
                </button>
                <button onClick={handleSave} style={{
                  padding: '10px 24px', fontSize: 13, borderRadius: 10,
                  border: 'none', background: T.green,
                  color: '#000', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(0,230,118,0.3)',
                }}>
                  Guardar cambios
                </button>
              </div>
            </>
          ) : (
            /* Read-only view */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: 'Nombre', value: form.name  || '—' },
                { label: 'Correo', value: form.email || '—' },
                { label: 'Bio',    value: form.bio   || 'Sin biografía' },
                { label: 'Meta',   value: `${form.goal} min / día` },
              ].map((row, i, arr) => (
                <div key={row.label} style={{
                  display: 'flex', gap: 16, padding: '14px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}>
                  <div style={{ fontSize: 13, color: T.faint, width: 72, flexShrink: 0 }}>{row.label}</div>
                  <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{row.value}</div>
                </div>
              ))}
              <button
                onClick={() => setEditing(true)}
                style={{
                  marginTop: 20, padding: '11px', fontSize: 13, borderRadius: 10,
                  border: '1px solid rgba(0,230,118,0.2)',
                  background: 'rgba(0,230,118,0.06)', color: T.green,
                  fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                ✏️ Editar información
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Actividad ── */}
      {tab === 'actividad' && (
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: 24,
          display: 'flex', flexDirection: 'column', gap: 24,
        }}>
          <ActivityGrid completedLessons={completedLessons} />

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.muted, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11 }}>
              Logros recientes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: '🔥', label: `${streak} días seguidos`,          sub: 'Racha actual',    done: streak > 0 },
                { icon: '⚡', label: `${xp} XP acumulados`,              sub: 'XP total',        done: xp > 0 },
                { icon: '✅', label: `${completedLessons.length} lecciones`, sub: 'Completadas', done: completedLessons.length > 0 },
              ].map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 16px', borderRadius: 12,
                  background: a.done ? 'rgba(0,230,118,0.04)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${a.done ? 'rgba(0,230,118,0.12)' : 'rgba(255,255,255,0.05)'}`,
                  opacity: a.done ? 1 : 0.4,
                }}>
                  <div style={{ fontSize: 24 }}>{a.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{a.label}</div>
                    <div style={{ fontSize: 12, color: T.faint }}>{a.sub}</div>
                  </div>
                  {a.done && <span style={{ fontSize: 11, color: T.green, fontWeight: 700 }}>✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Ajustes ── */}
      {tab === 'ajustes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16, padding: 24,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
              Notificaciones
            </div>
            {NOTIF_DEFS.map(n => (
              <Toggle
                key={n.key}
                label={n.label}
                sub={n.sub}
                checked={notifs[n.key]}
                onChange={() => {
                  const next = !notifs[n.key]
                  setNotifs(prev => ({ ...prev, [n.key]: next }))
                  showToast(next ? `${n.label} activado` : `${n.label} desactivado`)
                }}
              />
            ))}
          </div>

          <div style={{
            background: 'rgba(239,83,80,0.04)',
            border: '1px solid rgba(239,83,80,0.2)',
            borderRadius: 16, padding: 24,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.danger, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              Zona de peligro
            </div>
            <div style={{ fontSize: 13, color: T.faint, marginBottom: 18, lineHeight: 1.6 }}>
              Estas acciones son permanentes y no se pueden deshacer.
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { label: '🔄 Resetear progreso', msg: '¿Seguro? Esta acción no se puede deshacer' },
                { label: '🗑️ Eliminar cuenta',   msg: 'Contacta soporte para eliminar tu cuenta' },
              ].map(btn => (
                <button
                  key={btn.label}
                  onClick={() => showToast(btn.msg)}
                  style={{
                    padding: '10px 18px', fontSize: 13, borderRadius: 10,
                    border: '1px solid rgba(239,83,80,0.3)',
                    background: 'transparent', color: T.danger,
                    cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s',
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}