import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { useUser } from '../context/UserContext'
import { LessonRow } from '../components/ui/LessonRow'
import { XpBar } from '../components/ui/XpBar'
import { useSignImages } from '../utils/wikimedia'
import { T, DIFF } from '../styles/tokens'
import { Firestore } from '../services/firestore'
import { auth } from '../config/firebase'
import { onAuthStateChanged } from 'firebase/auth'

// ─────────────────────────────────────────────
// Fa — thin wrapper around Font Awesome icons
// Usage: <Fa icon="fa-bolt" size={14} color="#00e676" />
// Requires Font Awesome 6 Free to be loaded in index.html:
//   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
// ─────────────────────────────────────────────
function Fa({ icon, size = 14, color, style = {} }) {
  return (
    <i
      className={`fa-solid ${icon}`}
      style={{ fontSize: size, color, lineHeight: 1, ...style }}
    />
  )
}

// Emoji → FA mapping used across lessons
// fa-solid class names (FA 6)
const LESSON_ICONS = {
  1: 'fa-ban',           // Señales reglamentarias
  2: 'fa-triangle-exclamation', // Señales preventivas
  3: 'fa-traffic-light', // Semáforos
  4: 'fa-gauge-high',    // Velocidades
  5: 'fa-shield-halved', // Conducción defensiva
}

// ─────────────────────────────────────────────
// PageLecciones
// ─────────────────────────────────────────────

const LECCIONES_STYLES = `
@keyframes leccion-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
@keyframes leccion-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.05)} }
@keyframes leccion-glow { 0%,100%{box-shadow:0 0 8px rgba(0,230,118,0.2)} 50%{box-shadow:0 0 20px rgba(0,230,118,0.5)} }
@keyframes leccion-shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
.leccion-card:hover .leccion-play{opacity:1;transform:translateX(4px)}
.leccion-card:hover .leccion-img-wrap{transform:scale(1.08)}
.leccion-badge-done{animation:leccion-pulse 2s ease infinite}
.leccion-img-wrap{transition:transform 0.4s cubic-bezier(.16,1,.3,1)}
.leccion-progress-bar{transition:width 0.6s cubic-bezier(.16,1,.3,1)}
.leccion-shimmer{background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.03) 50%,transparent 100%);background-size:200% 100%;animation:leccion-shimmer 2s ease infinite}
`

const LESSONS = [
  { id: 1, title: 'Señales reglamentarias',  desc: 'Señales de prohibición, límites y obligación',       diff: 'fácil',   time: '5 min',  xp: 50,  locked: false, img: 'Colombia_road_sign_SR-01.svg',  color: '#f87171' },
  { id: 2, title: 'Señales preventivas',     desc: 'Advertencias de peligro y condiciones de la vía',    diff: 'fácil',   time: '6 min',  xp: 60,  locked: false, img: 'Colombia_road_sign_SP-01.svg',  color: '#fbbf24' },
  { id: 3, title: 'Semáforos y prioridades', desc: 'Luces de semáforo, pasos peatonales y emergencias',  diff: 'medio',   time: '8 min',  xp: 80,  locked: false, img: 'Colombia_road_sign_SP-23.svg',  color: '#60a5fa' },
  { id: 4, title: 'Velocidades máximas',     desc: 'Límites de velocidad según el tipo de vía',          diff: 'fácil',   time: '7 min',  xp: 70,  locked: false, img: 'Colombia_road_sign_SR-30B.svg', color: '#34d399' },
  { id: 5, title: 'Conducción defensiva',    desc: 'Anticipación, distancia segura y prevención',        diff: 'difícil', time: '10 min', xp: 100, locked: false, img: 'Colombia_road_sign_SP-44.svg',  color: '#a78bfa' },
]

