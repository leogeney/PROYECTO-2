import { T } from '../../styles/tokens'
import { useNavigate } from 'react-router-dom'
import { Icon } from './Icon'
import { useSignImages } from '../../utils/wikimedia'
import { useState } from 'react'
import { useProgress } from '../../context/ProgressContext'
import { MODULE_CONTENT } from '../../pages/PageModulo'

const CS = `
@keyframes mc-border{0%,100%{border-color:var(--mc-c);opacity:0.1}50%{border-color:var(--mc-c);opacity:0.35}}
@keyframes mc-shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes mc-fade{from{opacity:0;transform:translateY(18px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes mc-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes mc-ring{from{stroke-dashoffset:var(--r)}to{stroke-dashoffset:0}}
@keyframes mc-pulse{0%,100%{opacity:0.15;transform:scale(1)}50%{opacity:0.3;transform:scale(1.1)}}
@keyframes mc-glow{0%,100%{box-shadow:0 0 6px var(--mc-c)}50%{box-shadow:0 0 20px var(--mc-c)}}

.mc-c{transition:all 0.4s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden;cursor:pointer}
.mc-c:hover{transform:translateY(-8px)}
.mc-c:hover .mc-c-shine{opacity:1}
.mc-c:hover .mc-c-img{transform:scale(1.08)}
.mc-c:hover .mc-c-ring-outer{opacity:0.6}
.mc-c:hover .mc-c-badge{transform:translateY(-1px)}
.mc-c:active{transform:translateY(-4px)!important}

.mc-c-shine{position:absolute;inset:0;opacity:0;transition:opacity 0.5s;pointer-events:none;
  background:linear-gradient(135deg,transparent 20%,rgba(255,255,255,0.02) 40%,transparent 60%)}
.mc-c-img{transition:transform 0.5s cubic-bezier(.16,1,.3,1)}
.mc-c-ring-outer{transition:opacity 0.5s;pointer-events:none}
.mc-c-badge{transition:transform 0.3s}
`

function RingProgress({ pct, color, size = 54, stroke = 4 }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.16,1,.3,1)' }} />
    </svg>
  )
}

export function StatChip({ icon, value, label, color = T.muted }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '5px 12px', background: T.card,
      border: `1px solid ${T.border}`, borderRadius: 99, fontSize: 12,
    }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span className="mono" style={{ color, fontWeight: 700, fontSize: 11 }}>{value}</span>
      {label && (
        <span style={{ color: T.faint, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
      )}
    </div>
  )
}

