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
  const [selected, setSelected] = useState(null)

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
          Biblioteca de Señales
        </h2>
        <p style={{ fontSize: 14, color: T.muted }}>
          Toca una señal para ver su significado completo.
        </p>
      </div>

      <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input
          type="text"
          placeholder="Buscar señal por nombre o descripción..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '14px 18px',
            background: T.surface, color: T.text,
            border: `1px solid ${T.borderHi}`, borderRadius: 12,
            fontSize: 14, outline: 'none', fontFamily: 'DM Sans, sans-serif'
          }}
        />

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
                {cat.label} <span style={{ opacity:0.5, marginLeft:4 }}>({filter === 'all' ? SIGNS_DB.length : SIGNS_DB.filter(s => s.cat === cat.id).length})</span>
              </button>
            )
          })}
        </div>
      </div>

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
            <div key={sign.id} className="card anim-up" onClick={() => setSelected(sign)} style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '24px 20px', textAlign: 'center', gap: 14,
              animationDelay: `${(i % 10) * 50}ms`, cursor: 'pointer',
              transition: 'all 0.25s, border-color 0.3s',
            }}>
              <div style={{
                width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `linear-gradient(135deg, ${category.color}15, ${category.color}08)`,
                border: `1px solid ${category.color}20`, borderRadius: 12,
              }}>
                <img 
                  src={sign.img} 
                  alt={sign.name} 
                  style={{ width: 68, height: 68, objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }} 
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

      {/* Modal de detalle */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position:'fixed', inset:0, zIndex:9999,
          display:'flex', alignItems:'center', justifyContent:'center',
          background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)',
          animation:'fadeIn 0.2s ease',
        }}>
          <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes scaleIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}`}</style>
          <div onClick={e => e.stopPropagation()} style={{
            background:'#0e1017', border:'1px solid rgba(255,255,255,0.1)', borderRadius:24,
            padding:'36px 32px', maxWidth:440, width:'90%', maxHeight:'90vh', overflowY:'auto',
            animation:'scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            display:'flex', flexDirection:'column', gap:20, position:'relative',
          }}>
            <button onClick={() => setSelected(null)} style={{
              position:'absolute', top:16, right:20,
              background:'none', border:'none', color:'rgba(255,255,255,0.4)',
              fontSize:24, cursor:'pointer', lineHeight:1,
            }}>×</button>

            {(() => {
              const cat = SIGN_CATEGORIES.find(c => c.id === selected.cat)
              return (
                <>
                  <div style={{ display:'flex', gap:20, alignItems:'center' }}>
                    <div style={{
                      width:100, height:100, display:'flex', alignItems:'center', justifyContent:'center',
                      background:`linear-gradient(135deg, ${cat.color}20, ${cat.color}08)`,
                      border:`1px solid ${cat.color}30`, borderRadius:16, flexShrink:0,
                    }}>
                      <img src={selected.img} alt={selected.name}
                        style={{ width:80, height:80, objectFit:'contain', filter:'drop-shadow(0 6px 12px rgba(0,0,0,0.5))' }}
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                        <span style={{
                          padding:'3px 10px', borderRadius:99, fontSize:10, fontWeight:700,
                          background:`${cat.color}22`, color:cat.color, letterSpacing:'0.05em',
                          fontFamily:"'Space Mono',monospace",
                        }}>{cat.label}</span>
                        <span style={{
                          padding:'3px 10px', borderRadius:99, fontSize:10, fontWeight:700,
                          background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.4)',
                          fontFamily:"'Space Mono',monospace",
                        }}>{selected.code}</span>
                      </div>
                      <div style={{ fontSize:22, fontWeight:700, color:T.text, lineHeight:1.2 }}>
                        {selected.name}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    padding:'18px 20px', borderRadius:16,
                    background:`${cat.color}08`, border:`1px solid ${cat.color}18`,
                    fontSize:14, color:'rgba(220,228,240,0.9)', lineHeight:1.8,
                  }}>
                    {selected.detail || selected.desc}
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
