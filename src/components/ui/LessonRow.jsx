import { useNavigate } from 'react-router-dom'
import { T, DIFF } from '../../styles/tokens'
import { Icon } from './Icon'

export function LessonRow({ lesson, delay = 0 }) {
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
      onMouseEnter={e => {
        if (!lesson.locked)
          e.currentTarget.style.borderColor = lesson.done ? 'rgba(0,230,118,0.28)' : T.borderHi
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = lesson.done ? 'rgba(0,230,118,0.14)' : T.border
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: T.surface, border: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0,
      }}>{lesson.icon}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 5,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {lesson.title}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="badge" style={{ color: d.color, background: d.bg }}>{d.label}</span>
          <span style={{ fontSize: 10, color: T.faint }}><Icon icon="⏱" size={10} /> {lesson.time}</span>
          <span className="mono" style={{ fontSize: 10, color: T.gold }}>+{lesson.xp} XP</span>
        </div>
      </div>

      {lesson.done ? (
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'rgba(0,230,118,0.12)', border: '1px solid rgba(0,230,118,0.28)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, color: T.green, flexShrink: 0,
        }}><Icon icon="✓" size={12} /></div>
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