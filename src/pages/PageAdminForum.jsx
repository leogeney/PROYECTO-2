import { useState, useEffect } from 'react'
import { Firestore } from '../services/firestore'
import { T } from '../styles/tokens'

function timeAgo(ts) {
  const diff = Date.now() - ts
  const d = Math.floor(diff / 86400000)
  if (d < 1) return 'hoy'
  if (d < 30) return `${d}d`
  return new Date(ts).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

export function PageAdminForum() {
  const [posts, setPosts] = useState([])
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    Firestore.list('forum_posts', 'date').then(setPosts).catch(() => {})
  }, [])

  const handleDelete = async (id) => {
    setDeleting(id)
    await Firestore.del('forum_posts', id).catch(() => {})
    setPosts(prev => prev.filter(p => p.id !== id))
    setDeleting(null)
  }

  const togglePin = async (post) => {
    const pinned = !post.pinned
    await Firestore.update('forum_posts', post.id, { pinned }).catch(() => {})
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, pinned } : p))
  }

  const sorted = [...posts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return (b.date || 0) - (a.date || 0)
  })

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <i className="fa-solid fa-comments" style={{ color: T.cyan }}></i> Foro
        </h1>
        <p style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{posts.length} publicaciones · {posts.filter(p => p.pinned).length} fijadas</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sorted.map(p => (
          <div key={p.id} style={{
            padding: '14px 16px', borderRadius: 12,
            background: T.card, border: p.pinned ? `1px solid ${T.green}44` : `1px solid ${T.border}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {p.pinned && <span style={{ fontSize: 10, fontWeight: 700, color: T.green }}>📌</span>}
                  {p.title}
                </div>
                <div style={{ fontSize: 11, color: T.muted, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{p.author}</span>
                  <span style={{ color: T.faint }}>·</span>
                  <span>{timeAgo(p.date)}</span>
                  {p.category && <><span style={{ color: T.faint }}>·</span><span>{p.category}</span></>}
                  <span style={{ color: T.faint }}>·</span>
                  <span>{p.comments?.length || 0} comentarios</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button onClick={() => togglePin(p)} title={p.pinned ? 'Desfijar' : 'Fijar'} style={{
                  background: 'none', border: `1px solid ${T.border}`, borderRadius: 6,
                  color: p.pinned ? T.green : T.faint, cursor: 'pointer', fontSize: 11, padding: '4px 8px',
                  fontFamily: 'inherit',
                }}>📌</button>
                <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{
                  background: `${T.red}11`, border: `1px solid ${T.red}33`, borderRadius: 6,
                  color: T.red, cursor: 'pointer', fontSize: 11, padding: '4px 10px',
                  fontFamily: 'inherit',
                }}>{deleting === p.id ? '...' : <><i className="fa-solid fa-trash-can"></i></>}</button>
              </div>
            </div>
            <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5, whiteSpace: 'pre-wrap', maxHeight: 60, overflow: 'hidden' }}>{p.content}</div>

            {p.comments?.length > 0 && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
                  Comentarios ({p.comments.length})
                </div>
                {p.comments.slice(0, 3).map(c => (
                  <div key={c.id} style={{ fontSize: 11, color: T.muted, padding: '4px 0', display: 'flex', gap: 6 }}>
                    <span style={{ fontWeight: 600, color: T.text, flexShrink: 0 }}>{c.author}:</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.text}</span>
                  </div>
                ))}
                {p.comments.length > 3 && <div style={{ fontSize: 10, color: T.faint, marginTop: 2 }}>+{p.comments.length - 3} más</div>}
              </div>
            )}
          </div>
        ))}
        {posts.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: T.faint, fontSize: 13 }}>Sin publicaciones en el foro</div>}
      </div>
    </div>
  )
}
