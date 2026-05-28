import { useState, useEffect } from 'react'
import { useSupport } from '../context/SupportContext'
import { T } from '../styles/tokens'

function timeAgo(ts) {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'ahora'
  if (min < 60) return `${min}m`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d`
  return new Date(ts).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

const CATEGORY_META = {
  error: { color: '#ff5252', icon: 'fa-solid fa-bug', label: 'Error' },
  sugerencia: { color: '#448aff', icon: 'fa-solid fa-lightbulb', label: 'Sugerencia' },
  otro: { color: '#a29bfe', icon: 'fa-solid fa-comment-dots', label: 'Otro' },
}

export function PageAdminSupport() {
  const { reports, replyToReport } = useSupport()
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [filter, setFilter] = useState('all')

  const handleReply = async () => {
    if (!reply.trim() || !selected || sending) return
    setSending(true)
    await replyToReport(selected.id, reply.trim())
    setReply('')
    setSending(false)
  }

  const filtered = filter === 'all' ? reports : reports.filter(r => r.category === filter)
  const liveSelected = selected ? reports.find(r => r.id === selected.id) || selected : null

  if (liveSelected) {
    return (
      <div>
        <button onClick={() => { setSelected(null); setReply('') }} style={{
          background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`,
          borderRadius: 8, color: T.muted, cursor: 'pointer', fontSize: 12,
          padding: '6px 14px', fontFamily: 'inherit', marginBottom: 16,
        }}>
          <i className="fa-solid fa-arrow-left" style={{ marginRight: 6 }}></i>
          Volver a reportes
        </button>

        <div style={{
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: 20, marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: `${T.green}12`, border: `1px solid ${T.green}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: T.green,
            }}>
              {liveSelected.author?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{liveSelected.author}</div>
              <div style={{ fontSize: 11, color: T.muted }}>{timeAgo(liveSelected.date)}</div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 10, background: `${(CATEGORY_META[liveSelected.category] || CATEGORY_META.otro).color}18`, color: (CATEGORY_META[liveSelected.category] || CATEGORY_META.otro).color, display: 'flex', alignItems: 'center', gap: 4 }}>
              <i className={(CATEGORY_META[liveSelected.category] || CATEGORY_META.otro).icon}></i>
              {(CATEGORY_META[liveSelected.category] || CATEGORY_META.otro).label}
            </span>
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: '0 0 8px' }}>{liveSelected.title}</h3>
          <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{liveSelected.content}</p>

          {liveSelected.adminReply && (
            <div style={{
              marginTop: 14, padding: '12px 14px', borderRadius: 10,
              background: `${T.green}08`, border: `1px solid ${T.green}22`,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.green, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                <i className="fa-solid fa-reply"></i> Tu respuesta
              </div>
              <div style={{ fontSize: 13, color: T.text, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{liveSelected.adminReply}</div>
            </div>
          )}
        </div>

        <div style={{
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: 18,
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="fa-solid fa-reply" style={{ color: T.blue }}></i>
            Responder
          </h3>
          <textarea
            placeholder="Escribe tu respuesta..."
            value={reply}
            onChange={e => setReply(e.target.value)}
            rows={4}
            style={{
              width: '100%', padding: '12px 14px', fontSize: 13,
              borderRadius: 10, outline: 'none',
              background: 'rgba(255,255,255,0.03)', border: `2px solid ${T.border}`,
              color: T.text, resize: 'none', fontFamily: 'inherit',
              lineHeight: 1.5, marginBottom: 12, boxSizing: 'border-box',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = T.green }}
            onBlur={e => { e.currentTarget.style.borderColor = T.border }}
          />
          <button onClick={handleReply} disabled={!reply.trim() || sending} style={{
            padding: '10px 22px', borderRadius: 10, fontSize: 13,
            background: reply.trim() ? T.green : 'rgba(255,255,255,0.05)',
            color: reply.trim() ? '#000' : T.faint,
            border: 'none', fontWeight: 700, fontFamily: 'inherit',
            cursor: reply.trim() ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {sending ? 'Enviando...' : <><i className="fa-solid fa-paper-plane"></i> Enviar respuesta</>}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <i className="fa-solid fa-headset" style={{ color: T.orange }}></i>
          Reportes de soporte
        </h1>
        <p style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{reports.length} reportes recibidos</p>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'Todos', color: T.text },
          ...Object.entries(CATEGORY_META).map(([k, v]) => ({ key: k, label: v.label, color: v.color })),
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600,
            fontFamily: 'inherit', cursor: 'pointer', border: `1px solid ${filter === f.key ? f.color + '44' : T.border}`,
            background: filter === f.key ? `${f.color}12` : 'rgba(255,255,255,0.02)',
            color: filter === f.key ? f.color : T.muted, transition: 'all 0.15s',
          }}>{f.label}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '40px 20px', borderRadius: 14,
          background: T.card, border: `2px dashed ${T.border}`,
          color: T.faint, fontSize: 13,
        }}>
          <i className="fa-solid fa-inbox" style={{ fontSize: 28, marginBottom: 10, display: 'block', opacity: 0.5 }}></i>
          No hay reportes de esta categoría
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(r => {
            const meta = CATEGORY_META[r.category] || CATEGORY_META.otro
            return (
              <button key={r.id} onClick={() => setSelected(r)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', borderRadius: 12,
                background: T.card, border: `1px solid ${T.border}`,
                color: T.text, cursor: 'pointer', width: '100%',
                textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${meta.color}44` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: `${meta.color}15`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: meta.color, fontSize: 14,
                }}>
                  <i className={meta.icon}></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: T.muted, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{r.author}</span>
                    <span style={{ color: T.faint }}>·</span>
                    <span>{timeAgo(r.date)}</span>
                  </div>
                </div>
                <i className="fa-solid fa-chevron-right" style={{ color: T.faint, fontSize: 12 }}></i>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
