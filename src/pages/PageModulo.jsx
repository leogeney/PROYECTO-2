import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { T } from '../styles/tokens'
import { useProgress } from '../context/ProgressContext'
import { Icon } from '../components/ui/Icon'
import { SIGNS_DB } from '../data/signsData'

const SIGN_BY_CODE = Object.fromEntries(SIGNS_DB.map(s => [s.code, s]))
const CAT_COLORS = { reglamentaria: '#ff5252', preventiva: '#ffd740', informativa: '#448aff', transitoria: '#ff9100' }
const CAT_LABELS = { reglamentaria: 'Reglamentaria', preventiva: 'Preventiva', informativa: 'Informativa', transitoria: 'Transitoria' }
const CAT_ICONS = { reglamentaria: '⛔', preventiva: '⚠️', informativa: 'ℹ️', transitoria: '🚧' }

// ═══════════════════════════════════════════════════════════════════
// SEÑALES VIALES — Estrategia multi-fuente con fallback robusto
//
// Fuente 1: Wikimedia Commons (SVG oficial Colombia — dominio público)
// Fuente 2: Wikipedia thumbnails API (PNG renderizado, más confiable)
// Fuente 3: Emoji SVG inline generado (siempre disponible)
//
// El sistema intenta Fuente 1 → Fuente 2 → Fuente 3 automáticamente.
// ═══════════════════════════════════════════════════════════════════

// Helper: convierte nombre de archivo Wikimedia en URL de thumbnail PNG
// (mucho más confiable que Special:FilePath para SVGs externos)
const WK_SVG  = (file) => `https://commons.wikimedia.org/wiki/Special:FilePath/${file}`
const WK_THUMB = (file, px = 200) =>
  `https://commons.wikimedia.org/w/index.php?title=Special:FilePath/${file}&width=${px}`

// Catálogo de señales: [svgUrl, thumbUrl, emoji]
// Siempre se define thumbUrl como backup del SVG
const SIGNS = {
  // ── Reglamentarias ──────────────────────────────────────────────
  PARE:         [WK_SVG('Colombia_road_sign_SR-01.svg'),  WK_THUMB('Colombia_road_sign_SR-01.svg'),  '🛑'],
  CEDA:         [WK_SVG('Colombia_road_sign_SR-02.svg'),  WK_THUMB('Colombia_road_sign_SR-02.svg'),  '🔺'],
  NO_ENTRE:     [WK_SVG('Colombia_road_sign_SR-04.svg'),  WK_THUMB('Colombia_road_sign_SR-04.svg'),  '⛔'],
  NO_GIRO_IZQ:  [WK_SVG('Colombia_road_sign_SR-07.svg'),  WK_THUMB('Colombia_road_sign_SR-07.svg'),  '↩️'],
  NO_GIRO_DER:  [WK_SVG('Colombia_road_sign_SR-08.svg'),  WK_THUMB('Colombia_road_sign_SR-08.svg'),  '↪️'],
  NO_ADELANTAR: [WK_SVG('Colombia_road_sign_SR-26.svg'),  WK_THUMB('Colombia_road_sign_SR-26.svg'),  '🚘'],
  VEL_30:       [WK_SVG('Colombia_road_sign_SR-30.svg'),  WK_THUMB('Colombia_road_sign_SR-30.svg'),  '🔢'],
  VEL_50:       [WK_SVG('Colombia_road_sign_SR-30A.svg'), WK_THUMB('Colombia_road_sign_SR-30A.svg'), '5️⃣'],
  VEL_60:       [WK_SVG('Colombia_road_sign_SR-30B.svg'), WK_THUMB('Colombia_road_sign_SR-30B.svg'), '🔢'],
  VEL_80:       [WK_SVG('Colombia_road_sign_SR-30C.svg'), WK_THUMB('Colombia_road_sign_SR-30C.svg'), '🔢'],
  ZONA_AMARILLA:[WK_SVG('Colombia_road_sign_SR-38.svg'),  WK_THUMB('Colombia_road_sign_SR-38.svg'),  '🟡'],
  UN_SENTIDO:   [WK_SVG('Colombia_road_sign_SR-17.svg'),  WK_THUMB('Colombia_road_sign_SR-17.svg'),  '➡️'],
  // ── Preventivas ─────────────────────────────────────────────────
  CURVA_IZQ:   [WK_SVG('Colombia_road_sign_SP-01.svg'),  WK_THUMB('Colombia_road_sign_SP-01.svg'),  '〽️'],
  CURVA_DER:   [WK_SVG('Colombia_road_sign_SP-02.svg'),  WK_THUMB('Colombia_road_sign_SP-02.svg'),  '↗️'],
  CRUCE:       [WK_SVG('Colombia_road_sign_SP-11.svg'),  WK_THUMB('Colombia_road_sign_SP-11.svg'),  '✛'],
  SEMAFORO_PRE:[WK_SVG('Colombia_road_sign_SP-23.svg'),  WK_THUMB('Colombia_road_sign_SP-23.svg'),  '🚦'],
  ESCOLAR:     [WK_SVG('Colombia_road_sign_SP-47.svg'),  WK_THUMB('Colombia_road_sign_SP-47.svg'),  '🚸'],
  PEATONES:    [WK_SVG('Colombia_road_sign_SP-46A.svg'), WK_THUMB('Colombia_road_sign_SP-46A.svg'), '🚶'],
  ANIMALES:    [WK_SVG('Colombia_road_sign_SP-49.svg'),  WK_THUMB('Colombia_road_sign_SP-49.svg'),  '🦌'],
  OBRAS:       [WK_SVG('Colombia_road_sign_SP-43.svg'),  WK_THUMB('Colombia_road_sign_SP-43.svg'),  '🚧'],
  PENDIENTE:   [WK_SVG('Colombia_road_sign_SP-27.svg'),  WK_THUMB('Colombia_road_sign_SP-27.svg'),  '⛰️'],
  HUMEDA:      [WK_SVG('Colombia_road_sign_SP-44.svg'),  WK_THUMB('Colombia_road_sign_SP-44.svg'),  '🌧️'],
  INTERSECCION:[WK_SVG('Colombia_road_sign_SP-11.svg'),  WK_THUMB('Colombia_road_sign_SP-11.svg'),  '✛'],
  // ── Informativas / auxiliares ───────────────────────────────────
  SEMAFORO_INFO:[WK_SVG('Colombia_road_sign_SI-09.svg'),  WK_THUMB('Colombia_road_sign_SI-09.svg'), '🚦'],
  PASO_PEATONAL:[WK_SVG('Colombia_road_sign_SP-46A.svg'), WK_THUMB('Colombia_road_sign_SP-46A.svg'),'🦺'],
}

// Alias: SR[key] devuelve [svg, thumb, emoji] igual que SIGNS
const SR = SIGNS

// ─── Imagen con fallback multi-nivel ──────────────────────────────
// srcs: array de URLs [svg, thumb] — intenta en orden hasta que una carga
// emoji: string — último recurso siempre disponible
function SignImage({ srcs = [], emoji = '🔲', size = 80, style: extraStyle = {} }) {
  const [idx, setIdx] = useState(0)
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Resetear cuando cambien los sources
  useEffect(() => { setIdx(0); setFailed(false); setLoaded(false) }, [srcs?.[0]])

  const validSrcs = (srcs || []).filter(Boolean)

  if (failed || validSrcs.length === 0) {
    return (
      <span style={{
        lineHeight: 1, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        width: size, height: size, userSelect: 'none', ...extraStyle,
      }}><Icon icon={emoji} size={size * 0.55} /></span>
    )
  }

  return (
    <>
      {!loaded && (
        <span style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: size, height: size,           opacity: 0.25,
          position: 'absolute',
        }}><Icon icon={emoji} size={size * 0.5} /></span>
      )}
      <img
        key={validSrcs[idx]}
        src={validSrcs[idx]}
        alt={emoji}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (idx + 1 < validSrcs.length) {
            setIdx(i => i + 1)
          } else {
            setFailed(true)
          }
        }}
        style={{
          width: size, height: size, objectFit: 'contain',
          imageRendering: 'crisp-edges',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.25s ease',
          ...extraStyle,
        }}
      />
    </>
  )
}

