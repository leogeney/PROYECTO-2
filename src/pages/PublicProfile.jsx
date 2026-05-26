import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Firestore } from '../services/firestore'
import { getLevelInfo } from '../context/ProgressContext'
import { T } from '../styles/tokens'

function Fa({ icon, size = 14, color, style = {} }) {
  return <i className={`fa-solid ${icon}`} style={{ fontSize: size, color, lineHeight: 1, ...style }} />
}

const COURSE_ACHIEVEMENTS = [
  { fa: 'fa-medal',        title: 'Primera lección',    desc: 'Completaste tu primera lección',        done: cl => cl >= 1,           tier: 'bronce'  },
  { fa: 'fa-fire',         title: 'Racha de 7 días',    desc: 'Mantuviste 7 días consecutivos',        done: (cl,s) => s >= 7,        tier: 'plata'   },
  { fa: 'fa-bolt',         title: '1000 XP',            desc: 'Alcanzaste 1000 puntos de experiencia', done: (cl,s,x) => x >= 1000,   tier: 'plata'   },
  { fa: 'fa-book-open',    title: 'Módulo completo',    desc: 'Completaste 3 lecciones de un módulo',  done: cl => cl >= 3,           tier: 'oro'     },
  { fa: 'fa-trophy',       title: 'Súper progreso',     desc: 'Llegaste al Nivel 5',                   done: (cl,s,x,l) => l >= 5,    tier: 'oro'     },
  { fa: 'fa-star',         title: 'Maestro del tránsito', desc: 'Completaste todas las lecciones',     done: cl => cl >= 5,           tier: 'diamante'},
]

const TIER_COLORS = {
  bronce:   { color: '#cd7f32', bg: 'rgba(205,127,50,0.06)',  border: 'rgba(205,127,50,0.2)' },
  plata:    { color: '#c0c0c0', bg: 'rgba(192,192,192,0.06)', border: 'rgba(192,192,192,0.2)' },
  oro:      { color: '#ffd700', bg: 'rgba(255,215,0,0.06)',   border: 'rgba(255,215,0,0.2)' },
  diamante: { color: '#b9f2ff', bg: 'rgba(185,242,255,0.06)', border: 'rgba(185,242,255,0.2)' },
}

const GAME_ACHIEVEMENT_ICONS = {
  first_blood: '🎮', perfect_quiz: '🎯', memory_master: '🧠',
  speed_runner: '⚡', word_wizard: '✨', collector: '🏅', xp_master: '👑',
}

const TIER_ORDER = ['diamante', 'oro', 'plata', 'bronce']

