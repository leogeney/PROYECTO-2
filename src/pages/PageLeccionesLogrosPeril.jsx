import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { LessonRow } from '../components/ui/LessonRow'
import { XpBar } from '../components/ui/XpBar'
import { Icon } from '../components/ui/Icon'
import { useSignImages } from '../utils/wikimedia'
import { T, DIFF } from '../styles/tokens'

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
  { id: 1, icon: '⛔', title: 'Señales reglamentarias',  desc: 'Señales de prohibición, límites y obligación', diff: 'fácil',   time: '5 min',  xp: 50,  locked: false, img: 'Colombia_road_sign_SR-01.svg', color: '#f87171' },
  { id: 2, icon: '⚠️', title: 'Señales preventivas',     desc: 'Advertencias de peligro y condiciones de la vía', diff: 'fácil',   time: '6 min',  xp: 60,  locked: false, img: 'Colombia_road_sign_SP-01.svg', color: '#fbbf24' },
  { id: 3, icon: '🚦', title: 'Semáforos y prioridades', desc: 'Luces de semáforo, pasos peatonales y emergencias', diff: 'medio',   time: '8 min',  xp: 80,  locked: false, img: 'Colombia_road_sign_SP-23.svg', color: '#60a5fa' },
  { id: 4, icon: '🏎️', title: 'Velocidades máximas',     desc: 'Límites de velocidad según el tipo de vía', diff: 'fácil',   time: '7 min',  xp: 70,  locked: false, img: 'Colombia_road_sign_SR-30B.svg', color: '#34d399' },
  { id: 5, icon: '🛡️', title: 'Conducción defensiva',    desc: 'Anticipación, distancia segura y prevención', diff: 'difícil', time: '10 min', xp: 100, locked: false, img: 'Colombia_road_sign_SP-44.svg', color: '#a78bfa' },
]

