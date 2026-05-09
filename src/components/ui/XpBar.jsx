import { useProgress } from '../../context/ProgressContext'
import { T } from '../../styles/tokens'

export function XpBar() {
  const { levelInfo } = useProgress()
  const val = levelInfo.xpInCurrentLevel
  const max = levelInfo.xpForNextLevel
  const pct = (val / max) * 100

  return (
    <div style={{ padding: '12px 14px', background: T.bg, borderRadius: 10, border: `1px solid ${T.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 10, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          Nivel {levelInfo.level}
        </span>
        <span className="mono" style={{ fontSize: 10, color: T.green }}>{val}/{max} XP</span>
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