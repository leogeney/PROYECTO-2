import { T } from '../../styles/tokens'
import { useNavigate } from 'react-router-dom'
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
  const pct = Math.round((mod.done / mod.lessons) * 100)
 
  const handleClick = () => {
    if (mod.unlocked) navigate(`/dashboard/modulo/${mod.id}`)
  }
 
  return (
    <div
      className="card card-hover"
      onClick={handleClick}
      style={{
        padding: '24px', position: 'relative', overflow: 'hidden',
        opacity: mod.unlocked ? 1 : 0.4,
        cursor: mod.unlocked ? 'pointer' : 'default',
        borderColor: mod.unlocked ? `${mod.color}40` : T.border,
        background: mod.unlocked ? `linear-gradient(145deg, ${T.card}, ${mod.color}0a)` : T.card,
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={e => {
        if (mod.unlocked) {
          e.currentTarget.style.transform = 'translateY(-6px)'
          e.currentTarget.style.boxShadow = `0 14px 40px ${mod.color}25`
          e.currentTarget.style.borderColor = `${mod.color}80`
        }
      }}
      onMouseLeave={e => {
        if (mod.unlocked) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.borderColor = `${mod.color}40`
        }
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: mod.unlocked ? mod.color : T.faint,
        borderRadius: '14px 14px 0 0',
      }} />
      <div style={{ fontSize: 36, marginBottom: 14 }}>{mod.unlocked ? mod.icon : '🔒'}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 16, lineHeight: 1.3 }}>
        {mod.title}
      </div>
      {mod.unlocked ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 8, fontWeight: 600 }}>
            <span style={{ color: T.faint }}>{mod.done} / {mod.lessons} lecciones</span>
            <span className="mono" style={{ color: mod.color }}>{pct}%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: mod.color, borderRadius: 99, boxShadow: `0 0 10px ${mod.color}` }} />
          </div>
        </>
      ) : (
        <div style={{ fontSize: 11, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Bloqueado
        </div>
      )}
    </div>
  )
}