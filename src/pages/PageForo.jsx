import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForum } from '../context/ForumContext'
import { T } from '../styles/tokens'

const FS = `
@keyframes kid-pop {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes fo-slide {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fo-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes float-emoji {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(3deg); }
}
@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-8deg); }
  75% { transform: rotate(8deg); }
}
@keyframes heart-beat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
.kid-card {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.2);
  position: relative;
  overflow: hidden;
}
.kid-card:hover {
  transform: translateY(-4px) scale(1.008);
}
.kid-button-3d {
  transition: all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}
.kid-button-3d:active {
  transform: translateY(3px) !important;
  box-shadow: none !important;
}
.reaction-btn {
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.2);
}
.reaction-btn:hover {
  transform: translateY(-2px) scale(1.05);
}
.reaction-btn:hover .reaction-emoji {
  animation: wiggle 0.4s ease infinite;
}
.reaction-btn:active {
  transform: scale(0.9);
}
.doodle {
  position: absolute;
  pointer-events: none;
  opacity: 0.15;
  font-size: 28px;
  animation: float-emoji 6s ease-in-out infinite;
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

// Avatares de animalitos tiernos para los niños
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

function UserAvatar({ authorName, authorId, photoUrl, size = 36 }) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={authorName}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid rgba(255, 255, 255, 0.15)',
          display: 'block',
        }}
      />
    )
  }
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

const STICKER_COLORS = [
  { border: '#ff7675', badge: '#ff767522' },
  { border: '#74b9ff', badge: '#74b9ff22' },
  { border: '#55efc4', badge: '#55efc422' },
  { border: '#ffeaa7', badge: '#ffeaa722' },
  { border: '#a29bfe', badge: '#a29bfe22' },
  { border: '#fd79a8', badge: '#fd79a822' },
]

function getCardTheme(postId) {
  const str = postId || '1'
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return STICKER_COLORS[Math.abs(hash) % STICKER_COLORS.length]
}

const REACTION_TYPES = [
  { type: 'like', emoji: '👍', label: '¡Súper!', color: '#74b9ff' },
  { type: 'love', emoji: '❤️', label: '¡Me encanta!', color: '#ff7675' },
  { type: 'star', emoji: '🌟', label: '¡Estrella!', color: '#ffeaa7' },
  { type: 'party', emoji: '🎉', label: '¡Fiesta!', color: '#fd79a8' },
  { type: 'idea', emoji: '💡', label: '¡Brillante!', color: '#55efc4' },
]

function PostCard({ post, onClick }) {
  const navigate = useNavigate()
  const theme = getCardTheme(post.id)
  const { reactToPost } = useForum()

  return (
    <div 
      className="kid-card" 
      onClick={onClick} 
      style={{
        padding: '20px', 
        borderRadius: 20, 
        cursor: 'pointer',
        background: T.card, 
        border: `2px solid ${theme.border}44`,
        boxShadow: `0 6px 0px ${theme.border}11, 0 8px 16px rgba(0,0,0,0.15)`,
        animation: 'fo-slide 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginBottom: 8,
      }}
    >
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <UserAvatar authorName={post.author} authorId={post.authorId} size={36} />
          <div>
            <div 
              onClick={e => { e.stopPropagation(); if (post.authorId) navigate(`/dashboard/perfil/${post.authorId}`) }} 
              style={{
                fontSize: 13, 
                fontWeight: 700, 
                color: T.text, 
                cursor: post.authorId ? 'pointer' : 'default',
              }}
              onMouseEnter={e => { if (post.authorId) e.currentTarget.style.color = T.green }}
              onMouseLeave={e => { if (post.authorId) e.currentTarget.style.color = T.text }}
            >
              {post.author}
            </div>
            <div style={{ fontSize: 10, color: T.faint, fontFamily: "'Space Mono', monospace", display: 'flex', alignItems: 'center', gap: 4 }}>
              <i className="fa-regular fa-clock" style={{ fontSize: 9 }}></i>
              <span>{timeAgo(post.date)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: 16, 
        fontWeight: 700, 
        color: '#ffffff',
        lineHeight: 1.3, 
        margin: 0,
      }}>
        {post.title}
      </h3>

      {/* Post Image */}
      {post.img && (
        <div style={{ borderRadius: 14, overflow: 'hidden', maxHeight: 150, border: '1px solid rgba(255,255,255,0.06)' }}>
          <img src={post.img} alt="" style={{ width: '100%', height: 150, objectFit: 'cover', display: 'block' }} />
        </div>
      )}

      {/* Content Text */}
      <p style={{
        fontSize: 13, 
        color: T.muted, 
        lineHeight: 1.5,
        margin: 0,
        display: '-webkit-box', 
        WebkitLineClamp: 2, 
        WebkitBoxOrient: 'vertical', 
        overflow: 'hidden',
      }}>
        {post.content}
      </p>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '4px 0' }} />

      {/* Footer / Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        {/* Reactions List */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {REACTION_TYPES.map(rx => {
            const count = (post.reactions && post.reactions[rx.type]) || 0
            const active = count > 0
            return (
              <button
                key={rx.type}
                className="reaction-btn"
                onClick={e => {
                  e.stopPropagation()
                  reactToPost(post.id, rx.type)
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '5px 9px',
                  borderRadius: 14,
                  border: '1px solid',
                  borderColor: active ? rx.color : 'rgba(255,255,255,0.06)',
                  background: active ? `${rx.color}15` : 'rgba(255,255,255,0.02)',
                  color: active ? '#ffffff' : T.muted,
                  cursor: 'pointer',
                  fontSize: 11,
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                <span className="reaction-emoji" style={{ fontSize: 13 }}>{rx.emoji}</span>
                {count > 0 && <span>{count}</span>}
              </button>
            )
          })}
        </div>

        {/* Comment Count Link */}
        <div style={{ fontSize: 12, color: T.faint, display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="fa-regular fa-comment" style={{ fontSize: 12 }}></i>
          <span>{post.comments.length} {post.comments.length === 1 ? 'comentario' : 'comentarios'}</span>
        </div>
      </div>
    </div>
  )
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function resizeImage(dataUrl, maxW = 800, quality = 0.7) {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      let w = img.width, h = img.height
      if (w > maxW) { h = h * maxW / w; w = maxW }
      const c = document.createElement('canvas')
      c.width = w; c.height = h
      const ctx = c.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      resolve(c.toDataURL('image/jpeg', quality))
    }
    img.src = dataUrl
  })
}

function NewPostModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [img, setImg] = useState('')
  const [imgError, setImgError] = useState('')

  const handleFile = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 1_048_576) { setImgError('La imagen supera 1 MB'); return }
    setImgError('')
    const dataUrl = await readFileAsDataURL(file)
    const resized = await resizeImage(dataUrl)
    setImg(resized)
  }

  const isFormValid = title.trim() && content.trim()

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(5, 7, 15, 0.8)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      animation: 'fo-fade 0.2s ease',
    }}>
      <div style={{
        background: T.card, 
        borderRadius: 24,
        border: '2px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        padding: '24px', 
        maxWidth: 520, 
        width: '100%',
        animation: 'kid-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {/* Modal Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fa-solid fa-pen-to-square" style={{ color: T.green }}></i> ¡Crear nuevo tema!
          </h2>
          <div 
            onClick={onClose} 
            style={{ 
              cursor: 'pointer', 
              fontSize: 16, 
              color: T.faint, 
              fontWeight: 'bold', 
              width: 32, 
              height: 32,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          >
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>

        {/* Title Input */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.muted, marginBottom: 6 }}>
            Título de tu tema 🏷️
          </label>
          <input
            placeholder="Ej: ¡Miren mi dibujo de una moto! 🏍️"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              width: '100%', 
              padding: '12px 14px', 
              fontSize: 14, 
              borderRadius: 14, 
              outline: 'none',
              background: 'rgba(255,255,255,0.03)', 
              border: '2px solid rgba(255,255,255,0.06)',
              color: T.text, 
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.currentTarget.style.borderColor = T.green}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
          />
        </div>

        {/* Content Textarea */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: T.muted, marginBottom: 6 }}>
            Cuéntanos más detalles 💬
          </label>
          <textarea
            placeholder="¡Escribe aquí lo que quieras compartir con la comunidad!..."
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={4}
            style={{
              width: '100%', 
              padding: '12px 14px', 
              fontSize: 13, 
              borderRadius: 14, 
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

        {/* Image upload */}
        <div>
          <input
            type="file"
            accept="image/*"
            id="fo-img-input"
            onChange={handleFile}
            style={{ display: 'none' }}
          />
          {img ? (
            <div style={{ position: 'relative', display: 'inline-block', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img src={img} alt="preview" style={{ height: 100, borderRadius: 14, display: 'block' }} />
              <div 
                onClick={() => { setImg(''); setImgError('') }} 
                style={{
                  position: 'absolute', top: 6, right: 6,
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.7)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, cursor: 'pointer', lineHeight: 1, fontWeight: 'bold'
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </div>
            </div>
          ) : (
            <label 
              htmlFor="fo-img-input" 
              className="kid-button-3d"
              style={{
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 6,
                padding: '9px 15px', 
                borderRadius: 14, 
                fontSize: 12,
                fontWeight: 700,
                background: 'rgba(255,255,255,0.03)', 
                border: 'none',
                borderBottom: '3px solid rgba(0,0,0,0.3)',
                color: '#ffffff', 
                cursor: 'pointer',
              }}
            >
              <i className="fa-solid fa-image" style={{ color: T.green }}></i> Subir Imagen
            </label>
          )}
          {imgError && <div style={{ fontSize: 11, color: '#ff5252', marginTop: 6, fontWeight: 600 }}>⚠️ {imgError}</div>}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
          <button 
            onClick={onClose} 
            className="kid-button-3d"
            style={{
              padding: '10px 18px', 
              borderRadius: 14, 
              fontSize: 13, 
              background: 'transparent', 
              color: T.muted, 
              border: '2px solid rgba(255,255,255,0.06)', 
              fontWeight: 700,
            }}
          >
            <i className="fa-solid fa-xmark"></i> Cancelar
          </button>
          <button 
            onClick={() => { if (isFormValid) { onSubmit(title, content, img) } }} 
            className="kid-button-3d"
            disabled={!isFormValid}
            style={{
              padding: '10px 22px', 
              borderRadius: 14, 
              fontSize: 13, 
              background: T.green, 
              color: '#000000', 
              border: 'none', 
              borderBottom: `4px solid ${T.greenDim}`,
              fontWeight: 700,
              opacity: isFormValid ? 1 : 0.4,
              cursor: isFormValid ? 'pointer' : 'not-allowed',
            }}
          >
            <i className="fa-solid fa-paper-plane"></i> ¡Publicar!
          </button>
        </div>
      </div>
    </div>
  )
}

function PostDetail({ post, onBack }) {
  const { addComment, reactToPost } = useForum()
  const [text, setText] = useState('')
  const navigate = useNavigate()
  const theme = getCardTheme(post.id)

  return (
    <div style={{ animation: 'fo-slide 0.3s ease', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Back Button */}
      <div>
        <button 
          onClick={onBack} 
          className="kid-button-3d"
          style={{
            background: 'rgba(255,255,255,0.03)', 
            border: 'none', 
            borderBottom: '3px solid rgba(0,0,0,0.3)',
            borderRadius: 12,
            color: '#ffffff', 
            fontSize: 12, 
            fontWeight: 700, 
            padding: '8px 14px', 
            fontFamily: 'inherit',
          }}
        >
          <i className="fa-solid fa-arrow-left"></i> Volver al Foro
        </button>
      </div>

      {/* Main Post Card Details */}
      <div style={{ 
        padding: '24px', 
        borderRadius: 20, 
        background: T.card, 
        border: `2px solid ${theme.border}44`,
        boxShadow: `0 6px 0px ${theme.border}11, 0 8px 16px rgba(0,0,0,0.15)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        {/* Header author and tag */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <UserAvatar authorName={post.author} authorId={post.authorId} size={40} />
            <div>
              <span 
                onClick={() => { if (post.authorId) navigate(`/dashboard/perfil/${post.authorId}`) }} 
                style={{ 
                  fontSize: 14, 
                  fontWeight: 700, 
                  cursor: post.authorId ? 'pointer' : 'default', 
                  color: T.green 
                }}
              >
                {post.author}
              </span>
              <div style={{ fontSize: 10, color: T.faint, fontFamily: "'Space Mono', monospace", marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <i className="fa-regular fa-clock" style={{ fontSize: 9 }}></i>
                <span>Publicado {timeAgo(post.date)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Post Title */}
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', margin: 0, lineHeight: 1.3 }}>
          {post.title}
        </h2>

        {/* Post image */}
        {post.img && (
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            <img src={post.img} alt="" style={{ width: '100%', maxHeight: 400, objectFit: 'contain', display: 'block', background: '#090b11' }} />
          </div>
        )}

        {/* Post content text */}
        <p style={{ fontSize: 14, color: T.text, lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
          {post.content}
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />

        {/* Post Reactions */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {REACTION_TYPES.map(rx => {
            const count = (post.reactions && post.reactions[rx.type]) || 0
            const active = count > 0
            return (
              <button
                key={rx.type}
                className="reaction-btn"
                onClick={() => reactToPost(post.id, rx.type)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 16,
                  border: '1px solid',
                  borderColor: active ? rx.color : 'rgba(255,255,255,0.06)',
                  background: active ? `${rx.color}15` : 'rgba(255,255,255,0.02)',
                  color: active ? '#ffffff' : T.muted,
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  outline: 'none',
                }}
              >
                <span className="reaction-emoji" style={{ fontSize: 14 }}>{rx.emoji}</span>
                {count > 0 && <span>{count}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Comments Section */}
      <div style={{ marginTop: 8 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: T.muted, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fa-solid fa-comments" style={{ color: T.green }}></i>
          <span>{post.comments.length} {post.comments.length === 1 ? 'comentario' : 'comentarios'}</span>
        </h3>

        {post.comments.length === 0 ? (
          <div style={{ 
            fontSize: 13, 
            color: T.faint, 
            padding: '24px', 
            textAlign: 'center',
            background: T.card,
            borderRadius: 16,
            border: '2px dashed rgba(255,255,255,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}>
            <i className="fa-regular fa-face-smile" style={{ fontSize: 16 }}></i>
            <span>¡Aún no hay comentarios! Sé el primero en escribir algo amigable.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {post.comments.map(c => (
              <div 
                key={c.id} 
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                  animation: 'kid-pop 0.3s ease',
                }}
              >
                <UserAvatar authorName={c.author} authorId={c.authorId} size={32} />
                <div style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: 16,
                  borderTopLeftRadius: 2,
                  padding: '12px 14px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, alignItems: 'center' }}>
                    <span 
                      onClick={() => { if (c.authorId) navigate(`/dashboard/perfil/${c.authorId}`) }} 
                      style={{ 
                        fontSize: 12, 
                        fontWeight: 700, 
                        cursor: c.authorId ? 'pointer' : 'default', 
                        color: T.green 
                      }}
                    >
                      {c.author}
                    </span>
                    <span className="mono" style={{ fontSize: 9, color: T.faint, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <i className="fa-regular fa-clock" style={{ fontSize: 8 }}></i>
                      <span>{timeAgo(c.date)}</span>
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: T.text, lineHeight: 1.5, margin: 0 }}>
                    {c.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add comment Form */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
        <input
          placeholder="Escribe un comentario amigable... ✍️"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && text.trim()) { addComment(post.id, text); setText('') } }}
          style={{
            flex: 1, 
            padding: '12px 16px', 
            fontSize: 13, 
            borderRadius: 16, 
            outline: 'none',
            background: 'rgba(255,255,255,0.03)', 
            border: '2px solid rgba(255,255,255,0.06)',
            color: T.text, 
            fontFamily: 'inherit',
          }}
          onFocus={e => e.currentTarget.style.borderColor = T.green}
          onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
        />
        <button 
          onClick={() => { if (text.trim()) { addComment(post.id, text); setText('') } }} 
          className="kid-button-3d"
          style={{
            padding: '11px 20px', 
            borderRadius: 16, 
            fontSize: 13, 
            background: T.green, 
            color: '#000000', 
            border: 'none', 
            borderBottom: `4px solid ${T.greenDim}`,
            fontWeight: 700,
            fontFamily: 'inherit', 
            opacity: text.trim() ? 1 : 0.4,
            cursor: text.trim() ? 'pointer' : 'not-allowed',
          }}
          disabled={!text.trim()}
        >
          <i className="fa-solid fa-paper-plane"></i> ¡Enviar!
        </button>
      </div>
    </div>
  )
}

export function PageForo() {
  const { posts, addPost } = useForum()
  const [showNew, setShowNew] = useState(false)
  const [selected, setSelected] = useState(null)

  const selectedPost = selected ? posts.find(p => p.id === selected) : null

  return (
    <>
      <style>{FS}</style>

      {showNew && (
        <NewPostModal
          onClose={() => setShowNew(false)}
          onSubmit={(t, c, img) => { addPost(t, c, img); setShowNew(false) }}
        />
      )}

      {selectedPost ? (
        <PostDetail post={selectedPost} onBack={() => setSelected(null)} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Kids colorful banner */}
          <div style={{
            borderRadius: 20, 
            padding: '24px',
            background: `linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)`,
            boxShadow: '0 6px 0px rgba(108, 92, 231, 0.2), 0 10px 20px rgba(0,0,0,0.15)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Animated floating doodles for the kids banner */}
            <div className="doodle" style={{ top: 10, left: '10%' }}>🌟</div>
            <div className="doodle" style={{ bottom: 15, left: '30%' }}>🎨</div>
            <div className="doodle" style={{ top: 15, right: '25%' }}>🚀</div>
            <div className="doodle" style={{ bottom: 10, right: '40%' }}>💬</div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 10, color: '#ffeaa7', fontWeight: 800, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                <i className="fa-solid fa-rainbow"></i>
                <span>COMUNIDAD INFANTIL</span>
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                ¡Foro de los Exploradores!
              </h1>
              <p style={{ fontSize: 12, color: '#f1f2f6', marginTop: 4, margin: '4px 0 0', fontWeight: 600 }}>
                {posts.length} temas activos · Comparte tus dudas
              </p>
            </div>

            <button 
              onClick={() => setShowNew(true)} 
              className="kid-button-3d"
              style={{
                padding: '10px 20px', 
                borderRadius: 16, 
                fontSize: 13, 
                background: '#ffd740', 
                color: '#000000', 
                border: 'none', 
                borderBottom: '4px solid #d8a000',
                fontWeight: 800,
                fontFamily: 'inherit', 
                whiteSpace: 'nowrap',
                position: 'relative',
                zIndex: 1,
                boxShadow: '0 4px 0 rgba(0,0,0,0.1)',
              }}
            >
              <i className="fa-solid fa-pen-to-square"></i> ¡Crear Tema!
            </button>
          </div>

          {/* Posts Feed */}
          {posts.length === 0 ? (
            <div style={{
              padding: '40px 20px', 
              borderRadius: 20, 
              textAlign: 'center',
              background: T.card, 
              border: '2px dashed rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}>
              <div style={{ fontSize: 44, animation: 'float-emoji 3s ease-in-out infinite' }}>🐼💤</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
                  ¡El foro está vacío!
                </div>
                <div style={{ fontSize: 12, color: T.muted }}>
                  ¡Sé el primero en iniciar una divertida conversación!
                </div>
              </div>
              <button
                onClick={() => setShowNew(true)}
                className="kid-button-3d"
                style={{
                  padding: '8px 16px',
                  borderRadius: 12,
                  fontSize: 12,
                  background: T.green,
                  color: '#000000',
                  border: 'none',
                  borderBottom: `3px solid ${T.greenDim}`,
                  fontWeight: 700,
                  marginTop: 6,
                }}
              >
                <i className="fa-solid fa-pen-to-square"></i> Crear Publicación
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {posts.map(p => (
                <PostCard key={p.id} post={p} onClick={() => setSelected(p.id)} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
