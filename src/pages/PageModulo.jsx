import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { T } from '../styles/tokens'
import { useProgress } from '../context/ProgressContext'

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
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width, y: -10,
      vx: (Math.random() - 0.5) * 6, vy: Math.random() * 4 + 2,
      color: ['#00e676','#ffd740','#ff5252','#18ffff','#ff7043','#448aff'][Math.floor(Math.random()*6)],
      size: Math.random() * 8 + 4, spin: Math.random() * 0.2 - 0.1, angle: 0,
    }))
    let frame
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.angle += p.spin; p.vy += 0.05
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle)
        ctx.fillStyle = p.color; ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size)
        ctx.restore()
      })
      frame = requestAnimationFrame(draw)
    }
    draw()
    const t = setTimeout(() => cancelAnimationFrame(frame), 2500)
    return () => { cancelAnimationFrame(frame); clearTimeout(t) }
  }, [active])
  if (!active) return null
  return <canvas ref={canvasRef} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:9999 }} />
}

// ─── XP Float ─────────────────────────────────────────────────────
function XPFloat({ xp, visible }) {
  if (!visible) return null
  return (
    <div style={{
      position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
      fontSize:48, fontWeight:900, color:'#ffd740', zIndex:9998,
      fontFamily:"'Space Mono',monospace",
      animation:'xpFloat 1.2s ease-out forwards',
      pointerEvents:'none',
      textShadow:'0 0 40px rgba(255,215,64,0.6)',
    }}>+{xp} XP ⚡</div>
  )
}

// ─── Shared: Step Dots ────────────────────────────────────────────
function StepDots({ total, current, color }) {
  return (
    <div style={{ display:'flex', gap:6, marginBottom:24 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex:1, height:4, borderRadius:99,
          background: i < current ? color : i === current ? `${color}60` : 'rgba(255,255,255,0.08)',
          transition:'all 0.35s ease',
        }} />
      ))}
    </div>
  )
}

// ─── Shared: Nav Button ───────────────────────────────────────────
function NavButton({ onClick, label, color, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:'100%', padding:'14px', borderRadius:14, border:'none',
      background: disabled ? 'rgba(255,255,255,0.06)' : color,
      color: disabled ? 'rgba(255,255,255,0.3)' : '#000',
      fontWeight:700, fontSize:15, cursor: disabled ? 'default' : 'pointer',
      transition:'all 0.2s',
      boxShadow: disabled ? 'none' : `0 0 24px ${color}40`,
    }}>{label}</button>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TIPO A: EXPLAINER — Aprende concepto a concepto, a tu ritmo