function LeccionCard({ lesson, done, index, delay = 0 }) {
  const nav = useNavigate()
  const d = DIFF[lesson.diff]
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const { urls } = useSignImages(lesson.img ? [lesson.img] : [])
  const imgUrl = lesson.img ? urls[lesson.img] : null

  return (
    <div
      className="leccion-card card anim-up"
      onClick={() => { if (!lesson.locked && !done) nav(`/dashboard/leccion/${lesson.id}`) }}
      style={{
        borderRadius: 16, overflow: 'hidden', cursor: lesson.locked || done ? 'default' : 'pointer',
        background: T.card, border: `1px solid ${lesson.locked ? 'rgba(255,255,255,0.05)' : done ? 'rgba(0,230,118,0.15)' : `${lesson.color}18`}`,
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
                <Icon icon={lesson.icon} size={28} />
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
            <Icon icon={lesson.icon} size={40} />
          </div>
        )}
        {/* Overlay gradient at bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 40,
          background: `linear-gradient(transparent, ${T.card})`,
        }} />
        {/* Status badge on top right */}
        {done && (
          <div style={{
            position: 'absolute', top: 10, right: 10, width: 28, height: 28,
            borderRadius: '50%', background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon icon="✓" size={12} color={T.green} />
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
          <span className={done ? 'leccion-badge-done' : ''} style={{ padding: '3px 8px', borderRadius: 99, fontSize: 9, fontWeight: 700, background: d.bg, color: d.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <Icon icon="⚡" size={9} /> {d.label}
          </span>
          <span style={{ fontSize: 10, color: T.faint }}><Icon icon="⏱" size={10} /> {lesson.time}</span>
          <span style={{ fontSize: 10, fontFamily: "'Space Mono', monospace", fontWeight: 700, color: T.gold }}>+{lesson.xp} XP</span>
          {!done && !lesson.locked && (
            <span style={{ marginLeft: 'auto', fontSize: 11, color: lesson.color }}>
              Empezar →
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function PageLecciones() {
  const { xp, streak, completedLessons } = useProgress()
  const myLessons = LESSONS.map(l => ({ ...l, done: completedLessons.includes(l.id) }))
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
              { icon: '⚡', value: xp.toLocaleString(), label: 'XP ganados', color: T.green },
              { icon: '🔥', value: streak, label: 'días seguidos', color: T.orange },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon icon={s.icon} size={14} color={s.color} />
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
  { icon: '🎖️', title: 'Primera lección',    desc: 'Completaste tu primera lección',           done: cl => cl >= 1,
    tier: 'bronce',  order: 0 },
  { icon: '🔥', title: 'Racha de 7 días',     desc: 'Mantuviste 7 días consecutivos',           done: (cl, s) => s >= 7,
    tier: 'plata',   order: 1 },
  { icon: '⚡', title: '1000 XP',              desc: 'Alcanzaste 1000 puntos de experiencia',    done: (cl, s, x) => x >= 1000,
    tier: 'plata',   order: 2 },
  { icon: '📚', title: 'Módulo completo',      desc: 'Completaste 3 lecciones de un módulo',     done: cl => cl >= 3,
    tier: 'oro',     order: 3 },
  { icon: '🏆', title: 'Súper progreso',       desc: 'Llegaste al Nivel 5',                     done: (cl, s, x, l) => l >= 5,
    tier: 'oro',     order: 4 },
  { icon: '🌟', title: 'Maestro del tránsito', desc: 'Completaste todas las lecciones',          done: cl => cl >= 5,
    tier: 'diamante', order: 5 },
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
      border: unlocked
        ? `1px solid ${t.border}`
        : '1px solid rgba(255,255,255,0.04)',
      opacity: unlocked ? 1 : 0.35,
      cursor: 'default',
      animation: `lg-reveal 0.5s ease ${index * 0.06}s both`,
      '--lg-c': t.color,
    }}>
      <div className="lg-c-line" />
      <div className="lg-c-glow" />

      {/* Top: icon area */}
      <div style={{
        padding: '24px 24px 0',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: 16,
          background: unlocked ? `${t.bg}` : 'rgba(255,255,255,0.02)',
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
          <div className="lg-c-img" style={{
            fontSize: 28, lineHeight: 1,
            filter: unlocked ? 'none' : 'grayscale(0.6)',
          }}>
            {unlocked ? ach.icon : '🔒'}
          </div>
        </div>

        {unlocked && (
          <div style={{
            fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
            padding: '3px 8px', borderRadius: 99, whiteSpace: 'nowrap',
            background: t.bg, border: `1px solid ${t.border}`,
            color: t.color,
          }}>
            {ach.tier === 'diamante' ? '💎 ' : ''}{t.label}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '16px 24px 20px' }}>
        <div style={{
          fontSize: 15, fontWeight: 700,
          color: unlocked ? T.text : T.muted,
          marginBottom: 4,
        }}>
          {ach.title}
        </div>
        <div style={{
          fontSize: 12, color: T.faint, lineHeight: 1.4,
          marginBottom: unlocked ? 16 : 12,
        }}>
          {ach.desc}
        </div>

        {unlocked && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', borderRadius: 10,
            background: `${t.bg}`,
            border: `1px solid ${t.border}`,
          }}>
            <span style={{ color: t.color, fontSize: 14 }}>🏅</span>
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
        {/* Animated orbs */}
        <div style={{
          position: 'absolute', top: -80, right: -40, width: 260, height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,215,0,0.05), transparent 70%)',
          animation: 'lg-float 6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -30, width: 200, height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(185,242,255,0.04), transparent 70%)',
          animation: 'lg-float 8s ease-in-out infinite reverse',
        }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Icon */}
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,215,0,0.03))',
            border: '1px solid rgba(255,215,0,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, animation: 'lg-float 3s ease-in-out infinite',
          }}>
            <span style={{ fontSize: 32 }}>🏆</span>
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

          {/* Progress ring */}
          <div style={{ position: 'relative', flexShrink: 0, width: 64, height: 64 }}>
            <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
              <circle cx="32" cy="32" r="26" fill="none" stroke="#ffd740" strokeWidth="4"
                strokeDasharray={2 * Math.PI * 26} strokeDashoffset={2 * Math.PI * 26 * (1 - pct / 100)}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.16,1,.3,1)' }} />
            </svg>
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}>
              <span className="mono" style={{ fontSize: 18, fontWeight: 700, color: T.gold }}>{pct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements by tier */}
      {tiersOrder.map(tierKey => {
        const tierAchs = ACHIEVEMENTS.filter(a => a.tier === tierKey)
        if (tierAchs.length === 0) return null
        const t = TIERS[tierKey]
        const count = tierAchs.filter(a => a.done(completedLessons.length, streak, xp, level)).length

        return (
          <div key={tierKey} style={{ marginBottom: 22 }}>
            {/* Tier header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginBottom: 12, padding: '0 2px',
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%', background: t.color,
                boxShadow: `0 0 8px ${t.color}`,
              }} />
              <span style={{
                fontSize: 11, fontWeight: 700, color: t.color, textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>
                {tierKey === 'diamante' ? '💎 ' : ''}{t.label}
              </span>
              <span style={{
                fontSize: 10, color: T.faint,
                padding: '2px 6px', borderRadius: 99,
                background: 'rgba(255,255,255,0.03)',
              }}>
                {count}/{tierAchs.length}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
              {tierAchs.map((ach, i) => {
                const unlocked = ach.done(completedLessons.length, streak, xp, level)
                return (
                  <AchievementCard
                    key={ach.title}
                    ach={ach}
                    unlocked={unlocked}
                    index={i}
                    tier={tierKey}
                  />
                )
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
const P = {
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
              fontSize: 28, fontWeight: 700, color: P.green,
            }}>
              {initial}
            </div>
            <div style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 20, height: 20, borderRadius: '50%',
              background: P.green, display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #121212',
            }}><Icon icon="✓" size={12} color="#000" /></div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 3, lineHeight: 1.2 }}>
              {form.name || 'Sin nombre'}
            </div>
            <div style={{ fontSize: 13, color: P.muted, marginBottom: 12 }}>{form.email}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { label: `Nivel ${level}`,    bg: 'rgba(0,230,118,0.12)', color: P.green  },
                { label: <><Icon icon="🔥" size={11} /> {streak} días</>, bg: 'rgba(255,183,77,0.12)', color: P.orange },
                { label: <><Icon icon="⭐" size={11} /> Avanzado</>,        bg: 'rgba(179,157,219,0.12)', color: P.purple },
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
              color: editing ? P.green : P.muted,
              padding: '8px 16px', borderRadius: 10, fontSize: 13,
              cursor: 'pointer', fontWeight: 600, flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            {editing ? <><Icon icon="✕" size={13} /> Cancelar</> : <><Icon icon="✏️" size={13} /> Editar</>}
          </button>
        </div>

        {/* XP bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: P.faint }}>Progreso al nivel {level + 1}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: P.green }}>{xp.toLocaleString()} / {xpToNext.toLocaleString()} XP</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 100, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${xpPct}%`,
              background: `linear-gradient(90deg, rgba(0,230,118,0.6), ${P.green})`,
              borderRadius: 100, transition: 'width 0.8s cubic-bezier(.4,0,.2,1)',
              boxShadow: '0 0 12px rgba(0,230,118,0.4)',
            }} />
          </div>
          <div style={{ fontSize: 11, color: P.faint, marginTop: 6, textAlign: 'right' }}>
            {xpToNext - xp} XP para el siguiente nivel
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10 }}>
          <StatCard val={xp.toLocaleString()} lbl="XP total"    icon={<Icon icon="⚡" size={11} />} color={P.green}  />
          <StatCard val={streak}               lbl="Racha"       icon={<Icon icon="🔥" size={11} />} color={P.orange} />
          <StatCard val={completedLessons.length} lbl="Completadas" icon={<Icon icon="✅" size={11} />} color={P.purple} />
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        display: 'flex', gap: 4,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, padding: 4, marginBottom: 16,
      }}>
        {[['info',<><Icon icon="👤" size={13} /> Información</>], ['actividad',<><Icon icon="📊" size={13} /> Actividad</>], ['ajustes',<><Icon icon="⚙️" size={13} /> Ajustes</>]].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              flex: 1, padding: '9px 8px', fontSize: 13, border: 'none',
              borderRadius: 9, cursor: 'pointer', fontWeight: tab === id ? 600 : 400,
              background: tab === id ? 'rgba(0,230,118,0.1)' : 'transparent',
              color: tab === id ? P.green : P.muted,
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
                  <label style={{ fontSize: 12, fontWeight: 600, color: P.muted, letterSpacing: '0.04em' }}>{f.label}</label>
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
                <label style={{ fontSize: 12, fontWeight: 600, color: P.muted, letterSpacing: '0.04em' }}>Biografía</label>
                <textarea
                  rows={3}
                  value={draft.bio}
                  placeholder="Cuéntanos algo sobre ti..."
                  onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
                  style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: P.muted, letterSpacing: '0.04em' }}>Meta diaria</label>
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
                  background: 'transparent', color: P.muted, cursor: 'pointer',
                }}>
                  Cancelar
                </button>
                <button onClick={handleSave} style={{
                  padding: '10px 24px', fontSize: 13, borderRadius: 10,
                  border: 'none', background: P.green,
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
                  <div style={{ fontSize: 13, color: P.faint, width: 72, flexShrink: 0 }}>{row.label}</div>
                  <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{row.value}</div>
                </div>
              ))}
              <button
                onClick={() => setEditing(true)}
                style={{
                  marginTop: 20, padding: '11px', fontSize: 13, borderRadius: 10,
                  border: '1px solid rgba(0,230,118,0.2)',
                  background: 'rgba(0,230,118,0.06)', color: P.green,
                  fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <Icon icon="✏️" size={13} /> Editar información
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
            <div style={{ fontSize: 13, fontWeight: 600, color: P.muted, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11 }}>
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
                  <div style={{ fontSize: 24 }}><Icon icon={a.icon} size={24} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{a.label}</div>
                    <div style={{ fontSize: 12, color: P.faint }}>{a.sub}</div>
                  </div>
                  {a.done && <span style={{ color: P.green }}><Icon icon="✓" size={11} /></span>}
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
            <div style={{ fontSize: 11, fontWeight: 700, color: P.faint, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
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
            <div style={{ fontSize: 11, fontWeight: 700, color: P.danger, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              Zona de peligro
            </div>
            <div style={{ fontSize: 13, color: P.faint, marginBottom: 18, lineHeight: 1.6 }}>
              Estas acciones son permanentes y no se pueden deshacer.
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { label: <><Icon icon="🔄" size={13} /> Resetear progreso</>, msg: '¿Seguro? Esta acción no se puede deshacer' },
                { label: <><Icon icon="🗑️" size={13} /> Eliminar cuenta</>,   msg: 'Contacta soporte para eliminar tu cuenta' },
              ].map(btn => (
                <button
                  key={btn.label}
                  onClick={() => showToast(btn.msg)}
                  style={{
                    padding: '10px 18px', fontSize: 13, borderRadius: 10,
                    border: '1px solid rgba(239,83,80,0.3)',
                    background: 'transparent', color: P.danger,
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