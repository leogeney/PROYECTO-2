import { useState } from 'react'
import { useForum } from '../context/ForumContext'
import { T } from '../styles/tokens'

const FS = `
@keyframes fo-slide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes fo-fade{from{opacity:0}to{opacity:1}}
.fo-card{transition:all 0.3s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden}
.fo-card:hover{transform:translateY(-2px)}
.fo-card:hover .fo-card-glow{opacity:1}
.fo-card-glow{position:absolute;inset:0;opacity:0;transition:opacity 0.3s;pointer-events:none}
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

function PostCard({ post, onClick }) {
  return (
    <div className="fo-card" onClick={onClick} style={{
      padding: '18px 20px', borderRadius: 14, cursor: 'pointer',
      background: T.card, border: '1px solid rgba(255,255,255,0.04)',
      animation: 'fo-slide 0.3s ease',
    }}>
      <div className="fo-card-glow" style={{ background: `radial-gradient(circle at 80% 20%, rgba(0,230,118,0.03), transparent 60%)` }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{
          fontSize: 15, fontWeight: 600, color: T.text,
          lineHeight: 1.3, flex: 1,
        }}>
          {post.title}
        </div>
        <div style={{
          fontSize: 10, color: T.faint, whiteSpace: 'nowrap', marginLeft: 12, marginTop: 2,
          fontFamily: "'Space Mono', monospace",
        }}>
          {timeAgo(post.date)}
        </div>
      </div>
      {post.img && (
        <div style={{ marginBottom: 10, borderRadius: 8, overflow: 'hidden', maxHeight: 120 }}>
          <img src={post.img} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
        </div>
      )}
      <p style={{
        fontSize: 12, color: T.muted, lineHeight: 1.5,
        marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {post.content}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: T.faint }}>
        <span>{post.author}</span>
        <span>·</span>
        <span>{post.comments.length} comentarios</span>
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

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      animation: 'fo-fade 0.2s ease',
    }}>
      <div style={{
        background: T.card, borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.06)',
        padding: '28px 24px', maxWidth: 480, width: '100%',
        animation: 'fo-slide 0.3s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: T.text, margin: 0 }}>
            Nuevo tema
          </h2>
          <div onClick={onClose} style={{ cursor: 'pointer', fontSize: 18, color: T.faint, lineHeight: 1 }}>✕</div>
        </div>
        <input
          placeholder="Título del tema"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{
            width: '100%', padding: '10px 14px', fontSize: 14, borderRadius: 10, outline: 'none',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: T.text, marginBottom: 14, fontFamily: 'inherit',
          }}
        />
        <textarea
          placeholder="Escribe tu publicación..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
          style={{
            width: '100%', padding: '10px 14px', fontSize: 13, borderRadius: 10, outline: 'none',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: T.text, resize: 'none', fontFamily: 'inherit', lineHeight: 1.5, marginBottom: 14,
          }}
        />
        {/* Image upload */}
        <div style={{ marginBottom: 18 }}>
          <input
            type="file"
            accept="image/*"
            id="fo-img-input"
            onChange={handleFile}
            style={{ display: 'none' }}
          />
          {img ? (
            <div style={{ position: 'relative', display: 'inline-block', borderRadius: 10, overflow: 'hidden' }}>
              <img src={img} alt="preview" style={{ height: 100, borderRadius: 10, display: 'block' }} />
              <div onClick={() => { setImg(''); setImgError('') }} style={{
                position: 'absolute', top: 4, right: 4,
                width: 22, height: 22, borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, cursor: 'pointer', lineHeight: 1,
              }}>✕</div>
            </div>
          ) : (
            <label htmlFor="fo-img-input" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 8, fontSize: 12,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: T.faint, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              + Imagen
            </label>
          )}
          {imgError && <div style={{ fontSize: 11, color: '#ff6b6b', marginTop: 6 }}>{imgError}</div>}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '9px 18px', borderRadius: 10, fontSize: 13, cursor: 'pointer',
            background: 'transparent', color: T.faint, border: '1px solid rgba(255,255,255,0.08)', fontWeight: 500,
          }}>Cancelar</button>
          <button onClick={() => { if (title.trim() && content.trim()) { onSubmit(title, content, img); setTitle(''); setContent(''); setImg('') } }} style={{
            padding: '9px 20px', borderRadius: 10, fontSize: 13, cursor: 'pointer',
            background: T.green, color: '#000', border: 'none', fontWeight: 700,
            opacity: title.trim() && content.trim() ? 1 : 0.4,
          }}>Publicar</button>
        </div>
      </div>
    </div>
  )
}

function PostDetail({ post, onBack }) {
  const { addComment, deletePost } = useForum()
  const [text, setText] = useState('')

  return (
    <div style={{ animation: 'fo-slide 0.3s ease' }}>
      <button onClick={onBack} style={{
        background: 'transparent', border: 'none', color: T.faint, cursor: 'pointer',
        fontSize: 13, fontWeight: 500, padding: 0, marginBottom: 16, fontFamily: 'inherit',
      }}>
        ← Volver al foro
      </button>

      <div style={{ padding: '20px 22px', borderRadius: 14, background: T.card, border: '1px solid rgba(255,255,255,0.04)', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: T.text, margin: 0, lineHeight: 1.3 }}>{post.title}</h2>
        </div>
        <div style={{ fontSize: 11, color: T.faint, marginBottom: 14 }}>
          {post.author} · <span className="mono">{timeAgo(post.date)}</span>
        </div>
        {post.img && (
          <div style={{ marginBottom: 14, borderRadius: 10, overflow: 'hidden' }}>
            <img src={post.img} alt="" style={{ width: '100%', maxHeight: 400, objectFit: 'contain', display: 'block', background: '#000' }} />
          </div>
        )}
        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {post.content}
        </p>
      </div>

      {/* Comments */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: T.faint, marginBottom: 12 }}>
          {post.comments.length} {post.comments.length === 1 ? 'comentario' : 'comentarios'}
        </h3>
        {post.comments.length === 0 ? (
          <div style={{ fontSize: 12, color: T.faint, padding: '16px 0', textAlign: 'center' }}>
            Sin comentarios aún. Sé el primero en responder.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {post.comments.map(c => (
              <div key={c.id} style={{
                padding: '12px 16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{c.author}</span>
                  <span className="mono" style={{ fontSize: 9, color: T.faint }}>{timeAgo(c.date)}</span>
                </div>
                <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5, margin: 0 }}>{c.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add comment */}
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          placeholder="Escribe un comentario..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && text.trim()) { addComment(post.id, text); setText('') } }}
          style={{
            flex: 1, padding: '10px 14px', fontSize: 13, borderRadius: 10, outline: 'none',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: T.text, fontFamily: 'inherit',
          }}
        />
        <button onClick={() => { if (text.trim()) { addComment(post.id, text); setText('') } }} style={{
          padding: '10px 18px', borderRadius: 10, fontSize: 13, cursor: 'pointer',
          background: T.green, color: '#000', border: 'none', fontWeight: 700,
          fontFamily: 'inherit', opacity: text.trim() ? 1 : 0.4,
        }}>Enviar</button>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Header */}
          <div style={{
            borderRadius: 14, padding: '22px 22px 18px',
            background: `linear-gradient(145deg, ${T.card}, #0d101a)`,
            border: '1px solid rgba(0,230,118,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 9, color: T.green, fontWeight: 600, letterSpacing: '.16em', textTransform: 'uppercase', marginBottom: 6 }}>
                Comunidad
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: T.text, margin: 0, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                Foro de discusión
              </h1>
              <p style={{ fontSize: 11, color: T.muted, marginTop: 4, margin: '4px 0 0' }}>
                {posts.length} temas · comparte y aprende
              </p>
            </div>
            <button onClick={() => setShowNew(true)} style={{
              padding: '9px 18px', borderRadius: 10, fontSize: 12, cursor: 'pointer',
              background: T.green, color: '#000', border: 'none', fontWeight: 700,
              fontFamily: 'inherit', whiteSpace: 'nowrap',
            }}>
              + Nuevo tema
            </button>
          </div>

          {/* Posts */}
          {posts.length === 0 ? (
            <div style={{
              padding: '32px 20px', borderRadius: 14, textAlign: 'center',
              background: T.card, border: '1px solid rgba(255,255,255,0.04)',
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>💬</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 4 }}>Aún no hay temas</div>
              <div style={{ fontSize: 12, color: T.faint }}>Sé el primero en iniciar una conversación.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
