// App.jsx — Rediseño completo TRANSI+
import { useState, useEffect } from 'react'
import {
  Routes, Route, Navigate, NavLink,
  useNavigate, useParams,
} from 'react-router-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './config/firebase'
import Login from './components/Login/Login'

// ── Tokens de diseño ──────────────────────────────────────────────
const T = {
  bg:       '#07090f',
  surface:  '#0e1118',
  card:     '#131720',
  border:   'rgba(255,255,255,0.06)',
  borderHi: 'rgba(255,255,255,0.12)',
  green:    '#00e676',
  greenDim: '#00c853',
  blue:     '#448aff',
  gold:     '#ffd740',
  red:      '#ff5252',
  cyan:     '#18ffff',
  orange:   '#ff7043',
  text:     '#f0f4f8',
  muted:    '#6b7a8d',
  faint:    '#3a4455',
}

// ── CSS global ────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${T.bg};
    color: ${T.text};
    font-family: 'DM Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.faint}; border-radius: 99px; }

  @keyframes spin { to { transform: rotate(360deg); } }

  @keyframes slide-up {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes glow-pulse {
    0%, 100% { opacity: 0.6; }
    50%       { opacity: 1; }
  }

  .anim-up   { animation: slide-up 0.4s cubic-bezier(0.16,1,0.3,1) both; }
  .anim-fade { animation: fade-in 0.3s ease both; }
  .mono { font-family: 'Space Mono', monospace; }

  .card {
    background: ${T.card};
    border: 1px solid ${T.border};
    border-radius: 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .card-hover:hover {
    border-color: ${T.borderHi};
  }

  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 99px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .btn-primary {
    background: ${T.green}; color: #000;
    border: none; border-radius: 10px;
    font-size: 13px; font-weight: 700; font-family: 'DM Sans', sans-serif;
    cursor: pointer; padding: 10px 20px;
    transition: all 0.2s; letter-spacing: 0.02em;
  }
  .btn-primary:hover:not(:disabled) {
    background: #33eb91;
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(0,230,118,0.3);
  }
  .btn-primary:active:not(:disabled) { transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-ghost {
    background: transparent; color: ${T.muted};
    border: 1px solid ${T.border}; border-radius: 8px;
    font-size: 12px; font-weight: 500; font-family: 'DM Sans', sans-serif;
    cursor: pointer; padding: 6px 14px;
    transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: ${T.borderHi}; color: ${T.text}; }

  .nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 10px; font-size: 13px;
    color: ${T.muted}; text-decoration: none; font-weight: 500;
    border: 1px solid transparent; transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .nav-link:hover { color: ${T.text}; background: rgba(255,255,255,0.04); }
  .nav-link.active {
    color: ${T.green};
    background: rgba(0,230,118,0.08);
    border-color: rgba(0,230,118,0.18);
  }

  .grid-bg {
    background-image:
      linear-gradient(rgba(0,230,118,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,230,118,0.025) 1px, transparent 1px);
    background-size: 32px 32px;
  }
`

function GlobalStyles() {
  return <style>{GLOBAL_CSS}</style>
}

// ── Datos mock ────────────────────────────────────────────────────
const MODULES = [
  { id: 1, icon: '🚦', title: 'Señales de tránsito', color: '#ff5252', lessons: 5, done: 4, unlocked: true },
  { id: 2, icon: '📋', title: 'Normas básicas',       color: '#18ffff', lessons: 4, done: 1, unlocked: true },
  { id: 3, icon: '🤝', title: 'Comportamiento vial',  color: '#6b7a8d', lessons: 4, done: 0, unlocked: false },
  { id: 4, icon: '🌆', title: 'Situaciones reales',   color: '#6b7a8d', lessons: 6, done: 0, unlocked: false },
]

const LESSONS = [
  { id: 1, icon: '⛔', title: 'Señales reglamentarias',  diff: 'fácil',   time: '5 min',  xp: 50,  done: true,  locked: false },
  { id: 2, icon: '⚠️', title: 'Señales preventivas',     diff: 'fácil',   time: '6 min',  xp: 60,  done: true,  locked: false },
  { id: 3, icon: '🚦', title: 'Semáforos y prioridades', diff: 'medio',   time: '8 min',  xp: 80,  done: false, locked: false },
  { id: 4, icon: '🏎️', title: 'Velocidades máximas',     diff: 'fácil',   time: '7 min',  xp: 70,  done: false, locked: false },
  { id: 5, icon: '🛡️', title: 'Conducción defensiva',    diff: 'difícil', time: '10 min', xp: 100, done: false, locked: true  },
]

const QUIZZES = {
  3: [
    { q: '¿Qué indica un semáforo en rojo?',                         opts: ['Acelerar', 'Detenerse', 'Reducir velocidad', 'Girar a la derecha'], correct: 1 },
    { q: '¿Quién tiene prioridad en una intersección sin señales?',   opts: ['El vehículo de la derecha', 'El más rápido', 'El más grande', 'El que llegó primero'], correct: 0 },
    { q: '¿Qué significa el semáforo amarillo?',                     opts: ['Paso libre', 'Detenerse si es seguro', 'Acelerar', 'Ignorar'], correct: 1 },
  ],
  4: [
    { q: '¿Cuál es la velocidad máxima en zona escolar?',            opts: ['30 km/h', '40 km/h', '60 km/h', '20 km/h'], correct: 0 },
    { q: '¿En autopista cuál es la velocidad máxima general?',       opts: ['80 km/h', '100 km/h', '120 km/h', '60 km/h'], correct: 2 },
  ],
}

const LOGROS = [
  { icon: '🎖️', title: 'Primera lección',    desc: 'Completaste tu primera lección',   done: true  },
  { icon: '🔥', title: 'Racha de 7 días',     desc: 'Mantuviste 7 días consecutivos',   done: true  },
  { icon: '⚡', title: '1000 XP',              desc: 'Alcanzaste 1000 puntos',           done: true  },
  { icon: '🏆', title: 'Quiz perfecto',        desc: 'Sin errores en un quiz',           done: false },
  { icon: '📚', title: 'Módulo completo',      desc: 'Completaste un módulo entero',     done: false },
  { icon: '🌟', title: 'Maestro del tránsito', desc: 'Todos los módulos completados',   done: false },
]

const DIFF = {
  fácil:   { color: T.green,  bg: 'rgba(0,230,118,0.1)',   label: 'FÁCIL'   },
  medio:   { color: T.gold,   bg: 'rgba(255,215,64,0.1)',  label: 'MEDIO'   },
  difícil: { color: T.red,    bg: 'rgba(255,82,82,0.1)',   label: 'DIFÍCIL' },
}

// ── Componentes base ──────────────────────────────────────────────
function Logo({ small }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <div style={{
        width: small ? 24 : 30, height: small ? 24 : 30,
        borderRadius: 7, background: T.green,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: small ? 14 : 18, color: '#000', fontWeight: 900,
        boxShadow: '0 0 16px rgba(0,230,118,0.35)',
      }}>☸</div>
      <span className="mono" style={{
        fontSize: small ? 13 : 15, fontWeight: 700, color: T.text, letterSpacing: '0.08em',
      }}>
        TRANSI<span style={{ color: T.green }}>+</span>
      </span>
    </div>
  )
}

function XpBar({ value = 1340, max = 2000 }) {
  const pct = (value / max) * 100
  return (
    <div style={{ padding: '12px 14px', background: T.bg, borderRadius: 10, border: `1px solid ${T.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Nivel 4</span>
        <span className="mono" style={{ fontSize: 10, color: T.green }}>{value}/{max}</span>
      </div>
      <div style={{ height: 3, background: T.faint, borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: `linear-gradient(90deg, ${T.greenDim}, ${T.green})`,
          borderRadius: 99, boxShadow: `0 0 8px ${T.green}`,
        }} />
      </div>
    </div>
  )
}

function StatChip({ icon, value, label, color = T.muted }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '5px 12px', background: T.card,
      border: `1px solid ${T.border}`, borderRadius: 99, fontSize: 12,
    }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span className="mono" style={{ color, fontWeight: 700, fontSize: 11 }}>{value}</span>
      {label && <span style={{ color: T.faint, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>}
    </div>
  )
}

// ── ModuleCard ────────────────────────────────────────────────────
function ModuleCard({ mod }) {
  const pct = Math.round((mod.done / mod.lessons) * 100)
  return (
    <div
      className="card card-hover"
      style={{
        padding: '16px', position: 'relative', overflow: 'hidden',
        opacity: mod.unlocked ? 1 : 0.35,
        cursor: mod.unlocked ? 'pointer' : 'default',
        borderColor: mod.unlocked ? `${mod.color}28` : T.border,
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => { if (mod.unlocked) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 10px 32px ${mod.color}18` } }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: mod.unlocked ? mod.color : T.faint, borderRadius: '14px 14px 0 0' }} />
      <div style={{ fontSize: 24, marginBottom: 10 }}>{mod.unlocked ? mod.icon : '🔒'}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 10, lineHeight: 1.4 }}>{mod.title}</div>
      {mod.unlocked ? (
        <>
          <div style={{ height: 2, background: T.faint, borderRadius: 99, marginBottom: 6, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: mod.color, borderRadius: 99 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
            <span style={{ color: T.faint }}>{mod.done}/{mod.lessons}</span>
            <span className="mono" style={{ color: mod.color, fontWeight: 700 }}>{pct}%</span>
          </div>
        </>
      ) : (
        <div style={{ fontSize: 10, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bloqueado</div>
      )}
    </div>
  )
}

// ── LessonRow ─────────────────────────────────────────────────────
function LessonRow({ lesson, delay = 0 }) {
  const navigate = useNavigate()
  const d = DIFF[lesson.diff]

  const go = () => { if (!lesson.locked && !lesson.done) navigate(`/dashboard/leccion/${lesson.id}`) }

  return (
    <div
      className="card anim-up"
      onClick={go}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px', animationDelay: `${delay}ms`,
        opacity: lesson.locked ? 0.3 : 1,
        cursor: lesson.locked ? 'default' : 'pointer',
        background: lesson.done ? 'rgba(0,230,118,0.04)' : T.card,
        borderColor: lesson.done ? 'rgba(0,230,118,0.14)' : T.border,
      }}
      onMouseEnter={e => { if (!lesson.locked) e.currentTarget.style.borderColor = lesson.done ? 'rgba(0,230,118,0.28)' : T.borderHi }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = lesson.done ? 'rgba(0,230,118,0.14)' : T.border }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: T.surface, border: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0,
      }}>{lesson.icon}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {lesson.title}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="badge" style={{ color: d.color, background: d.bg }}>{d.label}</span>
          <span style={{ fontSize: 10, color: T.faint }}>⏱ {lesson.time}</span>
          <span className="mono" style={{ fontSize: 10, color: T.gold }}>+{lesson.xp} XP</span>
        </div>
      </div>

      {lesson.done ? (
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(0,230,118,0.12)', border: '1px solid rgba(0,230,118,0.28)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, color: T.green, flexShrink: 0,
        }}>✓</div>
      ) : !lesson.locked && (
        <button
          className="btn-primary"
          onClick={e => { e.stopPropagation(); go() }}
          style={{ padding: '6px 14px', fontSize: 11, flexShrink: 0 }}
        >
          Iniciar →
        </button>
      )}
    </div>
  )
}

// ── PageHome ──────────────────────────────────────────────────────
function PageHome({ user }) {
  const xp = 1340, streak = 7, level = 4
  const completed = LESSONS.filter(l => l.done).length
  const first = user.name.split(' ')[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Hero */}
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
          <div style={{ fontSize: 10, color: T.green, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.green, animation: 'glow-pulse 2s infinite' }} />
            En línea
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6, lineHeight: 1.2 }}>
            Hola, <span style={{ color: T.green }}>{first}</span> 👋
          </h1>
          <p style={{ fontSize: 13, color: T.muted, marginBottom: 22 }}>
            Tu racha sigue activa — no la pierdas hoy.
          </p>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { val: `Nv.${level}`, lbl: 'Nivel',     color: T.gold    },
              { val: xp,            lbl: 'XP',         color: T.green   },
              { val: `${streak}🔥`, lbl: 'Racha',      color: T.orange  },
              { val: `${completed}/${LESSONS.length}`, lbl: 'Lecciones', color: T.cyan },
            ].map((s, i) => (
              <div key={i}>
                <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Racha alert */}
      <div className="anim-up" style={{
        animationDelay: '60ms',
        background: 'rgba(255,112,67,0.06)', borderRadius: 12,
        border: '1px solid rgba(255,112,67,0.18)',
        padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
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
          <h2 style={{ fontSize: 12, fontWeight: 700, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            📚 Módulos
          </h2>
          <span className="mono" style={{ fontSize: 10, color: T.faint }}>
            {MODULES.filter(m => m.unlocked).length}/{MODULES.length} activos
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: 10 }}>
          {MODULES.map(m => <ModuleCard key={m.id} mod={m} />)}
        </div>
      </div>
    </div>
  )
}

// ── PageLecciones ─────────────────────────────────────────────────
function PageLecciones() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="anim-fade" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <h2 style={{ fontSize: 12, fontWeight: 700, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
            🎯 Lecciones
          </h2>
          <p style={{ fontSize: 12, color: T.faint }}>
            {LESSONS.filter(l => l.done).length} de {LESSONS.length} completadas
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {LESSONS.map((l, i) => <LessonRow key={l.id} lesson={l} delay={i * 55} />)}
      </div>
    </div>
  )
}

// ── PageLogros ────────────────────────────────────────────────────
function PageLogros() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="anim-fade">
        <h2 style={{ fontSize: 12, fontWeight: 700, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
          🏆 Logros
        </h2>
        <p style={{ fontSize: 12, color: T.faint }}>
          {LOGROS.filter(l => l.done).length} de {LOGROS.length} desbloqueados
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 10 }}>
        {LOGROS.map((l, i) => (
          <div
            key={i}
            className="card anim-up"
            style={{
              padding: '18px', animationDelay: `${i * 50}ms`,
              opacity: l.done ? 1 : 0.38,
              background: l.done ? 'rgba(255,215,64,0.04)' : T.card,
              borderColor: l.done ? 'rgba(255,215,64,0.2)' : T.border,
            }}
          >
            <div style={{ fontSize: 30, marginBottom: 10 }}>{l.done ? l.icon : '🔒'}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: l.done ? T.gold : T.muted, marginBottom: 4 }}>{l.title}</div>
            <div style={{ fontSize: 11, color: T.faint }}>{l.desc}</div>
            {l.done && (
              <div className="badge" style={{ marginTop: 12, color: T.gold, background: 'rgba(255,215,64,0.1)' }}>
                ✓ Desbloqueado
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── PagePerfil ────────────────────────────────────────────────────
function PagePerfil({ user }) {
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
        }}>
          {user.name?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{user.name}</div>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 20 }}>{user.email}</div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 28 }}>
          {[
            { val: '4',    lbl: 'Nivel',   color: T.gold    },
            { val: '1340', lbl: 'XP',      color: T.green   },
            { val: '7',    lbl: 'Racha',   color: T.orange  },
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

// ── PageQuiz ──────────────────────────────────────────────────────
function PageQuiz() {
  const { id } = useParams()
  const navigate = useNavigate()
  const lesson = LESSONS.find(l => l.id === Number(id))
  const quiz = QUIZZES[Number(id)]

  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(null)
  const [results, setResults] = useState([])
  const [finished, setFinished] = useState(false)

  if (!lesson) return (
    <div style={{ padding: 40, textAlign: 'center', color: T.muted }}>
      Lección no encontrada.
      <button className="btn-ghost" onClick={() => navigate(-1)} style={{ marginLeft: 12 }}>Volver</button>
    </div>
  )

  if (!quiz) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{lesson.icon}</div>
      <h2 style={{ fontSize: 18, marginBottom: 8 }}>{lesson.title}</h2>
      <p style={{ color: T.muted, marginBottom: 20, fontSize: 13 }}>Esta lección aún no tiene preguntas. ¡Próximamente!</p>
      <button className="btn-ghost" onClick={() => navigate(-1)}>← Volver</button>
    </div>
  )

  if (finished) {
    const correct = results.filter(Boolean).length
    const xpEarned = Math.round((correct / quiz.length) * lesson.xp)
    const perfect = correct === quiz.length
    return (
      <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 60 }}>{perfect ? '🏆' : correct > 0 ? '⭐' : '😅'}</div>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>{perfect ? '¡Perfecto!' : '¡Completado!'}</h2>
        <p style={{ color: T.muted, fontSize: 14 }}>
          Respondiste <strong style={{ color: T.text }}>{correct}/{quiz.length}</strong> correctamente
        </p>
        <div className="card" style={{ padding: '20px 44px', borderColor: 'rgba(255,215,64,0.25)', background: 'rgba(255,215,64,0.04)' }}>
          <div className="mono" style={{ fontSize: 32, fontWeight: 700, color: T.gold }}>+{xpEarned}</div>
          <div style={{ fontSize: 11, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>XP ganados</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" onClick={() => navigate('/dashboard/lecciones')}>← Lecciones</button>
          <button className="btn-primary" onClick={() => { setStep(0); setSelected(null); setResults([]); setFinished(false) }}>
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  const q = quiz[step]

  const handleNext = () => {
    const nr = [...results, selected === q.correct]
    setResults(nr)
    if (step + 1 >= quiz.length) setFinished(true)
    else { setStep(step + 1); setSelected(null) }
  }

  return (
    <div style={{ maxWidth: 580, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="btn-ghost" onClick={() => navigate(-1)} style={{ padding: '6px 10px' }}>←</button>
        <span style={{ fontSize: 20 }}>{lesson.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{lesson.title}</div>
          <div className="mono" style={{ fontSize: 10, color: T.faint }}>{step + 1}/{quiz.length}</div>
        </div>
        <span className="mono" style={{ fontSize: 10, color: T.green }}>
          {Math.round((step / quiz.length) * 100)}%
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: T.faint, borderRadius: 99, marginBottom: 28, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${(step / quiz.length) * 100}%`,
          background: T.green, borderRadius: 99,
          transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: `0 0 8px ${T.green}`,
        }} />
      </div>

      {/* Question */}
      <div className="card anim-fade" style={{ padding: '22px 24px', marginBottom: 14 }}>
        <p style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>{q.q}</p>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {q.opts.map((opt, i) => {
          const isCorrect = i === q.correct
          const isSelected = i === selected
          let bg = T.card, border = T.border, color = T.text
          if (selected !== null) {
            if (isCorrect) { bg = 'rgba(0,230,118,0.08)'; border = T.green; color = T.green }
            else if (isSelected) { bg = 'rgba(255,82,82,0.08)'; border = T.red; color = T.red }
          }
          return (
            <button key={i} onClick={() => { if (selected === null) setSelected(i) }} style={{
              background: bg, border: `1px solid ${border}`, borderRadius: 10,
              padding: '13px 16px', color, fontSize: 13, fontFamily: 'DM Sans, sans-serif',
              textAlign: 'left', cursor: selected !== null ? 'default' : 'pointer',
              transition: 'all 0.2s', fontWeight: (isSelected || (selected !== null && isCorrect)) ? 600 : 400,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span className="mono" style={{
                width: 24, height: 24, borderRadius: 6, background: T.surface,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: T.faint, flexShrink: 0,
              }}>
                {['A', 'B', 'C', 'D'][i]}
              </span>
              <span style={{ flex: 1 }}>{opt}</span>
              {selected !== null && isCorrect && <span style={{ color: T.green }}>✓</span>}
              {selected !== null && isSelected && !isCorrect && <span style={{ color: T.red }}>✗</span>}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {selected !== null && (
        <div className="anim-up">
          <div style={{
            padding: '12px 16px', borderRadius: 10, marginBottom: 12,
            background: selected === q.correct ? 'rgba(0,230,118,0.08)' : 'rgba(255,82,82,0.08)',
            border: `1px solid ${selected === q.correct ? 'rgba(0,230,118,0.3)' : 'rgba(255,82,82,0.3)'}`,
            fontSize: 13, color: selected === q.correct ? T.green : T.red,
          }}>
            {selected === q.correct ? '✅ ¡Correcto!' : `❌ La respuesta correcta es: "${q.opts[q.correct]}"`}
          </div>
          <button className="btn-primary" style={{ width: '100%', padding: '13px' }} onClick={handleNext}>
            {step + 1 >= quiz.length ? 'Ver resultados →' : 'Siguiente →'}
          </button>
        </div>
      )}
    </div>
  )
}

// ── DashboardLayout ───────────────────────────────────────────────
function DashboardLayout({ user, onLogout }) {
  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      display: 'grid',
      gridTemplateColumns: '220px 1fr',
      gridTemplateRows: '56px 1fr',
    }}>
      {/* Topbar */}
      <header style={{
        gridColumn: '1 / -1',
        background: T.surface, borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12,
      }}>
        <Logo small />
        <div style={{ flex: 1 }} />
        <StatChip icon="🔥" value="7"     label="racha" color={T.orange} />
        <StatChip icon="❤️" value="4/5"   color={T.red}   />
        <StatChip icon="⚡" value="1340"  label="xp"    color={T.green}  />
        <button className="btn-ghost" onClick={onLogout} style={{ marginLeft: 4, fontSize: 11 }}>Salir</button>
      </header>

      {/* Sidebar */}
      <nav style={{
        background: T.surface, borderRight: `1px solid ${T.border}`,
        padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto',
      }}>
        {[
          { icon: '⊞',  label: 'Inicio',    to: '/dashboard/inicio'    },
          { icon: '📚', label: 'Lecciones', to: '/dashboard/lecciones' },
          { icon: '🏆', label: 'Logros',    to: '/dashboard/logros'    },
          { icon: '👤', label: 'Perfil',    to: '/dashboard/perfil'    },
        ].map(n => (
          <NavLink
            key={n.to} to={n.to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>{n.icon}</span>
            {n.label}
          </NavLink>
        ))}

        <div style={{ flex: 1 }} />

        {/* User card */}
        <div style={{
          padding: '12px', background: T.card, borderRadius: 10, border: `1px solid ${T.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(0,230,118,0.12)', border: '1px solid rgba(0,230,118,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: T.green,
            }}>
              {user.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: 10, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nivel 4</div>
            </div>
          </div>
          <XpBar />
        </div>
      </nav>

      {/* Main */}
      <main style={{ overflowY: 'auto', padding: '24px 28px' }}>
        <Routes>
          <Route index element={<Navigate to="inicio" replace />} />
          <Route path="inicio"      element={<PageHome user={user} />} />
          <Route path="lecciones"   element={<PageLecciones />} />
          <Route path="logros"      element={<PageLogros />} />
          <Route path="perfil"      element={<PagePerfil user={user} />} />
          <Route path="leccion/:id" element={<PageQuiz />} />
        </Routes>
      </main>
    </div>
  )
}

// ── Loader ────────────────────────────────────────────────────────
function Loader() {
  return (
    <>
      <GlobalStyles />
      <div style={{
        minHeight: '100vh', background: T.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20,
      }}>
        <Logo />
        <div style={{
          width: 20, height: 20, border: `2px solid ${T.faint}`,
          borderTopColor: T.green, borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    </>
  )
}

// ── App root ──────────────────────────────────────────────────────
function App() {
  const [user, setUser]         = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fb) => {
      setUser(fb ? { email: fb.email, name: fb.displayName || fb.email } : null)
      setChecking(false)
    })
    return unsub
  }, [])

  if (checking) return <Loader />

  return (
    <>
      <GlobalStyles />
      <Routes>
        <Route path="/login"       element={user ? <Navigate to="/dashboard/inicio" replace /> : <Login />} />
        <Route path="/dashboard/*" element={user ? <DashboardLayout user={user} onLogout={() => signOut(auth)} /> : <Navigate to="/login" replace />} />
        <Route path="*"            element={<Navigate to={user ? '/dashboard/inicio' : '/login'} replace />} />
      </Routes>
    </>
  )
}

export default App