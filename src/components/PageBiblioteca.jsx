import { useState, useEffect } from 'react'
import { SIGNS_DB, SIGN_CATEGORIES } from '../data/signsData'
import { T } from '../styles/tokens'
import { Icon } from './ui/Icon'

const CAT_COLORS = { reglamentaria: '#ff5252', preventiva: '#ffd740', informativa: '#448aff', transitoria: '#ff9100' }
const CAT_ICONS = { reglamentaria: '', preventiva: '', informativa: 'ℹ', transitoria: '' }

const STYLE = `
@keyframes bib-fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes bib-scale{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
.bib-card{transition:all 0.3s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden}
.bib-card:hover{transform:translateY(-4px)}
.bib-card:hover .bib-card-img{transform:scale(1.1)}
.bib-card-img{transition:transform 0.4s cubic-bezier(.16,1,.3,1)}
`

function SignCard({ sign, onClick, delay }) {
  const cat = SIGN_CATEGORIES.find(c => c.id === sign.cat)
  const color = CAT_COLORS[sign.cat] || '#fff'

  return (
    <div
      className="card bib-card anim-up"
      onClick={() => onClick(sign)}
      style={{
        borderRadius: 16, padding: 0, cursor: 'pointer',
        background: T.card, border: `1px solid ${color}18`,
        animationDelay: `${delay}ms`,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}
    >
      {/* Image area */}
      <div style={{
        height: 140, position: 'relative', overflow: 'hidden',
        background: `linear-gradient(160deg, ${color}10, rgba(255,255,255,0.02))`,
        borderBottom: `1px solid ${color}12`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {sign.img ? (
          <img
            src={sign.img} alt={sign.name}
            className="bib-card-img"
            style={{
              height: 100, width: 100, objectFit: 'contain',
              filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.35))',
            }}
            onError={e => { e.target.style.display = 'none' }}
          />
        ) : (
          <Icon icon={CAT_ICONS[sign.cat] || '📋'} size={40} />
        )}
        {/* Category badge */}
        <span style={{
          position: 'absolute', top: 10, left: 10,
          padding: '3px 8px', borderRadius: 99,
          background: `${color}18`, border: `1px solid ${color}28`,
          color, fontSize: 9, fontWeight: 700,
          fontFamily: "'Space Mono', monospace",
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {CAT_ICONS[sign.cat] || ''} {cat?.label || sign.cat}
        </span>
        {/* Code badge */}
        {sign.code && (
          <span style={{
            position: 'absolute', bottom: 8, right: 10,
            padding: '2px 7px', borderRadius: 99,
            background: 'rgba(0,0,0,0.3)',
            fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)',
            fontFamily: "'Space Mono', monospace",
          }}>
            {sign.code}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4, lineHeight: 1.2 }}>
          {sign.name}
        </div>
        <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5, margin: 0, flex: 1 }}>
          {sign.desc}
        </p>
      </div>
    </div>
  )
}