function LeccionCard({ lesson, done, index, delay = 0 }) {
  const nav = useNavigate()
  const d = DIFF[lesson.diff]
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const { urls } = useSignImages(lesson.img ? [lesson.img] : [])
  const imgUrl = lesson.img ? urls[lesson.img] : null
  const faIcon = LESSON_ICONS[lesson.id]

  return (
    <div
      className="leccion-card card anim-up"
      onClick={() => { if (!lesson.locked && !done) nav(`/dashboard/leccion/${lesson.id}`) }}
      style={{
        borderRadius: 16, overflow: 'hidden', cursor: lesson.locked || done ? 'default' : 'pointer',
        background: T.card,
        border: `1px solid ${lesson.locked ? 'rgba(255,255,255,0.05)' : done ? 'rgba(0,230,118,0.15)' : `${lesson.color}18`}`,
        animationDelay: `${delay}ms`, position: 'relative',
        transition: 'all 0.3s cubic-bezier(.16,1,.3,1)',
        opacity: lesson.locked ? 0.35 : 1,
      }}
      onMouseEnter={e => { if (!lesson.locked && !done) { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${lesson.color}44`; e.currentTarget.style.boxShadow = `0 12px 32px ${lesson.color}15` } }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = '' }}
    >
      {/* Image banner */}
      <div style={{
        height: 140, position: 'relative', overflow: 'hidden',
        background: `linear-gradient(135deg, ${lesson.color}20, ${lesson.color}08)`,
      }}>
        {(imgUrl && !imgErr) ? (
          <>
            {!imgLoaded && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Fa icon={faIcon} size={28} color={lesson.color} />
              </div>
            )}
            <img
              src={imgUrl} alt={lesson.title}
              className="leccion-img-wrap"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgErr(true)}
              style={{
                width: '100%', height: '100%', objectFit: 'contain', padding: 20,
                opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s',
                filter: imgLoaded ? 'drop-shadow(0 4px 16px rgba(0,0,0,0.3))' : 'none',
              }}
            />
          </>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Fa icon={faIcon} size={40} color={lesson.color} />
          </div>
        )}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 40,
          background: `linear-gradient(transparent, ${T.card})`,
        }} />
        {done && (
          <div style={{
            position: 'absolute', top: 10, right: 10, width: 28, height: 28,
            borderRadius: '50%', background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Fa icon="fa-check" size={11} color={T.green} />
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '14px 18px 16px' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: done ? T.green : T.text, marginBottom: 3, lineHeight: 1.3 }}>
          {lesson.title}
        </div>
        <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.4, marginBottom: 10 }}>
          {lesson.desc}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className={done ? 'leccion-badge-done' : ''} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 99, fontSize: 9, fontWeight: 700, background: d.bg, color: d.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <Fa icon="fa-bolt" size={9} /> {d.label}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, color: T.faint }}>
            <Fa icon="fa-clock" size={10} /> {lesson.time}
          </span>
          <span style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", fontWeight: 700, color: T.gold }}>+{lesson.xp} XP</span>
          {!done && !lesson.locked && (
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: lesson.color }}>
              Empezar <Fa icon="fa-arrow-right" size={10} />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function PageLecciones() {
  const { xp, streak, completedLessons, lessonIds } = useProgress()
  const myLessons = LESSONS.map(l => ({ ...l, done: lessonIds.includes(l.id) }))
  const done = myLessons.filter(l => l.done).length
  const total = myLessons.length
  const pct = Math.round((done / total) * 100)

  return (
    <>
      <style>{LECCIONES_STYLES}</style>

      {/* Hero */}
      <div className="anim-up" style={{ borderRadius: 18, padding: '24px 28px', background: `linear-gradient(135deg, rgba(0,230,118,0.06) 0%, rgba(0,0,0,0) 60%)`, border: '1px solid rgba(0,230,118,0.1)', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.2 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.green, animation: 'leccion-pulse 2s infinite' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: T.green, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Prueba de conocimientos</span>
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: T.text, lineHeight: 1.2, letterSpacing: '-0.03em' }}>
                Evaluaciones viales
              </h1>
              <p style={{ fontSize: 13, color: T.muted, marginTop: 6, maxWidth: 400, lineHeight: 1.5 }}>
                Pon a prueba tus conocimientos sobre normas de tránsito con estas evaluaciones interactivas.
              </p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div className="mono" style={{ fontSize: 32, fontWeight: 700, color: T.green, lineHeight: 1 }}>{done}<span style={{ fontSize: 16, color: T.faint }}>/{total}</span></div>
              <div style={{ fontSize: 10, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>Completadas</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
            <div className="leccion-progress-bar" style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${T.greenDim}, ${T.green})`, borderRadius: 99, boxShadow: `0 0 10px ${T.green}` }} />
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
            {[
              { fa: 'fa-bolt',  value: xp.toLocaleString(), label: 'XP ganados',   color: T.green  },
              { fa: 'fa-fire',  value: streak,               label: 'días seguidos', color: T.orange },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Fa icon={s.fa} size={13} color={s.color} />
                <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</span>
                <span style={{ fontSize: 10, color: T.faint }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lesson grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 12 }}>
        {myLessons.map((l, i) => (
          <LeccionCard key={l.id} lesson={l} done={l.done} index={i} delay={i * 60} />
        ))}
      </div>
    </>
  )
}

// ─────────────────────────────────────────────
// PageLogros
// ─────────────────────────────────────────────

const LOGRO_STYLE = `
@keyframes lg-slide{from{opacity:0;transform:translateY(20px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes lg-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes lg-pulse{0%,100%{opacity:0.2;transform:scale(1)}50%{opacity:0.5;transform:scale(1.15)}}
@keyframes lg-glow{0%,100%{box-shadow:0 0 8px var(--lg-c)}50%{box-shadow:0 0 25px var(--lg-c)}}
@keyframes lg-shine{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes lg-reveal{0%{opacity:0;transform:scale(0.8) rotateY(10deg)}50%{transform:scale(1.05) rotateY(-3deg)}100%{opacity:1;transform:scale(1) rotateY(0)}}
@keyframes lg-sparkle{0%,100%{opacity:0;transform:scale(0)}50%{opacity:1;transform:scale(1)}}
.lg-c{transition:all 0.4s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden}
.lg-c:hover{transform:translateY(-6px)}
.lg-c:hover .lg-c-glow{opacity:0.12}
.lg-c:hover .lg-c-img{transform:scale(1.12)}
.lg-c:hover .lg-c-line{opacity:0.6}
.lg-c:active{transform:translateY(-3px)!important}
.lg-c-glow{position:absolute;inset:0;opacity:0;transition:opacity 0.5s;pointer-events:none;
  background:radial-gradient(circle at 50% 30%,var(--lg-c)08,transparent 70%)}
.lg-c-img{transition:transform 0.5s cubic-bezier(.16,1,.3,1)}
.lg-c-line{position:absolute;top:0;left:10%;right:10%;height:1px;
  background:linear-gradient(90deg,transparent,var(--lg-c),transparent);opacity:0.2;transition:opacity 0.3s}
`

const ACHIEVEMENTS = [
  { fa: 'fa-medal',        title: 'Primera lección',    desc: 'Completaste tu primera lección',        done: cl => cl >= 1,           tier: 'bronce'  },
  { fa: 'fa-fire',         title: 'Racha de 7 días',    desc: 'Mantuviste 7 días consecutivos',        done: (cl,s) => s >= 7,        tier: 'plata'   },
  { fa: 'fa-bolt',         title: '1000 XP',            desc: 'Alcanzaste 1000 puntos de experiencia', done: (cl,s,x) => x >= 1000,   tier: 'plata'   },
  { fa: 'fa-book-open',    title: 'Módulo completo',    desc: 'Completaste 3 lecciones de un módulo',  done: cl => cl >= 3,           tier: 'oro'     },
  { fa: 'fa-trophy',       title: 'Súper progreso',     desc: 'Llegaste al Nivel 5',                   done: (cl,s,x,l) => l >= 5,    tier: 'oro'     },
  { fa: 'fa-star',         title: 'Maestro del tránsito', desc: 'Completaste todas las lecciones',     done: cl => cl >= 5,           tier: 'diamante'},
]

const TIERS = {
  bronce:   { label: 'BRONCE',   color: '#cd7f32', bg: 'rgba(205,127,50,0.06)',  border: 'rgba(205,127,50,0.2)' },
  plata:    { label: 'PLATA',    color: '#c0c0c0', bg: 'rgba(192,192,192,0.06)', border: 'rgba(192,192,192,0.2)' },
  oro:      { label: 'ORO',      color: '#ffd700', bg: 'rgba(255,215,0,0.06)',   border: 'rgba(255,215,0,0.2)' },
  diamante: { label: 'DIAMANTE', color: '#b9f2ff', bg: 'rgba(185,242,255,0.06)', border: 'rgba(185,242,255,0.2)' },
}

function AchievementCard({ ach, unlocked, index }) {
  const t = TIERS[ach.tier]

  return (
    <div className="lg-c" style={{
      padding: 0, borderRadius: 18, background: T.card,
      border: unlocked ? `1px solid ${t.border}` : '1px solid rgba(255,255,255,0.04)',
      opacity: unlocked ? 1 : 0.35,
      cursor: 'default',
      animation: `lg-reveal 0.5s ease ${index * 0.06}s both`,
      '--lg-c': t.color,
    }}>
      <div className="lg-c-line" />
      <div className="lg-c-glow" />

      <div style={{ padding: '24px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{
          width: 60, height: 60, borderRadius: 16,
          background: unlocked ? t.bg : 'rgba(255,255,255,0.02)',
          border: `1px solid ${unlocked ? t.border : 'rgba(255,255,255,0.04)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          {unlocked && (
            <div style={{
              position: 'absolute', inset: -8, borderRadius: '50%',
              background: `radial-gradient(circle, ${t.color}0c, transparent 70%)`,
              animation: 'lg-pulse 3s ease-in-out infinite',
            }} />
          )}
          <div className="lg-c-img">
            {unlocked
              ? <Fa icon={ach.fa} size={26} color={t.color} />
              : <Fa icon="fa-lock" size={22} color="rgba(255,255,255,0.2)" />
            }
          </div>
        </div>

        {unlocked && (
          <div style={{
            fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
            padding: '3px 8px', borderRadius: 99, whiteSpace: 'nowrap',
            background: t.bg, border: `1px solid ${t.border}`, color: t.color,
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>
            {ach.tier === 'diamante' && <Fa icon="fa-gem" size={8} />}
            {t.label}
          </div>
        )}
      </div>

      <div style={{ padding: '16px 24px 20px' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: unlocked ? T.text : T.muted, marginBottom: 4 }}>
          {ach.title}
        </div>
        <div style={{ fontSize: 12, color: T.faint, lineHeight: 1.4, marginBottom: unlocked ? 16 : 12 }}>
          {ach.desc}
        </div>

        {unlocked && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', borderRadius: 10,
            background: t.bg, border: `1px solid ${t.border}`,
          }}>
            <Fa icon="fa-award" size={13} color={t.color} />
            <span style={{ fontSize: 11, fontWeight: 600, color: t.color }}>
              {ach.tier === 'diamante' ? 'Logro exclusivo' : 'Logro desbloqueado'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export function PageLogros() {
  const { xp, streak, levelInfo, completedLessons } = useProgress()
  const level = levelInfo.level
  const total = ACHIEVEMENTS.length
  const done = ACHIEVEMENTS.filter(a => a.done(completedLessons.length, streak, xp, level)).length
  const pct = Math.round((done / total) * 100)
  const tiersOrder = ['diamante', 'oro', 'plata', 'bronce']

  return (
    <>
      <style>{LOGRO_STYLE}</style>

      {/* Hero */}
      <div style={{
        borderRadius: 20, position: 'relative', overflow: 'hidden',
        background: `linear-gradient(145deg, ${T.card}, #10131e)`,
        border: '1px solid rgba(255,215,0,0.08)',
        marginBottom: 22, padding: '30px 28px',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -40, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,215,0,0.05), transparent 70%)', animation: 'lg-float 6s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -30, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(185,242,255,0.04), transparent 70%)', animation: 'lg-float 8s ease-in-out infinite reverse' }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,215,0,0.03))',
            border: '1px solid rgba(255,215,0,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, animation: 'lg-float 3s ease-in-out infinite',
          }}>
            <Fa icon="fa-trophy" size={30} color="#ffd740" />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: T.gold, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.gold, display: 'inline-block', boxShadow: `0 0 8px ${T.gold}` }} />
              Logros
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: 0, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
              Tus conquistas
            </h1>
            <p style={{ fontSize: 13, color: T.muted, margin: '4px 0 0', lineHeight: 1.4 }}>
              {done === total ? '¡Todos desbloqueados! Eres un maestro.' : `${done} de ${total} logros obtenidos`}
            </p>
          </div>

          <div style={{ position: 'relative', flexShrink: 0, width: 64, height: 64 }}>
            <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
              <circle cx="32" cy="32" r="26" fill="none" stroke="#ffd740" strokeWidth="4"
                strokeDasharray={2 * Math.PI * 26} strokeDashoffset={2 * Math.PI * 26 * (1 - pct / 100)}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.16,1,.3,1)' }} />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
              <span className="mono" style={{ fontSize: 18, fontWeight: 700, color: T.gold }}>{pct}%</span>
            </div>
          </div>
        </div>
      </div>

      {tiersOrder.map(tierKey => {
        const tierAchs = ACHIEVEMENTS.filter(a => a.tier === tierKey)
        if (tierAchs.length === 0) return null
        const t = TIERS[tierKey]
        const count = tierAchs.filter(a => a.done(completedLessons.length, streak, xp, level)).length

        return (
          <div key={tierKey} style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, padding: '0 2px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.color, boxShadow: `0 0 8px ${t.color}` }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: t.color, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                {tierKey === 'diamante' && <Fa icon="fa-gem" size={10} />}
                {t.label}
              </span>
              <span style={{ fontSize: 10, color: T.faint, padding: '2px 6px', borderRadius: 99, background: 'rgba(255,255,255,0.03)' }}>
                {count}/{tierAchs.length}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
              {tierAchs.map((ach, i) => {
                const unlocked = ach.done(completedLessons.length, streak, xp, level)
                return <AchievementCard key={ach.title} ach={ach} unlocked={unlocked} index={i} tier={tierKey} />
              })}
            </div>
          </div>
        )
      })}
    </>
  )
}

