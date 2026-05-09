import { T } from '../../styles/tokens'

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
      onMouseEnter={e => {
        if (mod.unlocked) {
          e.currentTarget.style.transform = 'translateY(-3px)'
          e.currentTarget.style.boxShadow = `0 10px 32px ${mod.color}18`
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: mod.unlocked ? mod.color : T.faint,
        borderRadius: '14px 14px 0 0',
      }} />
      <div style={{ fontSize: 24, marginBottom: 10 }}>{mod.unlocked ? mod.icon : '🔒'}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 10, lineHeight: 1.4 }}>
        {mod.title}
      </div>
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
        <div style={{ fontSize: 10, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Bloqueado
        </div>
      )}
    </div>
  )
}