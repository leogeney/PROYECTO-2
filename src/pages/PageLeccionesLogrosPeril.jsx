// ── PageLecciones ─────────────────────────────────────────────────
import { useProgress } from '../context/ProgressContext'
import { LessonRow } from '../components/ui/LessonRow'
import { XpBar } from '../components/ui/XpBar'
import { T } from '../styles/tokens'

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

// ── PageLogros ────────────────────────────────────────────────────
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

// ── PagePerfil ────────────────────────────────────────────────────
export function PagePerfil({ user }) {
  const { xp, streak, levelInfo } = useProgress()
  const level = levelInfo.level

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 480 }}>
      <h2 className="anim-fade" style={{ fontSize: 12, fontWeight: 700, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        👤 Perfil
      </h2>
      <div className="card anim-up" style={{ padding: '28px', textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', margin: '0 auto 14px',
          background: 'rgba(0,230,118,0.1)', border: '2px solid rgba(0,230,118,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 700, color: T.green,
          boxShadow: '0 0 24px rgba(0,230,118,0.18)',
        }}>{user.name?.[0]?.toUpperCase() ?? '?'}</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{user.name}</div>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 20 }}>{user.email}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28 }}>
          {[
            { val: `${level}`, lbl: 'Nivel', color: T.gold   },
            { val: `${xp}`,    lbl: 'XP',    color: T.green  },
            { val: `${streak}`,lbl: 'Racha',  color: T.orange },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: 10, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card anim-up" style={{ padding: '18px', animationDelay: '70ms' }}>
        <XpBar />
      </div>
    </div>
  )
}