// ─────────────────────────────────────────────
// PagePerfil — helpers
// ─────────────────────────────────────────────

const NOTIF_DEFS = [
  { key: 'racha',  label: 'Recordatorio de racha', sub: 'Cada día a las 8 PM' },
  { key: 'logros', label: 'Nuevos logros',          sub: 'Cuando desbloquees algo' },
  { key: 'nuevos', label: 'Contenido nuevo',        sub: 'Nuevas lecciones disponibles' },
  { key: 'tips',   label: 'Consejos del día',       sub: 'Tips de aprendizaje' },
]

const GOALS = [
  { value: 5,  label: '5 min / día — Ritmo suave' },
  { value: 10, label: '10 min / día — Casual' },
  { value: 15, label: '15 min / día — Regular' },
  { value: 30, label: '30 min / día — Comprometido' },
  { value: 45, label: '45 min / día — Intenso' },
  { value: 60, label: '60 min / día — Dedicado' },
]

function Toast({ msg }) {
  if (!msg) return null
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      background: 'rgba(15,15,15,0.92)', color: '#fff',
      padding: '10px 20px', borderRadius: 100,
      fontSize: 13, fontWeight: 500,
      border: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      zIndex: 1000, whiteSpace: 'nowrap',
      animation: 'fadeInUp 0.2s ease',
    }}>
      {msg}
    </div>
  )
}