export function ModuleCard({ mod }) {
  const navigate = useNavigate()
  const { lessonIds } = useProgress()
  
  // Calculate dynamic progress
  const modContent = MODULE_CONTENT[mod.id]
  const totalLessons = modContent?.lessons?.length || mod.lessons
  const doneLessons = modContent?.lessons?.filter(l => lessonIds.includes(l.id))?.length || 0
  const pct = Math.round((doneLessons / totalLessons) * 100)

  const { urls } = useSignImages(mod.img ? [mod.img] : [])
  const imgUrl = mod.img ? urls[mod.img] : null
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  const handleClick = () => {
    if (mod.unlocked) navigate(`/dashboard/modulo/${mod.id}`)
  }

  const statusLabel = !mod.unlocked ? 'Bloqueado'
    : doneLessons === totalLessons ? 'Completado'
    : doneLessons > 0 ? 'En progreso' : 'Comenzar'

  const statusColor = !mod.unlocked ? T.faint
    : doneLessons === totalLessons ? T.green
    : doneLessons > 0 ? T.gold : T.cyan

  return (
    <>
      <style>{CS}</style>
      <div className="mc-c"
        onClick={handleClick}
        style={{
          padding: 0, borderRadius: 18,
          opacity: mod.unlocked ? 1 : 0.45,
          background: T.card,
          border: '1px solid rgba(255,255,255,0.06)',
          animation: 'mc-fade 0.45s ease',
          '--mc-c': mod.color,
        }}
        onMouseEnter={e => {
          if (!mod.unlocked) return
          e.currentTarget.style.borderColor = `${mod.color}50`
          e.currentTarget.style.boxShadow = `0 20px 60px ${mod.color}18, 0 0 0 1px ${mod.color}20`
          e.currentTarget.style.background = `linear-gradient(170deg, ${T.card}, ${mod.color}08)`
        }}
        onMouseLeave={e => {
          if (!mod.unlocked) return
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.background = T.card
        }}
      >
        <div className="mc-c-shine" />

        {/* ── TOP SECTION: image + status ── */}
        <div style={{
          padding: '24px 24px 18px',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          position: 'relative',
        }}>
          {/* Image container */}
          <div style={{
            width: 72, height: 72, borderRadius: 18,
            background: mod.unlocked ? `linear-gradient(145deg, ${mod.color}14, ${mod.color}06)` : 'rgba(255,255,255,0.02)',
            border: `1px solid ${mod.unlocked ? `${mod.color}1a` : 'rgba(255,255,255,0.04)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden', flexShrink: 0,
          }}>
            {/* Backdrop glow */}
            <div className="mc-c-ring-outer" style={{
              position: 'absolute', inset: -8, borderRadius: '50%',
              background: `radial-gradient(circle, ${mod.color}0c, transparent 70%)`,
              opacity: 0.3, animation: 'mc-pulse 3s ease-in-out infinite',
            }} />
            {/* Image ring */}
            <div className="mc-c-ring-outer" style={{
              position: 'absolute', inset: -2, borderRadius: 20,
              border: `1.5px solid ${mod.color}`, opacity: 0.12,
            }} />
            {(imgUrl && !imgErr && mod.unlocked) ? (
              <>
                {!imgLoaded && <Icon icon={mod.icon} size={26} />}
                <img
                  src={imgUrl} alt={mod.title}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgErr(true)}
                  className="mc-c-img"
                  style={{
                    width: '100%', height: '100%', objectFit: 'contain', padding: 8,
                    opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s',
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.35))',
                  }}
                />
              </>
            ) : (
              <Icon icon={mod.unlocked ? mod.icon : '🔒'} size={30} />
            )}
          </div>

          {/* Status badge */}
          <div className="mc-c-badge" style={{
            fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
            padding: '4px 10px', borderRadius: 99, whiteSpace: 'nowrap',
            background: `${statusColor}0c`, border: `1px solid ${statusColor}18`,
            color: statusColor,
          }}>
            {statusLabel === 'Completado' && '✓ '}{statusLabel}
          </div>
        </div>

        {/* ── BODY: title + meta ── */}
        <div style={{ padding: '0 24px' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text, lineHeight: 1.3, marginBottom: 4 }}>
            {mod.title}
          </div>
          <div style={{ fontSize: 11, color: T.faint, marginBottom: 20, lineHeight: 1.4 }}>
            {mod.unlocked
              ? `${totalLessons} lecciones ${doneLessons > 0 ? `· ${pct}% completado` : ''}`
              : 'Completa módulos anteriores para acceder'}
          </div>
        </div>

        {/* ── FOOTER: progress ── */}
        {mod.unlocked ? (
          <div style={{
            padding: '16px 24px 20px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            {/* Circular progress */}
            <div style={{ flexShrink: 0, position: 'relative', width: 44, height: 44 }}>
              <RingProgress pct={pct} color={mod.color} size={44} stroke={3} />
              <div style={{
                position: 'absolute', inset: 0, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: mod.done === mod.lessons ? T.green : T.text }}>
                  {pct}%
                </span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 5 }}>
                <span style={{ color: T.faint, fontWeight: 600 }}>
                  {doneLessons === totalLessons ? 'Completado' : 'Progreso'}
                </span>
                <span className="mono" style={{ color: mod.color, fontWeight: 700 }}>
                  {doneLessons}/{totalLessons}
                </span>
              </div>
              <div style={{
                height: 4, borderRadius: 99, overflow: 'hidden',
                background: 'rgba(255,255,255,0.05)',
              }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  background: `linear-gradient(90deg, ${mod.color}bb, ${mod.color})`,
                  backgroundSize: '200% auto',
                  borderRadius: 99,
                  animation: pct > 0 && pct < 100 ? 'mc-shimmer 2s linear infinite' : 'none',
                  boxShadow: pct > 0 ? `0 0 8px ${mod.color}33` : 'none',
                  transition: 'width 0.6s cubic-bezier(.16,1,.3,1)',
                }} />
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            padding: '16px 24px 20px',
            borderTop: '1px solid rgba(255,255,255,0.03)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(255,255,255,0.03)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, opacity: 0.3,
            }}>🔒</div>
            <div style={{ fontSize: 11, color: T.faint, lineHeight: 1.3 }}>
              Desbloquea completando módulos anteriores
            </div>
          </div>
        )}
      </div>
    </>
  )
}