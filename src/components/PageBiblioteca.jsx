import React, { useState } from 'react'
import { SIGNS_DB, SIGN_CATEGORIES } from '../data/signsData'

const T = {
  bg:       '#07090f',
  surface:  'rgba(255,255,255,0.03)',
  card:     'rgba(18,21,30,0.6)',
  border:   'rgba(255,255,255,0.08)',
  borderHi: 'rgba(255,255,255,0.2)',
  text:     '#ffffff',
  muted:    '#94a3b8',
  faint:    '#64748b',
  green:    '#00e676',
}

export function PageBiblioteca() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredSigns = SIGNS_DB.filter(s => {
    const matchesFilter = filter === 'all' || s.cat === filter
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.desc.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="anim-fade" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          🪧 Biblioteca de Señales
        </h2>
        <p style={{ fontSize: 14, color: T.muted }}>
          Aprende y repasa el significado de las señales internacionales de tránsito.
        </p>
      </div>

      <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Buscador */}
        <input
          type="text"
          placeholder="🔍 Buscar señal por nombre o descripción..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '14px 18px',
            background: T.surface, color: T.text,
            border: `1px solid ${T.borderHi}`, borderRadius: 12,
            fontSize: 14, outline: 'none', fontFamily: 'DM Sans, sans-serif'
          }}
        />

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
          {SIGN_CATEGORIES.map(cat => {
            const isActive = filter === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                style={{
                  background: isActive ? `${cat.color}22` : T.card,
                  color: isActive ? cat.color : T.muted,
                  border: `1px solid ${isActive ? cat.color : T.border}`,
                  padding: '8px 16px', borderRadius: 99,
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  whiteSpace: 'nowrap', transition: 'all 0.2s'
                }}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Galería / Grilla */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
        gap: 16, marginTop: 10 
      }}>
        {filteredSigns.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: T.faint }}>
            No se encontraron señales con esta búsqueda.
          </div>
        )}
        
        {filteredSigns.map((sign, i) => {
          const category = SIGN_CATEGORIES.find(c => c.id === sign.cat)
          return (
            <div key={sign.id} className="card anim-up" style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '24px 20px', textAlign: 'center', gap: 14,
              animationDelay: `${(i % 10) * 50}ms`
            }}>
              <div style={{
                width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {/* Fallback de imagen en caso de error de SVG remoto o cargado */}
                <img 
                  src={sign.img} 
                  alt={sign.name} 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.3))' }} 
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <div style={{ 
                  fontSize: 10, fontWeight: 700, color: category.color, 
                  textTransform: 'uppercase', letterSpacing: '0.05em' 
                }}>
                  {category.label}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.text, lineHeight: 1.2 }}>
                  {sign.name}
                </div>
                <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5, margin: 0 }}>
                  {sign.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
