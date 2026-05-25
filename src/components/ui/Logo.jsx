import { T } from '../../styles/tokens'
import { Icon } from './Icon'

export function Logo({ small }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 14,
          background: T.green,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          color: '#000',
          fontWeight: 900,
          boxShadow: '0 0 22px rgba(0,230,118,0.45)',
        }}
      >
       <i class="fa-solid fa-motorcycle"></i>
      </div>

      <span
        className="mono"
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: T.text,
          letterSpacing: '0.12em',
        }}
      >
        TRANSI<span style={{ color: T.green }}>+</span>
      </span>
    </div>
  )
}