// Cada paso revela un concepto con ícono grande, título,
// explicación y tip/ley opcional. Sin presión, sin tiempo.
// ═══════════════════════════════════════════════════════════════════
function ExplainerLesson({ steps, color, onComplete }) {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const xpTotal = steps.length * 15

  const step = steps[idx]
  const isLast = idx === steps.length - 1

  const goNext = () => {
    if (isLast) { onComplete(xpTotal); return }
    setVisible(false)
    setTimeout(() => { setIdx(i => i + 1); setVisible(true) }, 200)
  }

  return (
    <div>
      <StepDots total={steps.length} current={idx} color={color} />

      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Visual hero */}
        <div style={{
          borderRadius:22, border:`1px solid ${color}30`,
          background:`linear-gradient(145deg, rgba(255,255,255,0.02), ${color}10)`,
          padding:'36px 28px', marginBottom:20,
          display:'flex', flexDirection:'column', alignItems:'center',
          justifyContent:'center', gap:14, textAlign:'center',
          position:'relative', overflow:'hidden', minHeight:180,
        }}>
          <div style={{
            position:'absolute', width:220, height:220, borderRadius:'50%',
            background:`radial-gradient(circle, ${color}15, transparent 70%)`,
            top:'50%', left:'50%', transform:'translate(-50%,-50%)',
            pointerEvents:'none',
          }} />
          {step.visual && (
            <div style={{ fontSize:72, lineHeight:1, filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>
              {step.visual}
            </div>
          )}
          {step.tag && (
            <div style={{
              padding:'4px 14px', borderRadius:99,
              background:`${color}18`, border:`1px solid ${color}35`,
              fontSize:10, fontWeight:700, color,
              fontFamily:"'Space Mono',monospace", textTransform:'uppercase', letterSpacing:'0.1em',
            }}>{step.tag}</div>
          )}
        </div>

        {/* Content */}
        <div style={{
          background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:18, padding:'22px 24px', marginBottom:20,
        }}>
          <h2 style={{ fontSize:18, fontWeight:700, color:T.text, marginBottom:12, lineHeight:1.4 }}>
            {step.title}
          </h2>
          <p style={{ fontSize:14, color:'rgba(240,244,248,0.85)', lineHeight:1.8, marginBottom:0 }}>
            {step.body}
          </p>
          {step.detail && (
            <div style={{
              marginTop:16, padding:'14px 16px', borderRadius:12,
              background:`${color}0D`, borderLeft:`3px solid ${color}`,
              fontSize:13, color:T.muted, lineHeight:1.7,
            }}>
              <span style={{ fontWeight:700, color, marginRight:6 }}>💡 Recuerda:</span>
              {step.detail}
            </div>
          )}
          {step.tip && (
            <div style={{
              marginTop:12, padding:'12px 16px', borderRadius:12,
              background:'rgba(255,215,64,0.08)', border:'1px solid rgba(255,215,64,0.2)',
              fontSize:13, color:'rgba(255,215,64,0.9)', lineHeight:1.7,
            }}>⚡ {step.tip}</div>
          )}
          {step.law && (
            <div style={{
              marginTop:12, padding:'10px 14px', borderRadius:10,
              background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)',
              fontSize:12, color:T.faint, lineHeight:1.6, fontStyle:'italic',
            }}>📋 {step.law}</div>
          )}
        </div>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <span style={{ fontSize:11, color:T.faint, fontFamily:"'Space Mono',monospace" }}>
            {idx+1} / {steps.length}
          </span>
          <span style={{ fontSize:11, color:'#ffd740', fontFamily:"'Space Mono',monospace" }}>
            +{xpTotal} XP al completar
          </span>
        </div>
        <NavButton onClick={goNext} label={isLast ? '¡Lección completada! ✓' : 'Entendido, continuar →'} color={color} />
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TIPO B: EXPLORER — Toca para descubrir
// Cuadrícula de señales/conceptos. El usuario toca cada una
// para ver su significado. Aprende explorando libremente.
// ═══════════════════════════════════════════════════════════════════
function ExplorerLesson({ items, color, intro, onComplete }) {
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
          background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:14, padding:'14px 18px', marginBottom:20,
          display:'flex', alignItems:'center', gap:12,
        }}>
          <span style={{ fontSize:22 }}>👆</span>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:T.text, marginBottom:3 }}>{intro.title}</div>
            <div style={{ fontSize:12, color:T.muted }}>{intro.subtitle}</div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <span style={{ fontSize:11, color:T.muted, fontFamily:"'Space Mono',monospace" }}>
            EXPLORADAS: {seen.size}/{items.length}
          </span>
          {allSeen && (
            <span style={{ fontSize:11, color:'#00e676', fontFamily:"'Space Mono',monospace" }}>
              ¡Todo descubierto! ✓
            </span>
          )}
        </div>
        <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:99, overflow:'hidden' }}>
          <div style={{
            height:'100%', borderRadius:99, background:color,
            width:`${(seen.size / items.length) * 100}%`,
            transition:'width 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          }} />
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(130px, 1fr))',
        gap:10, marginBottom:20,
      }}>
        {items.map(item => {
          const isActive = active?.id === item.id
          const wasSeen = seen.has(item.id)
          return (
            <button key={item.id} onClick={() => handleTap(item)} style={{
              borderRadius:16, border:'1px solid',
              borderColor: isActive ? color : wasSeen ? `${color}40` : 'rgba(255,255,255,0.09)',
              background: isActive ? `${color}12` : wasSeen ? `${color}06` : 'rgba(255,255,255,0.02)',
              padding:'16px 12px', cursor:'pointer',
              display:'flex', flexDirection:'column', alignItems:'center', gap:8,
              transition:'all 0.25s',
              transform: isActive ? 'scale(1.04)' : 'scale(1)',
              boxShadow: isActive ? `0 8px 24px ${color}25` : 'none',
            }}>
              <div style={{ fontSize:36, lineHeight:1 }}>{item.emoji}</div>
              <div style={{
                fontSize:11, fontWeight:600,
                color: isActive ? color : wasSeen ? T.text : T.muted,
                textAlign:'center', lineHeight:1.3,
              }}>{item.name}</div>
              {wasSeen && !isActive && (
                <div style={{
                  width:16, height:16, borderRadius:'50%',
                  background:`${color}25`, display:'flex',
                  alignItems:'center', justifyContent:'center',
                  fontSize:9, color,
                }}>✓</div>
              )}
            </button>
          )
        })}
      </div>

      {/* Detail panel */}
      {active && (
        <div style={{
          borderRadius:18, border:`1px solid ${color}35`,
          background:`linear-gradient(135deg, rgba(255,255,255,0.03), ${color}0A)`,
          padding:'22px 24px', marginBottom:20,
          animation:'fadeInUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:14 }}>
            <div style={{ fontSize:48 }}>{active.emoji}</div>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color, marginBottom:4 }}>{active.name}</div>
              {active.type && (
                <div style={{
                  display:'inline-block', padding:'2px 10px', borderRadius:99,
                  background:`${active.typeColor || color}18`, border:`1px solid ${active.typeColor || color}30`,
                  fontSize:10, fontWeight:700, color: active.typeColor || color,
                  fontFamily:"'Space Mono',monospace", textTransform:'uppercase',
                }}>{active.type}</div>
              )}
            </div>
          </div>
          <p style={{ fontSize:14, color:'rgba(240,244,248,0.85)', lineHeight:1.8, marginBottom:0 }}>
            {active.meaning}
          </p>
          {active.rule && (
            <div style={{
              marginTop:14, padding:'12px 14px', borderRadius:10,
              background:`${color}0C`, borderLeft:`3px solid ${color}`,
              fontSize:13, color:T.muted, lineHeight:1.6,
            }}>📋 {active.rule}</div>
          )}
          {active.example && (
            <div style={{
              marginTop:12, padding:'12px 14px', borderRadius:10,
              background:'rgba(255,215,64,0.07)', border:'1px solid rgba(255,215,64,0.18)',
              fontSize:13, color:'rgba(255,215,64,0.85)', lineHeight:1.6,
            }}>Ejemplo: {active.example}</div>
          )}
        </div>
      )}

      {allSeen ? (
        <NavButton onClick={() => onComplete(xp)} label={`¡Has explorado todo! Completar (+${xp} XP) →`} color={color} />
      ) : (
        <div style={{ textAlign:'center', padding:'12px', fontSize:12, color:T.faint }}>
          Toca cada señal para aprender — {items.length - seen.size} más por descubrir
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TIPO C: INTERACTIVE DEMO — Toma decisiones y ve las consecuencias
// No hay correcto/incorrecto: hay consecuencias explicadas.
// El aprendizaje viene de entender el por qué de cada resultado.
// ═══════════════════════════════════════════════════════════════════
function InteractiveDemoLesson({ demos, color, onComplete }) {
  const [demoIdx, setDemoIdx] = useState(0)
  const [choice, setChoice] = useState(null)
  const [xpTotal, setXpTotal] = useState(0)

  const demo = demos[demoIdx]
  const isLast = demoIdx === demos.length - 1

  const handleChoice = (option) => {
    if (choice) return
    setChoice(option)
    setXpTotal(x => x + 20)
  }

  const handleNext = () => {
    if (isLast) { onComplete(xpTotal + 10); return }
    setChoice(null)
    setTimeout(() => setDemoIdx(i => i + 1), 150)
  }

  return (
    <div>
      <StepDots total={demos.length} current={demoIdx} color={color} />

      {/* Scene */}
      <div style={{
        borderRadius:20, overflow:'hidden', marginBottom:20, border:`1px solid ${color}28`,
      }}>
        <div style={{
          padding:'28px 24px',
          background:`linear-gradient(160deg, rgba(255,255,255,0.03) 40%, ${color}10)`,
          textAlign:'center',
        }}>
          <div style={{ fontSize:64, marginBottom:12 }}>{demo.scene}</div>
          <h3 style={{ fontSize:16, fontWeight:700, color:T.text, marginBottom:8, lineHeight:1.5 }}>
            {demo.situation}
          </h3>
          {demo.context && (
            <p style={{ fontSize:13, color:T.muted, lineHeight:1.6 }}>{demo.context}</p>
          )}
        </div>
        <div style={{ padding:'12px 20px', background:`${color}10`, borderTop:`1px solid ${color}20` }}>
          <span style={{ fontSize:11, fontWeight:700, color, fontFamily:"'Space Mono',monospace" }}>
            👇 ¿QUÉ HARÍAS TÚ?
          </span>
        </div>
      </div>

      {/* Options */}
      {!choice && (
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
          {demo.options.map((opt, i) => (
            <button key={i} onClick={() => handleChoice(opt)} style={{
              padding:'14px 18px', borderRadius:14,
              border:'1px solid rgba(255,255,255,0.1)',
              background:'rgba(255,255,255,0.03)',
              color:T.text, fontSize:14, fontWeight:500, cursor:'pointer',
              textAlign:'left', display:'flex', alignItems:'center', gap:12,
              transition:'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=`${color}60`; e.currentTarget.style.background=`${color}08` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.background='rgba(255,255,255,0.03)' }}
            >
              <span style={{
                width:28, height:28, borderRadius:8, flexShrink:0,
                background:'rgba(255,255,255,0.05)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:14,
              }}>{['🅐','🅑','🅒','🅓'][i]}</span>
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Consequence panel */}
      {choice && (
        <div style={{ animation:'fadeInUp 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}>
          {/* What you chose */}
          <div style={{
            padding:'12px 18px', borderRadius:12, marginBottom:14,
            background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)',
            display:'flex', alignItems:'center', gap:12,
          }}>
            <span style={{ fontSize:11, color:T.faint, fontFamily:"'Space Mono',monospace", whiteSpace:'nowrap' }}>
              ELEGISTE:
            </span>
            <span style={{ fontSize:14, color:T.text }}>{choice.label}</span>
          </div>

          {/* Consequence */}
          <div style={{
            borderRadius:18, overflow:'hidden', marginBottom:14,
            border:`1px solid ${choice.positive ? 'rgba(0,230,118,0.3)' : 'rgba(255,152,0,0.3)'}`,
          }}>
            <div style={{
              padding:'20px 20px 16px',
              background: choice.positive ? 'rgba(0,230,118,0.06)' : 'rgba(255,152,0,0.06)',
            }}>
              <div style={{ fontSize:32, marginBottom:10, textAlign:'center' }}>{choice.consequenceEmoji}</div>
              <h4 style={{
                fontSize:14, fontWeight:700, textAlign:'center', marginBottom:10,
                color: choice.positive ? '#00e676' : '#ff9800',
              }}>{choice.consequenceTitle}</h4>
              <p style={{ fontSize:13, color:'rgba(240,244,248,0.85)', lineHeight:1.75 }}>
                {choice.consequence}
              </p>
            </div>
            {/* Ideal explanation */}
            <div style={{
              padding:'14px 20px',
              background:'rgba(255,255,255,0.025)',
              borderTop:'1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize:11, fontWeight:700, color, fontFamily:"'Space Mono',monospace", marginBottom:8 }}>
                ✅ LO IDEAL EN ESTA SITUACIÓN
              </div>
              <p style={{ fontSize:13, color:T.muted, lineHeight:1.65 }}>{demo.idealExplanation}</p>
              {demo.law && (
                <p style={{ fontSize:11, color:T.faint, marginTop:8, fontStyle:'italic' }}>📋 {demo.law}</p>
              )}
            </div>
          </div>

          <NavButton
            onClick={handleNext}
            label={isLast ? '¡He aprendido esto! Completar →' : 'Siguiente situación →'}
            color={color}
          />
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TIPO D: STORY — Narración interactiva con consecuencias
// Historia en primera persona. El usuario toma decisiones y ve
// qué pasa. Aprendizaje por experiencia sin penalización.
// ═══════════════════════════════════════════════════════════════════
function StoryLesson({ storyTitle, intro, chapters, color, onComplete }) {
  const [chapterIdx, setChapterIdx] = useState(0)
  const [decision, setDecision] = useState(null)
  const [history, setHistory] = useState([])

  const chapter = chapters[chapterIdx]
  const isLast = chapterIdx === chapters.length - 1

  const handleDecision = (path) => {
    if (decision) return
    setDecision(path)
    setHistory(h => [...h, { id: chapter.id, choice: path.label }])
  }

  const handleContinue = () => {
    if (isLast) { onComplete(chapters.length * 20 + 30); return }
    setDecision(null)
    setTimeout(() => setChapterIdx(i => i + 1), 150)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:24, paddingBottom:20, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize:11, color, fontFamily:"'Space Mono',monospace", marginBottom:6 }}>
          📖 HISTORIA · CAP. {chapterIdx+1}/{chapters.length}
        </div>
        <h2 style={{ fontSize:20, fontWeight:700, color:T.text }}>{storyTitle}</h2>
        {chapterIdx === 0 && intro && (
          <p style={{ fontSize:13, color:T.muted, lineHeight:1.6, marginTop:8 }}>{intro}</p>
        )}
      </div>

      {/* Chapter scene */}
      <div style={{
        background:`linear-gradient(145deg, rgba(255,255,255,0.03), ${color}08)`,
        border:`1px solid ${color}22`, borderRadius:20, padding:'24px 22px', marginBottom:20,
      }}>
        {chapter.sceneEmoji && (
          <div style={{ fontSize:52, textAlign:'center', marginBottom:16 }}>{chapter.sceneEmoji}</div>
        )}
        <div style={{
          fontSize:11, color, fontFamily:"'Space Mono',monospace",
          marginBottom:12, textTransform:'uppercase', letterSpacing:'0.08em',
        }}>{chapter.location || 'EN LA VÍA'}</div>
        <p style={{ fontSize:15, color:T.text, lineHeight:1.85 }}>{chapter.narrative}</p>
      </div>

      {/* Decision */}
      {chapter.decision && !decision && (
        <>
          <div style={{ fontSize:12, fontWeight:700, color:T.muted, fontFamily:"'Space Mono',monospace", marginBottom:12 }}>
            🔀 ¿QUÉ DECIDES?
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {chapter.decision.paths.map((path, i) => (
              <button key={i} onClick={() => handleDecision(path)} style={{
                padding:'14px 18px', borderRadius:14,
                border:'1px solid rgba(255,255,255,0.1)',
                background:'rgba(255,255,255,0.03)',
                color:T.text, fontSize:14, cursor:'pointer',
                textAlign:'left', transition:'all 0.2s',
                display:'flex', gap:12, alignItems:'flex-start',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=`${color}60`; e.currentTarget.style.background=`${color}08`; e.currentTarget.style.transform='translateX(4px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.transform='translateX(0)' }}
              >
                <span style={{ fontSize:18, flexShrink:0, marginTop:1 }}>{path.emoji}</span>
                <span style={{ lineHeight:1.5 }}>{path.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* After decision */}
      {decision && (
        <div style={{ animation:'fadeInUp 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <div style={{
            borderRadius:18, marginBottom:16, overflow:'hidden',
            border:`1px solid ${decision.positive ? 'rgba(0,230,118,0.3)' : decision.neutral ? 'rgba(255,215,64,0.25)' : 'rgba(255,152,0,0.3)'}`,
          }}>
            <div style={{
              padding:'18px 20px',
              background: decision.positive ? 'rgba(0,230,118,0.06)' : decision.neutral ? 'rgba(255,215,64,0.05)' : 'rgba(255,152,0,0.06)',
            }}>
              <div style={{ fontSize:28, marginBottom:10 }}>
                {decision.positive ? '✅' : decision.neutral ? '⚠️' : '❗'}
              </div>
              <p style={{ fontSize:14, color:T.text, lineHeight:1.8, marginBottom:12 }}>
                {decision.consequence}
              </p>
            </div>
            <div style={{
              padding:'16px 20px', background:'rgba(255,255,255,0.025)',
              borderTop:'1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{
                fontSize:10, fontWeight:700, color, fontFamily:"'Space Mono',monospace",
                marginBottom:8, textTransform:'uppercase', letterSpacing:'0.1em',
              }}>🧠 Lo que aprendemos aquí</div>
              <p style={{ fontSize:13, color:T.muted, lineHeight:1.7 }}>{decision.learning}</p>
            </div>
          </div>
          <NavButton
            onClick={handleContinue}
            label={isLast ? '🏁 Fin de la historia · Completar' : 'Continuar la historia →'}
            color={color}
          />
        </div>
      )}

      {/* No-decision chapters */}
      {!chapter.decision && (
        <NavButton
          onClick={handleContinue}
          label={isLast ? '🏁 Completar lección' : 'Continuar →'}
          color={color}
        />
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TIPO E: CONCEPT MAP — Acordeón de conceptos que el usuario
// abre a su ritmo. Aprende las conexiones entre ideas.
// ═══════════════════════════════════════════════════════════════════
function ConceptMapLesson({ concepts, color, onComplete }) {
  const [revealed, setRevealed] = useState(new Set())
  const [active, setActive] = useState(null)

  const toggle = (id) => {
    setRevealed(s => new Set([...s, id]))
    setActive(active === id ? null : id)
  }

  const allRevealed = revealed.size === concepts.length
  const xp = Math.round((revealed.size / concepts.length) * 60) + 20

  return (
    <div>
      <div style={{
        background:'rgba(255,255,255,0.02)', borderRadius:12,
        border:'1px solid rgba(255,255,255,0.07)',
        padding:'12px 16px', marginBottom:20,
        display:'flex', alignItems:'center', gap:10,
      }}>
        <span style={{ fontSize:18 }}>🗺️</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12, fontWeight:600, color:T.text }}>Mapa de conceptos</div>
          <div style={{ fontSize:11, color:T.muted }}>Toca cada concepto para expandirlo y aprender</div>
        </div>
        <div style={{ fontSize:11, color, fontFamily:"'Space Mono',monospace" }}>
          {revealed.size}/{concepts.length}
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {concepts.map((concept, i) => {
          const isOpen = active === concept.id
          const wasSeen = revealed.has(concept.id)
          return (
            <div key={concept.id} style={{ animation:`fadeInUp 0.3s ease ${i * 0.06}s both` }}>
              <button onClick={() => toggle(concept.id)} style={{
                width:'100%', padding:'16px 18px',
                borderRadius: isOpen ? '16px 16px 0 0' : 16,
                border:'1px solid',
                borderColor: isOpen ? color : wasSeen ? `${color}35` : 'rgba(255,255,255,0.08)',
                borderBottom: isOpen ? `1px solid ${color}20` : undefined,
                background: isOpen ? `${color}10` : wasSeen ? `${color}05` : 'rgba(255,255,255,0.02)',
                cursor:'pointer', textAlign:'left',
                display:'flex', alignItems:'center', gap:14, transition:'all 0.25s',
              }}>
                <div style={{
                  width:36, height:36, borderRadius:10, flexShrink:0,
                  background: isOpen ? `${color}20` : wasSeen ? `${color}12` : 'rgba(255,255,255,0.05)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:20,
                }}>{concept.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600, color: isOpen ? color : T.text }}>
                    {concept.title}
                  </div>
                  <div style={{ fontSize:11, color:T.faint, marginTop:2 }}>{concept.subtitle}</div>
                </div>
                <div style={{
                  color: isOpen ? color : T.faint, fontSize:18,
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition:'transform 0.25s',
                }}>›</div>
              </button>

              {isOpen && (
                <div style={{
                  borderRadius:'0 0 16px 16px',
                  border:`1px solid ${color}25`, borderTop:'none',
                  background:`linear-gradient(180deg, ${color}06, rgba(255,255,255,0.01))`,
                  padding:'18px 20px', animation:'fadeInUp 0.2s ease',
                }}>
                  <p style={{ fontSize:14, color:'rgba(240,244,248,0.9)', lineHeight:1.8 }}>
                    {concept.explanation}
                  </p>
                  {concept.keyPoints && (
                    <div style={{ marginTop:14 }}>
                      {concept.keyPoints.map((point, pi) => (
                        <div key={pi} style={{ display:'flex', alignItems:'flex-start', gap:10, marginTop:8 }}>
                          <div style={{
                            width:6, height:6, borderRadius:'50%',
                            background:color, flexShrink:0, marginTop:7,
                          }} />
                          <span style={{ fontSize:13, color:T.muted, lineHeight:1.6 }}>{point}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {concept.law && (
                    <div style={{
                      marginTop:14, padding:'10px 14px', borderRadius:10,
                      background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
                      fontSize:12, color:T.faint, fontStyle:'italic',
                    }}>📋 {concept.law}</div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {allRevealed && (
        <div style={{ marginTop:20, animation:'fadeInUp 0.3s ease' }}>
          <div style={{
            padding:'14px 18px', borderRadius:14, marginBottom:14,
            background:'rgba(0,230,118,0.08)', border:'1px solid rgba(0,230,118,0.2)',
            textAlign:'center', fontSize:13, color:'#00e676',
          }}>🌟 ¡Has explorado todos los conceptos! +{xp} XP</div>
          <NavButton onClick={() => onComplete(xp)} label="Completar lección ✓" color={color} />
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// TIPO F: STEP GUIDE — Guía procedimental paso a paso
// Para maniobras, procedimientos y protocolos. El usuario
// avanza a su ritmo con navegación libre entre pasos.
// ═══════════════════════════════════════════════════════════════════
function StepGuideLesson({ steps, color, onComplete }) {
  const [current, setCurrent] = useState(0)

  const step = steps[current]
  const isLast = current === steps.length - 1

  const goNext = () => {
    if (isLast) { onComplete(steps.length * 12 + 20); return }
    setCurrent(i => i + 1)
  }

  return (
    <div>
      {/* Vertical stepper */}
      <div style={{ display:'flex', gap:16, marginBottom:24 }}>
        {/* Step indicators */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:0, flexShrink:0 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              <button onClick={() => i < current && setCurrent(i)} style={{
                width:32, height:32, borderRadius:'50%', border:'none',
                background: i < current ? `${color}20` : i === current ? color : 'rgba(255,255,255,0.06)',
                border: `2px solid ${i < current ? color : i === current ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:11, fontWeight:700,
                color: i < current ? color : i === current ? '#000' : T.faint,
                fontFamily:"'Space Mono',monospace", transition:'all 0.3s',
                cursor: i < current ? 'pointer' : 'default', flexShrink:0,
              }}>
                {i < current ? '✓' : i + 1}
              </button>
              {i < steps.length - 1 && (
                <div style={{
                  width:2, height:20, flexShrink:0,
                  background: i < current ? color : 'rgba(255,255,255,0.08)',
                  transition:'background 0.3s',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Current step card */}
        <div key={current} style={{
          flex:1,
          background:`linear-gradient(135deg, rgba(255,255,255,0.03), ${color}08)`,
          border:`1px solid ${color}28`, borderRadius:18, padding:'20px 20px',
          animation:'fadeInUp 0.3s ease',
        }}>
          <div style={{ fontSize:11, color, fontFamily:"'Space Mono',monospace", marginBottom:10 }}>
            PASO {current+1} DE {steps.length}
          </div>
          {step.emoji && (
            <div style={{ fontSize:44, marginBottom:12 }}>{step.emoji}</div>
          )}
          <h3 style={{ fontSize:16, fontWeight:700, color:T.text, marginBottom:10 }}>
            {step.action}
          </h3>
          <p style={{ fontSize:13, color:'rgba(240,244,248,0.85)', lineHeight:1.75 }}>
            {step.explanation}
          </p>
          {step.warning && (
            <div style={{
              marginTop:14, padding:'10px 14px', borderRadius:10,
              background:'rgba(255,152,0,0.08)', border:'1px solid rgba(255,152,0,0.25)',
              fontSize:12, color:'#ffb74d', lineHeight:1.6,
            }}>⚠️ {step.warning}</div>
          )}
          {step.tip && (
            <div style={{
              marginTop:10, padding:'10px 14px', borderRadius:10,
              background:'rgba(255,215,64,0.07)', border:'1px solid rgba(255,215,64,0.2)',
              fontSize:12, color:'rgba(255,215,64,0.85)', lineHeight:1.6,
            }}>💡 {step.tip}</div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display:'flex', gap:10 }}>
        {current > 0 && (
          <button onClick={() => setCurrent(i => i - 1)} style={{
            padding:'13px 18px', borderRadius:14,
            border:'1px solid rgba(255,255,255,0.1)',
            background:'transparent', color:T.muted,
            fontSize:14, cursor:'pointer', whiteSpace:'nowrap',
          }}>← Atrás</button>
        )}
        <div style={{ flex:1 }}>
          <NavButton
            onClick={goNext}
            label={isLast ? '✓ ¡Lo entendí! Completar' : `Siguiente: ${steps[current+1]?.action?.slice(0,30)}... →`}
            color={color}
          />
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// DATOS DE MÓDULOS
// ═══════════════════════════════════════════════════════════════════
const MODULE_CONTENT = {
  1: {
    icon:'🚦', title:'Señales de tránsito', color:'#ff5252',
    description:'Las señales viales son el lenguaje universal de la carretera. Conocerlas puede salvarte la vida.',
    lessons: [
      {
        id:1, icon:'🗂️', title:'El sistema de señales',
        diff:'fácil', time:'5 min', xp:80, type:'explainer',
        steps: [
          {
            tag:'Introducción', visual:'🚦',
            title:'Las señales hablan un idioma universal',
            body:'En Colombia y en casi todo el mundo, las señales de tránsito están estandarizadas por forma y color. Esto significa que puedes entender una señal incluso sin leer el texto: su forma y color ya te dicen de qué tipo es.',
            tip:'La forma y el color son la clave. Antes de leer el texto, ya sabes si una señal te prohíbe algo, te advierte, o te informa.',
          },
          {
            tag:'Tipo 1', visual:'⛔',
            title:'Señales Reglamentarias — Color rojo, forma circular',
            body:'Las señales circulares con borde rojo son ÓRDENES. No son sugerencias. Indican prohibiciones o restricciones que debes cumplir obligatoriamente. Ignorarlas puede resultar en multas o en accidentes graves.',
            detail:'Círculo rojo = obligación. Esto incluye el STOP, los límites de velocidad y las prohibiciones de giro o circulación.',
            law:'Ley 769/2002 — Manual de Señalización Vial de Colombia.',
          },
          {
            tag:'Tipo 2', visual:'⚠️',
            title:'Señales Preventivas — Color amarillo, forma de rombo o triángulo',
            body:'Las señales amarillas en forma de rombo o triángulo te ADVIERTEN de un peligro próximo. No te prohíben nada, pero te piden que reduzcas la velocidad y aumentes la atención. Pueden anunciar curvas, cruces, zonas escolares o presencia de fauna.',
            detail:'Amarillo = peligro adelante. Son tu sistema de alerta temprana en la carretera.',
          },
          {
            tag:'Tipo 3', visual:'🪧',
            title:'Señales Informativas — Color azul o verde, forma rectangular',
            body:'Las señales rectangulares azules o verdes te INFORMAN. Muestran destinos, distancias, servicios disponibles o características de la vía. No tienen fuerza obligatoria, pero son esenciales para orientarte.',
            detail:'Azul = información local. Verde = información de rutas y destinos a larga distancia.',
          },
          {
            tag:'Resumen', visual:'🧠',
            title:'El truco para recordarlo siempre',
            body:'Pregúntate el color de la señal. Rojo → debo obedecer. Amarillo → debo prestar atención. Azul/verde → estoy recibiendo información.',
            tip:'Cada vez que veas una señal, menciona mentalmente su tipo. En pocas semanas lo harás automáticamente.',
          },
        ],
      },
      {
        id:2, icon:'⛔', title:'Señales Reglamentarias en detalle',
        diff:'fácil', time:'7 min', xp:70, type:'explorer',
        intro: {
          title:'Toca cada señal para descubrir qué significa',
          subtitle:'Aprende las señales más importantes de la vía a tu propio ritmo',
        },
        items: [
          {
            id:'stop', name:'STOP', emoji:'🛑', type:'Reglamentaria', typeColor:'#ff5252',
            meaning:'Detención total y obligatoria. Debes detener completamente el vehículo antes de la línea de parada, independientemente de si hay otros vehículos o no. No es negociable: incluso a las 3am sin un alma en la calle, debes parar completamente.',
            rule:'Detenerse sin completar la parada total es infracción grave. Multa + descuento de puntos de licencia.',
            example:'Llegas a una intersección con señal de STOP. Reduces, frenas completamente, miras en ambas direcciones y solo entonces avanzas.',
          },
          {
            id:'ceda', name:'Ceda el paso', emoji:'🔺', type:'Reglamentaria', typeColor:'#ff5252',
            meaning:'No es una detención total como el STOP, pero debes reducir la velocidad y dejar pasar a los vehículos que tienen prioridad. Si hay que parar para ceder el paso, se para.',
            rule:'Triángulo invertido con borde rojo. No ignorarlo: es infracción.',
            example:'Sales de un barrio a una avenida principal con señal de ceda. Esperas a que no haya vehículos en la avenida antes de incorporarte.',
          },
          {
            id:'velocidad', name:'Límite de velocidad', emoji:'🔢', type:'Reglamentaria', typeColor:'#ff5252',
            meaning:'Un número dentro de un círculo rojo establece la velocidad MÁXIMA permitida en esa zona. No es la velocidad recomendada ni ideal: es el límite legal. Superarlo en cualquier carril es infracción.',
            rule:'El límite aplica en todos los carriles. Circular a 60 en zona de 50, aunque todos lo hagan, es infracción.',
            example:'Entras a un barrio residencial y la señal dice 30. Reduces a 30 km/h aunque la vía parezca despejada.',
          },
          {
            id:'prohibido', name:'Prohibido el paso', emoji:'🚫', type:'Reglamentaria', typeColor:'#ff5252',
            meaning:'Círculo rojo con barra blanca horizontal. Significa que no puedes circular en esa dirección. Muy común al inicio de vías de un solo sentido.',
            rule:'Entrar en contravía es una de las infracciones más peligrosas y más multadas.',
            example:'Ves esta señal en la calle hacia la que ibas a girar. No entres: es de sentido contrario.',
          },
          {
            id:'no_giro', name:'Giro prohibido', emoji:'🔄', type:'Reglamentaria', typeColor:'#ff5252',
            meaning:'Señal circular roja con una flecha tachada. Indica que el giro en esa dirección está prohibido, incluso si el semáforo está en verde.',
            rule:'El giro prohibido aplica aunque el semáforo permita circular.',
            example:'Semáforo verde pero hay señal de "No gire a la izquierda". No puedes girar aunque el semáforo esté en verde.',
          },
          {
            id:'no_adelantar', name:'No adelantar', emoji:'🚘', type:'Reglamentaria', typeColor:'#ff5252',
            meaning:'Prohíbe sobrepasar a otros vehículos en ese tramo. Aparece en curvas, zonas de poca visibilidad o segmentos donde adelantar sería extremadamente peligroso.',
            rule:'Adelantar donde está prohibido es infracción muy grave: multa alta + riesgo de accidente mortal.',
            example:'Llevas un rato detrás de un camión lento, pero ves la señal de no adelantar. Esperas a que desaparezca y la visibilidad sea buena.',
          },
        ],
      },
      {
        id:3, icon:'⚠️', title:'Señales Preventivas: qué te advierten',
        diff:'fácil', time:'6 min', xp:75, type:'concept_map',
        concepts: [
          {
            id:'curva', emoji:'〽️',
            title:'Curva peligrosa', subtitle:'Reducir velocidad antes de entrar',
            explanation:'Indica que viene una curva con ángulo pronunciado. Debes reducir la velocidad ANTES de entrar a la curva, no dentro de ella. Frenar en una curva puede hacerte perder el control del vehículo.',
            keyPoints:[
              'Si hay una flecha, indica la dirección de la curva.',
              'Reduce antes de llegar a la curva, no durante.',
              'En lluvia, reduce aún más: el pavimento mojado disminuye la adherencia.',
            ],
          },
          {
            id:'escolar', emoji:'🚸',
            title:'Zona escolar', subtitle:'Máxima atención — niños cerca',
            explanation:'Indica que estás cerca de una institución educativa y que pueden haber niños cruzando la vía. En horarios de entrada y salida de clases, la velocidad se reduce drásticamente (normalmente 30 km/h o menos si hay señal).',
            keyPoints:[
              'Los niños son impredecibles: pueden cruzar sin mirar.',
              'La señal aplica aunque no veas niños en ese momento.',
            ],
            law:'En zonas escolares activas la autoridad puede imponer límites de 30 km/h o inferiores.',
          },
          {
            id:'animal', emoji:'🦌',
            title:'Cruce de animales', subtitle:'Fauna silvestre o doméstica en la vía',
            explanation:'Frecuente en carreteras que atraviesan zonas rurales o parques naturales. Advierte que animales pueden cruzar inesperadamente. De noche, los animales no son visibles hasta el último momento.',
            keyPoints:[
              'Reduce la velocidad para tener tiempo de reacción.',
              'Si un animal cruza, frena recto: no hagas maniobras bruscas.',
              'De noche, usa luces largas donde no haya tráfico de frente.',
            ],
          },
          {
            id:'obra', emoji:'🚧',
            title:'Zona de obras', subtitle:'Trabajadores en la vía — velocidad reducida',
            explanation:'Indica trabajos en la vía: carriles cerrados, desvíos, superficies irregulares o trabajadores en la calzada. Requiere máxima atención.',
            keyPoints:[
              'Sigue las instrucciones del personal de obra.',
              'La señalización temporal puede estar mal iluminada de noche.',
            ],
          },
          {
            id:'interseccion', emoji:'✛',
            title:'Intersección próxima', subtitle:'Puede haber tráfico cruzado',
            explanation:'Advierte que viene una intersección donde puede haber vehículos cruzando. Debes reducir la velocidad y prepararte para ceder el paso si es necesario.',
            keyPoints:[
              'Anticipar la intersección te da más tiempo de reacción.',
              'En intersecciones sin señal, tiene prioridad quien viene por la derecha.',
            ],
          },
        ],
      },
    ],
  },

  2: {
    icon:'📋', title:'Normas básicas', color:'#18ffff',
    description:'Las reglas del juego en la vía pública. Sin ellas, el tráfico sería un caos total.',
    lessons: [
      {
        id:4, icon:'🚦', title:'Los semáforos y su lógica',
        diff:'fácil', time:'6 min', xp:70, type:'explainer',
        steps: [
          {
            tag:'Verde', visual:'🟢',
            title:'Verde: puedes avanzar — pero con criterio',
            body:'La luz verde no significa "avanza sin mirar". Significa que tienes prioridad para circular. Antes de arrancar, verifica que la intersección esté libre y que nadie cruce en rojo.',
            tip:'Aunque el verde sea tuyo, siempre mira antes de cruzar una intersección.',
          },
          {
            tag:'Amarillo', visual:'🟡',
            title:'Amarillo: prepárate para detenerte',
            body:'El amarillo no significa "acelera". Significa que el rojo está por llegar. Evalúa: si puedes frenar de forma segura antes de la línea, frena. Si ya estás demasiado cerca y frenar bruscamente sería peligroso, cruza con precaución.',
            detail:'Frenar de golpe en amarillo puede causar un choque por detrás. El buen criterio es clave.',
          },
          {
            tag:'Rojo', visual:'🔴',
            title:'Rojo: detención total — siempre',
            body:'El rojo es rojo a toda hora y en todas las circunstancias. Ni a las 3am en una calle vacía, ni en carretera, ni con prisa. En Colombia, saltarse el semáforo en rojo es infracción grave.',
            law:'Ley 769/2002 Art. 79 — El conductor debe detenerse ante la luz roja.',
          },
          {
            tag:'Peatones', visual:'🚶',
            title:'Verde para girar: el peatón tiene prioridad',
            body:'Puedes tener luz verde para girar, pero si hay un peatón cruzando legalmente por el paso de cebra, el peatón tiene prioridad absoluta. Debes esperar a que cruce completamente.',
            law:'Ley 769/2002 Art. 76 — El peatón en paso habilitado tiene prioridad sobre los vehículos.',
            tip:'Nunca topes la bocina al peatón para que se apure. Espera.',
          },
          {
            tag:'Sin semáforo', visual:'❓',
            title:'Intersección sin semáforo ni señal',
            body:'Cuando no hay señal ni semáforo, la prioridad la tiene el vehículo que viene por la derecha. Esto se llama la "norma de la derecha".',
            detail:'En intersecciones sin señal: mira a tu derecha. Si viene alguien, cede el paso.',
          },
        ],
      },
      {
        id:5, icon:'🏎️', title:'Velocidades: los límites y su razón de ser',
        diff:'fácil', time:'7 min', xp:70, type:'concept_map',
        concepts: [
          {
            id:'urbana', emoji:'🏙️',
            title:'Zona urbana: hasta 50 km/h', subtitle:'La velocidad en ciudad',
            explanation:'En Colombia, la velocidad máxima en zona urbana es de 50 km/h, salvo señal diferente. Este límite no es arbitrario: a 50 km/h la distancia de frenado en pavimento seco es de unos 25 metros. A 70 km/h, sería más de 50 metros.',
            keyPoints:[
              'Un peatón atropellado a 30 km/h tiene 90% de probabilidad de sobrevivir.',
              'A 50 km/h, la probabilidad de muerte del peatón es del 45%.',
              'A 70 km/h, la probabilidad de muerte del peatón supera el 85%.',
            ],
            law:'Resolución 1885 de 2015 — Límites de velocidad en Colombia.',
          },
          {
            id:'carretera', emoji:'🛣️',
            title:'Carretera nacional: hasta 80 km/h', subtitle:'Para vehículos particulares',
            explanation:'En carreteras nacionales el límite general para autos es 80 km/h. Algunos tramos de doble calzada pueden tener hasta 100 km/h si hay señal que lo indique.',
            keyPoints:[
              'Siempre obedece la señal más restrictiva que veas.',
              'En lluvia o niebla, reduce aunque el límite sea mayor.',
              'El carril izquierdo es para adelantar, no para ir a mayor velocidad.',
            ],
          },
          {
            id:'lluvia', emoji:'🌧️',
            title:'Lluvia: el límite legal no es suficiente', subtitle:'Condiciones reales de la vía',
            explanation:'Con lluvia, el pavimento mojado puede duplicar la distancia de frenado. Debes reducir por debajo del límite cuando llueve, hay niebla, el pavimento está en mal estado o la visibilidad es reducida.',
            keyPoints:[
              'Ir a la velocidad máxima con lluvia fuerte puede ser imprudente.',
              'Aquaplaning: a alta velocidad en agua, las llantas pierden contacto con el pavimento.',
              'Aumenta la distancia de seguimiento al vehículo de adelante.',
            ],
          },
          {
            id:'exceso', emoji:'📉',
            title:'Consecuencias reales de exceder la velocidad', subtitle:'Más allá de la multa',
            explanation:'La energía de impacto en un accidente aumenta exponencialmente con la velocidad. Un choque a 100 km/h libera cuatro veces más energía que uno a 50 km/h.',
            keyPoints:[
              'Multa económica: puede superar 15 SMLDV.',
              'Descuento de puntos de licencia: acumulando puntos se pierde la licencia.',
              'Aumento del riesgo de accidente mortal de forma exponencial.',
            ],
          },
        ],
      },
      {
        id:6, icon:'🤝', title:'Prioridades en la vía',
        diff:'medio', time:'8 min', xp:85, type:'interactive_demo',
        demos: [
          {
            scene:'🚑',
            situation:'Una ambulancia con sirena y luces activas se aproxima por detrás.',
            context:'Estás en una calle de dos carriles. El vehículo de emergencias viene por tu carril.',
            options:[
              { label:'Me orillo gradualmente a la derecha y reduzco la velocidad', positive:true, consequenceEmoji:'✅', consequenceTitle:'¡Correcto! Así se hace', consequence:'Al orillar a la derecha de forma gradual y segura, le abres paso a la ambulancia sin crear peligro adicional. El vehículo de emergencias puede continuar sin obstáculos.' },
              { label:'Freno en seco en mi carril para que me esquive', positive:false, consequenceEmoji:'❗', consequenceTitle:'Peligroso y contraproducente', consequence:'Frenar bruscamente en tu carril sin moverse puede causar un choque con el vehículo que viene detrás de ti y dificulta el paso de la ambulancia. Nunca frenes en seco: orilla y reduce gradualmente.' },
              { label:'Acelero para abrirle espacio adelante', positive:false, consequenceEmoji:'⚠️', consequenceTitle:'No es la solución correcta', consequence:'Acelerar puede parecer útil, pero si la ambulancia va más rápido que tú, no estás resolviendo el problema. Además puedes crear otro peligro adelante.' },
              { label:'Cambio de carril a la izquierda rápidamente', positive:false, consequenceEmoji:'❗', consequenceTitle:'Maniobra incorrecta', consequence:'Cambiar al carril izquierdo es exactamente lo contrario de lo que debes hacer: le bloqueas el paso. Siempre orilla A LA DERECHA.' },
            ],
            idealExplanation:'Ante un vehículo de emergencias con sirena activa: orilla gradualmente a la derecha, reduce la velocidad y detente si es necesario. Hazlo de forma segura, sin frenar bruscamente.',
            law:'Ley 769/2002 Art. 70 — Los conductores deben ceder el paso a vehículos de emergencia.',
          },
          {
            scene:'🚗🚗',
            situation:'Llegas a una intersección sin señales ni semáforos. Hay un vehículo a tu derecha también aproximándose.',
            context:'Los dos van aproximadamente a la misma velocidad y llegarán al cruce casi al mismo tiempo.',
            options:[
              { label:'Cedo el paso: él viene por mi derecha, tiene prioridad', positive:true, consequenceEmoji:'✅', consequenceTitle:'Perfecto — dominaste la norma', consequence:'En intersecciones sin señal, quien viene por la derecha tiene prioridad. Al ceder el paso, cumpliste la norma correctamente y evitaste un choque.' },
              { label:'Acelero para cruzar primero antes de que llegue', positive:false, consequenceEmoji:'❗', consequenceTitle:'Arriesgado e incorrecto', consequence:'Acelerar para "ganarle" al que tiene prioridad es peligroso y puede terminar en un choque de frente.' },
              { label:'Toco la bocina para avisarle que voy a pasar', positive:false, consequenceEmoji:'⚠️', consequenceTitle:'La bocina no da prioridad', consequence:'Tocar la bocina no te da prioridad legal. Quien viene por tu derecha tiene la prioridad sin importar lo que hagas.' },
              { label:'Freno completamente y espero a que él pase', positive:true, consequenceEmoji:'✅', consequenceTitle:'Correcto también', consequence:'Frenar y ceder es igualmente válido. Lo importante es que el de tu derecha pase primero.' },
            ],
            idealExplanation:'En intersecciones sin señal ni semáforo, rige la norma de la derecha: el vehículo que viene por tu derecha tiene prioridad.',
            law:'Ley 769/2002 Art. 81 — En intersecciones sin señal, tiene prioridad el vehículo que viene por la derecha.',
          },
          {
            scene:'🚶‍♂️',
            situation:'Vas a girar a la derecha con luz verde. Un peatón comienza a cruzar por el paso peatonal.',
            context:'El semáforo de peatones también está en verde.',
            options:[
              { label:'Espero pacientemente a que el peatón cruce completamente', positive:true, consequenceEmoji:'✅', consequenceTitle:'Así es — el peatón tiene prioridad', consequence:'Aunque tu semáforo esté en verde para girar, el peatón en el paso habilitado tiene prioridad absoluta. Esperaste correctamente.' },
              { label:'Giro lento esperando que el peatón se haga a un lado', positive:false, consequenceEmoji:'❗', consequenceTitle:'El giro es incorrecto', consequence:'Girar mientras el peatón está cruzando es arriesgado e ilegal. Si el peatón cambia de dirección o tropieza, puedes atropellarlo.' },
              { label:'Toco la bocina suavemente para que se apure', positive:false, consequenceEmoji:'⚠️', consequenceTitle:'La bocina al peatón está mal', consequence:'Tocarle la bocina a un peatón que cruza legalmente es irrespetuoso e innecesario. El peatón tiene prioridad; es tu deber esperar.' },
            ],
            idealExplanation:'El peatón en el paso peatonal habilitado tiene siempre prioridad, incluso cuando tú tienes luz verde para girar. Espera a que cruce completamente.',
            law:'Ley 769/2002 Art. 76 — El peatón en paso habilitado tiene prioridad sobre los vehículos.',
          },
        ],
      },
    ],
  },

  3: {
    icon:'🤝', title:'Comportamiento vial', color:'#ff9800',
    description:'Tu actitud al volante importa tanto como tu habilidad. Aprende a convivir con otros en la vía.',
    lessons: [
      {
        id:7, icon:'🪞', title:'El sistema de espejos — cómo usarlos',
        diff:'fácil', time:'6 min', xp:70, type:'step_guide',
        steps: [
          {
            emoji:'🔧', action:'Ajusta los espejos ANTES de arrancar',
            explanation:'Los espejos deben ajustarse con el cuerpo en posición de conducción. El retrovisor central debe mostrar la luneta trasera completa. Los espejos laterales deben mostrar apenas el borde de tu vehículo y un amplio campo de la vía lateral trasera.',
            tip:'Si ves mucho de tu propio carro en los laterales, están apuntando demasiado hacia adentro. Gíralos más hacia afuera.',
          },
          {
            emoji:'👀', action:'Revisa los espejos cada 5-8 segundos en marcha',
            explanation:'Conducir bien no es solo mirar hacia adelante. Un buen conductor hace un ciclo visual constante: adelante → espejo central → espejo izquierdo → espejo derecho → adelante. Esto te da una imagen actualizada de todo lo que rodea a tu vehículo.',
            tip:'Si llevas más de 10 segundos sin revisar los espejos, estás perdiendo información crítica sobre tu entorno.',
          },
          {
            emoji:'🔍', action:'Verifica el punto ciego antes de cambiar de carril',
            explanation:'Los espejos tienen un límite: no cubren una zona a tus lados traseros llamada "punto ciego". Antes de cambiar de carril, debes girar levemente la cabeza hacia el lado al que quieres moverte para verificar que no haya un vehículo en esa zona invisible.',
            warning:'El punto ciego puede ocultar a una moto o incluso a un auto pequeño completamente. Nunca cambies de carril sin verificarlo.',
          },
          {
            emoji:'➡️', action:'La secuencia correcta para cambiar de carril',
            explanation:'El orden importa: 1) Espejo central, 2) Espejo lateral del lado al que irás, 3) Gira la cabeza para verificar el punto ciego, 4) Activa el indicador (pisca), 5) Maniobra gradualmente.',
            tip:'Si te saltas el punto ciego (paso 3), los demás pasos no te protegen de un vehículo invisible.',
          },
          {
            emoji:'🌙', action:'De noche: activa el modo nocturno del retrovisor',
            explanation:'La mayoría de los retrovisores tienen una palanca inferior que los pone en modo nocturno. Esto reduce el deslumbramiento de los faros de los vehículos que vienen detrás. Úsalo siempre que conduzcas de noche.',
          },
        ],
      },
      {
        id:8, icon:'📱', title:'Distracciones: qué le pasa a tu cerebro',
        diff:'medio', time:'7 min', xp:80, type:'explainer',
        steps: [
          {
            tag:'El problema', visual:'📱',
            title:'El celular: por qué es tan peligroso',
            body:'A 60 km/h, mirar el celular durante solo 3 segundos equivale a recorrer 50 metros con los ojos completamente cerrados. En ese espacio puede haber un semáforo, un peatón o un vehículo frenando bruscamente.',
            tip:'50 metros a ojos cerrados. Eso es lo que compras cuando miras el celular 3 segundos a 60 km/h.',
          },
          {
            tag:'Tipos de distracción', visual:'🧠',
            title:'Hay tres tipos de distracción — todas peligrosas',
            body:'Las distracciones se clasifican en tres tipos: Visual (dejas de mirar la vía), Manual (sueltas el volante) y Cognitiva (tu mente deja de estar en la conducción). El celular activa las tres simultáneamente.',
            detail:'Una conversación con un pasajero es mayormente cognitiva. El celular es visual + manual + cognitiva al mismo tiempo.',
          },
          {
            tag:'Audífonos', visual:'🎧',
            title:'Los audífonos en ambos oídos: riesgo invisibilizado',
            body:'Los audífonos en ambos oídos bloquean sonidos críticos: sirenas de emergencia, bocinas de advertencia y el sonido de frenadas cercanas. Conducir con audífonos en ambos oídos es ilegal en muchos contextos y siempre peligroso.',
            tip:'Si debes escuchar algo, usa solo un oído o el sistema de audio del vehículo a un volumen que permita oír el entorno.',
          },
          {
            tag:'GPS', visual:'🗺️',
            title:'El GPS: úsalo bien',
            body:'El GPS es una herramienta de seguridad cuando se usa correctamente: programado ANTES de arrancar, con la pantalla visible y el volumen de voz activado para no necesitar mirar la pantalla. Nunca lo programes mientras conduces, ni en semáforo.',
            detail:'Si necesitas cambiar el destino, estaciona. 30 segundos de parada son preferibles a un accidente.',
          },
          {
            tag:'Somnolencia', visual:'😴',
            title:'La somnolencia: tan peligrosa como el alcohol',
            body:'Conducir con más de 18 horas sin dormir tiene efectos equivalentes a una alcoholemia de 0.05%. Los microsueños de 2 a 30 segundos ocurren sin que el conductor los perciba.',
            tip:'La única solución es detenerse y descansar. El café, el frío y la música son alivios temporales que no eliminan el riesgo.',
          },
        ],
      },
      {
        id:9, icon:'😤', title:'Agresividad vial: cómo responder',
        diff:'medio', time:'8 min', xp:85, type:'story',
        storyTitle:'Un martes en el tráfico',
        intro:'Son las 7:45am. Llegas tarde al trabajo. El tráfico está pesado. Así comienza esta historia.',
        chapters: [
          {
            id:'c1', sceneEmoji:'🚗',
            location:'TRONCAL · 7:45AM',
            narrative:'Llevas 20 minutos en trancón. De repente, un vehículo se te cierra bruscamente al cambiar de carril sin señalizar. Pisas el freno justo a tiempo. El susto es real. El enojo llega inmediatamente.',
            decision: {
              paths: [
                { emoji:'😤', label:'Le toco la bocina largo y le hago gestos con la mano', positive:false, consequence:'El conductor del otro vehículo responde con otro gesto. Ambos están ahora distraídos, enojados y tomando peores decisiones de conducción. La situación escaló innecesariamente.', learning:'Responder a la agresividad con agresividad escala la situación y te distrae de la vía. El otro conductor ya cometió el error — tú decides si este incidente termina aquí o si se convierte en algo peor.' },
                { emoji:'💨', label:'Lo adelanto por la derecha para "enseñarle una lección"', positive:false, consequence:'Adelantar por la derecha es peligroso e ilegal. El otro conductor puede no verte. Podrías causar un choque.', learning:'Las maniobras agresivas de "venganza" te convierten en el conductor peligroso. No existe ninguna lección que valga la pena a ese precio.' },
                { emoji:'😌', label:'Respiro, mantengo distancia y continúo mi camino', positive:true, consequence:'En segundos, el otro vehículo está tres carros adelante y el incidente terminó. Tu ritmo cardíaco vuelve a la normalidad.', learning:'La respuesta madura no es pasividad — es inteligencia. Cada segundo que dedicas a reaccionar agresivamente es un segundo de atención que le robas a la vía.' },
              ],
            },
          },
          {
            id:'c2', sceneEmoji:'🚘',
            location:'AUTOPISTA · 8:20AM',
            narrative:'Ya saliste del trancón. Vas a 80 km/h en el carril izquierdo. De repente, el vehículo detrás te pone las luces largas repetidamente. Quiere que te hagas a un lado.',
            decision: {
              paths: [
                { emoji:'😠', label:'Reduzco la velocidad para molestarlo — él es el agresivo', positive:false, consequence:'Reducir la velocidad intencionalmente ante un vehículo que te presiona es extremadamente peligroso. Si frena tarde, el choque es inminente.', learning:'Obstaculizar intencionalmente es tan peligroso como la agresividad original del otro conductor. La actitud punitiva en la vía solo crea más riesgo.' },
                { emoji:'😤', label:'Le pongo luces largas de vuelta para que sepa cómo molesta', positive:false, consequence:'Las luces largas dirigidas al conductor de atrás lo deslumbran y pueden hacerle perder temporalmente la visión. Creaste un peligro real.', learning:'Las luces largas dirigidas a otro conductor son un peligro, no una comunicación.' },
                { emoji:'😌', label:'Me cambio al carril derecho cuando es seguro y lo dejo pasar', positive:true, consequence:'El vehículo pasa y desaparece. El incidente terminó en 15 segundos. Sigues tu camino sin daños ni multas.', learning:'El carril izquierdo es para adelantar, no para ocuparlo indefinidamente. Ceder el carril cuando alguien quiere pasar es conducción correcta.' },
              ],
            },
          },
          {
            id:'c3', sceneEmoji:'🅿️',
            location:'PARQUEADERO · 8:45AM',
            narrative:'Llegaste. Al buscar parqueadero, alguien te quita el espacio que ibas a ocupar. Él se baja del carro y te mira desafiante.',
            decision: {
              paths: [
                { emoji:'😠', label:'Bajo del carro y le digo lo que pienso', positive:false, consequence:'Las confrontaciones en la vía son impredecibles. No sabes quién es esa persona ni su estado de ánimo. Muchos incidentes de agresividad vial terminan en violencia física.', learning:'Nada que suceda en la vía vale una confrontación física. Tu seguridad personal está por encima de cualquier "principio".' },
                { emoji:'😌', label:'Busco otro espacio — no vale la pena', positive:true, consequence:'Encuentras otro espacio a 30 metros. Llegas a tu destino entero, sin multa, sin daños, sin el peso emocional de una pelea.', learning:'Ceder en situaciones de conflicto potencial no es perder — es saber elegir qué batallas valen la pena.' },
              ],
            },
          },
        ],
      },
    ],
  },

  4: {
    icon:'🌆', title:'Situaciones reales', color:'#ab47bc',
    description:'Casos prácticos que todo conductor enfrenta. Aprende a tomar decisiones correctas bajo presión.',
    lessons: [
      {
        id:10, icon:'🅿️', title:'Cómo estacionar correctamente',
        diff:'fácil', time:'5 min', xp:65, type:'explorer',
        intro: {
          title:'Toca cada situación para aprender las reglas de estacionamiento',
          subtitle:'Desde zonas prohibidas hasta la técnica correcta en pendiente',
        },
        items: [
          {
            id:'zona_amarilla', name:'Zona amarilla', emoji:'🟡', type:'Prohibición', typeColor:'#ffd740',
            meaning:'La pintura amarilla en el bordillo indica zona exclusiva de carga y descarga para vehículos de mercancías. Los vehículos particulares NO pueden estacionar aquí, ni por un momento. No es una zona de doble fila temporal ni de "solo un minuto".',
            rule:'Estacionar en zona amarilla: infracción + multa + posible inmovilización del vehículo.',
          },
          {
            id:'pendiente_arriba', name:'Pendiente ↑ cuesta arriba', emoji:'⛰️', type:'Técnica', typeColor:'#18ffff',
            meaning:'Cuando estacionas cuesta arriba, debes girar las ruedas delanteras HACIA AFUERA (hacia la vía). Si el freno falla y el vehículo rueda hacia atrás, las ruedas chocarán contra el bordillo y lo detendrán.',
            rule:'Truco: Cuesta arriba = ruedas afuera. Piensa "me alejo del andén".',
            example:'Estacionas en subida. Giras el volante completamente hacia la izquierda (vía) antes de soltar el freno de pie.',
          },
          {
            id:'pendiente_abajo', name:'Pendiente ↓ cuesta abajo', emoji:'🏔️', type:'Técnica', typeColor:'#18ffff',
            meaning:'Cuando estacionas cuesta abajo, debes girar las ruedas delanteras HACIA EL ANDÉN (adentro). Si el freno falla y el vehículo rueda hacia adelante, las ruedas chocarán contra el bordillo.',
            rule:'Truco: Cuesta abajo = ruedas adentro. Piensa "me acerco al andén".',
            example:'Estacionas en bajada. Giras el volante completamente hacia la derecha (andén) antes de soltar el freno.',
          },
          {
            id:'hidrante', name:'Frente a hidrante', emoji:'🚒', type:'Prohibición', typeColor:'#ff5252',
            meaning:'Nunca estaciones frente a un hidrante. En caso de incendio, los bomberos necesitan acceso inmediato. Estacionar allí puede costar vidas, además de multa e inmovilización del vehículo.',
            rule:'En emergencias, los bomberos pueden quebrar la ventana del vehículo para pasar la manguera.',
          },
          {
            id:'esquina', name:'En esquina o cruce', emoji:'✛', type:'Prohibición', typeColor:'#ff5252',
            meaning:'Estacionar a menos de 5 metros de una esquina reduce la visibilidad de conductores y peatones, creando puntos ciegos peligrosos y bloqueando el paso de vehículos que giran.',
            rule:'Mínimo 5 metros de distancia de cualquier esquina o cruce.',
          },
          {
            id:'doble_fila', name:'Doble fila', emoji:'🚗🚗', type:'Prohibición', typeColor:'#ff5252',
            meaning:'Estacionar en doble fila bloquea el tráfico y en emergencias puede impedir el paso de ambulancias. "Solo un momento" no es excusa legal ni moral.',
            rule:'Infracción grave + multa alta. Si se inmoviliza el vehículo, los costos de liberación se suman.',
          },
        ],
      },
      {
        id:11, icon:'🚑', title:'En caso de accidente: el protocolo correcto',
        diff:'difícil', time:'10 min', xp:100, type:'step_guide',
        steps: [
          {
            emoji:'⚡', action:'Paso 1: mantén la calma — evalúa antes de actuar',
            explanation:'El primer instante después de un accidente es confuso. Respira. Evalúa si estás herido, si hay otros heridos y si hay peligro inmediato (fuego, riesgo de explosión, vehículos que se aproximan). No actúes por pánico.',
            tip:'La calma te permite tomar mejores decisiones. El pánico lleva a errores que agravan la situación.',
          },
          {
            emoji:'⚠️', action:'Paso 2: señaliza la zona de peligro',
            explanation:'Antes de cualquier otra cosa, señaliza el área para evitar un segundo accidente. Activa las luces de emergencia, coloca triángulos de seguridad a 50 metros por detrás del vehículo.',
            warning:'Un segundo accidente sobre el primero es uno de los escenarios más mortales en carretera. La señalización salva más vidas de lo que parece.',
          },
          {
            emoji:'🤕', action:'Paso 3: verifica heridos — NO los muevas',
            explanation:'Si hay heridos, verifica si están conscientes y respiran. NO muevas a ningún herido a menos que haya peligro inminente (fuego, derrumbe). Una lesión de columna puede ser imperceptible y moverlos incorrectamente puede causar parálisis permanente.',
            warning:'Mover a un herido sin conocimientos de primeros auxilios puede convertir una lesión recuperable en una parálisis permanente.',
          },
          {
            emoji:'📞', action:'Paso 4: llama a los servicios de emergencia',
            explanation:'Llama al 123 (emergencias en Colombia). Informa: ubicación exacta, número de vehículos involucrados, si hay heridos y cuántos, y si hay algún peligro especial (combustible derramado, vehículo volcado). No cuelgues hasta que te lo indiquen.',
          },
          {
            emoji:'📸', action:'Paso 5: documenta la escena ANTES de mover vehículos',
            explanation:'Antes de mover los vehículos, fotografía todo: posición de los vehículos, daños, señales cercanas, placas y cualquier elemento relevante. Son evidencia crucial para el proceso con la aseguradora.',
            tip:'Fotografía desde múltiples ángulos. Las imágenes pueden resolver disputas sobre quién tuvo la culpa.',
          },
          {
            emoji:'📄', action:'Paso 6: intercambia datos con el otro conductor',
            explanation:'Intercambia: nombre completo, cédula, número de licencia, placa del vehículo, aseguradora y número de SOAT. No firmes ningún documento en la escena sin haberlo leído completamente.',
            warning:'No firmes "acuerdos" redactados en el lugar sin consultarlos con tu aseguradora.',
          },
          {
            emoji:'📋', action:'Paso 7: verifica que tu SOAT esté vigente',
            explanation:'El SOAT cubre los gastos médicos de todas las víctimas del accidente. Circular sin SOAT vigente es una infracción grave y te deja sin cobertura.',
            law:'El SOAT es obligatorio en Colombia. Sin él: multa grave + responsabilidad civil directa por gastos médicos.',
          },
        ],
      },
      {
        id:12, icon:'🌙', title:'Conducción nocturna: lo que cambia',
        diff:'medio', time:'7 min', xp:80, type:'concept_map',
        concepts: [
          {
            id:'visibilidad', emoji:'🌑',
            title:'La visibilidad se reduce drásticamente', subtitle:'Cómo adaptarse a la oscuridad',
            explanation:'De noche, la distancia a la que percibes obstáculos se reduce a apenas 40-100 metros con luces artificiales. La velocidad que es segura de día puede no serlo de noche en la misma vía.',
            keyPoints:[
              'Luces cortas: visibilidad de unos 40 metros.',
              'Luces largas: visibilidad de unos 100 metros — úsalas en carretera oscura sin tráfico de frente.',
              'Cambia a luces cortas cuando veas faros de frente o alcances un vehículo.',
            ],
          },
          {
            id:'deslumbramiento', emoji:'💡',
            title:'El deslumbramiento', subtitle:'Cómo recuperar la visión',
            explanation:'Cuando un vehículo de frente te deslumbra con luces largas, la visión se recupera en unos 5-7 segundos. En ese tiempo puedes recorrer más de 100 metros "a ciegas". Nunca respondas deslumbrando de vuelta.',
            keyPoints:[
              'Mira hacia la derecha (al borde de tu carril) en lugar de al centro.',
              'No mires directamente los faros: esto prolonga el deslumbramiento.',
              'Reduce la velocidad mientras tu visión se recupera.',
            ],
          },
          {
            id:'animales', emoji:'🦌',
            title:'Fauna en carretera de noche', subtitle:'Un peligro subestimado',
            explanation:'Los animales son mucho más difíciles de ver de noche. Si un animal cruza y el choque es inevitable, lo correcto es frenar recto y fuerte, sin girar bruscamente.',
            keyPoints:[
              'Un viraje brusco para evitar un animal puede causar un vuelco o un choque de frente.',
              'El daño al vehículo es reparable; un accidente grave quizás no.',
              'En zonas de fauna silvestre, reduce la velocidad aunque no hayas visto animales.',
            ],
          },
          {
            id:'somnolencia_noche', emoji:'😴',
            title:'La somnolencia nocturna', subtitle:'El mayor peligro de la noche',
            explanation:'El cuerpo tiene un ciclo circadiano que promueve el sueño entre las 2am y las 5am. Conducir en ese horario aumenta el riesgo de microsueños incluso sin estar cansado.',
            keyPoints:[
              'Si sientes somnolencia, detente en un lugar seguro y duerme 20-30 minutos.',
              'El café puede darte 30-45 minutos extra, no más. No es solución.',
              'Planifica viajes largos nocturnos con paradas cada 2 horas.',
            ],
            law:'La somnolencia es considerada conducción bajo incapacidad — mismo nivel que el alcohol en la legislación vial de Colombia.',
          },
        ],
      },
    ],
  },
}

// ─── Dispatcher ───────────────────────────────────────────────────
function LessonGame({ lesson, color, onComplete }) {
  const { addXp, completeLesson } = useProgress()

  const handleComplete = (xp) => {
    addXp(xp)
    completeLesson(lesson.id)
    onComplete()
  }

  switch (lesson.type) {
    case 'explainer':
      return <ExplainerLesson steps={lesson.steps} color={color} onComplete={handleComplete} />
    case 'explorer':
      return <ExplorerLesson items={lesson.items} color={color} intro={lesson.intro} onComplete={handleComplete} />
    case 'interactive_demo':
      return <InteractiveDemoLesson demos={lesson.demos} color={color} onComplete={handleComplete} />
    case 'story':
      return <StoryLesson storyTitle={lesson.storyTitle} intro={lesson.intro} chapters={lesson.chapters} color={color} onComplete={handleComplete} />
    case 'concept_map':
      return <ConceptMapLesson concepts={lesson.concepts} color={color} onComplete={handleComplete} />
    case 'step_guide':
      return <StepGuideLesson steps={lesson.steps} color={color} onComplete={handleComplete} />
    default:
      return <div style={{ color:T.muted, textAlign:'center', padding:40 }}>Tipo de lección no reconocido: {lesson.type}</div>
  }
}

// ─── Constantes de UI ─────────────────────────────────────────────
const DIFF_COLOR = { fácil:'#00e676', medio:'#ffd740', difícil:'#ff5252' }
const TYPE_LABELS = {
  explainer:'📖 Explainer',
  explorer:'👆 Explorador',
  interactive_demo:'🎮 Demo interactiva',
  story:'📚 Historia',
  concept_map:'🗺️ Mapa conceptual',
  step_guide:'🪜 Guía paso a paso',
}

// ─── Vista del módulo ─────────────────────────────────────────────
function ModuleView({ mod, onSelectLesson, completedIds }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Module hero */}
      <div style={{
        background:`linear-gradient(135deg, rgba(255,255,255,0.03) 50%, ${mod.color}12)`,
        border:`1px solid ${mod.color}28`, borderRadius:22, padding:'28px 26px',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', right:-50, top:-50, width:220, height:220, borderRadius:'50%',
          background:`radial-gradient(circle, ${mod.color}14, transparent 70%)`,
        }} />
        <div style={{ fontSize:38, marginBottom:12 }}>{mod.icon}</div>
        <h1 style={{ fontSize:22, fontWeight:700, color:T.text, marginBottom:8 }}>{mod.title}</h1>
        <p style={{ fontSize:13, color:T.muted, lineHeight:1.6, marginBottom:20 }}>{mod.description}</p>
        <div style={{ display:'flex', gap:20 }}>
          {[
            ['Lecciones', mod.lessons.length, mod.color],
            ['XP total', mod.lessons.reduce((a,l) => a + l.xp, 0), '#ffd740'],
            ['Completadas', completedIds.filter(id => mod.lessons.find(l => l.id === id)).length, '#00e676'],
          ].map(([l,v,c]) => (
            <div key={l}>
              <div style={{ fontSize:22, fontWeight:700, color:c, fontFamily:"'Space Mono',monospace" }}>{v}</div>
              <div style={{ fontSize:10, color:T.faint, textTransform:'uppercase', letterSpacing:'0.07em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lessons list */}
      <div>
        <div style={{ fontSize:11, fontWeight:700, color:T.faint, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:14 }}>
          📚 Lecciones del módulo
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {mod.lessons.map((lesson, i) => {
            const done = completedIds.includes(lesson.id)
            return (
              <button key={lesson.id} onClick={() => onSelectLesson(lesson)} style={{
                background: done ? `${mod.color}08` : 'rgba(255,255,255,0.02)',
                border:`1px solid ${done ? mod.color+'35' : 'rgba(255,255,255,0.07)'}`,
                borderRadius:16, padding:'16px 18px', cursor:'pointer',
                display:'flex', alignItems:'center', gap:14,
                textAlign:'left', width:'100%', transition:'all 0.2s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = `${mod.color}50`
                  e.currentTarget.style.transform = 'translateX(4px)'
                  e.currentTarget.style.boxShadow = `-4px 0 0 0 ${mod.color}`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = done ? `${mod.color}35` : 'rgba(255,255,255,0.07)'
                  e.currentTarget.style.transform = 'translateX(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width:34, height:34, borderRadius:10, flexShrink:0,
                  background: done ? `${mod.color}20` : `${mod.color}12`,
                  border:`1px solid ${mod.color}30`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:"'Space Mono',monospace", fontSize:12, fontWeight:700, color:mod.color,
                }}>{done ? '✓' : i + 1}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600, color: done ? mod.color : T.text, marginBottom:5 }}>
                    {lesson.icon} {lesson.title}
                  </div>
                  <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                    <span style={{
                      fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:99,
                      background:`${DIFF_COLOR[lesson.diff]}18`, color:DIFF_COLOR[lesson.diff],
                      fontFamily:"'Space Mono',monospace", textTransform:'uppercase',
                    }}>{lesson.diff}</span>
                    <span style={{ fontSize:11, color:T.faint }}>⏱ {lesson.time}</span>
                    <span style={{ fontSize:11, color:'#ffd740' }}>⚡ {lesson.xp} XP</span>
                    <span style={{ fontSize:10, color:T.faint }}>{TYPE_LABELS[lesson.type] || lesson.type}</span>
                  </div>
                </div>
                <span style={{ color: done ? mod.color : T.faint, fontSize:18 }}>{done ? '✓' : '›'}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Page principal ───────────────────────────────────────────────
export function PageModulo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { completedLessons } = useProgress()
  const mod = MODULE_CONTENT[Number(id)]
  const [activeLesson, setActiveLesson] = useState(null)
  const [confetti, setConfetti] = useState(false)
  const [showXP, setShowXP] = useState(false)
  const [lastXP, setLastXP] = useState(0)

  if (!mod) return (
    <div style={{ padding:40, textAlign:'center' }}>
      <div style={{ fontSize:40, marginBottom:16 }}>🔒</div>
      <h2 style={{ fontSize:18, color:T.text, marginBottom:8 }}>Módulo no disponible</h2>
      <p style={{ color:T.muted, marginBottom:20 }}>Este módulo aún no está desbloqueado.</p>
      <button onClick={() => navigate(-1)} style={{
        padding:'10px 20px', borderRadius:10,
        border:'1px solid rgba(255,255,255,0.1)', background:'transparent',
        color:T.text, cursor:'pointer',
      }}>← Volver</button>
    </div>
  )

  const handleComplete = () => {
    setConfetti(true)
    setShowXP(true)
    setTimeout(() => { setConfetti(false); setShowXP(false); setActiveLesson(null) }, 2000)
  }

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes xpFloat { 0%{opacity:0;transform:translate(-50%,-50%) scale(0.5)} 30%{opacity:1;transform:translate(-50%,-60%) scale(1.1)} 70%{opacity:1;transform:translate(-50%,-75%) scale(1)} 100%{opacity:0;transform:translate(-50%,-90%) scale(0.9)} }
        .fade-in { animation: fadeInUp 0.3s ease both; }
      `}</style>

      <Confetti active={confetti} />
      {showXP && <XPFloat xp="🎉" visible={showXP} />}

      <div style={{ maxWidth:660, margin:'0 auto' }}>
        {activeLesson ? (
          <div className="fade-in">
            {/* Back button */}
            <button onClick={() => setActiveLesson(null)} style={{
              background:'none', border:'none', color:T.muted, fontSize:12,
              cursor:'pointer', padding:0, marginBottom:20,
              display:'flex', alignItems:'center', gap:6,
            }}>← Volver al módulo</button>

            {/* Lesson header */}
            <div style={{
              background:`linear-gradient(135deg, rgba(255,255,255,0.03), ${mod.color}08)`,
              border:`1px solid ${mod.color}22`, borderRadius:18,
              padding:'20px 22px', marginBottom:24,
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{
                  width:48, height:48, borderRadius:14, flexShrink:0,
                  background:`${mod.color}15`, border:`1.5px solid ${mod.color}30`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:24,
                }}>{activeLesson.icon}</div>
                <div>
                  <h2 style={{ fontSize:17, fontWeight:700, color:T.text, marginBottom:5 }}>{activeLesson.title}</h2>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    <span style={{
                      fontSize:9, fontWeight:700, padding:'3px 10px', borderRadius:99,
                      background:`${DIFF_COLOR[activeLesson.diff]}18`, color:DIFF_COLOR[activeLesson.diff],
                      fontFamily:"'Space Mono',monospace", textTransform:'uppercase',
                    }}>{activeLesson.diff}</span>
                    <span style={{ fontSize:11, color:T.muted }}>⏱ {activeLesson.time}</span>
                    <span style={{ fontSize:11, color:'#ffd740' }}>⚡ hasta {activeLesson.xp} XP</span>
                    <span style={{ fontSize:10, color:T.faint }}>{TYPE_LABELS[activeLesson.type]}</span>
                  </div>
                </div>
              </div>
            </div>

            <LessonGame lesson={activeLesson} color={mod.color} onComplete={handleComplete} />
          </div>
        ) : (
          <div className="fade-in">
            <ModuleView mod={mod} onSelectLesson={setActiveLesson} completedIds={completedLessons} />
          </div>
        )}
      </div>
    </>
  )
}