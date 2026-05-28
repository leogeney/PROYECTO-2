import { useState, useEffect } from 'react'
import { Firestore } from '../services/firestore'
import { T } from '../styles/tokens'

const CATS = [
  { id: 'normas', label: 'Normas', color: '#448aff' },
  { id: 'seguridad', label: 'Seguridad', color: '#00e676' },
  { id: 'sanciones', label: 'Sanciones', color: '#ff5252' },
  { id: 'tips', label: 'Tips', color: '#ffd740' },
]

function timeAgo(ts) {
  const diff = Date.now() - (typeof ts === 'number' ? ts : Date.parse(ts))
  const d = Math.floor(diff / 86400000)
  if (d < 1) return 'hoy'
  if (d < 30) return `${d}d`
  return new Date(ts).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

export function PageAdminNews() {
  const [news, setNews] = useState([])
  const [form, setForm] = useState({ title: '', summary: '', body: '', cat: 'normas', emoji: '📰' })
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    Firestore.list('news', 'date').then(setNews).catch(() => {})
  }, [])

  const handleSave = async () => {
    if (!form.title.trim()) return
    const data = { ...form, title: form.title.trim(), summary: form.summary.trim(), body: form.body.trim(), date: Date.now() }
    if (editing) {
      await Firestore.update('news', editing, data).catch(() => {})
    } else {
      await Firestore.add('news', data).catch(() => {})
    }
    setForm({ title: '', summary: '', body: '', cat: 'normas', emoji: '📰' })
    setEditing(null)
    setShowForm(false)
    Firestore.list('news', 'date').then(setNews).catch(() => {})
  }

  const handleDelete = async (id) => {
    await Firestore.del('news', id).catch(() => {})
    setNews(prev => prev.filter(n => n.id !== id))
  }

  const openEdit = (item) => {
    setForm({ title: item.title, summary: item.summary, body: item.body, cat: item.cat, emoji: item.emoji || '📰' })
    setEditing(item.id)
    setShowForm(true)
  }

  return (
    <div>
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-newspaper" style={{ color: T.blue }}></i> Noticias
          </h1>
          <p style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{news.length} publicadas</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', summary: '', body: '', cat: 'normas', emoji: '📰' }) }} style={{
          padding: '9px 16px', borderRadius: 8, background: T.green, color: '#000',
          border: 'none', fontSize: 12, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}><i className="fa-solid fa-plus"></i> Nueva noticia</button>
      </div>

      {showForm && (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: '0 0 14px' }}>{editing ? 'Editar' : 'Nueva'} noticia</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input placeholder="Título" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={inp} />
            <input placeholder="Resumen (una línea)" value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} style={inp} />
            <textarea placeholder="Cuerpo (usa **negrita**)" value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} rows={5} style={{ ...inp, resize: 'vertical' }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <select value={form.cat} onChange={e => setForm(p => ({ ...p, cat: e.target.value }))} style={{ ...inp, width: 'auto' }}>
                {CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <input placeholder="Emoji (📰)" value={form.emoji} onChange={e => setForm(p => ({ ...p, emoji: e.target.value }))} style={{ ...inp, width: 100 }} />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', borderRadius: 8, background: 'transparent', border: `1px solid ${T.border}`, color: T.muted, fontSize: 12, fontFamily: 'inherit', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleSave} style={{ padding: '8px 16px', borderRadius: 8, background: T.green, color: '#000', border: 'none', fontSize: 12, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>{editing ? 'Guardar' : 'Publicar'}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {news.map(n => {
          const cat = CATS.find(c => c.id === n.cat) || CATS[0]
          return (
            <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: T.card, border: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 20 }}>{n.emoji || '📰'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</div>
                <div style={{ fontSize: 11, color: T.muted }}>{timeAgo(n.date)}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: `${cat.color}18`, color: cat.color }}>{cat.label}</span>
              <button onClick={() => openEdit(n)} style={{ background: 'none', border: 'none', color: T.faint, cursor: 'pointer', fontSize: 13, padding: 4 }}><i className="fa-solid fa-pen"></i></button>
              <button onClick={() => handleDelete(n.id)} style={{ background: 'none', border: 'none', color: T.red, cursor: 'pointer', fontSize: 13, padding: 4 }}><i className="fa-solid fa-trash-can"></i></button>
            </div>
          )
        })}
        {news.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: T.faint, fontSize: 13 }}>Sin noticias aún</div>}
      </div>
    </div>
  )
}

const inp = {
  width: '100%', padding: '10px 12px', fontSize: 13, borderRadius: 8,
  background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`,
  color: T.text, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
}