export function PublicProfile() {
  const { uid } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [gameAchievements, setGameAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) return
    ;(async () => {
      try {
        const [userData, achData] = await Promise.all([
          Firestore.get('users', uid),
          Firestore.get('game_achievements', uid),
        ])
        if (userData) setProfile(userData)
        if (achData?.achievements) {
          const unlocked = Object.values(achData.achievements).filter(a => a.unlocked)
          setGameAchievements(unlocked)
        }
      } catch {}
      setLoading(false)
    })()
  }, [uid])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <div style={{ width: 24, height: 24, border: `2px solid ${T.faint}`, borderTopColor: T.green, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  if (!profile) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
        <h2 style={{ color: T.text, fontWeight: 600 }}>Usuario no encontrado</h2>
        <p style={{ color: T.muted, fontSize: 13, marginTop: 8 }}>Este perfil no existe o no está disponible.</p>
        <button onClick={() => navigate(-1)} style={{
          marginTop: 20, padding: '10px 22px', borderRadius: 10, border: 'none',
          background: T.green, color: '#000', fontWeight: 700, cursor: 'pointer', fontSize: 13,
        }}>Volver</button>
      </div>
    )
  }

  const xp = profile.xp || 0
  const streak = profile.streak || 0
  const completedLessons = profile.completedLessons || []
  const levelInfo = getLevelInfo(xp)
  const level = levelInfo.level
  const initial = (profile.name?.[0] ?? '?').toUpperCase()

  const totalCourseAchs = COURSE_ACHIEVEMENTS.length
  const doneCourseAchs = COURSE_ACHIEVEMENTS.filter(a => a.done(completedLessons.length, streak, xp, level)).length

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', paddingBottom: 48 }}>
      <button onClick={() => navigate(-1)} style={{
        background: 'transparent', border: 'none', color: T.faint, cursor: 'pointer',
        fontSize: 13, fontWeight: 500, padding: 0, marginBottom: 16, fontFamily: 'inherit',
      }}>
        ← Volver
      </button>

      {/* Hero */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 22, overflow: 'hidden' }}>
        <div style={{ padding: '28px 28px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 26 }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%', overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.12)',
                background: 'rgba(0,230,118,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {profile.photo
                  ? <img src={profile.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 26, fontWeight: 700, color: '#00e676' }}>{initial}</span>
                }
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 21, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1.2, marginBottom: 4 }}>
                {profile.name || 'Sin nombre'}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', marginBottom: 12 }}>
                {profile.email || ''}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { fa: 'fa-layer-group', label: `Nivel ${level}`,    bg: 'rgba(0,230,118,0.1)',   color: '#00e676' },
                  { fa: 'fa-fire',        label: `${streak} días`, bg: 'rgba(255,167,38,0.1)',  color: '#ffa726' },
                ].map(b => (
                  <span key={b.label} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 11, fontWeight: 600,
                    padding: '4px 11px', borderRadius: 100,
                    background: b.bg, color: b.color, border: `1px solid ${b.color}33`,
                  }}>
                    <Fa icon={b.fa} size={10} /> {b.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Progreso al nivel {level + 1}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#00e676' }}>{xp.toLocaleString()} / {levelInfo.nextLevelTotalReq.toLocaleString()} XP</span>
            </div>
            <div style={{ height: 7, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, Math.round((xp / levelInfo.nextLevelTotalReq) * 100))}%`, background: 'linear-gradient(90deg, rgba(0,230,118,0.5), #00e676)', borderRadius: 100, transition: 'width 0.9s cubic-bezier(.4,0,.2,1)' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <StatPill fa="fa-bolt"        value={xp.toLocaleString()}       label="XP total"     color="#00e676" />
          <StatPill fa="fa-fire"        value={streak}                    label="Racha"        color="#ffa726" />
          <StatPill fa="fa-circle-check" value={completedLessons.length}  label="Completadas"  color="#ba68c8" />
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '20px 24px', marginTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>Biografía</div>
          <p style={{ fontSize: 14, color: '#e8e8e8', lineHeight: 1.6, margin: 0 }}>{profile.bio}</p>
        </div>
      )}

      {/* Activity */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '20px 24px', marginTop: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 16 }}>
          Actividad
        </div>
        <ActivityGrid completedLessons={completedLessons} />
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 20, paddingTop: 20 }}>
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
                <Fa icon={a.fa} size={16} color={a.ic} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{a.sub}</div>
                </div>
                {a.done && <Fa icon="fa-check" size={12} color="#00e676" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Achievements */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '20px 24px', marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
            Logros de curso ({doneCourseAchs}/{totalCourseAchs})
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {COURSE_ACHIEVEMENTS.map(a => {
            const unlocked = a.done(completedLessons.length, streak, xp, level)
            const t = TIER_COLORS[a.tier]
            return (
              <div key={a.title} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 16px', borderRadius: 14,
                background: unlocked ? t.bg : 'rgba(255,255,255,0.02)',
                border: `1px solid ${unlocked ? t.border : 'rgba(255,255,255,0.05)'}`,
                opacity: unlocked ? 1 : 0.4,
              }}>
                <Fa icon={a.fa} size={18} color={unlocked ? t.color : T.faint} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: unlocked ? '#fff' : T.faint }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: unlocked ? 'rgba(255,255,255,0.5)' : T.faint }}>{a.desc}</div>
                </div>
                {unlocked && <Fa icon="fa-check" size={12} color={t.color} />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Game Achievements */}
      {gameAchievements.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '20px 24px', marginTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 12 }}>
            Logros de juegos ({gameAchievements.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {gameAchievements.map(a => (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 16px', borderRadius: 14,
                background: 'rgba(0,230,118,0.05)',
                border: '1px solid rgba(0,230,118,0.1)',
              }}>
                <span style={{ fontSize: 24 }}>{GAME_ACHIEVEMENT_ICONS[a.id] || '🏅'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
