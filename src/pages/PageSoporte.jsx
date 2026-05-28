import { useState } from 'react'
import { auth } from '../config/firebase'
import { useSupport } from '../context/SupportContext'
import { useUser } from '../context/UserContext'
import { T } from '../styles/tokens'

const SS = `
@keyframes sp-slide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes sp-fade{from{opacity:0}to{opacity:1}}
@keyframes float-icon {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-6px) rotate(2deg); }
}
.sp-card{transition:all 0.2s ease}
.sp-card:hover{transform:translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.15)}
.sp-doodle {
  position: absolute;
  pointer-events: none;
  opacity: 0.15;
  font-size: 28px;
  color: #ffffff;
  animation: float-icon 5s ease-in-out infinite;
}
.sp-btn-action {
  transition: all 0.2s ease;
}
.sp-btn-action:hover {
  transform: translateY(-1px);
}
.sp-btn-action:active {
  transform: translateY(0);
}
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

// Avatares de animalitos tiernos para identificar a los remitentes
function getKidAvatar(authorName, authorId) {
  const emojis = ['🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐰', '🐸', '🐙', '🦄', '🐶', '🐱', '🐹', '🐒', '🦖', '🐧', '🦉', '🐝']
  const colors = [
    'linear-gradient(135deg, #ff7675, #e84393)',
    'linear-gradient(135deg, #74b9ff, #0984e3)',
    'linear-gradient(135deg, #55efc4, #00b894)',
    'linear-gradient(135deg, #ffeaa7, #fdcb6e)',
    'linear-gradient(135deg, #a29bfe, #6c5ce7)',
    'linear-gradient(135deg, #fd79a8, #e84393)',
    'linear-gradient(135deg, #fab1a0, #ff7675)',
    'linear-gradient(135deg, #00cec9, #00b894)',
  ]
  const str = authorId || authorName || 'Anónimo'
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const emojiIndex = Math.abs(hash) % emojis.length
  const colorIndex = Math.abs(hash) % colors.length
  return { emoji: emojis[emojiIndex], bg: colors[colorIndex] }
}

function UserAvatar({ authorName, authorId, size = 32 }) {
  const { emoji, bg } = getKidAvatar(authorName, authorId)
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.55,
      border: '2px solid rgba(255, 255, 255, 0.15)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
      flexShrink: 0,
      userSelect: 'none',
    }}>
      {emoji}
    </div>
  )
}

const CATEGORY_THEMES = {
  error: { 
    color: '#ff5252', 
    bg: 'rgba(255,82,82,0.05)', 
    bgActive: 'rgba(255,82,82,0.12)',
    border: '#ff525233', 
    label: 'Error',
    icon: <i className="fa-solid fa-bug"></i> 
  },
  sugerencia: { 
    color: '#448aff', 
    bg: 'rgba(68,138,255,0.05)', 
    bgActive: 'rgba(68,138,255,0.12)',
    border: '#448aff33', 
    label: 'Sugerencia',
    icon: <i className="fa-solid fa-lightbulb"></i> 
  },
  otro: { 
    color: '#a29bfe', 
    bg: 'rgba(162,155,254,0.05)', 
    bgActive: 'rgba(162,155,254,0.12)',
    border: '#a29bfe33', 
    label: 'Otro',
    icon: <i className="fa-solid fa-comment-dots"></i> 
  },
}

function ReportCard({ report, onDelete }) {
  const theme = CATEGORY_THEMES[report.category] || CATEGORY_THEMES.otro
  return (
    <div className="sp-card" style={{
      padding: '20px', 
      borderRadius: 16,
      background: T.card, 
      border: `2px solid ${theme.color}33`,
      boxShadow: `0 4px 12px rgba(0,0,0,0.15)`,
      animation: 'sp-slide 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      position: 'relative',
    }}>
      {/* Delete button (trash can) on top right */}
      <button 
        onClick={() => onDelete(report.id)}
        style={{
          position: 'absolute',
          top: 18,
          right: 18,
          background: 'transparent',
          border: 'none',
          color: T.faint,
          fontSize: 14,
          cursor: 'pointer',
          transition: 'color 0.2s',
          padding: 4,
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#ff5252'}
        onMouseLeave={e => e.currentTarget.style.color = T.faint}
        title="Eliminar reporte"
      >
        <i className="fa-solid fa-trash-can"></i>
      </button>

      {/* Header info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <UserAvatar authorName={report.author} authorId={report.authorId || report.author} size={32} />
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>
              {report.author}
            </span>
            <div style={{ fontSize: 10, color: T.faint, fontFamily: "'Space Mono', monospace" }}>
              {timeAgo(report.date)}
            </div>
          </div>
        </div>

        {/* Category Pill Tag */}
        <span style={{
          fontSize: 10, 
          fontWeight: 700, 
          letterSpacing: '.06em', 
          textTransform: 'uppercase',
          padding: '4px 10px', 
          borderRadius: 10,
          background: theme.bgActive, 
          color: theme.color,
          border: `1px solid ${theme.color}44`,
          marginRight: 28, // avoid overlapping trash icon
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}>
          {theme.icon}
          <span>{theme.label}</span>
        </span>
      </div>

      {/* Report Title */}
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', margin: 0 }}>
        {report.title}
      </h3>

      {/* Content Text */}
      <p style={{
        fontSize: 13, 
        color: T.muted, 
        lineHeight: 1.5, 
        margin: 0, 
        whiteSpace: 'pre-wrap',
      }}>
        {report.content}
      </p>
    </div>
  )
}

export function PageSoporte() {
  const { user } = useUser() || {}
  const { reports, addReport, deleteReport, CATEGORIES } = useSupport()
  const isAdmin = user?.isAdmin
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
        borderRadius: 20, 
        padding: '24px',
        background: `linear-gradient(135deg, #00b894 0%, #00cec9 100%)`,
        boxShadow: '0 6px 0px rgba(0, 184, 148, 0.2), 0 10px 20px rgba(0,0,0,0.15)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 20,
      }}>
        {/* Decorative Floating Icons */}
        <div className="sp-doodle" style={{ top: 12, left: '8%' }}><i className="fa-solid fa-headset"></i></div>
        <div className="sp-doodle" style={{ bottom: 12, left: '28%' }}><i className="fa-solid fa-envelope"></i></div>
        <div className="sp-doodle" style={{ top: 15, right: '22%' }}><i className="fa-solid fa-circle-question"></i></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 10, color: '#ffeaa7', fontWeight: 800, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
            <i className="fa-solid fa-circle-info"></i>
            <span>SOPORTE Y AYUDA</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Reportar error o sugerencia
          </h1>
          <p style={{ fontSize: 12, color: '#f1f2f6', marginTop: 4, margin: '4px 0 0', fontWeight: 600 }}>
            {isAdmin ? `${reports.length} reportes recibidos de exploradores` : 'Envíanos tus sugerencias o reporta errores para mejorar'}
          </p>
        </div>

        {!sent && !showForm && (
          <button 
            onClick={() => setShowForm(true)} 
            className="sp-btn-action"
            style={{
              padding: '10px 20px', 
              borderRadius: 14, 
              fontSize: 13, 
              background: '#ffffff', 
              color: '#00b894', 
              border: 'none', 
              fontWeight: 800,
              fontFamily: 'inherit', 
              whiteSpace: 'nowrap',
              position: 'relative',
              zIndex: 1,
              boxShadow: '0 4px 0 rgba(0,0,0,0.1)',
              cursor: 'pointer',
            }}
          >
            <i className="fa-solid fa-plus" style={{ marginRight: 5 }}></i> Nuevo reporte
          </button>
        )}
      </div>

      {/* Success message for non-admins */}
      {sent && !isAdmin && (
        <div style={{
          padding: '32px 24px', 
          borderRadius: 20, 
          textAlign: 'center',
          background: T.card, 
          border: `2px solid ${T.green}44`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          marginBottom: 16, 
          animation: 'sp-slide 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
        }}>
          <div style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: 'rgba(0, 230, 118, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: T.green,
            fontSize: 26,
            border: `2px solid ${T.green}33`,
          }}>
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>
              ¡Reporte enviado con éxito!
            </h2>
            <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.5, maxWidth: 360, margin: '0 auto' }}>
              Muchas gracias por colaborar. Nuestro equipo revisará los detalles para seguir optimizando la plataforma.
            </p>
          </div>
          <button 
            onClick={() => setSent(false)} 
            className="sp-btn-action"
            style={{
              marginTop: 6,
              padding: '10px 20px', 
              borderRadius: 12, 
              fontSize: 13, 
              fontWeight: 700,
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.03)', 
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#ffffff', 
              fontFamily: 'inherit',
            }}
          >
            <i className="fa-solid fa-arrow-left" style={{ marginRight: 6 }}></i> Enviar otro reporte
          </button>
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div style={{
          padding: '24px', 
          borderRadius: 20, 
          background: T.card,
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          marginBottom: 20, 
          animation: 'sp-slide 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className="fa-solid fa-file-signature" style={{ color: T.green }}></i> Crear reporte
            </h2>
            <div 
              onClick={() => setShowForm(false)} 
              style={{ 
                cursor: 'pointer', 
                fontSize: 16, 
                color: T.faint,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.03)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <i className="fa-solid fa-xmark"></i>
            </div>
          </div>

          {/* Category Tabs (Clean Dark-Mode standard style) */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.muted, marginBottom: 8 }}>
              Categoría del reporte
            </label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.entries(CATEGORIES).map(([key, label]) => {
                const theme = CATEGORY_THEMES[key] || CATEGORY_THEMES.otro
                const isSelected = category === key
                return (
                  <button 
                    key={key} 
                    type="button"
                    onClick={() => setCategory(key)} 
                    style={{
                      padding: '8px 16px', 
                      borderRadius: 10, 
                      fontSize: 12, 
                      cursor: 'pointer',
                      background: isSelected ? theme.bgActive : 'rgba(255,255,255,0.02)',
                      border: isSelected ? `2px solid ${theme.color}` : '1px solid rgba(255,255,255,0.06)',
                      color: isSelected ? '#ffffff' : T.muted,
                      fontWeight: isSelected ? 700 : 500,
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    {theme.icon}
                    <span>{label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.muted, marginBottom: 6 }}>
              Título descriptivo
            </label>
            <input
              placeholder="Ej: Problema al cargar los logros"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{
                width: '100%', 
                padding: '12px 14px', 
                fontSize: 14, 
                borderRadius: 12, 
                outline: 'none',
                background: 'rgba(255,255,255,0.03)', 
                border: '2px solid rgba(255,255,255,0.06)',
                color: T.text, 
                fontFamily: 'inherit',
              }}
              onFocus={e => e.currentTarget.style.borderColor = T.green}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.muted, marginBottom: 6 }}>
              Detalles del error o propuesta
            </label>
            <textarea
              placeholder="Por favor describe lo que sucedió o lo que te gustaría sugerir..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              style={{
                width: '100%', 
                padding: '12px 14px', 
                fontSize: 13, 
                borderRadius: 12, 
                outline: 'none',
                background: 'rgba(255,255,255,0.03)', 
                border: '2px solid rgba(255,255,255,0.06)',
                color: T.text, 
                resize: 'none', 
                fontFamily: 'inherit', 
                lineHeight: 1.5,
              }}
              onFocus={e => e.currentTarget.style.borderColor = T.green}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button 
              onClick={() => setShowForm(false)} 
              className="sp-btn-action"
              style={{
                padding: '10px 18px', 
                borderRadius: 12, 
                fontSize: 13, 
                background: 'transparent', 
                color: T.muted, 
                border: '1px solid rgba(255,255,255,0.08)', 
                fontWeight: 600, 
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              <i className="fa-solid fa-xmark"></i> Cancelar
            </button>
            <button 
              onClick={handleSubmit} 
              className="sp-btn-action"
              style={{
                padding: '10px 22px', 
                borderRadius: 12, 
                fontSize: 13, 
                background: T.green, 
                color: '#000000', 
                border: 'none', 
                fontWeight: 700, 
                fontFamily: 'inherit',
                opacity: title.trim() && content.trim() ? 1 : 0.4,
                cursor: title.trim() && content.trim() ? 'pointer' : 'not-allowed',
              }}
              disabled={!title.trim() || !content.trim()}
            >
              <i className="fa-solid fa-paper-plane"></i> Enviar
            </button>
          </div>
        </div>
      )}

      {/* Mis reportes (usuario normal) */}
      {!isAdmin && (
        <div style={{ marginTop: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="fa-regular fa-clock" style={{ color: T.green }}></i>
            Mis reportes
          </h3>
          {reports.filter(r => r.authorId === auth.currentUser?.uid).length === 0 ? (
            <div style={{ padding: '24px 16px', borderRadius: 14, background: T.card, border: `1px solid ${T.border}`, textAlign: 'center', color: T.faint, fontSize: 12 }}>
              No has enviado ningún reporte aún.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {reports.filter(r => r.authorId === auth.currentUser?.uid).map(r => (
                <div key={r.id} style={{
                  padding: '14px 16px', borderRadius: 12,
                  background: T.card, border: `1px solid ${T.border}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{r.title}</div>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                      background: r.adminReply ? `${T.green}18` : `${T.orange}18`,
                      color: r.adminReply ? T.green : T.orange,
                      whiteSpace: 'nowrap',
                    }}>
                      {r.adminReply ? 'Respondido' : 'Pendiente'}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, whiteSpace: 'pre-wrap', marginBottom: r.adminReply ? 8 : 0 }}>
                    {r.content}
                  </div>
                  {r.adminReply && (
                    <div style={{
                      padding: '10px 12px', borderRadius: 8,
                      background: `${T.green}08`, border: `1px solid ${T.green}22`,
                      marginTop: 8,
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: T.green, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <i className="fa-solid fa-reply"></i> Respuesta del admin
                      </div>
                      <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {r.adminReply}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lista de reportes (solo admin) */}
      {isAdmin && reports.length === 0 && !showForm && (
        <div style={{
          padding: '40px 20px', 
          borderRadius: 20, 
          textAlign: 'center',
          background: T.card, 
          border: '2px dashed rgba(255,255,255,0.04)',
          color: T.faint,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}>
          <i className="fa-solid fa-folder-open" style={{ fontSize: 18 }}></i>
          <span>No hay reportes de soporte recibidos aún.</span>
        </div>
      )}
      {isAdmin && reports.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reports.map(r => (
            <ReportCard key={r.id} report={r} onDelete={deleteReport} />
          ))}
        </div>
      )}
    </>
  )
}
