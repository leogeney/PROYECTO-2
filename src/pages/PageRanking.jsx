import React from 'react'
import { T } from '../styles/tokens'
import { Icon } from '../components/ui/Icon'

// Datos de prueba para el mockup
const DUMMY_RANKING = [
  { id: 1, name: 'Sofia M.', xp: 12500, level: 15, streak: 12 },
  { id: 2, name: 'Mateo R.', xp: 11200, level: 14, streak: 8 },
  { id: 3, name: 'Valeria G.', xp: 10800, level: 13, streak: 21 },
  { id: 4, name: 'Lucas T.', xp: 9500, level: 12, streak: 5 },
  { id: 5, name: 'Isabella C.', xp: 8900, level: 11, streak: 3 },
  { id: 6, name: 'Diego A.', xp: 8200, level: 10, streak: 14 },
  { id: 7, name: 'Camila P.', xp: 7500, level: 9, streak: 2 },
  { id: 8, name: 'Emilio V.', xp: 7100, level: 9, streak: 7 },
  { id: 9, name: 'Martina S.', xp: 6800, level: 8, streak: 1 },
  { id: 10, name: 'Alejandro G.', xp: 6400, level: 8, streak: 0 },
]

export function PageRanking({ user }) {
  const top3 = DUMMY_RANKING.slice(0, 3)
  const rest = DUMMY_RANKING.slice(3)

  const getMedalColor = (index) => {
    if (index === 0) return '#FFD700' // Oro
    if (index === 1) return '#C0C0C0' // Plata
    if (index === 2) return '#CD7F32' // Bronce
    return T.card
  }

  return (
    <div className="anim-fade" style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 40 }}>
      
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Icon icon="🏆" size={48} />
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Ranking Global</h1>
        <p style={{ color: T.muted, fontSize: 14, marginTop: 8 }}>
          Los mejores conductores virtuales de la academia.
        </p>
      </div>

      {/* Podio para el Top 3 */}
      <div style={{ 
        display: 'flex', justifyContent: 'center', alignItems: 'flex-end', 
        gap: 16, marginBottom: 48, marginTop: 32 
      }}>
        {/* Segundo lugar */}
        <PodiumItem user={top3[1]} rank={2} height={140} color={getMedalColor(1)} />
        {/* Primer lugar */}
        <PodiumItem user={top3[0]} rank={1} height={180} color={getMedalColor(0)} />
        {/* Tercer lugar */}
        <PodiumItem user={top3[2]} rank={3} height={110} color={getMedalColor(2)} />
      </div>

      {/* Tu posición (Mockup) */}
      <div className="card" style={{ 
        padding: '16px 24px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16,
        background: `linear-gradient(90deg, ${T.card}, rgba(0, 230, 118, 0.08))`,
        borderColor: T.green
      }}>
        <div style={{ fontSize: 20, fontWeight: 800, width: 40, textAlign: 'center', color: T.green }}>42</div>
        <div style={{ 
          width: 40, height: 40, borderRadius: '50%', background: 'rgba(0, 230, 118, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.green, fontWeight: 700
        }}>
          {user?.name?.[0]?.toUpperCase() || 'T'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{user?.name?.split(' ')[0] || 'Tú'}</div>
          <div style={{ fontSize: 12, color: T.muted }}>Nivel actual</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: T.green }}>1,450 XP</div>
        </div>
      </div>

      {/* Lista del resto */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rest.map((u, i) => (
          <div key={u.id} className="card card-hover" style={{ 
            padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16,
            transition: 'transform 0.2s'
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.faint, width: 30, textAlign: 'center' }}>
              {i + 4}
            </div>
            <div style={{ 
              width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.text, fontWeight: 600, fontSize: 14
            }}>
              {u.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{u.name}</div>
              <div style={{ fontSize: 11, color: T.muted, display: 'flex', gap: 12, marginTop: 4 }}>
                <span>Nivel {u.level}</span>
                {u.streak > 0 && <span style={{ color: T.orange }}><Icon icon="🔥" size={11} /> {u.streak} días</span>}
              </div>
            </div>
            <div className="mono" style={{ fontSize: 16, fontWeight: 700, color: T.text }}>
              {u.xp.toLocaleString()} <span style={{ fontSize: 10, color: T.faint }}>XP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PodiumItem({ user, rank, height, color }) {
  if (!user) return null;
  const isFirst = rank === 1;

  return (
    <div className="anim-up" style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', width: 100,
      animationDelay: `${rank * 100}ms`
    }}>
      <div style={{ 
        width: isFirst ? 56 : 48, height: isFirst ? 56 : 48, 
        borderRadius: '50%', background: `${color}22`, border: `2px solid ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: isFirst ? 24 : 18, color, fontWeight: 800, marginBottom: 8,
        boxShadow: `0 0 20px ${color}40`
      }}>
        {user.name[0]}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, textAlign: 'center', marginBottom: 4, whiteSpace: 'nowrap' }}>
        {user.name.split(' ')[0]}
      </div>
      <div className="mono" style={{ fontSize: 11, color: T.muted, marginBottom: 12 }}>
        {user.xp.toLocaleString()}
      </div>
      
      <div style={{ 
        width: '100%', height, background: `linear-gradient(to top, ${T.card}, ${color}33)`,
        borderTop: `3px solid ${color}`, borderTopLeftRadius: 8, borderTopRightRadius: 8,
        display: 'flex', justifyContent: 'center', paddingTop: 12,
        boxShadow: `0 -10px 20px ${color}15`
      }}>
        <div style={{ fontSize: 24, fontWeight: 900, color, opacity: 0.8 }}>
          {rank}
        </div>
      </div>
    </div>
  )
}