// Wrapper con position relative para el placeholder del emoji
function SignContainer({ srcs, emoji, size = 80, style: extraStyle = {} }) {
  return (
    <div style={{ width: size, height: size, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center', ...extraStyle }}>
      <SignImage srcs={srcs} emoji={emoji} size={size} />
    </div>
  )
}

// ─── Sign Detail Modal ───────────────────────────────────────────
function SignDetailModal({ sign, onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!sign) return null

  // Look up extra info from SIGNS_DB by code
  const code = sign.code || ''
  const db = code ? SIGN_BY_CODE[code] : null
  const cat = db?.cat || ''
  const catColor = CAT_COLORS[cat] || sign.typeColor || sign.color || T.faint
  const catLabel = CAT_LABELS[cat] || sign.type || sign.tag || ''
  const catIcon = CAT_ICONS[cat] || '📋'
  const name = sign.name || sign.title || db?.name || ''
  const desc = sign.meaning || sign.desc || db?.desc || ''
  const detail = sign.detail || db?.detail || ''
  const tip = sign.tip || ''
  const law = sign.law || ''
  const rule = sign.rule || ''
  const example = sign.example || ''
  const hasExtended = detail || tip || law || rule || example

  const srcs = sign.sign || (sign.srcs ? sign.srcs : null)
  const firstSrc = Array.isArray(srcs) ? srcs[0] : (db?.img || null)

  return (
    <div
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:9999,
        background:'rgba(0,0,0,0.8)',
        display:'flex', alignItems:'center', justifyContent:'center',
        backdropFilter:'blur(12px)',
        animation:'fadeInUp 0.2s ease',
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{
        background:'linear-gradient(160deg, #1a1a24, #14141c)',
        borderRadius:24, maxWidth:520, width:'92%',
        border:`1px solid ${catColor}22`,
        boxShadow:`0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px ${catColor}0a`,
        overflow:'hidden', animation:'lq-scaleUp 0.25s ease',
        position:'relative',
      }}>
        {/* Decorative glow */}
        <div style={{
          position:'absolute', top:-80, left:'50%', transform:'translateX(-50%)',
          width:200, height:200, borderRadius:'50%',
          background:`radial-gradient(circle, ${catColor}18, transparent 70%)`,
          pointerEvents:'none',
        }} />

        {/* Image area */}
        <div style={{
          height:240, display:'flex', alignItems:'center', justifyContent:'center',
          background:`linear-gradient(160deg, ${catColor}10, rgba(255,255,255,0.02) 60%)`,
          position:'relative', borderBottom:`1px solid ${catColor}15`,
        }}>
          {firstSrc ? (
            <>
              <div style={{
                position:'absolute', width:180, height:180, borderRadius:'50%',
                background:`radial-gradient(circle, ${catColor}0c, transparent 70%)`,
              }} />
              <img
                src={firstSrc}
                alt={name}
                style={{
                  height:170, width:170, objectFit:'contain',
                  filter:`drop-shadow(0 8px 32px rgba(0,0,0,0.5))`,
                  position:'relative',
                }}
                onError={e => {
                  if (Array.isArray(srcs) && srcs[1]) { e.target.src = srcs[1]; e.target.onError = null }
                  else { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }
                }}
              />
            </>
          ) : (
            <div style={{
              width:120, height:120, borderRadius:24,
              background:`${catColor}18`, border:`1px solid ${catColor}30`,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Icon icon={sign.emoji || '🚦'} size={56} />
            </div>
          )}

          {/* Code badge */}
          {code && (
            <span style={{
              position:'absolute', bottom:12, right:16,
              padding:'3px 10px', borderRadius:99,
              background:'rgba(0,0,0,0.4)',
              border:`1px solid ${catColor}25`,
              fontSize:10, fontWeight:700, fontFamily:"'Space Mono',monospace",
              color:'rgba(255,255,255,0.5)', letterSpacing:'0.05em',
            }}>
              {code}
            </span>
          )}

          <button onClick={onClose} style={{
            position:'absolute', top:12, right:12, width:34, height:34,
            borderRadius:'50%', border:`1px solid rgba(255,255,255,0.1)`,
            background:'rgba(0,0,0,0.4)', backdropFilter:'blur(4px)',
            color:'rgba(255,255,255,0.7)', fontSize:16, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            lineHeight:1, transition:'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
          >✕</button>
        </div>

        {/* Info */}
        <div style={{ padding:'22px 24px 26px' }}>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:16 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, flexWrap:'wrap' }}>
                <h2 style={{ fontSize:20, fontWeight:700, color:T.text, margin:0, lineHeight:1.2, letterSpacing:'-0.02em' }}>
                  {name}
                </h2>
                {catLabel && (
                  <span style={{
                    padding:'3px 9px', borderRadius:99, fontSize:9, fontWeight:700,
                    background:`${catColor}15`, border:`1px solid ${catColor}28`,
                    color:catColor, textTransform:'uppercase', letterSpacing:'0.06em',
                    fontFamily:"'Space Mono',monospace", whiteSpace:'nowrap',
                  }}>
                    {catIcon} {catLabel}
                  </span>
                )}
              </div>
              {desc && (
                <p style={{ fontSize:14, color:'rgba(215,225,240,0.85)', lineHeight:1.7, margin:0 }}>
                  {desc}
                </p>
              )}
            </div>
          </div>

          {/* Extended info blocks */}
          {hasExtended && (
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:6 }}>
              {detail && (
                <div style={{
                  padding:'14px 16px', borderRadius:12,
                  background:`${catColor}08`, border:`1px solid ${catColor}16`,
                }}>
                  <div style={{ fontSize:10, fontWeight:700, color:catColor, textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'Space Mono',monospace", marginBottom:6 }}>
                    <Icon icon="📖" size={10} /> Detalle
                  </div>
                  <p style={{ fontSize:13, color:'rgba(215,225,240,0.82)', lineHeight:1.7, margin:0 }}>{detail}</p>
                </div>
              )}
              {tip && (
                <div style={{
                  padding:'14px 16px', borderRadius:12,
                  background:'rgba(251,191,36,0.07)', border:'1px solid rgba(251,191,36,0.18)',
                }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'rgba(251,191,36,0.9)', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'Space Mono',monospace", marginBottom:6 }}>
                    <Icon icon="💡" size={10} /> Consejo
                  </div>
                  <p style={{ fontSize:13, color:'rgba(215,225,240,0.82)', lineHeight:1.7, margin:0 }}>{tip}</p>
                </div>
              )}
              {rule && (
                <div style={{
                  padding:'14px 16px', borderRadius:12,
                  background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
                }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'Space Mono',monospace", marginBottom:6 }}>
                    <Icon icon="📋" size={10} /> Normativa
                  </div>
                  <p style={{ fontSize:13, color:'rgba(215,225,240,0.7)', lineHeight:1.7, margin:0 }}>{rule}</p>
                </div>
              )}
              {law && (
                <div style={{
                  padding:'12px 16px', borderRadius:12,
                  background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)',
                }}>
                  <p style={{ fontSize:12, color:'rgba(215,225,240,0.45)', lineHeight:1.6, margin:0, fontStyle:'italic' }}>
                    <Icon icon="⚖️" size={10} /> {law}
                  </p>
                </div>
              )}
              {example && (
                <div style={{
                  padding:'14px 16px', borderRadius:12,
                  background:'rgba(52,211,153,0.06)', border:'1px solid rgba(52,211,153,0.18)',
                }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'#34d399', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'Space Mono',monospace", marginBottom:6 }}>
                    <Icon icon="🎯" size={10} /> Ejemplo práctico
                  </div>
                  <p style={{ fontSize:13, color:'rgba(215,225,240,0.82)', lineHeight:1.7, margin:0 }}>{example}</p>
                </div>
              )}
            </div>
          )}

          {/* Fallback when no extended info */}
          {!hasExtended && !desc && (
            <p style={{ fontSize:13, color:T.muted, textAlign:'center', padding:'12px 0' }}>
              Toca "Entendido, siguiente" para continuar la lección.
            </p>
          )}

          {/* Close CTA */}
          <button onClick={onClose} style={{
            width:'100%', marginTop:18, padding:'12px', borderRadius:12,
            border:`1px solid ${catColor}30`,
            background:`${catColor}0C`,
            color:catColor, fontWeight:600, fontSize:13,
            cursor:'pointer', transition:'all 0.15s', letterSpacing:'0.01em',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = `${catColor}18`; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = `${catColor}0C`; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Fondos de módulo (Unsplash URLs fijas) ───────────────────────
const BG_IMAGES = {
  1: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1200&q=80',
  2: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
  3: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80',
  4: 'https://images.unsplash.com/photo-1519003300449-424ad0405076?w=1200&q=80',
}

// ─── Confetti ─────────────────────────────────────────────────────
function Confetti({ active }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const shapes = ['rect','circle','star','triangle']
    const colors = ['#a78bfa','#34d399','#fbbf24','#f87171','#60a5fa','#fb7185','#f97316','#22d3ee']
    const particles = Array.from({ length: 280 }, () => ({
      x: Math.random() * canvas.width, y: -20 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 8, vy: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 3, spin: Math.random() * 0.3 - 0.15, angle: 0,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      opacity: 1,
    }))
    const sparks = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height * 0.5,
      vx: (Math.random() - 0.5) * 2, vy: -Math.random() * 3 - 1,
      life: 1, color: '#ffffff',
    }))
    let frame
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.angle += p.spin; p.vy += 0.05
        p.opacity = Math.max(0, 1 - p.y / (canvas.height * 0.9))
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle)
        ctx.globalAlpha = p.opacity * 0.9
        ctx.fillStyle = p.color
        if (p.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, p.size/2, 0, Math.PI*2); ctx.fill() }
        else if (p.shape === 'star') { drawStar(ctx, 0, 0, 5, p.size/2, p.size/4); ctx.fill() }
        else if (p.shape === 'triangle') { ctx.beginPath(); ctx.moveTo(0, -p.size/2); ctx.lineTo(p.size/2, p.size/2); ctx.lineTo(-p.size/2, p.size/2); ctx.closePath(); ctx.fill() }
        else { ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size) }
        ctx.restore()
      })
      sparks.forEach(s => {
        s.x += s.vx; s.y += s.vy; s.life -= 0.008
        ctx.globalAlpha = Math.max(0, s.life)
        ctx.fillStyle = s.color
        ctx.beginPath(); ctx.arc(s.x, s.y, 1.5, 0, Math.PI*2); ctx.fill()
      })
      frame = requestAnimationFrame(draw)
    }
    function drawStar(ctx, cx, cy, points, outer, inner) {
      ctx.beginPath()
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outer : inner
        const a = (i * Math.PI) / points - Math.PI / 2
        i === 0 ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a)) : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
      }
      ctx.closePath()
    }
    draw()
    const t = setTimeout(() => cancelAnimationFrame(frame), 3500)
    return () => { cancelAnimationFrame(frame); clearTimeout(t) }
  }, [active])
  if (!active) return null
  return <canvas ref={canvasRef} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:9999 }} />
}

function XPFloat({ visible }) {
  if (!visible) return null
  return (
    <div style={{
      position:'fixed', top:'45%', left:'50%',
      transform:'translate(-50%,-50%)',
      zIndex:9998, pointerEvents:'none',
      animation:'xpFloat 2s cubic-bezier(0.22,1,0.36,1) forwards',
      textAlign:'center',
    }}>
      <div style={{
        position:'relative', padding:'32px 48px', borderRadius:24,
        background:'rgba(10,10,14,0.85)', border:'2px solid rgba(251,191,36,0.4)',
        boxShadow:'0 0 80px rgba(251,191,36,0.25), inset 0 0 60px rgba(251,191,36,0.06)',
        backdropFilter:'blur(12px)',
      }}>
        <div style={{
          position:'absolute', inset:-2, borderRadius:24,
          background:'linear-gradient(135deg, #fbbf24, #f59e0b, #fbbf24)',
          zIndex:-1, opacity:0.3,
        }} />
        <div style={{
          fontSize:48, fontWeight:900, letterSpacing:'-0.03em',
          background:'linear-gradient(135deg,#fbbf24,#f59e0b)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          filter:'drop-shadow(0 4px 24px rgba(251,191,36,0.6))',
          marginBottom:8,
        }}>Completado</div>
        <div style={{
          display:'inline-block', padding:'8px 20px', borderRadius:10,
          background:'rgba(251,191,36,0.15)', border:'1px solid rgba(251,191,36,0.25)',
          fontSize:22, fontWeight:700, color:'#fbbf24',
          fontFamily:"'Space Mono', monospace",
        }}>+XP GANADO</div>
      </div>
    </div>
  )
}

const DIFF_COLOR = { fácil:'#34d399', medio:'#fbbf24', difícil:'#f87171' }
const TYPE_LABELS = {
  explainer:'Explainer', explorer:'Explorador',
  interactive_demo:'Demo interactivo', story:'Historia',
  concept_map:'Mapa conceptual', step_guide:'Guia paso a paso',
}

function Pill({ label, color, size = 'sm' }) {
  const fs = size === 'xs' ? 9 : 10
  const px = size === 'xs' ? 7 : 9
  const py = size === 'xs' ? 2 : 3
  return (
    <span style={{
      display:'inline-block', padding:`${py}px ${px}px`,
      borderRadius:99, background:`${color}18`, border:`1px solid ${color}30`,
      fontSize:fs, fontWeight:700, color, letterSpacing:'0.07em',
      textTransform:'uppercase', fontFamily:"'Space Mono',monospace", lineHeight:1,
    }}>{label}</span>
  )
}

function PrimaryButton({ onClick, label, color, disabled }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width:'100%', padding:'15px 22px', borderRadius:14, border:'none',
        background: disabled ? 'rgba(255,255,255,0.07)' : color,
        color: disabled ? 'rgba(255,255,255,0.25)' : '#0a0a0a',
        fontWeight:700, fontSize:14, cursor:disabled?'default':'pointer',
        transition:'all 0.2s', letterSpacing:'0.01em',
        transform: !disabled && h ? 'translateY(-2px)' : 'none',
        boxShadow: !disabled && h ? `0 10px 32px ${color}45` : 'none',
        animation: !disabled && h ? 'cardGlow 1.5s ease-in-out infinite' : 'none',
      }}>{label}</button>
  )
}