export function PageBiblioteca() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filteredSigns = SIGNS_DB.filter(s => {
    const matchesFilter = filter === 'all' || s.cat === filter
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          (s.desc || '').toLowerCase().includes(search.toLowerCase()) ||
                          (s.code || '').toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <style>{STYLE}</style>

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: '-0.03em', margin: 0 }}>
          <Icon icon="🪧" size={22} /> Biblioteca de Señales
        </h1>
        <p style={{ fontSize: 14, color: T.muted, margin: 0 }}>
          {SIGNS_DB.length} señales viales colombianas — toca una para ver su información completa.
        </p>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Buscar por nombre, código o descripción..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '14px 18px 14px 44px',
              background: 'rgba(255,255,255,0.03)', color: T.text,
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
              fontSize: 14, outline: 'none', fontFamily: 'DM Sans, sans-serif',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.25)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16, opacity: 0.3 }}>🔍</span>
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, flexWrap: 'wrap' }}>
          {SIGN_CATEGORIES.map(cat => {
            const isActive = filter === cat.id
            const count = filter === 'all' && cat.id === 'all' ? SIGNS_DB.length
              : cat.id === 'all' ? SIGNS_DB.length
              : SIGNS_DB.filter(s => s.cat === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                style={{
                  background: isActive ? `${cat.color}18` : 'rgba(255,255,255,0.03)',
                  color: isActive ? cat.color : T.muted,
                  border: `1px solid ${isActive ? cat.color : 'rgba(255,255,255,0.06)'}`,
                  padding: '7px 14px', borderRadius: 99,
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  whiteSpace: 'nowrap', transition: 'all 0.2s',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {cat.id === 'all' ? '' : (CAT_ICONS[cat.id] || '') + ' '}{cat.label}
                <span style={{ opacity: 0.4, marginLeft: 5, fontFamily: "'Space Mono', monospace", fontSize: 10 }}>{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 14, marginTop: 4,
      }}>
        {filteredSigns.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '40px 20px', textAlign: 'center', color: T.faint }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            No se encontraron señales con "<strong>{search}</strong>"
          </div>
        )}

        {filteredSigns.map((sign, i) => (
          <SignCard key={sign.id} sign={sign} delay={(i % 12) * 40} onClick={setSelected} />
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <DetailModal sign={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

function DetailModal({ sign, onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!sign) return null

  const cat = SIGN_CATEGORIES.find(c => c.id === sign.cat)
  const color = CAT_COLORS[sign.cat] || '#fff'
  const catIcon = CAT_ICONS[sign.cat] || '📋'
  const imgUrl = sign.img || null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        animation: 'bib-fadeIn 0.2s ease',
        padding: 20,
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{
        background: 'linear-gradient(160deg, #16161f, #0e0e15)',
        border: `1px solid ${color}22`,
        borderRadius: 24, maxWidth: 520, width: '100%',
        maxHeight: '85vh', overflowY: 'auto',
        animation: 'bib-scale 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        position: 'relative',
        boxShadow: `0 40px 100px rgba(0,0,0,0.8)`,
      }}>
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
          width: 200, height: 200, borderRadius: '50%',
          background: `radial-gradient(circle, ${color}15, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 14, right: 14, zIndex: 2,
          width: 32, height: 32, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(0,0,0,0.4)',
          color: 'rgba(255,255,255,0.5)', fontSize: 16,
          cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', lineHeight: 1,
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
        >✕</button>

        {/* Image */}
        <div style={{
          height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `linear-gradient(160deg, ${color}0d, rgba(255,255,255,0.015))`,
          borderBottom: `1px solid ${color}12`,
          position: 'relative',
        }}>
          {imgUrl ? (
            <>
              <div style={{
                position: 'absolute', width: 180, height: 180, borderRadius: '50%',
                background: `radial-gradient(circle, ${color}08, transparent 70%)`,
              }} />
              <img
                src={imgUrl} alt={sign.name}
                style={{
                  height: 150, width: 150, objectFit: 'contain',
                  filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.5))',
                  position: 'relative',
                }}
                onError={e => { e.target.style.display = 'none' }}
              />
            </>
          ) : (
            <div style={{
              width: 100, height: 100, borderRadius: 20,
              background: `${color}18`, border: `1px solid ${color}28`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon icon={catIcon} size={44} />
            </div>
          )}
          {sign.code && (
            <span style={{
              position: 'absolute', bottom: 12, right: 16,
              padding: '3px 10px', borderRadius: 99,
              background: 'rgba(0,0,0,0.4)',
              border: `1px solid ${color}20`,
              fontSize: 10, fontWeight: 700,
              fontFamily: "'Space Mono', monospace",
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.05em',
            }}>
              {sign.code}
            </span>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '22px 24px 28px' }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                  {sign.name}
                </h2>
                {cat && (
                  <span style={{
                    padding: '3px 9px', borderRadius: 99, fontSize: 9, fontWeight: 700,
                    background: `${cat.color}15`, border: `1px solid ${cat.color}28`,
                    color: cat.color, textTransform: 'uppercase', letterSpacing: '0.06em',
                    fontFamily: "'Space Mono', monospace", whiteSpace: 'nowrap',
                  }}>
                    {catIcon} {cat.label}
                  </span>
                )}
              </div>
              {/* Description */}
              {sign.desc && (
                <p style={{ fontSize: 14, color: 'rgba(215,225,240,0.85)', lineHeight: 1.7, margin: 0 }}>
                  {sign.desc}
                </p>
              )}
            </div>
          </div>

          {/* Detail block */}
          {sign.detail && sign.detail !== sign.desc && (
            <div style={{
              padding: '16px 18px', borderRadius: 14,
              background: `${color}08`, border: `1px solid ${color}16`,
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Space Mono', monospace", marginBottom: 7 }}>
                <Icon icon="📖" size={10} /> Detalle
              </div>
              <p style={{ fontSize: 13, color: 'rgba(215,225,240,0.82)', lineHeight: 1.75, margin: 0 }}>
                {sign.detail}
              </p>
            </div>
          )}

          {/* Info cards row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
            {/* Type info */}
            <div style={{
              padding: '14px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Space Mono', monospace", marginBottom: 6 }}>
                Tipo
              </div>
              <div style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>
                {cat?.label || sign.cat}
              </div>
            </div>

            {/* Code info */}
            {sign.code && (
              <div style={{
                padding: '14px 14px', borderRadius: 12,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Space Mono', monospace", marginBottom: 6 }}>
                  Código
                </div>
                <div style={{ fontSize: 12, color: T.text, fontWeight: 600, fontFamily: "'Space Mono', monospace" }}>
                  {sign.code}
                </div>
              </div>
            )}

            {/* Form info */}
            <div style={{
              padding: '14px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Space Mono', monospace", marginBottom: 6 }}>
                Forma
              </div>
              <div style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>
                {sign.cat === 'reglamentaria' ? 'Círculo' : sign.cat === 'preventiva' ? 'Rombo' : sign.cat === 'informativa' ? 'Rectángulo' : sign.cat === 'transitoria' ? 'Rombo naranja' : '—'}
              </div>
            </div>

            {/* Color info */}
            <div style={{
              padding: '14px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'Space Mono', monospace", marginBottom: 6 }}>
                Color
              </div>
              <div style={{ fontSize: 12, color: T.text, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: color, display: 'inline-block' }} />
                {cat?.label || '—'}
              </div>
            </div>
          </div>

          {/* Close */}
          <button onClick={onClose} style={{
            width: '100%', marginTop: 18, padding: '12px', borderRadius: 12,
            border: `1px solid ${color}28`,
            background: `${color}0A`,
            color, fontWeight: 600, fontSize: 13,
            cursor: 'pointer', transition: 'all 0.15s',
            fontFamily: 'DM Sans, sans-serif',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = `${color}18` }}
            onMouseLeave={e => { e.currentTarget.style.background = `${color}0A` }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
