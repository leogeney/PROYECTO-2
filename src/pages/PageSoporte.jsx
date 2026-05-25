import { useState } from 'react'
import { useSupport } from '../context/SupportContext'
import { T } from '../styles/tokens'

const SS = `
@keyframes sp-slide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes sp-fade{from{opacity:0}to{opacity:1}}
.sp-card{transition:all 0.3s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden}
.sp-card:hover{transform:translateY(-2px)}
`

function timeAgo(date) {
  const diff = Date.now() - date
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'ahora'
  if (min < 60) return `${min}m`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d`
  return `${Math.floor(d / 7)}sem`
}

const CATEGORY_STYLES = {
  error: { color: T.red, bg: 'rgba(255,82,82,0.12)' },
  sugerencia: { color: T.blue, bg: 'rgba(68,130,255,0.12)' },
  otro: { color: T.faint, bg: 'rgba(255,255,255,0.04)' },
}

const CATEGORY_LABELS = { error: 'Error', sugerencia: 'Sugerencia', otro: 'Otro' }

function ReportCard({ report }) {
  const cs = CATEGORY_STYLES[report.category] || CATEGORY_STYLES.otro
  return (
    <div className="sp-card" style={{
      padding: '18px 20px', borderRadius: 14,
      background: T.card, border: '1px solid rgba(255,255,255,0.04)',
      animation: 'sp-slide 0.3s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
            padding: '3px 8px', borderRadius: 6,
            background: cs.bg, color: cs.color,
          }}>
            {CATEGORY_LABELS[report.category] || 'Otro'}
          </span>
          <span style={{ fontSize: 15, fontWeight: 600, color: T.text, lineHeight: 1.3 }}>
            {report.title}
          </span>
        </div>
        <div style={{
          fontSize: 10, color: T.faint, whiteSpace: 'nowrap', marginLeft: 12, marginTop: 2,
          fontFamily: "'Space Mono', monospace",
        }}>
          {timeAgo(report.date)}
        </div>
      </div>
      <p style={{
        fontSize: 12, color: T.muted, lineHeight: 1.5, margin: 0, whiteSpace: 'pre-wrap',
      }}>
        {report.content}
      </p>
      <div style={{ fontSize: 11, color: T.faint, marginTop: 10 }}>
        {report.author}
      </div>
    </div>
  )
}

export function PageSoporte({ isAdmin }) {
  const { reports, addReport, CATEGORIES } = useSupport()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('error')
  const [sent, setSent] = useState(false)

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return
    addReport(title, content, category)
    setTitle('')
    setContent('')
    setCategory('error')
    setShowForm(false)
    setSent(true)
  }

  return (
    <>
      <style>{SS}</style>

      {/* Header */}
      <div style={{
        borderRadius: 14, padding: '22px 22px 18px',
        background: `linear-gradient(145deg, ${T.card}, #0d101a)`,
        border: '1px solid rgba(0,230,118,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <div>
          <div style={{ fontSize: 9, color: T.green, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 6 }}>
            Soporte
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: T.text, margin: 0, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Reportar error o sugerencia
          </h1>
          <p style={{ fontSize: 11, color: T.muted, marginTop: 4, margin: '4px 0 0' }}>
            {isAdmin ? `${reports.length} reportes recibidos` : 'Ayuda a mejorar la plataforma'}
          </p>
        </div>
        {!sent && (
          <button onClick={() => setShowForm(true)} style={{
            padding: '9px 18px', borderRadius: 10, fontSize: 12, cursor: 'pointer',
            background: T.green, color: '#000', border: 'none', fontWeight: 700,
            fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}>
            + Nuevo reporte
          </button>
        )}
      </div>

      {/* Success message for non-admins */}
      {sent && !isAdmin && (
        <div style={{
          padding: '24px 20px', borderRadius: 14, textAlign: 'center',
          background: T.card, border: '1px solid rgba(0,230,118,0.08)',
          marginBottom: 16, animation: 'sp-slide 0.3s ease',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.green, marginBottom: 4 }}>Reporte enviado</div>
          <div style={{ fontSize: 12, color: T.muted, marginBottom: 14 }}>Gracias por tu ayuda. Los administradores revisarán tu reporte.</div>
          <button onClick={() => setSent(false)} style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: T.faint, fontFamily: 'inherit',
          }}>Enviar otro reporte</button>
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div style={{
          padding: '20px 22px', borderRadius: 14, background: T.card,
          border: '1px solid rgba(255,255,255,0.04)',
          marginBottom: 16, animation: 'sp-slide 0.3s ease',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: T.text, margin: 0 }}>Nuevo reporte</h2>
            <div onClick={() => setShowForm(false)} style={{ cursor: 'pointer', fontSize: 16, color: T.faint, lineHeight: 1 }}>✕</div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <button key={key} onClick={() => setCategory(key)} style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
                background: category === key ? (CATEGORY_STYLES[key]?.bg || 'rgba(255,255,255,0.08)') : 'rgba(255,255,255,0.04)',
                border: category === key ? `1px solid ${CATEGORY_STYLES[key]?.color || T.faint}` : '1px solid rgba(255,255,255,0.08)',
                color: category === key ? (CATEGORY_STYLES[key]?.color || T.text) : T.faint,
                fontWeight: category === key ? 600 : 400,
                fontFamily: 'inherit',
              }}>
                {label}
              </button>
            ))}
          </div>
          <input
            placeholder="Título del reporte"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', fontSize: 14, borderRadius: 10, outline: 'none',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: T.text, marginBottom: 14, fontFamily: 'inherit',
            }}
          />
          <textarea
            placeholder="Describe el error o sugerencia..."
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={4}
            style={{
              width: '100%', padding: '10px 14px', fontSize: 13, borderRadius: 10, outline: 'none',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: T.text, resize: 'none', fontFamily: 'inherit', lineHeight: 1.5, marginBottom: 14,
            }}
          />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setShowForm(false)} style={{
              padding: '9px 18px', borderRadius: 10, fontSize: 13, cursor: 'pointer',
              background: 'transparent', color: T.faint, border: '1px solid rgba(255,255,255,0.08)', fontWeight: 500, fontFamily: 'inherit',
            }}>Cancelar</button>
            <button onClick={handleSubmit} style={{
              padding: '9px 20px', borderRadius: 10, fontSize: 13, cursor: 'pointer',
              background: T.green, color: '#000', border: 'none', fontWeight: 700, fontFamily: 'inherit',
              opacity: title.trim() && content.trim() ? 1 : 0.4,
            }}>Enviar</button>
          </div>
        </div>
      )}

      {/* Lista de reportes (solo admin) */}
      {isAdmin && reports.length === 0 && !showForm && (
        <div style={{
          padding: '32px 20px', borderRadius: 14, textAlign: 'center',
          background: T.card, border: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div style={{ fontSize: 11, color: T.faint }}>No hay reportes aún.</div>
        </div>
      )}
      {isAdmin && reports.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {reports.map(r => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      )}
    </>
  )
}
