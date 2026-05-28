import { useState, useEffect } from 'react'
import { Firestore } from '../services/firestore'
import { NEWS, NEWS_CATEGORIES } from '../data/newsData'
import { T } from '../styles/tokens'
import { Icon } from '../components/ui/Icon'

const CATS = [
  { id: 'normas', label: 'Normas', color: '#448aff' },
  { id: 'seguridad', label: 'Seguridad', color: '#00e676' },
  { id: 'sanciones', label: 'Sanciones', color: '#ff5252' },
  { id: 'tips', label: 'Tips', color: '#ffd740' },
]

function normalize(n) {
  const cat = CATS.find(c => c.id === n.cat) || CATS[0]
  const ts = typeof n.date === 'number' ? n.date : Date.now()
  const body = n.body || ''
  return {
    ...n,
    id: n.id,
    tag: cat.label,
    color: cat.color,
    date: typeof n.date === 'string' ? n.date : new Date(ts).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
    readMin: n.readMin || Math.max(1, Math.round(body.split(/\s+/).length / 200)),
    emoji: n.emoji || '📰',
    summary: n.summary || (body.length > 120 ? body.slice(0, 120) + '...' : body),
  }
}

const S = {
  page: { display: 'flex', flexDirection: 'column', gap: 24 },
  header: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: '0.1em' },
  subtitle: { fontSize: 14, color: T.muted },
  filters: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 },
  card: (accent) => ({ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.15s, border-color 0.15s, box-shadow 0.15s' }),
  cardTop: (accent) => ({ height: 6, background: accent }),
  cardBody: { padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 },
  tagRow: { display: 'flex', alignItems: 'center', gap: 8 },
  tag: (accent) => ({ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: accent, background: `${accent}18`, padding: '3px 8px', borderRadius: 99 }),
  meta: { fontSize: 11, color: T.muted },
  cardTitle: { fontSize: 15, fontWeight: 700, color: T.text, lineHeight: 1.4 },
  cardSummary: { fontSize: 13, color: T.muted, lineHeight: 1.6 },
  readMore: (accent) => ({ fontSize: 12, fontWeight: 600, color: accent, marginTop: 4 }),
  overlay: { position: 'fixed', inset: 0, background: 'rgba(7,9,15,0.88)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
  modal: { background: T.surface, border: `1px solid ${T.border}`, borderRadius: 18, maxWidth: 640, width: '100%', maxHeight: '85vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' },
  modalBanner: (accent) => ({ height: 8, borderRadius: '18px 18px 0 0', background: accent }),
  modalContent: { padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 16 },
  modalClose: { alignSelf: 'flex-end', background: 'none', border: 'none', color: T.muted, fontSize: 22, cursor: 'pointer', lineHeight: 1, marginBottom: -8 },
  modalTag: (accent) => ({ display: 'inline-block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: accent, background: `${accent}18`, padding: '4px 10px', borderRadius: 99 }),
  modalTitle: { fontSize: 22, fontWeight: 800, color: T.text, lineHeight: 1.3 },
  modalMeta: { fontSize: 12, color: T.muted, display: 'flex', gap: 12, alignItems: 'center' },
  modalBody: { fontSize: 14, color: T.muted, lineHeight: 1.8, whiteSpace: 'pre-line' },
  divider: { height: 1, background: T.border, margin: '4px 0' },
}

function FilterBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600,
      border: `1px solid ${active ? T.green : T.border}`,
      background: active ? 'rgba(0,230,118,0.1)' : 'transparent',
      color: active ? T.green : T.muted, cursor: 'pointer', transition: 'all 0.15s',
    }}>{children}</button>
  )
}

function renderBody(text) {
  return text.split('\n').map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g)
    return (
      <p key={i} style={{ margin: 0 }}>
        {parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: T.text, fontWeight: 700 }}>{p}</strong> : p)}
      </p>
    )
  })
}

function NewsModal({ news, onClose }) {
  if (!news) return null
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.modalBanner(news.color)} />
        <div style={S.modalContent}>
          <button style={S.modalClose} onClick={onClose}><Icon icon="✕" size={22} /></button>
          <span style={S.modalTag(news.color)}>{news.tag}</span>
          <h2 style={S.modalTitle}>{news.emoji} {news.title}</h2>
          <div style={S.modalMeta}>
            <span><Icon icon="📅" size={12} /> {news.date}</span>
            <span>·</span>
            <span>⏱ {news.readMin} min de lectura</span>
          </div>
          <div style={S.divider} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...S.modalBody }}>
            {renderBody(news.body)}
          </div>
        </div>
      </div>
    </div>
  )
}

function NewsCard({ news, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div style={{
      ...S.card(news.color), transform: hov ? 'translateY(-3px)' : 'none',
      borderColor: hov ? `${news.color}40` : T.border,
      boxShadow: hov ? `0 8px 24px ${news.color}18` : 'none',
    }} onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={S.cardTop(news.color)} />
      <div style={S.cardBody}>
        <div style={S.tagRow}>
          <span style={S.tag(news.color)}>{news.tag}</span>
          <span style={S.meta}>{news.date} · {news.readMin} min</span>
        </div>
        <h3 style={S.cardTitle}>{news.emoji} {news.title}</h3>
        <p style={S.cardSummary}>{news.summary}</p>
        <span style={S.readMore(news.color)}>Leer artículo →</span>
      </div>
    </div>
  )
}

export function PageNoticias() {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [allNews, setAllNews] = useState([])

  useEffect(() => {
    Firestore.list('news').then(fb => {
      const firebaseNews = (fb || []).map(n => normalize(n))
      const staticNews = NEWS.map(n => normalize(n))
      const merged = [...firebaseNews, ...staticNews]
      const seen = new Set()
      const deduped = merged.filter(n => {
        const key = n.title?.toLowerCase().trim()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      setAllNews(deduped)
    }).catch(() => {
      setAllNews(NEWS.map(n => normalize(n)))
    })
  }, [])

  const filtered = filter === 'all' ? allNews : allNews.filter(n => n.cat === filter)

  return (
    <div style={S.page}>
      <div className="anim-fade" style={S.header}>
        <h2 style={S.label}><Icon icon="📰" size={13} /> Noticias Viales</h2>
        <p style={S.subtitle}>Mantente al día con las normas, sanciones y tips del tránsito en Colombia.</p>
      </div>
      <div className="anim-up" style={S.filters}>
        {NEWS_CATEGORIES.map(c => (
          <FilterBtn key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>{c.label}</FilterBtn>
        ))}
      </div>
      <p style={{ fontSize: 12, color: T.muted }}>{filtered.length} artículo{filtered.length !== 1 ? 's' : ''}</p>
      <div className="anim-up" style={S.grid}>
        {filtered.map(news => (
          <NewsCard key={news.id} news={news} onClick={() => setSelected(news)} />
        ))}
      </div>
      {selected && <NewsModal news={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