function ToggleRow({ label, sub, checked, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#e8e8e8', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{sub}</div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        style={{
          width: 44, height: 26, borderRadius: 13, flexShrink: 0,
          border: 'none', cursor: 'pointer', padding: 0,
          background: checked ? '#00e676' : 'rgba(255,255,255,0.1)',
          transition: 'background 0.2s', position: 'relative',
        }}
      >
        <span style={{
          position: 'absolute', top: 3, borderRadius: '50%',
          width: 20, height: 20, background: '#fff',
          left: checked ? 21 : 3, transition: 'left 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  )
}

function StatPill({ fa, value, label, color }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 4, padding: '14px 8px',
      background: 'rgba(255,255,255,0.03)', borderRadius: 14,
      border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <Fa icon={fa} size={13} color={color} style={{ opacity: 0.7 }} />
      <span style={{ fontSize: 22, fontWeight: 700, color, letterSpacing: '-0.5px' }}>{value}</span>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>{label}</span>
    </div>
  )
}

function FieldRow({ label, value, last }) {
  return (
    <div style={{ display: 'flex', gap: 20, padding: '14px 0', borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ width: 80, flexShrink: 0, fontSize: 12, color: 'rgba(255,255,255,0.3)', paddingTop: 1 }}>{label}</span>
      <span style={{ fontSize: 14, color: '#e8e8e8', lineHeight: 1.5 }}>{value || '—'}</span>
    </div>
  )
}

