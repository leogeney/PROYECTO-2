import { NavLink } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { ModuleCard } from '../components/ui/Cards'
import { T } from '../styles/tokens'
import { MODULES } from '../data/lessons'

export function PageHome({ user }) {
  const { xp, streak, levelInfo, completedLessons } = useProgress()
  const level = levelInfo.level
  const completed = completedLessons.length
  const first = user.name.split(' ')[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Hero banner */}
      <div className="card anim-up" style={{
        padding: '26px 28px', position: 'relative', overflow: 'hidden',
        borderColor: 'rgba(0,230,118,0.14)',
        background: `linear-gradient(135deg, ${T.card} 60%, rgba(0,230,118,0.05))`,
      }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.7 }} />
        <div style={{
          position: 'absolute', right: -60, top: -60, width: 280, height: 280,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,230,118,0.1), transparent 70%)',
          animation: 'glow-pulse 4s ease-in-out infinite',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: 10, color: T.green, fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', marginBottom: 10,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.green, animation: 'glow-pulse 2s infinite' }} />
            En línea
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6, lineHeight: 1.2 }}>
            Hola, <span style={{ color: T.green }}>{first}</span> 👋
          </h1>
          <p style={{ fontSize: 13, color: T.muted, marginBottom: 22 }}>Tu racha sigue activa — no la pierdas hoy.</p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { val: `Nv.${level}`,                       lbl: 'Nivel',     color: T.gold   },
              { val: xp,                                   lbl: 'XP',        color: T.green  },
              { val: `${streak}🔥`,                       lbl: 'Racha',     color: T.orange },
              { val: `${completed}/5`,                     lbl: 'Lecciones', color: T.cyan   },
            ].map((s, i) => (
              <div key={i}>
                <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Streak banner */}
      <div className="anim-up" style={{
        animationDelay: '60ms', background: 'rgba(255,112,67,0.06)', borderRadius: 12,
        border: '1px solid rgba(255,112,67,0.18)', padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <span style={{ fontSize: 28 }}>🔥</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.orange }}>{streak} días de racha</div>
          <div style={{ fontSize: 11, color: T.muted }}>Practica hoy para no perderla</div>
        </div>
        <NavLink to="/dashboard/lecciones" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ fontSize: 11, padding: '7px 16px', background: T.orange }}>
            Practicar →
          </button>
        </NavLink>
      </div>

      {/* Módulos */}
      <div className="anim-up" style={{ animationDelay: '120ms' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <h2 style={{ fontSize: 12, fontWeight: 700, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.1em' }}>📚 Módulos</h2>
          <span className="mono" style={{ fontSize: 10, color: T.faint }}>{MODULES.filter(m => m.unlocked).length}/{MODULES.length} activos</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {MODULES.map(m => <ModuleCard key={m.id} mod={m} />)}
        </div>
      </div>
    </div>
  )
}