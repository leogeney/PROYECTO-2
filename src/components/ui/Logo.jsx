import { T } from '../../styles/tokens'
import { Icon } from './Icon'

export function Logo({ small }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <div style={{
        width: small ? 24 : 30, height: small ? 24 : 30,
        borderRadius: 7, background: T.green,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: small ? 14 : 18, color: '#000', fontWeight: 900,
        boxShadow: '0 0 16px rgba(0,230,118,0.35)',
      }}><Icon icon="☸" size={small ? 14 : 18} /></div>
      <span className="mono" style={{
        fontSize: small ? 13 : 15, fontWeight: 700, color: T.text, letterSpacing: '0.08em',
      }}>
        TRANSI<span style={{ color: T.green }}>+</span>: SEGURIDAD VIAL
      </span>
    </div>
  )
}