function ActivityGrid({ completedLessons }) {
  const today = new Date()
  const cells = Array.from({ length: 182 }, (_, i) => {
    const done = completedLessons?.some?.(l => {
      const d = new Date(typeof l === 'object' ? l.date : l)
      const ref = new Date(today)
      ref.setDate(ref.getDate() - (181 - i))
      return d.toDateString() === ref.toDateString()
    })
    return done ? 3 : 0
  })

  // Month labels: each column = 1 week
  const monthLabels = []
  let prev = ''
  for (let col = 0; col < 26; col++) {
    const d = new Date(today)
    d.setDate(d.getDate() - (181 - col * 7 - 3))
    const m = d.toLocaleString('es', { month: 'short' }).replace('.', '')
    if (m !== prev) monthLabels.push({ label: m, start: col })
    prev = m
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 3, marginBottom: 4, fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
        {monthLabels.map((m, i) => {
          const span = ((monthLabels[i + 1]?.start || 26) - m.start)
          return <span key={m.label} style={{ width: `calc(${span} / 26 * 100%)` }}>{m.label}</span>
        })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(26, 1fr)', gap: 3 }}>
        {cells.map((lvl, i) => (
          <div key={i} style={{
            aspectRatio: '1', borderRadius: 3,
            background: lvl === 0 ? 'rgba(255,255,255,0.05)' : `rgba(0,230,118,${[0, 0.2, 0.45, 0.7, 1][lvl]})`,
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Menos</span>
        {[0.05, 0.2, 0.45, 0.7, 1].map((o, i) => (
          <div key={i} style={{ width: 11, height: 11, borderRadius: 2, background: i === 0 ? 'rgba(255,255,255,0.05)' : `rgba(0,230,118,${o})` }} />
        ))}
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Más</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// PagePerfil
// ─────────────────────────────────────────────

export function PagePerfil({ user }) {
  const { xp, streak, levelInfo, completedLessons } = useProgress()
  const { refresh: refreshUser } = useUser()
  const level    = levelInfo?.level    ?? 1
  const xpToNext = levelInfo?.xpToNext ?? 3000
  const xpPct = Math.min(100, Math.round((xp / xpToNext) * 100))

  const [tab,     setTab]     = useState('info')
  const [toast,   setToast]   = useState('')
  const [editing, setEditing] = useState(false)
  const [photo,   setPhoto]   = useState(null)
  const fileRef               = useRef(null)

  const [form, setForm] = useState({
    name:  user?.name  ?? 'María González',
    email: user?.email ?? 'maria@ejemplo.com',
    bio:   user?.bio   ?? 'Apasionada por el aprendizaje continuo.',
    goal:  30,
  })
  const [draft,  setDraft]  = useState(form)
  const [notifs, setNotifs] = useState({ racha: true, logros: true, nuevos: false, tips: true })

  // Load profile from Firestore
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fb) => {
      if (!fb?.uid) return
      try {
        const data = await Firestore.get('users', fb.uid)
        if (data) {
          const next = {
            name: data.name || user?.name || 'María González',
            email: data.email || user?.email || 'maria@ejemplo.com',
            bio: data.bio || '',
            goal: data.goal || 30,
          }
          setForm(next)
          setDraft(next)
          if (data.photo) setPhoto(data.photo)
          if (data.notifs) setNotifs(data.notifs)
        }
      } catch {}
    })
    return unsub
  }, [])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2200) }

  const handleSave = async () => {
    if (!draft.name.trim())         return showToast('El nombre no puede estar vacío')
    if (!draft.email.includes('@')) return showToast('Correo inválido')
    setForm(draft); setEditing(false)
    try {
      const fb = auth.currentUser
      if (fb?.uid) {
        await Firestore.set('users', fb.uid, {
          name: draft.name.trim(),
          email: draft.email.trim(),
          bio: draft.bio.trim(),
          goal: draft.goal,
          notifs,
          ...(photo ? { photo } : {}),
        })
      }
    } catch {}
    refreshUser()
    showToast('Perfil actualizado ✓')
  }

  const handleCancel = () => { setDraft(form); setEditing(false); showToast('Cambios descartados') }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { setPhoto(ev.target.result); refreshUser() }
    reader.readAsDataURL(file)
  }

  const initial = (form.name?.[0] ?? '?').toUpperCase()

  const input = {
    width: '100%', padding: '10px 14px', fontSize: 14,
    borderRadius: 10, outline: 'none', fontFamily: 'inherit',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#e8e8e8', transition: 'border-color 0.15s',
  }

  const card = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 20, padding: '24px',
  }

  // Tab definitions with FA icons
  const TABS = [
    { id: 'info',      fa: 'fa-user',        label: 'Información' },
    { id: 'actividad', fa: 'fa-chart-simple', label: 'Actividad'   },
    { id: 'ajustes',   fa: 'fa-gear',         label: 'Ajustes'     },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 0 48px' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity:0; transform:translateX(-50%) translateY(8px) }
          to   { opacity:1; transform:translateX(-50%) translateY(0) }
        }
        .perfil-tab-btn { transition: all 0.15s }
        .perfil-tab-btn:hover { background: rgba(255,255,255,0.05) !important }
        .perfil-input:focus { border-color: rgba(0,230,118,0.5) !important }
        .perfil-edit-btn:hover { background: rgba(255,255,255,0.06) !important }
        .perfil-save-btn:hover { opacity: 0.88 }
        .perfil-danger-btn:hover { background: rgba(239,83,80,0.08) !important }
        .avatar-upload-btn:hover { background: rgba(0,0,0,0.7) !important; opacity: 1 !important }
      `}</style>

      <Toast msg={toast} />

      {/* ── HERO ── */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22, overflow: 'hidden' }}>
        <div style={{ padding: '28px 28px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 26 }}>

            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%', overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.12)',
                background: 'rgba(0,230,118,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {photo
                  ? <img src={photo} alt="Foto de perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 26, fontWeight: 700, color: '#00e676' }}>{initial}</span>
                }
              </div>
              <button
                className="avatar-upload-btn"
                onClick={() => fileRef.current?.click()}
                title="Cambiar foto"
                style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'rgba(0,0,0,0)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.18s, background 0.18s', color: '#fff',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = 1 }}
                onMouseLeave={e => { e.currentTarget.style.opacity = 0 }}
              >
                <Fa icon="fa-camera" size={18} />
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 26, height: 26, borderRadius: '50%',
                  background: '#1a1a1a', border: '2px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title="Cambiar foto"
              >
                <Fa icon="fa-camera" size={11} color="rgba(255,255,255,0.7)" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
            </div>

            {/* Identity */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 21, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1.2, marginBottom: 4 }}>
                {form.name || 'Sin nombre'}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', marginBottom: 12 }}>
                {form.email}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { fa: 'fa-layer-group', label: `Nivel ${level}`,    bg: 'rgba(0,230,118,0.1)',   color: '#00e676', border: 'rgba(0,230,118,0.2)'   },
                  { fa: 'fa-fire',        label: `${streak} días`,     bg: 'rgba(255,167,38,0.1)',  color: '#ffa726', border: 'rgba(255,167,38,0.2)'  },
                  { fa: 'fa-star',        label: 'Avanzado',           bg: 'rgba(186,104,200,0.1)', color: '#ba68c8', border: 'rgba(186,104,200,0.2)' },
                ].map(b => (
                  <span key={b.label} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 11, fontWeight: 600,
                    padding: '4px 11px', borderRadius: 100,
                    background: b.bg, color: b.color, border: `1px solid ${b.border}`,
                  }}>
                    <Fa icon={b.fa} size={10} /> {b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Edit button */}
            <button
              className="perfil-edit-btn"
              onClick={() => { setEditing(!editing); setTab('info') }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 10, fontSize: 13,
                fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                background: editing ? 'rgba(0,230,118,0.08)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${editing ? 'rgba(0,230,118,0.25)' : 'rgba(255,255,255,0.1)'}`,
                color: editing ? '#00e676' : 'rgba(255,255,255,0.5)',
              }}
            >
              <Fa icon={editing ? 'fa-xmark' : 'fa-pen'} size={12} />
              {editing ? 'Cancelar' : 'Editar'}
            </button>
          </div>

          {/* XP Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Progreso al nivel {level + 1}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#00e676' }}>{xp.toLocaleString()} / {xpToNext.toLocaleString()} XP</span>
            </div>
            <div style={{ height: 7, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${xpPct}%`, background: 'linear-gradient(90deg, rgba(0,230,118,0.5), #00e676)', borderRadius: 100, transition: 'width 0.9s cubic-bezier(.4,0,.2,1)' }} />
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 6, textAlign: 'right' }}>
              {(xpToNext - xp).toLocaleString()} XP para el siguiente nivel
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10, padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <StatPill fa="fa-bolt"        value={xp.toLocaleString()}       label="XP total"     color="#00e676" />
          <StatPill fa="fa-fire"        value={streak}                    label="Racha"        color="#ffa726" />
          <StatPill fa="fa-circle-check" value={completedLessons.length}  label="Completadas"  color="#ba68c8" />
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ display: 'flex', gap: 3, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 4 }}>
        {TABS.map(({ id, fa, label }) => (
          <button
            key={id}
            className="perfil-tab-btn"
            onClick={() => setTab(id)}
            style={{
              flex: 1, padding: '9px 6px', fontSize: 13,
              border: 'none', borderRadius: 10, cursor: 'pointer',
              fontWeight: tab === id ? 600 : 400,
              background: tab === id ? 'rgba(0,230,118,0.09)' : 'transparent',
              color: tab === id ? '#00e676' : 'rgba(255,255,255,0.4)',
              outline: tab === id ? '1px solid rgba(0,230,118,0.18)' : '1px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <Fa icon={fa} size={12} /> {label}
          </button>
        ))}
      </div>

      {/* ── TAB: Información ── */}
      {tab === 'info' && (
        <div style={card}>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                { label: 'Nombre completo', key: 'name',  type: 'text',  placeholder: 'Tu nombre' },
                { label: 'Correo',          key: 'email', type: 'email', placeholder: 'tu@correo.com' },
              ].map(f => (
                <div key={f.key} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
                    {f.label.toUpperCase()}
                  </label>
                  <input
                    className="perfil-input"
                    type={f.type}
                    value={draft[f.key]}
                    placeholder={f.placeholder}
                    onChange={e => setDraft(d => ({ ...d, [f.key]: e.target.value }))}
                    style={input}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>BIOGRAFÍA</label>
                <textarea
                  className="perfil-input"
                  rows={3}
                  value={draft.bio}
                  placeholder="Cuéntanos algo sobre ti…"
                  onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
                  style={{ ...input, resize: 'none', lineHeight: 1.65 }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>META DIARIA</label>
                <select
                  className="perfil-input"
                  value={draft.goal}
                  onChange={e => setDraft(d => ({ ...d, goal: Number(e.target.value) }))}
                  style={input}
                >
                  {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 6 }}>
                <button onClick={handleCancel} style={{ padding: '10px 20px', fontSize: 13, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button className="perfil-save-btn" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 24px', fontSize: 13, borderRadius: 10, border: 'none', background: '#00e676', color: '#000', fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.15s' }}>
                  <Fa icon="fa-floppy-disk" size={13} /> Guardar cambios
                </button>
              </div>
            </div>
          ) : (
            <div>
              <FieldRow label="Nombre" value={form.name} />
              <FieldRow label="Correo" value={form.email} />
              <FieldRow label="Bio"    value={form.bio || 'Sin biografía'} />
              <FieldRow label="Meta"   value={`${form.goal} min / día`} last />
              <button
                className="perfil-edit-btn"
                onClick={() => setEditing(true)}
                style={{
                  marginTop: 20, width: '100%', padding: '11px',
                  fontSize: 13, fontWeight: 600, borderRadius: 12,
                  border: '1px solid rgba(0,230,118,0.2)',
                  background: 'rgba(0,230,118,0.05)', color: '#00e676', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                }}
              >
                <Fa icon="fa-pen" size={12} /> Editar información
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Actividad ── */}
      {tab === 'actividad' && (
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 16 }}>
            Actividad — últimos 6 meses
          </div>
          <ActivityGrid completedLessons={completedLessons} />

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 24, paddingTop: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 14 }}>
              Logros recientes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { fa: 'fa-fire',         label: `${streak} días seguidos`,             sub: 'Racha actual',   done: streak > 0,                  color: 'rgba(255,167,38,0.1)',  border: 'rgba(255,167,38,0.15)',  ic: '#ffa726' },
                { fa: 'fa-bolt',         label: `${xp.toLocaleString()} XP`,           sub: 'XP total',       done: xp > 0,                      color: 'rgba(0,230,118,0.1)',   border: 'rgba(0,230,118,0.15)',   ic: '#00e676' },
                { fa: 'fa-circle-check', label: `${completedLessons.length} lecciones`, sub: 'Completadas',   done: completedLessons.length > 0, color: 'rgba(186,104,200,0.1)', border: 'rgba(186,104,200,0.15)', ic: '#ba68c8' },
              ].map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 16px', borderRadius: 14,
                  background: a.done ? a.color : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${a.done ? a.border : 'rgba(255,255,255,0.05)'}`,
                  opacity: a.done ? 1 : 0.35,
                }}>
                  <Fa icon={a.fa} size={20} color={a.ic} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{a.label}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{a.sub}</div>
                  </div>
                  {a.done && <Fa icon="fa-check" size={14} color="#00e676" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Ajustes ── */}
      {tab === 'ajustes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 4 }}>
              Notificaciones
            </div>
            {NOTIF_DEFS.map(n => (
              <ToggleRow
                key={n.key}
                label={n.label}
                sub={n.sub}
                checked={notifs[n.key]}
                onChange={() => {
                  const next = !notifs[n.key]
                  const updated = { ...notifs, [n.key]: next }
                  setNotifs(updated)
                  const fb = auth.currentUser
                  if (fb?.uid) Firestore.set('users', fb.uid, { notifs: updated }).catch(() => {})
                  showToast(next ? `${n.label} activado` : `${n.label} desactivado`)
                }}
              />
            ))}
          </div>

          {/* Danger zone */}
          <div style={{ background: 'rgba(239,83,80,0.03)', border: '1px solid rgba(239,83,80,0.18)', borderRadius: 20, padding: '22px 24px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(239,83,80,0.8)', textTransform: 'uppercase', marginBottom: 8 }}>
              Zona de peligro
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 18, lineHeight: 1.65 }}>
              Estas acciones son permanentes y no se pueden deshacer.
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { fa: 'fa-rotate-left', label: 'Resetear progreso', msg: '¿Seguro? Esta acción no se puede deshacer' },
                { fa: 'fa-trash',       label: 'Eliminar cuenta',   msg: 'Contacta soporte para eliminar tu cuenta' },
              ].map(btn => (
                <button
                  key={btn.label}
                  className="perfil-danger-btn"
                  onClick={() => showToast(btn.msg)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '10px 18px', fontSize: 13, borderRadius: 10,
                    border: '1px solid rgba(239,83,80,0.25)',
                    background: 'transparent', color: 'rgba(239,83,80,0.8)',
                    cursor: 'pointer', fontWeight: 500, transition: 'background 0.15s',
                  }}
                >
                  <Fa icon={btn.fa} size={12} /> {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}