function StepDots({ total, current, color }) {
  return (
    <div style={{ display:'flex', gap:5, marginBottom:26 }}>
      {Array.from({length:total}).map((_,i) => (
        <div key={i} style={{
          flex:1, height:3, borderRadius:99,
          background: i<current ? color : i===current ? `${color}55` : 'rgba(255,255,255,0.07)',
          transition:'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        }} />
      ))}
    </div>
  )
}

function InfoBlock({ type, text, color }) {
  const styles = {
    tip:    { bg:'rgba(251,191,36,0.07)',  border:'1px solid rgba(251,191,36,0.18)',  tc:'rgba(251,191,36,0.9)',  icon:'TIP' },
    detail: { bg:`${color}0C`,             border:`1px solid ${color}20`,             tc:color,                   icon:'INFO' },
    law:    { bg:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', tc:'rgba(255,255,255,0.4)', icon:'LEY' },
    warn:   { bg:'rgba(251,146,60,0.07)',  border:'1px solid rgba(251,146,60,0.2)',   tc:'#fb923c',               icon:'ALERTA' },
    good:   { bg:'rgba(52,211,153,0.06)',  border:'1px solid rgba(52,211,153,0.2)',   tc:'#34d399',               icon:'OK' },
  }
  const s = styles[type] || styles.law
  return (
    <div style={{
      marginTop:12, padding:'13px 16px', borderRadius:12,
      background:s.bg, border:s.border,
      fontSize:13, color:'rgba(220,228,240,0.85)', lineHeight:1.75,
    }}>
      <span style={{ marginRight:6 }}><Icon icon={s.icon} size={10} color={s.tc} /></span>
      {text}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TIPO A: EXPLAINER
// ═══════════════════════════════════════════════════════════════════
function ExplainerLesson({ steps, color, onComplete, onShowSign }) {
  const [idx, setIdx] = useState(0)
  const [vis, setVis] = useState(true)
  const xpTotal = steps.length * 15
  const step = steps[idx]
  const isLast = idx === steps.length - 1

  const goNext = () => {
    if (isLast) { onComplete(xpTotal); return }
    setVis(false)
    setTimeout(() => { setIdx(i=>i+1); setVis(true) }, 220)
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, opacity:vis?1:0, transition:'opacity 0.25s' }}>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <StepDots total={steps.length} current={idx} color={color} />
        <div style={{
          flex:1, borderRadius:20,
          background:`linear-gradient(145deg, rgba(255,255,255,0.03), ${color}0E)`,
          border:`1px solid ${color}22`,
          display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', gap:18, textAlign:'center',
          padding:'40px 28px', minHeight:260, position:'relative', overflow:'hidden',
        }}>
          <div style={{
            position:'absolute', bottom:-40, left:'50%', transform:'translateX(-50%)',
            width:220, height:220, borderRadius:'50%',
            background:`radial-gradient(circle, ${color}14, transparent 68%)`,
            pointerEvents:'none',
          }} />
          {/* Señal real de Colombia — tappable */}
          <div
            onClick={() => onShowSign?.({
              ...step, sign: step.sign, emoji: step.visual,
              title: step.title, color, code: step.code || '',
            })}
            style={{
              position:'relative', display:'flex', alignItems:'center', justifyContent:'center',
              cursor: step.sign ? 'pointer' : 'default',
              transition:'all 0.25s cubic-bezier(.16,1,.3,1)',
            }}
            onMouseEnter={e => {
              if (step.sign) {
                e.currentTarget.style.transform = 'scale(1.06)'
                e.currentTarget.style.filter = `drop-shadow(0 0 30px ${color}50)`
              }
            }}
            onMouseLeave={e => {
              if (step.sign) {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.filter = 'none'
              }
            }}
          >
            <div style={{
              borderRadius:24, padding:16,
              background:`linear-gradient(160deg, ${color}10, rgba(255,255,255,0.02))`,
              border:`1px solid ${color}20`,
              boxShadow:`0 8px 32px ${color}0a`,
              transition:'all 0.25s',
            }}>
              {step.sign ? (
                <SignContainer
                  srcs={step.sign}
                  emoji={step.visual}
                  size={130}
                  style={{ filter:`drop-shadow(0 0 24px ${color}40)` }}
                />
              ) : (
                <div style={{ filter:`drop-shadow(0 0 28px ${color}60)` }}>
                  <Icon icon={step.visual} size={80} />
                </div>
              )}
            </div>
            {step.sign && (
              <div style={{
                position:'absolute', bottom:6, right:6,
                padding:'4px 10px', borderRadius:99,
                background:`linear-gradient(135deg, ${color}, ${color}cc)`,
                color:'#000', border:'none',
                fontFamily:"'Space Mono',monospace", fontWeight:700,
                fontSize:9, letterSpacing:'0.04em',
                boxShadow:`0 2px 8px ${color}40`,
              }}>
                + info
              </div>
            )}
          </div>
          {step.tag && <Pill label={step.tag} color={color} />}
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.25)', fontFamily:"'Space Mono',monospace" }}>
            {idx+1} / {steps.length}
          </div>
        </div>
        <div style={{
          padding:'14px 16px', borderRadius:14,
          background:'rgba(255,215,64,0.06)', border:'1px solid rgba(255,215,64,0.14)',
          display:'flex', alignItems:'center', gap:10,
        }}>
          <span style={{ fontSize:11, fontWeight:700, color:'#fbbf24', background:'rgba(251,191,36,0.15)', padding:'4px 8px', borderRadius:6, fontFamily:"'Space Mono',monospace" }}>XP</span>
          <div>
            <div style={{ fontSize:11, color:'rgba(255,215,64,0.5)', fontFamily:"'Space Mono',monospace", letterSpacing:'0.06em' }}>AL COMPLETAR</div>
            <div style={{ fontSize:18, fontWeight:700, color:'#fbbf24', fontFamily:"'Space Mono',monospace" }}>+{xpTotal} XP</div>
          </div>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{
          flex:1, padding:'26px 24px', borderRadius:20,
          background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)',
        }}>
          <h2 style={{ fontSize:18, fontWeight:700, color:T.text, marginBottom:14, lineHeight:1.4, letterSpacing:'-0.01em' }}>{step.title}</h2>
          <p style={{ fontSize:14, color:'rgba(215,225,240,0.82)', lineHeight:1.9 }}>{step.body}</p>
          {step.detail && <InfoBlock type="detail" text={step.detail} color={color} />}
          {step.tip    && <InfoBlock type="tip"    text={step.tip}    color={color} />}
          {step.law    && <InfoBlock type="law"    text={step.law}    color={color} />}
        </div>
        <PrimaryButton onClick={goNext} label={isLast ? <><Icon icon="✓" size={11} color="#0a0a0a" /> ¡Lección completada!</> : <>Entendido, siguiente →</>} color={color} />
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TIPO B: EXPLORER
// ═══════════════════════════════════════════════════════════════════
function ExplorerLesson({ items, color, intro, onComplete, onShowSign }) {
  const [active, setActive] = useState(null)
  const [seen, setSeen] = useState(new Set())

  const handleTap = (item) => {
    setActive(active?.id === item.id ? null : item)
    setSeen(s => new Set([...s, item.id]))
  }
  const allSeen = seen.size === items.length
  const xp = Math.round((seen.size / items.length) * 80) + 20

  return (
    <div>
      {intro && (
        <div style={{
          padding:'16px 20px', borderRadius:16, marginBottom:20,
          background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)',
          display:'flex', alignItems:'center', gap:14,
        }}>
          <div style={{
            width:42, height:42, borderRadius:12, background:`${color}14`,
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5">
              <path d="M10 18c-4 0-6-1.5-6-5V6a2 2 0 0 1 4 0v1a2 2 0 0 1 4 0v1a2 2 0 0 1 4 0v6c0 3.5-2 5-6 5z"/>
              <path d="M8 12V7"/><path d="M12 12V7"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:600, color:T.text, marginBottom:3 }}>{intro.title}</div>
            <div style={{ fontSize:12, color:T.muted }}>{intro.subtitle}</div>
          </div>
          <div style={{ marginLeft:'auto', textAlign:'right' }}>
            <div style={{ fontSize:20, fontWeight:700, color, fontFamily:"'Space Mono',monospace" }}>{seen.size}/{items.length}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', textTransform:'uppercase', letterSpacing:'0.06em' }}>vistas</div>
          </div>
        </div>
      )}

      <div style={{ height:3, background:'rgba(255,255,255,0.06)', borderRadius:99, marginBottom:20, overflow:'hidden' }}>
        <div style={{ height:'100%', background:color, borderRadius:99, width:`${(seen.size/items.length)*100}%`, transition:'width 0.5s cubic-bezier(0.34,1.56,0.64,1)' }} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(120px,1fr))', gap:10, marginBottom:16 }}>
        {items.map(item => {
          const isActive = active?.id === item.id
          const wasSeen = seen.has(item.id)
          return (
            <button key={item.id} onClick={() => handleTap(item)} style={{
              borderRadius:16, border:`1px solid ${isActive?color:wasSeen?`${color}35`:'rgba(255,255,255,0.07)'}`,
              background:isActive?`${color}12`:wasSeen?`${color}05`:'rgba(255,255,255,0.02)',
              padding:'16px 10px', cursor:'pointer', display:'flex', flexDirection:'column',
              alignItems:'center', gap:10, transition:'all 0.25s',
              transform:isActive?'scale(1.06) translateY(-2px)':'scale(1)',
              boxShadow:isActive?`0 12px 32px ${color}28`:'none',
            }}>
              <div style={{
                width:72, height:72, display:'flex', alignItems:'center', justifyContent:'center',
                borderRadius:12,
                background: isActive ? `${color}15` : 'rgba(255,255,255,0.04)',
                padding:6, position:'relative',
              }}>
                <SignContainer
                  srcs={item.sign}
                  emoji={item.emoji}
                  size={60}
                  style={isActive ? { filter:`drop-shadow(0 0 10px ${color}80)` } : {}}
                />
              </div>
              <div style={{ fontSize:11, fontWeight:600, textAlign:'center', lineHeight:1.3, color:isActive?color:wasSeen?T.text:T.muted }}>
                {item.name}
              </div>
              {wasSeen && (
                <div style={{ width:18, height:18, borderRadius:'50%', background:`${color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color }}>✓</div>
              )}
            </button>
          )
        })}
      </div>

      {active && (
        <div style={{
          borderRadius:20, border:`1px solid ${color}30`,
          background:`linear-gradient(135deg, rgba(255,255,255,0.03), ${color}09)`,
          padding:'24px 26px', marginBottom:16, animation:'fadeInUp 0.3s ease',
          display:'grid', gridTemplateColumns:'100px 1fr', gap:24, alignItems:'flex-start',
        }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
            <div
              onClick={() => onShowSign?.({
                ...active, sign: active.sign, emoji: active.emoji,
                title: active.name, color, code: active.code || '',
              })}
              style={{
                width:110, height:110, borderRadius:20,
                background:`linear-gradient(160deg, ${color}12, rgba(255,255,255,0.02))`,
                border:`1px solid ${color}28`,
                display:'flex', alignItems:'center', justifyContent:'center', padding:10,
                position:'relative', cursor:'pointer',
                transition:'all 0.25s cubic-bezier(.16,1,.3,1)',
                boxShadow:`0 4px 20px ${color}0a`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.08)'
                e.currentTarget.style.boxShadow = `0 8px 32px ${color}20`
                e.currentTarget.style.borderColor = `${color}50`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = `0 4px 20px ${color}0a`
                e.currentTarget.style.borderColor = `${color}28`
              }}
            >
              <SignContainer srcs={active.sign} emoji={active.emoji} size={84} />
              <div style={{
                position:'absolute', top:-5, right:-5,
                padding:'3px 8px', borderRadius:99,
                background:`linear-gradient(135deg, ${color}, ${color}cc)`,
                color:'#000',
                fontFamily:"'Space Mono',monospace", fontWeight:700,
                fontSize:8, letterSpacing:'0.04em',
                boxShadow:`0 2px 8px ${color}40`,
                border:'none',
              }}>
                + info
              </div>
            </div>
            {active.code && (
              <span style={{ fontSize:9, color:T.faint, fontFamily:"'Space Mono',monospace" }}>{active.code}</span>
            )}
          </div>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color, marginBottom:6 }}>{active.name}</div>
            {active.type && <Pill label={active.type} color={active.typeColor||color} size="xs" />}
            <p style={{ fontSize:14, color:'rgba(215,225,240,0.88)', lineHeight:1.8, marginTop:10 }}>{active.meaning}</p>
            {active.rule    && <InfoBlock type="detail" text={active.rule}    color={color} />}
            {active.example && <InfoBlock type="tip"    text={active.example} color={color} />}
          </div>
        </div>
      )}

      {allSeen
        ? <PrimaryButton onClick={() => onComplete(xp)} label={`¡Has explorado todo! Completar (+${xp} XP) →`} color={color} />
        : <div style={{ textAlign:'center', padding:12, fontSize:12, color:T.faint }}>
            Toca cada señal — {items.length - seen.size} más por descubrir
          </div>
      }
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TIPO C: INTERACTIVE DEMO
// ═══════════════════════════════════════════════════════════════════
function InteractiveDemoLesson({ demos, color, onComplete, onShowSign }) {
  const [demoIdx, setDemoIdx] = useState(0)
  const [choice, setChoice] = useState(null)
  const [xpTotal, setXpTotal] = useState(0)
  const [hov, setHov] = useState(null)

  const demo = demos[demoIdx]
  const isLast = demoIdx === demos.length - 1

  const handleChoice = (opt) => { if (choice) return; setChoice(opt); setXpTotal(x => x+20) }
  const handleNext = () => {
    if (isLast) { onComplete(xpTotal+10); return }
    setChoice(null); setHov(null)
    setTimeout(() => setDemoIdx(i=>i+1), 150)
  }

  return (
    <div>
      <StepDots total={demos.length} current={demoIdx} color={color} />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18, marginBottom:16 }}>
        <div style={{
          borderRadius:20, border:`1px solid ${color}22`,
          background:`linear-gradient(160deg, rgba(255,255,255,0.03), ${color}09)`,
          padding:'32px 24px', display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', gap:16, textAlign:'center',
        }}>
          <div
            onClick={() => onShowSign?.({ ...demo, sign: demo.sign, emoji: demo.scene, title: demo.situation, color, code: demo.code || '' })}
            style={{ cursor: demo.sign ? 'pointer' : 'default', transition:'transform 0.2s' }}
            onMouseEnter={e => { if (demo.sign) e.currentTarget.style.transform = 'scale(1.06)' }}
            onMouseLeave={e => { if (demo.sign) e.currentTarget.style.transform = 'scale(1)' }}
          >
            {demo.sign ? (
              <SignContainer srcs={demo.sign} emoji={demo.scene} size={80}
                style={{ filter:`drop-shadow(0 0 20px ${color}40)` }} />
            ) : (
              <div style={{
                width:80, height:80, borderRadius:24, background:`${color}14`,
                border:`1px solid ${color}25`, display:'flex', alignItems:'center',
                justifyContent:'center',
              }}><Icon icon={demo.scene} size={44} /></div>
            )}
          </div>
          <h3 style={{ fontSize:16, fontWeight:700, color:T.text, lineHeight:1.5 }}>{demo.situation}</h3>
          {demo.context && <p style={{ fontSize:13, color:T.muted, lineHeight:1.65 }}>{demo.context}</p>}
          <Pill label="¿Qué harías?" color={color} />
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {!choice && demo.options.map((opt,i) => (
            <button key={i} onClick={() => handleChoice(opt)}
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
              style={{
                padding:'13px 16px', borderRadius:13,
                border:`1px solid ${hov===i?`${color}50`:'rgba(255,255,255,0.08)'}`,
                background:hov===i?`${color}09`:'rgba(255,255,255,0.02)',
                color:T.text, fontSize:13, fontWeight:500, cursor:'pointer',
                textAlign:'left', display:'flex', gap:12, alignItems:'center',
                transition:'all 0.18s', transform:hov===i?'translateX(4px)':'none',
              }}>
              <span style={{
                width:28, height:28, borderRadius:8, flexShrink:0,
                background:hov===i?`${color}18`:'rgba(255,255,255,0.05)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:13, border:`1px solid ${hov===i?`${color}35`:'rgba(255,255,255,0.07)'}`,
              }}>{['A','B','C','D'][i]}</span>
              {opt.label}
            </button>
          ))}

          {choice && (
            <div style={{ animation:'fadeInUp 0.3s ease', display:'flex', flexDirection:'column', gap:10, height:'100%' }}>
              <div style={{
                padding:'12px 16px', borderRadius:12,
                background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
                display:'flex', gap:10, alignItems:'center',
              }}>
                <span style={{ fontSize:10, color:T.faint, fontFamily:"'Space Mono',monospace", whiteSpace:'nowrap' }}>ELEGISTE:</span>
                <span style={{ fontSize:13, color:T.text }}>{choice.label}</span>
              </div>
              <div style={{
                flex:1, borderRadius:16, overflow:'hidden',
                border:`1px solid ${choice.positive?'rgba(52,211,153,0.28)':'rgba(251,146,60,0.28)'}`,
              }}>
                <div style={{ padding:'16px 18px', background:choice.positive?'rgba(52,211,153,0.06)':'rgba(251,146,60,0.06)' }}>
                  <div style={{ fontSize:26, marginBottom:8, textAlign:'center' }}>{choice.consequenceEmoji}</div>
                  <h4 style={{ fontSize:14, fontWeight:700, textAlign:'center', color:choice.positive?'#34d399':'#fb923c', marginBottom:8 }}>{choice.consequenceTitle}</h4>
                  <p style={{ fontSize:13, color:'rgba(215,225,240,0.88)', lineHeight:1.75 }}>{choice.consequence}</p>
                </div>
                <div style={{ padding:'14px 18px', background:'rgba(255,255,255,0.025)', borderTop:`1px solid ${choice.positive?'rgba(52,211,153,0.1)':'rgba(251,146,60,0.1)'}` }}>
                  <div style={{ fontSize:10, fontWeight:700, color, fontFamily:"'Space Mono',monospace", letterSpacing:'0.08em', marginBottom:6 }}>[OK] LO IDEAL</div>
                  <p style={{ fontSize:12, color:T.muted, lineHeight:1.65 }}>{demo.idealExplanation}</p>
                  {demo.law && <p style={{ fontSize:11, color:T.faint, marginTop:6, fontStyle:'italic' }}><Icon icon="📋" size={11} /> {demo.law}</p>}
                </div>
              </div>
              <PrimaryButton onClick={handleNext} label={isLast?'Completar →':'Siguiente situación →'} color={color} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TIPO D: STORY
// ═══════════════════════════════════════════════════════════════════
function StoryLesson({ storyTitle, intro, chapters, color, onComplete, onShowSign }) {
  const [chIdx, setChIdx] = useState(0)
  const [decision, setDecision] = useState(null)
  const [hov, setHov] = useState(null)

  const chapter = chapters[chIdx]
  const isLast = chIdx === chapters.length - 1
  const rc = decision ? (decision.positive?'#34d399':decision.neutral?'#fbbf24':'#fb923c') : color

  const handleContinue = () => {
    if (isLast) { onComplete(chapters.length*20+30); return }
    setDecision(null); setHov(null)
    setTimeout(() => setChIdx(i=>i+1), 150)
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:22, paddingBottom:20, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <Pill label="HISTORIA" color={color} />
        <Pill label={`Cap. ${chIdx+1}/${chapters.length}`} color="rgba(255,255,255,0.3)" size="xs" />
        <div style={{ flex:1 }} />
        <div style={{ display:'flex', gap:5 }}>
          {chapters.map((_,i) => (
            <div key={i} style={{
              width:8, height:8, borderRadius:'50%',
              background: i < chIdx ? color : i===chIdx ? `${color}80` : 'rgba(255,255,255,0.1)',
              transition:'all 0.3s',
            }} />
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:decision?'1fr 1fr':'1fr', gap:16, marginBottom:14 }}>
        <div style={{
          borderRadius:20, border:`1px solid ${color}22`,
          background:`linear-gradient(145deg, rgba(255,255,255,0.03), ${color}08)`,
          padding:'28px 26px',
        }}>
          {chapter.sceneEmoji && (
            <div style={{
              width:60, height:60, borderRadius:18, background:`${color}14`,
              border:`1px solid ${color}22`, display:'flex', alignItems:'center',
              justifyContent:'center', marginBottom:18,
            }}><Icon icon={chapter.sceneEmoji} size={32} /></div>
          )}
          <Pill label={chapter.location||'EN LA VÍA'} color={color} size="xs" />
          <p style={{ fontSize:15, color:T.text, lineHeight:1.9, marginTop:14, letterSpacing:'0.005em' }}>{chapter.narrative}</p>
          {!decision && chapter.decision && (
            <div style={{ marginTop:20 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:T.faint, letterSpacing:'0.1em', textTransform:'uppercase', fontFamily:"'Space Mono',monospace", marginBottom:12 }}>¿QUÉ DECIDES?</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {chapter.decision.paths.map((path,i) => (
                  <button key={i} onClick={() => setDecision(path)}
                    onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
                    style={{
                      padding:'14px 16px', borderRadius:12,
                      border:`1px solid ${hov===i?`${color}50`:'rgba(255,255,255,0.07)'}`,
                      background:hov===i?`${color}08`:'rgba(255,255,255,0.02)',
                      color:T.text, fontSize:13, cursor:'pointer', textAlign:'left',
                      display:'flex', gap:12, alignItems:'flex-start',
                      transition:'all 0.18s', transform:hov===i?'translateX(4px)':'none',
                    }}>
                    <span style={{ flexShrink:0 }}><Icon icon={path.emoji} size={18} /></span>
                    <span style={{ lineHeight:1.5 }}>{path.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {decision && (
          <div style={{ display:'flex', flexDirection:'column', gap:12, animation:'fadeInUp 0.35s ease' }}>
            <div style={{ flex:1, borderRadius:20, overflow:'hidden', border:`1px solid ${rc}28` }}>
              <div style={{ padding:'22px 22px', background:`${rc}07` }}>
                <div style={{ fontSize:28, marginBottom:12 }}>{decision.positive ? '[OK]' : decision.neutral ? '[!]' : '[!]'}</div>
                <p style={{ fontSize:14, color:T.text, lineHeight:1.85 }}>{decision.consequence}</p>
              </div>
              <div style={{ padding:'16px 22px', background:'rgba(255,255,255,0.02)', borderTop:`1px solid ${rc}14` }}>
                <div style={{ fontSize:10, fontWeight:700, color, fontFamily:"'Space Mono',monospace", letterSpacing:'0.1em', marginBottom:8 }}>APRENDIZAJE: LO QUE APRENDEMOS</div>
                <p style={{ fontSize:13, color:T.muted, lineHeight:1.7 }}>{decision.learning}</p>
              </div>
            </div>
            <PrimaryButton onClick={handleContinue} label={isLast?'FIN · Completar':'Continuar la historia →'} color={color} />
          </div>
        )}
      </div>
      {!chapter.decision && <PrimaryButton onClick={handleContinue} label={isLast?'FIN Completar':'Continuar →'} color={color} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TIPO E: CONCEPT MAP
// ═══════════════════════════════════════════════════════════════════
function ConceptMapLesson({ concepts, color, onComplete, onShowSign }) {
  const [revealed, setRevealed] = useState(new Set())
  const [active, setActive] = useState(null)

  const toggle = id => { setRevealed(s => new Set([...s,id])); setActive(active===id?null:id) }
  const allRevealed = revealed.size === concepts.length
  const xp = Math.round((revealed.size/concepts.length)*60)+20

  return (
    <div>
      <div style={{
        display:'flex', alignItems:'center', gap:14, padding:'14px 18px', borderRadius:16,
        background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', marginBottom:20,
      }}>
        <div style={{ fontSize:10, fontWeight:700, color, fontFamily:"'Space Mono',monospace", letterSpacing:'0.1em' }}>MAPA</div>
        <div style={{ flex:1, fontSize:12, color:T.text, fontWeight:600 }}>Mapa de conceptos</div>
        <div style={{ display:'flex', gap:4 }}>
          {concepts.map((_,i) => (
            <div key={i} style={{
              width:8, height:8, borderRadius:'50%',
              background:revealed.has(concepts[i].id) ? color : 'rgba(255,255,255,0.1)',
              transition:'background 0.3s',
            }} />
          ))}
        </div>
        <div style={{ fontSize:11, color, fontFamily:"'Space Mono',monospace", fontWeight:700 }}>
          {revealed.size}/{concepts.length}
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {concepts.map((c,i) => {
          const isOpen = active === c.id
          const wasSeen = revealed.has(c.id)
          return (
            <div key={c.id} style={{ animation:`fadeInUp 0.3s ease ${i*0.06}s both` }}>
              <button onClick={() => toggle(c.id)} style={{
                width:'100%', padding:'16px 20px',
                borderRadius:isOpen?'16px 16px 0 0':16,
                border:`1px solid ${isOpen?color:wasSeen?`${color}30`:'rgba(255,255,255,0.07)'}`,
                borderBottom:isOpen?`1px solid ${color}18`:undefined,
                background:isOpen?`linear-gradient(135deg,${color}0F,${color}06)`:wasSeen?`${color}04`:'rgba(255,255,255,0.02)',
                cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:14,
                transition:'all 0.25s',
              }}>
                <div
                  onClick={e => {
                    e.stopPropagation()
                    if (c.sign) onShowSign?.({ ...c, sign: c.sign, emoji: c.emoji, title: c.title, color, code: c.subtitle?.split(' — ')[0] || '' })
                  }}
                  style={{
                    width:46, height:46, borderRadius:13, flexShrink:0,
                    background:isOpen?`${color}20`:wasSeen?`${color}10`:'rgba(255,255,255,0.05)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    padding:4, transition:'all 0.25s', position:'relative',
                    cursor: c.sign ? 'pointer' : 'default',
                  }}
                  onMouseEnter={e => { if (c.sign) e.currentTarget.style.transform = 'scale(1.12)' }}
                  onMouseLeave={e => { if (c.sign) e.currentTarget.style.transform = 'scale(1)' }}
                >
                  <SignContainer srcs={c.sign} emoji={c.emoji} size={38} />
                  {c.sign && (
                    <div style={{
                      position:'absolute', top:-3, right:-3,
                      width:14, height:14, borderRadius:'50%',
                      background:color, color:'#000',
                      fontSize:7, fontWeight:700, display:'flex',
                      alignItems:'center', justifyContent:'center',
                      fontFamily:"'Space Mono',monospace",
                      boxShadow:`0 1px 4px ${color}50`,
                    }}>i</div>
                  )}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:isOpen?color:T.text, transition:'color 0.2s' }}>{c.title}</div>
                  <div style={{ fontSize:11, color:T.faint, marginTop:2 }}>{c.subtitle}</div>
                </div>
                {wasSeen && !isOpen && <Pill label="✓" color={color} size="xs" />}
                <div style={{ color:isOpen?color:'rgba(255,255,255,0.2)', fontSize:18, transform:isOpen?'rotate(90deg)':'none', transition:'all 0.25s' }}>›</div>
              </button>

              {isOpen && (
                <div style={{
                  borderRadius:'0 0 16px 16px', border:`1px solid ${color}20`, borderTop:'none',
                  background:`linear-gradient(180deg,${color}06,rgba(255,255,255,0.01))`,
                  padding:'20px 22px', animation:'fadeInUp 0.22s ease',
                  display:'grid', gridTemplateColumns:c.keyPoints?'1fr 1fr':'1fr', gap:20,
                }}>
                  <div>
                    <p style={{ fontSize:14, color:'rgba(215,225,240,0.9)', lineHeight:1.85 }}>{c.explanation}</p>
                    {c.law && <InfoBlock type="law" text={c.law} color={color} />}
                  </div>
                  {c.keyPoints && (
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, color, fontFamily:"'Space Mono',monospace", letterSpacing:'0.08em', marginBottom:12 }}>PUNTOS CLAVE</div>
                      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                        {c.keyPoints.map((pt,pi) => (
                          <div key={pi} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                            <div style={{ width:5, height:5, borderRadius:'50%', background:color, flexShrink:0, marginTop:8, boxShadow:`0 0 6px ${color}80` }} />
                            <span style={{ fontSize:13, color:T.muted, lineHeight:1.65 }}>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {allRevealed && (
        <div style={{ marginTop:20, animation:'fadeInUp 0.3s ease' }}>
          <div style={{ padding:'14px 18px', borderRadius:14, marginBottom:14, background:'rgba(52,211,153,0.07)', border:'1px solid rgba(52,211,153,0.2)', textAlign:'center', fontSize:13, color:'#34d399' }}>
            * ¡Todos los conceptos explorados! +{xp} XP
          </div>
          <PrimaryButton onClick={() => onComplete(xp)} label="Completar lección ✓" color={color} />
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TIPO F: STEP GUIDE
// ═══════════════════════════════════════════════════════════════════
function StepGuideLesson({ steps, color, onComplete, onShowSign }) {
  const [current, setCurrent] = useState(0)
  const step = steps[current]
  const isLast = current === steps.length - 1
  const goNext = () => { if (isLast) { onComplete(steps.length*12+20); return }; setCurrent(i=>i+1) }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', marginBottom:28, overflowX:'auto', paddingBottom:4 }}>
        {steps.map((s,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <button onClick={() => i<current && setCurrent(i)} style={{
                width:36, height:36, borderRadius:'50%',
                background:i===current?color:i<current?`${color}22`:'rgba(255,255,255,0.05)',
                border:`2px solid ${i===current?'transparent':i<current?`${color}50`:'rgba(255,255,255,0.1)'}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:11, fontWeight:700, color:i===current?'#000':i<current?color:T.faint,
                fontFamily:"'Space Mono',monospace", cursor:i<current?'pointer':'default', flexShrink:0,
                transition:'all 0.3s', boxShadow:i===current?`0 0 20px ${color}60, 0 0 40px ${color}25`:'none',
              }}>{i<current?'✓':i+1}</button>
              <div style={{
                fontSize:9, color:i===current?color:T.faint, fontFamily:"'Space Mono',monospace",
                maxWidth:64, textAlign:'center', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
              }}>{s.action?.slice(0,14)}</div>
            </div>
            {i < steps.length-1 && (
              <div style={{
                height:2, width:40, flexShrink:0, margin:'0 4px 18px',
                background:i<current?color:'rgba(255,255,255,0.08)', transition:'background 0.4s',
                boxShadow: i<current ? `0 0 6px ${color}60` : 'none',
              }} />
            )}
          </div>
        ))}
      </div>

      <div key={current} style={{ display:'grid', gridTemplateColumns:'120px 1fr', gap:20, marginBottom:18, animation:'fadeInUp 0.3s ease' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start', gap:14, paddingTop:4 }}>
          <div style={{
            width:100, height:100, borderRadius:24,
            background:`linear-gradient(145deg, ${color}18, ${color}09)`,
            border:`1px solid ${color}28`,
            display:'flex', alignItems:'center', justifyContent:'center', padding:10,
            position:'relative',
          }}>
            {step.sign ? (
              <SignContainer srcs={step.sign} emoji={step.emoji} size={80} />
            ) : (
              <span><Icon icon={step.emoji} size={48} /></span>
            )}
          </div>
          <Pill label={`${current+1}/${steps.length}`} color={color} size="xs" />
        </div>
        <div style={{
          borderRadius:20, padding:'22px 22px',
          background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)',
        }}>
          <h3 style={{ fontSize:16, fontWeight:700, color:T.text, marginBottom:12, letterSpacing:'-0.01em', lineHeight:1.4 }}>{step.action}</h3>
          <p style={{ fontSize:13, color:'rgba(215,225,240,0.85)', lineHeight:1.8 }}>{step.explanation}</p>
          {step.warning && <InfoBlock type="warn" text={step.warning} color={color} />}
          {step.tip     && <InfoBlock type="tip"  text={step.tip}     color={color} />}
        </div>
      </div>

      <div style={{ display:'flex', gap:10 }}>
        {current > 0 && (
          <button onClick={() => setCurrent(i=>i-1)} style={{
            padding:'14px 20px', borderRadius:14, border:'1px solid rgba(255,255,255,0.09)',
            background:'transparent', color:T.muted, fontSize:13, cursor:'pointer', whiteSpace:'nowrap',
          }}>← Atrás</button>
        )}
        <div style={{ flex:1 }}>
          <PrimaryButton onClick={goNext} label={isLast?'✓ ¡Completar!':'Siguiente paso →'} color={color} />
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// DATOS — MIGRADO a nueva API de señales
//
// Cada señal ahora usa:
//   sign: SR.NOMBRE      → [svgUrl, thumbUrl, emoji]  (fallback automático)
//   emoji: '...'         → último recurso visual
//
// Los campos que antes eran signSrc: null ahora usan emoji apropiados
// o señales informativas cuando existe el recurso.
// ═══════════════════════════════════════════════════════════════════
const MODULE_CONTENT = {
  1: {
    icon:'🚦', title:'Señales de tránsito', color:'#f87171',
    description:'Las señales viales son el lenguaje universal de la carretera. Conocerlas puede salvarte la vida.',
    lessons: [
      {
        id:1, icon:'🗂️', title:'El sistema de señales', diff:'fácil', time:'5 min', xp:80, type:'explainer',
        steps:[
          { tag:'Introducción', visual:'🚦', sign: null,
            title:'Las señales hablan un idioma universal',
            body:'En Colombia y en casi todo el mundo, las señales de tránsito están estandarizadas por forma y color. Esto significa que puedes entender una señal incluso sin leer el texto: su forma y color ya te dicen de qué tipo es.',
            tip:'La forma y el color son la clave. Antes de leer el texto, ya sabes si una señal te prohíbe algo, te advierte, o te informa.' },
          { tag:'Tipo 1',  visual:'⛔', sign: SR.PARE,
            title:'Señales Reglamentarias — Color rojo',
            body:'Las señales circulares con borde rojo son ÓRDENES. No son sugerencias. Indican prohibiciones o restricciones que debes cumplir obligatoriamente.',
            detail:'Círculo rojo = obligación. Esto incluye el STOP, los límites de velocidad y las prohibiciones de giro.',
            law:'Ley 769/2002 — Manual de Señalización Vial de Colombia.' },
          { tag:'Tipo 2', visual:'⚠️', sign: SR.CURVA_IZQ,
            title:'Señales Preventivas — Color amarillo',
            body:'Las señales amarillas en forma de rombo o triángulo te ADVIERTEN de un peligro próximo. No te prohíben nada, pero te piden que reduzcas la velocidad.',
            detail:'Amarillo = peligro adelante. Son tu sistema de alerta temprana.' },
          { tag:'Tipo 3', visual:'🪧', sign: null,
            title:'Señales Informativas — Azul o verde',
            body:'Las señales rectangulares azules o verdes te INFORMAN. Muestran destinos, distancias y servicios. No tienen fuerza obligatoria, pero son esenciales para orientarte.',
            detail:'Azul = información local. Verde = rutas y destinos lejanos.' },
          { tag:'Resumen', visual:'🧠', sign: SR.VEL_50,
            title:'El truco para recordarlo siempre',
            body:'Pregúntate el color. Rojo → debo obedecer. Amarillo → debo prestar atención. Azul/verde → estoy recibiendo información.',
            tip:'Practica mentalmente cada vez que veas una señal. En pocas semanas lo harás automáticamente.' },
        ],
      },
      {
        id:2, icon:'⛔', title:'Señales Reglamentarias', diff:'fácil', time:'7 min', xp:70, type:'explorer',
        intro:{ title:'Toca cada señal para descubrir su significado', subtitle:'Señales oficiales del Manual de Señalización Vial de Colombia' },
        items:[
          { id:'stop',        name:'PARE',             code:'SR-01', emoji:'🛑', sign:SR.PARE,         type:'Reglamentaria', typeColor:'#f87171',
            meaning:'Detención total y obligatoria antes de la línea de parada. No es negociable: incluso a las 3am sin nadie en la calle, debes parar completamente.',
            rule:'Sin parada total = infracción grave. Multa + descuento de puntos.',
            example:'Llegas a la señal. Frenas completamente, miras a ambos lados y solo entonces avanzas.' },
          { id:'ceda',        name:'Ceda el paso',     code:'SR-02', emoji:'🔺', sign:SR.CEDA,         type:'Reglamentaria', typeColor:'#f87171',
            meaning:'Reduce la velocidad y deja pasar a los vehículos con prioridad. Si hay que parar para ceder, se para.',
            rule:'Triángulo invertido rojo. Ignorarlo = infracción.',
            example:'Esperas a que no haya vehículos en la avenida principal antes de incorporarte.' },
          { id:'velocidad',   name:'Vel. máx 50',      code:'SR-30A',emoji:'🔢', sign:SR.VEL_50,       type:'Reglamentaria', typeColor:'#f87171',
            meaning:'El número dentro del círculo rojo es la velocidad MÁXIMA. No es sugerencia. Superarlo es infracción independientemente del carril.',
            rule:'Circular a 60 en zona de 50 es infracción aunque todos lo hagan.',
            example:'Ves señal de 30 al entrar al barrio. Reduces a 30 km/h aunque la vía parezca despejada.' },
          { id:'prohibido',   name:'No entre',          code:'SR-04', emoji:'🚫', sign:SR.NO_ENTRE,     type:'Reglamentaria', typeColor:'#f87171',
            meaning:'Círculo rojo con barra blanca. No puedes circular en esa dirección. Muy común al inicio de vías de sentido único.',
            rule:'Circular en contravía = infracción gravísima.',
            example:'Ves esta señal. No entras: es sentido contrario.' },
          { id:'no_giro',     name:'No gire a la izq', code:'SR-07', emoji:'↩️', sign:SR.NO_GIRO_IZQ,  type:'Reglamentaria', typeColor:'#f87171',
            meaning:'Flecha tachada dentro de círculo rojo. Giro prohibido en esa dirección, aunque el semáforo esté verde.',
            rule:'El giro sigue prohibido aunque el semáforo permita circular.',
            example:'Semáforo verde pero con señal de "No gire a la izquierda". No puedes girar.' },
          { id:'no_adelantar',name:'No adelantar',      code:'SR-26', emoji:'🚘', sign:SR.NO_ADELANTAR, type:'Reglamentaria', typeColor:'#f87171',
            meaning:'Prohíbe sobrepasar vehículos en ese tramo. Aparece en curvas y zonas de poca visibilidad.',
            rule:'Adelantar donde está prohibido = infracción muy grave.',
            example:'Esperas a que desaparezca la señal antes de intentar adelantar.' },
        ],
      },
      {
        id:3, icon:'⚠️', title:'Señales Preventivas', diff:'fácil', time:'6 min', xp:75, type:'concept_map',
        concepts:[
          { id:'curva',       emoji:'〽️', sign:SR.CURVA_IZQ,   title:'Curva peligrosa',      subtitle:'SP-01/02 — Reducir antes de entrar',
            explanation:'Indica una curva con ángulo pronunciado. Reduce la velocidad ANTES de entrar, no dentro. Frenar en curva puede hacerte perder el control.',
            keyPoints:['La flecha indica la dirección de la curva.','Reduce antes de llegar, no durante.','En lluvia reduce aún más: el pavimento mojado baja la adherencia.'] },
          { id:'escolar',     emoji:'🚸', sign:SR.ESCOLAR,      title:'Zona escolar',          subtitle:'SP-47 — Máxima atención, niños cerca',
            explanation:'Cerca de institución educativa. En horarios de entrada y salida pueden haber niños cruzando. La velocidad puede reducirse a 30 km/h o menos.',
            keyPoints:['Los niños son impredecibles.','La señal aplica aunque no veas niños.'],
            law:'En zonas escolares activas pueden imponerse límites de 30 km/h o inferiores.' },
          { id:'animal',      emoji:'🦌', sign:SR.ANIMALES,     title:'Cruce de animales',     subtitle:'SP-49 — Fauna en la vía',
            explanation:'En carreteras rurales o cerca de parques naturales. Los animales pueden cruzar sin aviso. De noche son prácticamente invisibles.',
            keyPoints:['Reduce para tener tiempo de reacción.','Si un animal cruza, frena recto.','De noche usa luces largas sin tráfico opuesto.'] },
          { id:'obra',        emoji:'🚧', sign:SR.OBRAS,        title:'Zona de obras',         subtitle:'SP-43 — Trabajadores en la vía',
            explanation:'Indica carriles cerrados, desvíos, superficies irregulares o personal en la calzada.',
            keyPoints:['Sigue instrucciones del personal de obra.','De noche la señalización puede estar mal iluminada.'] },
          { id:'interseccion',emoji:'✛', sign:SR.INTERSECCION, title:'Intersección próxima',  subtitle:'SP-11 — Puede haber tráfico cruzado',
            explanation:'Viene una intersección con posible tráfico cruzando. Reduce y prepárate para ceder.',
            keyPoints:['Anticiparla te da más tiempo de reacción.','Sin señal: prioridad a quien viene por la derecha.'] },
        ],
      },
    ],
  },
  2: {
    icon:'📋', title:'Normas básicas', color:'#34d399',
    description:'Las reglas del juego en la vía pública. Sin ellas, el tráfico sería un caos.',
    lessons: [
      {
        id:4, icon:'🚦', title:'Los semáforos y su lógica', diff:'fácil', time:'6 min', xp:70, type:'explainer',
        steps:[
          { tag:'Verde',       visual:'🟢', sign: SR.SEMAFORO_PRE,
            title:'Verde: avanza — pero con criterio',
            body:'Verde no es "avanza sin mirar". Es tu prioridad para circular. Antes de arrancar verifica que la intersección esté libre.',
            tip:'Aunque el verde sea tuyo, siempre mira antes de cruzar.' },
          { tag:'Amarillo',    visual:'🟡', sign: null,
            title:'Amarillo: prepárate para parar',
            body:'El amarillo anuncia el rojo. Si puedes frenar con seguridad, hazlo. Si ya estás muy cerca y frenar sería peligroso, cruza con precaución.',
            detail:'Frenar bruscamente en amarillo puede causar un choque por detrás.' },
          { tag:'Rojo',        visual:'🔴', sign: null,
            title:'Rojo: detención total siempre',
            body:'El rojo es rojo en toda circunstancia. A ninguna hora ni bajo ninguna excusa puede cruzarse un semáforo en rojo en Colombia.',
            law:'Ley 769/2002 Art. 79 — Detención obligatoria ante luz roja.' },
          { tag:'Peatones',    visual:'🚶', sign: SR.PEATONES,
            title:'Al girar: el peatón tiene prioridad',
            body:'Con verde para girar, si hay un peatón cruzando legalmente tiene prioridad absoluta. Debes esperar a que cruce completamente.',
            law:'Ley 769/2002 Art. 76 — El peatón en paso habilitado tiene prioridad.',
            tip:'Nunca toques la bocina al peatón para apurarlo.' },
          { tag:'Sin semáforo',visual:'❓', sign: SR.CRUCE,
            title:'Sin semáforo ni señal',
            body:'La prioridad la tiene el vehículo que viene por la derecha. Esto se llama la "norma de la derecha" y es de obligatorio cumplimiento.',
            detail:'Mira a tu derecha. Si viene alguien, cede el paso.' },
        ],
      },
      {
        id:5, icon:'🏎️', title:'Velocidades y límites', diff:'fácil', time:'7 min', xp:70, type:'concept_map',
        concepts:[
          { id:'urbana',    emoji:'🏙️', sign:SR.VEL_50,   title:'Zona urbana: hasta 50 km/h',       subtitle:'SR-30A — La velocidad en ciudad',
            explanation:'En Colombia la velocidad máxima urbana es 50 km/h salvo señal diferente. A 50 km/h la distancia de frenado en seco es ~25 m. A 70 km/h supera los 50 m.',
            keyPoints:['A 30 km/h: 90% de probabilidad de sobrevivir si atropellas.','A 50 km/h: 45% de probabilidad de muerte del peatón.','A 70 km/h: >85% de probabilidad de muerte del peatón.'],
            law:'Resolución 1885 de 2015 — Límites de velocidad.' },
          { id:'carretera', emoji:'🛣️', sign:SR.VEL_80,   title:'Carretera: hasta 80 km/h',         subtitle:'SR-30C — Vehículos particulares',
            explanation:'En carreteras nacionales el límite es 80 km/h para autos. Algunos tramos de doble calzada señalados pueden llegar a 100 km/h.',
            keyPoints:['Obedece siempre la señal más restrictiva.','En lluvia reduce aunque el límite sea mayor.','El carril izquierdo es para adelantar, no para circular.'] },
          { id:'lluvia',    emoji:'🌧️', sign:SR.HUMEDA,   title:'Lluvia: el límite no es suficiente',subtitle:'SP-44 — Vía húmeda',
            explanation:'Con lluvia el pavimento mojado puede duplicar la distancia de frenado. Debes reducir incluso por debajo del límite.',
            keyPoints:['Velocidad máxima con lluvia fuerte puede ser imprudente.','Aquaplaning: a alta velocidad las llantas pierden contacto.','Aumenta la distancia de seguimiento.'] },
          { id:'exceso',    emoji:'📉', sign:SR.VEL_30,   title:'Consecuencias del exceso',          subtitle:'SR-30 — Más allá de la multa',
            explanation:'La energía en un choque aumenta exponencialmente. Un impacto a 100 km/h libera cuatro veces más energía que uno a 50 km/h.',
            keyPoints:['Multa: puede superar 15 SMLDV.','Descuento de puntos de licencia.','Riesgo de accidente mortal crece de forma exponencial.'] },
        ],
      },
      {
        id:6, icon:'🤝', title:'Prioridades en la vía', diff:'medio', time:'8 min', xp:85, type:'interactive_demo',
        demos:[
          { scene:'🚑', sign: null,
            situation:'Una ambulancia con sirena se aproxima por detrás.',
            context:'Estás en una calle de dos carriles. El vehículo de emergencias viene por tu carril.',
            options:[
              { label:'Me orillo a la derecha gradualmente y reduzco', positive:true,  consequenceEmoji:'[OK]', consequenceTitle:'¡Correcto!',              consequence:'Al orillar a la derecha abres paso sin crear peligro adicional. La ambulancia continúa sin obstáculos.' },
              { label:'Freno en seco donde estoy',                     positive:false, consequenceEmoji:'[!]', consequenceTitle:'Peligroso',               consequence:'Frenar bruscamente puede causar un choque con quien viene detrás y dificulta el paso de la ambulancia.' },
              { label:'Acelero para abrir espacio adelante',           positive:false, consequenceEmoji:'[!]', consequenceTitle:'No resuelve el problema', consequence:'Si la ambulancia va más rápido que tú, no estás ayudando y puedes crear otro peligro.' },
              { label:'Me cambio al carril izquierdo',                 positive:false, consequenceEmoji:'[!]', consequenceTitle:'Incorrecto',              consequence:'Cambiar al izquierdo bloquea el paso. Siempre orilla A LA DERECHA.' },
            ],
            idealExplanation:'Ante emergencias: orilla gradualmente a la derecha, reduce y detente si es necesario.',
            law:'Ley 769/2002 Art. 70 — Ceder paso a vehículos de emergencia.' },
          { scene:'🚗🚗', sign: SR.CRUCE,
            situation:'Intersección sin señales. Vehículo a tu derecha aproximándose.',
            context:'Los dos llegarán al cruce casi al mismo tiempo.',
            options:[
              { label:'Cedo el paso: viene por mi derecha, tiene prioridad', positive:true,  consequenceEmoji:'[OK]', consequenceTitle:'¡Correcto!',              consequence:'Quien viene por la derecha tiene prioridad. Cediste correctamente y evitaste un choque.' },
              { label:'Acelero para cruzar primero',                         positive:false, consequenceEmoji:'[!]', consequenceTitle:'Peligroso',               consequence:'Acelerar para "ganarle" al que tiene prioridad puede terminar en choque.' },
              { label:'Toco bocina para avisarle',                           positive:false, consequenceEmoji:'[!]', consequenceTitle:'La bocina no da prioridad',consequence:'Tocar bocina no te da prioridad legal. El de la derecha la tiene siempre.' },
              { label:'Freno y espero que pase',                             positive:true,  consequenceEmoji:'[OK]', consequenceTitle:'También correcto',         consequence:'Igualmente válido. Lo importante es que el de la derecha pase primero.' },
            ],
            idealExplanation:'Sin señal ni semáforo: norma de la derecha. El vehículo que viene por tu derecha tiene prioridad.',
            law:'Ley 769/2002 Art. 81 — Prioridad al vehículo de la derecha.' },
          { scene:'🚶‍♂️', sign: SR.PEATONES,
            situation:'Giras a la derecha en verde. Un peatón comienza a cruzar.',
            context:'El semáforo peatonal también está en verde.',
            options:[
              { label:'Espero a que el peatón cruce completamente', positive:true,  consequenceEmoji:'[OK]', consequenceTitle:'Correcto — el peatón manda', consequence:'El peatón en paso habilitado tiene prioridad absoluta. Esperaste correctamente.' },
              { label:'Giro lento esperando que se haga a un lado',  positive:false, consequenceEmoji:'[!]', consequenceTitle:'Arriesgado e ilegal',        consequence:'Si el peatón cambia dirección o tropieza, puedes atropellarlo.' },
              { label:'Toco bocina suavemente',                      positive:false, consequenceEmoji:'[!]', consequenceTitle:'No corresponde',            consequence:'Tocarle bocina a quien cruza legalmente es innecesario e irrespetuoso.' },
            ],
            idealExplanation:'El peatón en paso habilitado tiene siempre prioridad, incluso cuando tú tienes verde para girar.',
            law:'Ley 769/2002 Art. 76 — Prioridad al peatón en paso habilitado.' },
        ],
      },
    ],
  },
  3: {
    icon:'🤝', title:'Comportamiento vial', color:'#fb923c',
    description:'Tu actitud al volante importa tanto como tu habilidad. Aprende a convivir en la vía.',
    lessons: [
      {
        id:7, icon:'🪞', title:'El sistema de espejos', diff:'fácil', time:'6 min', xp:70, type:'step_guide',
        steps:[
          { emoji:'🔧', sign: null, action:'Ajusta los espejos antes de arrancar',
            explanation:'Con el cuerpo en posición de conducción. El retrovisor central muestra la luneta trasera completa. Los laterales muestran apenas el borde del vehículo y amplio campo trasero.',
            tip:'Si ves mucho de tu propio carro en los laterales, están apuntando demasiado hacia adentro.' },
          { emoji:'👀', sign: null, action:'Revisa los espejos cada 5–8 segundos',
            explanation:'Un buen conductor hace un ciclo visual constante: adelante → espejo central → espejo izquierdo → espejo derecho → adelante. Esto te da imagen actualizada de todo tu entorno.',
            tip:'Más de 10 segundos sin revisar espejos = información crítica perdida.' },
          { emoji:'🔍', sign: null, action:'Verifica el punto ciego antes de cambiar carril',
            explanation:'Los espejos no cubren una zona lateral trasera llamada "punto ciego". Antes de cambiar de carril, gira levemente la cabeza hacia el lado al que irás.',
            warning:'El punto ciego puede ocultar una moto o un auto pequeño completamente.' },
          { emoji:'➡️', sign: null, action:'Secuencia correcta para cambiar de carril',
            explanation:'1) Espejo central, 2) Espejo lateral, 3) Gira la cabeza para el punto ciego, 4) Activa el indicador, 5) Maniobra gradualmente.',
            tip:'Si saltas el paso 3, los demás pasos no te protegen del vehículo invisible.' },
          { emoji:'🌙', sign: null, action:'De noche: modo nocturno del retrovisor',
            explanation:'La palanca inferior del retrovisor reduce el deslumbramiento de los faros traseros. Úsala siempre de noche.' },
        ],
      },
      {
        id:8, icon:'📱', title:'Distracciones al conducir', diff:'medio', time:'7 min', xp:80, type:'explainer',
        steps:[
          { tag:'El problema', visual:'📱', sign: null,
            title:'El celular: por qué es tan peligroso',
            body:'A 60 km/h, mirar el celular 3 segundos = recorrer 50 metros con los ojos cerrados. En ese espacio puede haber un semáforo, un peatón o un vehículo frenando.',
            tip:'50 metros a ojos cerrados. Eso compras cuando miras el celular 3 segundos.' },
          { tag:'Tipos',       visual:'🧠', sign: null,
            title:'Tres tipos de distracción',
            body:'Visual (dejas de mirar la vía), Manual (sueltas el volante) y Cognitiva (tu mente sale de la conducción). El celular activa las tres al mismo tiempo.',
            detail:'Una conversación con pasajero es cognitiva. El celular es visual + manual + cognitiva simultáneamente.' },
          { tag:'Audífonos',   visual:'🎧', sign: null,
            title:'Audífonos en ambos oídos',
            body:'Bloquean sirenas, bocinas y sonidos de frenadas cercanas. En muchos contextos es ilegal conducir con ambos oídos tapados.',
            tip:'Si debes escuchar, usa un solo oído o el audio del vehículo a volumen bajo.' },
          { tag:'GPS',         visual:'🗺️', sign: null,
            title:'El GPS: úsalo bien',
            body:'Prográmalo ANTES de arrancar. Activa la voz para no mirar la pantalla. Si debes cambiar el destino, estaciona primero.',
            detail:'30 segundos de parada son preferibles a un accidente.' },
          { tag:'Sueño',       visual:'😴', sign: null,
            title:'La somnolencia es tan peligrosa como el alcohol',
            body:'Más de 18 horas sin dormir ≈ alcoholemia de 0.05%. Los microsueños de 2–30 segundos ocurren sin que el conductor lo perciba.',
            tip:'La única solución es detenerse y descansar. El café es temporal.' },
        ],
      },
      {
        id:9, icon:'😤', title:'Agresividad vial', diff:'medio', time:'8 min', xp:85, type:'story',
        storyTitle:'Un martes en el tráfico',
        intro:'Son las 7:45am. Llegas tarde. El tráfico está pesado. Así comienza esta historia.',
        chapters:[
          { id:'c1', sceneEmoji:'🚗', location:'TRONCAL · 7:45AM',
            narrative:'Llevas 20 minutos en trancón. Un vehículo se te cierra bruscamente al cambiar de carril sin señalizar. Pisas el freno justo a tiempo. El susto es real. El enojo llega inmediatamente.',
            decision:{ paths:[
              { emoji:'😤', label:'Le toco la bocina largo y le hago gestos', positive:false, consequence:'El conductor responde con otro gesto. Ambos están ahora distraídos y enojados. La situación escaló innecesariamente.', learning:'Responder con agresividad escala la situación y te distrae de la vía. Tú decides si el incidente termina aquí.' },
              { emoji:'💨', label:'Lo adelanto por la derecha para "enseñarle"', positive:false, consequence:'Adelantar por la derecha es peligroso e ilegal. Podrías causar un choque.', learning:'Las maniobras de "venganza" te convierten en el conductor peligroso.' },
              { emoji:'😌', label:'Respiro, mantengo distancia y sigo', positive:true, consequence:'En segundos, el otro vehículo está lejos. El incidente terminó. Tu ritmo cardíaco vuelve a la normalidad.', learning:'La respuesta madura no es pasividad — es inteligencia. Cada reacción agresiva es atención que le robas a la vía.' },
            ]} },
          { id:'c2', sceneEmoji:'🚘', location:'AUTOPISTA · 8:20AM',
            narrative:'Vas a 80 km/h en el carril izquierdo. El vehículo de atrás te pone las luces largas repetidamente. Quiere que te hagas a un lado.',
            decision:{ paths:[
              { emoji:'😠', label:'Reduzco para molestarlo', positive:false, consequence:'Reducir intencionalmente ante un vehículo que te presiona es extremadamente peligroso.', learning:'Obstaculizar intencionalmente es tan peligroso como la agresividad original.' },
              { emoji:'😤', label:'Le pongo luces largas de vuelta', positive:false, consequence:'Deslumbras al conductor de atrás y puedes hacerle perder la visión.', learning:'Las luces largas dirigidas a otro conductor son un peligro real.' },
              { emoji:'😌', label:'Me cambio al carril derecho cuando es seguro', positive:true, consequence:'El vehículo pasa y desaparece. Incidente terminado en 15 segundos.', learning:'El carril izquierdo es para adelantar. Ceder cuando alguien quiere pasar es conducción correcta.' },
            ]} },
          { id:'c3', sceneEmoji:'🅿️', location:'PARQUEADERO · 8:45AM',
            narrative:'Al buscar parqueadero, alguien te quita el espacio. Él se baja del carro y te mira desafiante.',
            decision:{ paths:[
              { emoji:'😠', label:'Bajo del carro y le digo lo que pienso', positive:false, consequence:'Las confrontaciones son impredecibles. Muchos incidentes de agresividad vial terminan en violencia.', learning:'Nada en la vía vale una confrontación física. Tu seguridad está por encima de cualquier principio.' },
              { emoji:'😌', label:'Busco otro espacio — no vale la pena', positive:true, consequence:'Encuentras otro espacio a 30 metros. Llegas sin daños, sin multa, sin carga emocional.', learning:'Ceder en conflictos potenciales no es perder — es saber qué batallas valen la pena.' },
            ]} },
        ],
      },
    ],
  },
  4: {
    icon:'🌆', title:'Situaciones reales', color:'#a78bfa',
    description:'Casos prácticos que todo conductor enfrenta. Aprende a decidir bien bajo presión.',
    lessons: [
      {
        id:10, icon:'🅿️', title:'Cómo estacionar correctamente', diff:'fácil', time:'5 min', xp:65, type:'explorer',
        intro:{ title:'Toca cada situación para conocer las reglas', subtitle:'Zonas prohibidas, técnicas en pendiente y más' },
        items:[
          { id:'amarilla',  name:'Zona amarilla',       code:'SR-38', emoji:'🟡', sign:SR.ZONA_AMARILLA, type:'Prohibición', typeColor:'#fbbf24',
            meaning:'Zona exclusiva de carga y descarga para mercancías. Vehículos particulares no pueden estacionar aquí bajo ninguna circunstancia.',
            rule:'Infracción + multa + posible inmovilización del vehículo.' },
          { id:'arriba',    name:'Pendiente ↑',          code:'—',     emoji:'⛰️', sign: null,             type:'Técnica',     typeColor:'#34d399',
            meaning:'Ruedas delanteras HACIA AFUERA (hacia la vía). Si el freno falla y el vehículo rueda hacia atrás, las ruedas chocan con el bordillo.',
            rule:'Cuesta arriba = ruedas afuera. Piensa "me alejo del andén".',
            example:'Giras el volante completamente hacia la izquierda antes de soltar el freno.' },
          { id:'abajo',     name:'Pendiente ↓',          code:'—',     emoji:'🏔️', sign: null,             type:'Técnica',     typeColor:'#34d399',
            meaning:'Ruedas delanteras HACIA EL ANDÉN. Si el freno falla el vehículo es detenido por el bordillo.',
            rule:'Cuesta abajo = ruedas adentro.',
            example:'Giras el volante completamente hacia la derecha antes de soltar el freno.' },
          { id:'no_entre',  name:'No entre',             code:'SR-04', emoji:'🚫', sign:SR.NO_ENTRE,       type:'Prohibición', typeColor:'#f87171',
            meaning:'Señal de no ingreso en la salida de parqueaderos y vías de sentido único. Ignorarla puede causarte un choque frontal.',
            rule:'Circular en contravía = infracción gravísima.' },
          { id:'ceda',      name:'Ceda en esquina',      code:'SR-02', emoji:'🔺', sign:SR.CEDA,           type:'Prioridad',   typeColor:'#f87171',
            meaning:'Estacionar a menos de 5 metros de una señal de ceda el paso bloquea la visibilidad de los conductores.',
            rule:'Mínimo 5 metros de distancia de cualquier señal de tránsito.' },
          { id:'doble',     name:'Doble fila',           code:'—',     emoji:'🚗', sign: null,             type:'Prohibición', typeColor:'#f87171',
            meaning:'Bloquea el tráfico y en emergencias puede impedir el paso de ambulancias. "Solo un momento" no es excusa.',
            rule:'Infracción grave + multa alta + posible inmovilización.' },
        ],
      },
      {
        id:11, icon:'🚑', title:'En caso de accidente', diff:'difícil', time:'10 min', xp:100, type:'step_guide',
        steps:[
          { emoji:'⚡', sign: null, action:'Mantén la calma — evalúa antes de actuar',
            explanation:'Respira. Evalúa si estás herido, si hay otros heridos y si hay peligro inmediato como fuego o vehículos que se aproximan.',
            tip:'La calma permite mejores decisiones. El pánico agrava la situación.' },
          { emoji:'⚠️', sign: null, action:'Señaliza la zona de peligro',
            explanation:'Enciende las luces de emergencia y coloca triángulos a 50 metros detrás del vehículo para evitar un segundo accidente.',
            warning:'Un segundo accidente sobre el primero es uno de los escenarios más mortales.' },
          { emoji:'🤕', sign: null, action:'Verifica heridos — NO los muevas',
            explanation:'Verifica si los heridos están conscientes y respiran. NO muevas a nadie a menos que haya peligro inminente como fuego.',
            warning:'Mover un herido incorrectamente puede convertir una lesión recuperable en parálisis permanente.' },
          { emoji:'📞', sign: null, action:'Llama al 123',
            explanation:'Informa: ubicación exacta, número de vehículos, si hay heridos y cuántos, peligros especiales como combustible derramado.' },
          { emoji:'📸', sign: null, action:'Documenta la escena antes de mover vehículos',
            explanation:'Fotografía la posición de los vehículos, daños, señales cercanas y placas. Son evidencia para el proceso con la aseguradora.',
            tip:'Fotografía desde múltiples ángulos.' },
          { emoji:'📄', sign: null, action:'Intercambia datos con el otro conductor',
            explanation:'Intercambia: nombre, cédula, licencia, placa, aseguradora y SOAT. No firmes ningún documento sin leerlo.',
            warning:'No firmes acuerdos en el lugar sin consultar con tu aseguradora.' },
          { emoji:'📋', sign: null, action:'Verifica que tu SOAT esté vigente',
            explanation:'El SOAT cubre gastos médicos de todas las víctimas. Sin SOAT vigente quedas sin cobertura y con responsabilidad civil directa.',
            law:'SOAT obligatorio en Colombia. Sin él: multa grave + responsabilidad civil.' },
        ],
      },
      {
        id:12, icon:'🌙', title:'Conducción nocturna', diff:'medio', time:'7 min', xp:80, type:'concept_map',
        concepts:[
          { id:'visibilidad',     emoji:'🌑', sign: null,       title:'La visibilidad se reduce drásticamente', subtitle:'Adaptarse a la oscuridad',
            explanation:'De noche la visibilidad cae a 40–100 metros con luces artificiales. La velocidad segura de día puede no serlo de noche en la misma vía.',
            keyPoints:['Luces cortas: ~40 m de visibilidad.','Luces largas: ~100 m — úsalas sin tráfico de frente.','Cambia a cortas al ver faros opuestos.'] },
          { id:'deslumbramiento', emoji:'💡', sign: null,       title:'El deslumbramiento',                     subtitle:'Recuperar la visión',
            explanation:'Cuando faros largos de frente te deslumbran, la visión se recupera en 5–7 segundos. Puedes recorrer más de 100 metros "a ciegas".',
            keyPoints:['Mira hacia la derecha, al borde de tu carril.','No mires los faros directamente.','Reduce mientras recuperas la visión.'] },
          { id:'animales',        emoji:'🦌', sign: SR.ANIMALES,title:'Fauna en carretera de noche',            subtitle:'SP-49 — Peligro subestimado',
            explanation:'Los animales son casi invisibles de noche hasta el último segundo. Si el choque es inevitable, frena recto y fuerte.',
            keyPoints:['Un viraje brusco puede causar vuelco o choque de frente.','El daño al vehículo es reparable.','En zonas de fauna, reduce aunque no veas animales.'] },
          { id:'sueno',           emoji:'😴', sign: null,       title:'La somnolencia nocturna',                subtitle:'El mayor peligro',
            explanation:'El cuerpo promueve el sueño entre las 2am y 5am. Conducir en ese horario aumenta el riesgo de microsueños aunque no estés cansado.',
            keyPoints:['Si sientes sueño, detente y duerme 20–30 min.','El café da 30–45 min extra máximo.','En viajes largos, para cada 2 horas.'],
            law:'La somnolencia equivale a conducción bajo incapacidad en la legislación colombiana.' },
        ],
      },
    ],
  },
}

// ─── Dispatcher ───────────────────────────────────────────────────
function LessonGame({ lesson, color, onComplete, onShowSign }) {
  const { addXp, completeLesson } = useProgress()
  const handleComplete = xp => { addXp(xp); completeLesson(lesson.id); onComplete() }
  switch (lesson.type) {
    case 'explainer':        return <ExplainerLesson      steps={lesson.steps}                                 color={color} onComplete={handleComplete} onShowSign={onShowSign} />
    case 'explorer':         return <ExplorerLesson        items={lesson.items}   intro={lesson.intro}         color={color} onComplete={handleComplete} onShowSign={onShowSign} />
    case 'interactive_demo': return <InteractiveDemoLesson demos={lesson.demos}                                color={color} onComplete={handleComplete} onShowSign={onShowSign} />
    case 'story':            return <StoryLesson           storyTitle={lesson.storyTitle} intro={lesson.intro} chapters={lesson.chapters} color={color} onComplete={handleComplete} onShowSign={onShowSign} />
    case 'concept_map':      return <ConceptMapLesson      concepts={lesson.concepts}                          color={color} onComplete={handleComplete} onShowSign={onShowSign} />
    case 'step_guide':       return <StepGuideLesson       steps={lesson.steps}                                color={color} onComplete={handleComplete} onShowSign={onShowSign} />
    default: return <div style={{ color:T.muted, textAlign:'center', padding:40 }}>Tipo: {lesson.type}</div>
  }
}

// ─── Lesson Card ──────────────────────────────────────────────────
function LessonCard({ lesson, index, done, color, onClick }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: done ? `${color}07` : h ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.015)',
        border:`1px solid ${done?`${color}30`:h?'rgba(255,255,255,0.12)':'rgba(255,255,255,0.06)'}`,
        borderRadius:16, padding:'16px 20px', cursor:'pointer',
        display:'flex', alignItems:'center', gap:14,
        textAlign:'left', width:'100%', transition:'all 0.18s',
        transform:h?'translateX(2px)':'none',
        boxShadow:h?`-3px 0 0 0 ${color}, 0 0 30px rgba(255,215,0,0.08)`:'none',
      }}>
      <div style={{
        width:38, height:38, borderRadius:11, flexShrink:0,
        background:done?`${color}18`:`${color}0E`, border:`1px solid ${done?`${color}35`:`${color}18`}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:"'Space Mono',monospace", fontSize:12, fontWeight:700, color, transition:'all 0.2s',
      }}>{done?'✓':index+1}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:14, fontWeight:600, color:done?color:T.text, marginBottom:6 }}>
          <Icon icon={lesson.icon} size={18} /> {lesson.title}
        </div>
        <div style={{ display:'flex', gap:6, alignItems:'center', flexWrap:'wrap' }}>
          <Pill label={lesson.diff} color={DIFF_COLOR[lesson.diff]} size="xs" />
          <span style={{ fontSize:11, color:T.faint }}><Icon icon="⏱" size={11} /> {lesson.time}</span>
          <span style={{ fontSize:11, color:'rgba(251,191,36,0.65)' }}><Icon icon="⚡" size={11} /> {lesson.xp} XP</span>
          <span style={{ fontSize:10, color:T.faint }}>{TYPE_LABELS[lesson.type]}</span>
        </div>
      </div>
      <span style={{ color:done?color:h?T.text:'rgba(255,255,255,0.15)', fontSize:18, transition:'all 0.18s', transform:h?'translateX(2px)':'none' }}>
        {done?'✓':'›'}
      </span>
    </button>
  )
}

// ─── Module View ──────────────────────────────────────────────────
function ModuleView({ mod, onSelectLesson, completedIds }) {
  const completedInMod = completedIds.filter(id => mod.lessons.find(l => l.id===id)).length
  const totalXp = mod.lessons.reduce((a,l) => a+l.xp, 0)
  const modKey = Object.keys(MODULE_CONTENT).find(k => MODULE_CONTENT[k] === mod)
  const bgImg = BG_IMAGES[modKey]

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24, alignItems:'flex-start' }}>
      <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
        <div style={{ borderRadius:24, overflow:'hidden', position:'relative', minHeight:220, border:`1px solid ${mod.color}28` }}>
          {bgImg && (
            <div style={{ position:'absolute', inset:0, backgroundImage:`url(${bgImg})`, backgroundSize:'cover', backgroundPosition:'center', opacity:0.22 }} />
          )}
          <div style={{
            position:'absolute', inset:-2, borderRadius:26, zIndex:0,
            background:'linear-gradient(135deg, ' + mod.color + ', #fbbf24, ' + mod.color + ', #a78bfa)',
            backgroundSize:'300% 300%', animation:'shimmer 4s ease infinite',
            opacity:0.3,
          }} />
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, rgba(10,10,14,0.85) 40%, ${mod.color}18)` }} />
          <div style={{ position:'relative', padding:'36px 36px 32px' }}>
            <div style={{
              width:72, height:72, borderRadius:20, marginBottom:22,
              background:`linear-gradient(145deg, ${mod.color}18, rgba(255,255,255,0.03))`,
              border:`1px solid ${mod.color}30`,
              display:'flex', alignItems:'center', justifyContent:'center',
              overflow:'hidden', position:'relative',
              boxShadow:`0 0 30px ${mod.color}15`,
            }}>
              {mod.img ? (
                <img
                  src={`https://commons.wikimedia.org/wiki/Special:FilePath/${mod.img}`}
                  alt={mod.title}
                  style={{
                    width:'100%', height:'100%', objectFit:'contain', padding:8,
                    opacity:0.92,
                    filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.35))',
                  }}
                  onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}
                />
              ) : null}
              <div style={{ position:'absolute', display: mod.img ? 'none' : 'flex', alignItems:'center', justifyContent:'center', inset:0 }}>
                <Icon icon={mod.icon} size={34} />
              </div>
            </div>
            <h1 style={{ fontSize:28, fontWeight:700, color:T.text, marginBottom:10, letterSpacing:'-0.03em', lineHeight:1.15 }}>{mod.title}</h1>
            <p style={{ fontSize:14, color:T.muted, lineHeight:1.65, maxWidth:460 }}>{mod.description}</p>
          </div>
        </div>

        <div>
          <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.25)', textTransform:'uppercase', letterSpacing:'0.12em', fontFamily:"'Space Mono',monospace", marginBottom:12 }}><Icon icon="📚" size={10} /> LECCIONES DEL MÓDULO</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {mod.lessons.map((lesson,i) => (
              <LessonCard key={lesson.id} lesson={lesson} index={i} done={completedIds.includes(lesson.id)} color={mod.color} onClick={() => onSelectLesson(lesson)} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ borderRadius:20, border:`1px solid ${mod.color}22`, background:`linear-gradient(160deg, rgba(255,255,255,0.03), ${mod.color}09)`, padding:'22px 22px', overflow:'hidden', position:'relative' }}>
          <div style={{ position:'absolute', right:-30, top:-30, width:130, height:130, borderRadius:'50%', background:`radial-gradient(circle, ${mod.color}18, transparent 70%)`, pointerEvents:'none' }} />
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontFamily:"'Space Mono',monospace", letterSpacing:'0.1em', marginBottom:18 }}>TU PROGRESO</div>
          {[['Lecciones', mod.lessons.length, mod.color],['XP disponible', totalXp, '#fbbf24'],['Completadas', `${completedInMod}/${mod.lessons.length}`, '#34d399']].map(([l,v,c]) => (
            <div key={l} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize:12, color:T.muted }}>{l}</span>
              <span style={{ fontSize:18, fontWeight:700, color:c, fontFamily:"'Space Mono',monospace" }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:11, color:T.faint }}>Avance</span>
              <span style={{ fontSize:11, color:mod.color, fontFamily:"'Space Mono',monospace" }}>{Math.round((completedInMod/mod.lessons.length)*100)}%</span>
            </div>
            <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:99, overflow:'hidden' }}>
              <div style={{ height:'100%', borderRadius:99, background:mod.color, width:`${(completedInMod/mod.lessons.length)*100}%`, transition:'width 0.6s cubic-bezier(0.34,1.56,0.64,1)' }} />
            </div>
          </div>
        </div>

        <div style={{ borderRadius:20, border:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)', padding:'20px 20px' }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontFamily:"'Space Mono',monospace", letterSpacing:'0.1em', marginBottom:14 }}>PRÓXIMA LECCIÓN</div>
          {(() => {
            const next = mod.lessons.find(l => !completedIds.includes(l.id))
            if (!next) return <div style={{ textAlign:'center', padding:'12px 0', fontSize:13, color:'#34d399' }}>* ¡Módulo completado!</div>
            return (
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:`${mod.color}14`, border:`1px solid ${mod.color}22`, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon icon={next.icon} size={20} /></div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:T.text, marginBottom:3 }}>{next.title}</div>
                    <div style={{ display:'flex', gap:6 }}>
                      <Pill label={next.diff} color={DIFF_COLOR[next.diff]} size="xs" />
                      <span style={{ fontSize:11, color:T.faint }}>⏱ {next.time}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => onSelectLesson(next)} style={{ width:'100%', padding:'12px', borderRadius:12, border:`1.5px solid ${mod.color}50`, background:`${mod.color}0E`, color:mod.color, fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.2s', letterSpacing:'0.01em' }}>
                  Comenzar →
                </button>
              </div>
            )
          })()}
        </div>

        <div style={{ borderRadius:16, border:'1px solid rgba(255,255,255,0.05)', background:'rgba(255,255,255,0.01)', padding:'16px 18px' }}>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.2)', fontFamily:"'Space Mono',monospace", letterSpacing:'0.1em', marginBottom:12 }}>FORMATOS DE LECCIÓN</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {Object.entries(TYPE_LABELS).map(([k,v]) => (
              <div key={k} style={{ fontSize:12, color:T.faint, display:'flex', gap:8, alignItems:'center' }}>
                <span>{v.slice(0,2)}</span><span>{v.slice(3)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────
export function PageModulo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { completedLessons } = useProgress()
  const mod = MODULE_CONTENT[Number(id)]
  const [activeLesson, setActiveLesson] = useState(null)
  const [confetti, setConfetti] = useState(false)
  const [showXP, setShowXP] = useState(false)
  const [signDetail, setSignDetail] = useState(null)

  if (!mod) return (
    <div style={{ padding:48, textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
        <div style={{ width:72, height:72, borderRadius:22, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon icon="🔒" size={36} color="rgba(255,255,255,0.25)" /></div>
      <h2 style={{ fontSize:18, color:T.text }}>Módulo no disponible</h2>
      <p style={{ color:T.muted, fontSize:14 }}>Este módulo aún no está desbloqueado.</p>
      <button onClick={() => navigate(-1)} style={{ padding:'11px 22px', borderRadius:12, border:'1px solid rgba(255,255,255,0.1)', background:'transparent', color:T.text, cursor:'pointer', fontSize:13 }}>← Volver</button>
    </div>
  )

  const handleComplete = () => {
    setConfetti(true); setShowXP(true)
    setTimeout(() => { setConfetti(false); setShowXP(false); setActiveLesson(null) }, 2200)
  }

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes xpFloat  { 0%{opacity:0;transform:translate(-50%,-50%) scale(0.6)} 25%{opacity:1;transform:translate(-50%,-58%) scale(1.08)} 70%{opacity:1;transform:translate(-50%,-70%) scale(1)} 100%{opacity:0;transform:translate(-50%,-85%) scale(0.92)} }
        @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-30px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.9)} }
        @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes cardGlow { 0%,100%{box-shadow:0 0 20px rgba(255,215,0,0)} 50%{box-shadow:0 0 40px rgba(255,215,0,0.1)} }
        .fin { animation: fadeInUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      <div style={{
        position:'fixed', inset:0, zIndex:0, overflow:'hidden', pointerEvents:'none',
      }}>
        <div style={{
          position:'absolute', width:'500px', height:'500px', borderRadius:'50%',
          background:'radial-gradient(circle, rgba(167,139,250,0.08), transparent 70%)',
          top:'-100px', left:'-100px', animation:'orbFloat 12s ease-in-out infinite',
        }} />
        <div style={{
          position:'absolute', width:'400px', height:'400px', borderRadius:'50%',
          background:'radial-gradient(circle, rgba(52,211,153,0.06), transparent 70%)',
          bottom:'-80px', right:'-80px', animation:'orbFloat 15s ease-in-out infinite reverse',
        }} />
        <div style={{
          position:'absolute', width:'300px', height:'300px', borderRadius:'50%',
          background:'radial-gradient(circle, rgba(251,191,36,0.05), transparent 70%)',
          top:'50%', left:'50%', transform:'translate(-50%,-50%)',
          animation:'orbFloat 18s ease-in-out infinite 3s',
        }} />
      </div>

      <Confetti active={confetti} />
      {showXP && <XPFloat visible={showXP} />}

      <SignDetailModal sign={signDetail} onClose={() => setSignDetail(null)} />

      <div style={{ position:'relative', zIndex:1, padding:'0 8px' }}>
        {activeLesson ? (
          <div className="fin">
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
              <button onClick={() => setActiveLesson(null)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.3)', fontSize:12, cursor:'pointer', padding:0, display:'flex', alignItems:'center', gap:6, transition:'color 0.15s', flexShrink:0 }}
                onMouseEnter={e => e.currentTarget.style.color='rgba(255,255,255,0.65)'}
                onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.3)'}
              >← {mod.title}</button>
              <div style={{ width:1, height:16, background:'rgba(255,255,255,0.1)' }} />
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:34, height:34, borderRadius:10, flexShrink:0, background:`${mod.color}14`, border:`1px solid ${mod.color}25`, display:'flex', alignItems:'center', justifyContent:'center' }}><Icon icon={activeLesson.icon} size={18} /></div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:T.text }}>{activeLesson.title}</div>
                  <div style={{ display:'flex', gap:6, marginTop:3 }}>
                    <Pill label={activeLesson.diff} color={DIFF_COLOR[activeLesson.diff]} size="xs" />
                    <span style={{ fontSize:11, color:T.faint }}><Icon icon="⏱" size={11} /> {activeLesson.time}</span>
                    <span style={{ fontSize:11, color:'rgba(251,191,36,0.65)' }}><Icon icon="⚡" size={11} /> {activeLesson.xp} XP</span>
                  </div>
                </div>
              </div>
            </div>
            <LessonGame lesson={activeLesson} color={mod.color} onComplete={handleComplete} onShowSign={setSignDetail} />
          </div>
        ) : (
          <div className="fin">
            <ModuleView mod={mod} onSelectLesson={setActiveLesson} completedIds={completedLessons} />
          </div>
        )}
      </div>
    </>
  )
}