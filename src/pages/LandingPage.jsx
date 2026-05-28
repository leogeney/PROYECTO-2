import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState, useCallback } from 'react'
import { T } from '../styles/tokens'

const FEATURES = [
  { icon: 'fa-solid fa-book', title: 'Biblioteca de señales', desc: 'Más de 50 señales de tránsito colombianas con imágenes y descripciones detalladas.', color: '#00ff88' },
  { icon: 'fa-solid fa-pen-to-square', title: 'Lecciones interactivas', desc: 'Módulos educativos con explicaciones, ejemplos y evaluación de conocimientos.', color: '#5b8def' },
  { icon: 'fa-solid fa-newspaper', title: 'Noticias viales', desc: 'Información actualizada sobre normas, multas, seguridad y consejos de conducción.', color: '#f5c542' },
  { icon: 'fa-solid fa-comments', title: 'Foro comunitario', desc: 'Espacio para compartir dudas, experiencias y discutir temas de tránsito.', color: '#33e6ff' },
  { icon: 'fa-solid fa-gamepad', title: 'Juegos educativos', desc: 'Aprende mientras te diviertes con actividades interactivas sobre seguridad vial.', color: '#ff8552' },
  { icon: 'fa-solid fa-trophy', title: 'Logros y ranking', desc: 'Gana XP, sube de nivel y compite con otros usuarios en el ranking.', color: '#ff6b6b' },
]

const ACHIEVEMENTS = [
  { icon: 'fa-solid fa-layer-group', value: '7+', label: 'Módulos de aprendizaje' },
  { icon: 'fa-solid fa-signs-post', value: '50+', label: 'Señales de tránsito' },
  { icon: 'fa-solid fa-users', value: 'Comunidad', label: 'Foro activo' },
  { icon: 'fa-solid fa-star', value: 'XP', label: 'Sistema de progreso' },
]

const TYPING_WORDS = ['seguridad vial', 'señales de tránsito', 'normas colombianas', 'conducción segura']

function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setRevealed(true); obs.unobserve(el) }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, revealed]
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, revealed] = useReveal()
  return (
    <div ref={ref} style={{
      opacity: revealed ? 1 : 0,
      transform: revealed ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ...style,
    }}>{children}</div>
  )
}

function ParticleField() {
  const particles = useRef([])
  if (particles.current.length === 0) {
    for (let i = 0; i < 50; i++) {
      particles.current.push({
        x: Math.random() * 100, y: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        speed: 0.3 + Math.random() * 0.8,
        delay: Math.random() * 8,
        opacity: 0.1 + Math.random() * 0.2,
        driftX: (Math.random() - 0.5) * 30,
        driftY: (Math.random() - 0.5) * 30,
      })
    }
  }
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.current.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', width: p.size, height: p.size, borderRadius: '50%',
          background: i % 3 === 0 ? '#00ff88' : i % 3 === 1 ? '#5b8def' : '#f5c542',
          left: `${p.x}%`, top: `${p.y}%`, opacity: 0,
          animation: `lp-particle-${i % 3} ${6 / p.speed}s ease-in-out ${p.delay}s infinite`,
          boxShadow: i % 3 === 0 ? '0 0 6px rgba(0,255,136,0.3)' : 'none',
        }} />
      ))}
    </div>
  )
}

function GlowOrbs() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', width: '45vw', height: '45vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,255,136,0.1), transparent 70%)',
        top: '-15%', left: '-10%', animation: 'lp-orb-1 14s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: '40vw', height: '40vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(91,141,239,0.07), transparent 70%)',
        bottom: '-20%', right: '-5%', animation: 'lp-orb-2 18s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: '25vw', height: '25vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,197,66,0.06), transparent 70%)',
        top: '30%', left: '55%', animation: 'lp-orb-3 12s ease-in-out infinite 2s',
      }} />
      <div style={{
        position: 'absolute', width: '20vw', height: '20vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(51,230,255,0.05), transparent 70%)',
        top: '60%', left: '10%', animation: 'lp-orb-4 16s ease-in-out infinite 4s',
      }} />
    </div>
  )
}

export function LandingPage() {
  const nav = useNavigate()
  const heroRef = useRef(null)
  const [cursorPos, setCursorPos] = useState({ x: 0.5, y: 0.5 })
  const [typingIdx, setTypingIdx] = useState(0)
  const [typingText, setTypingText] = useState('')
  const [typingPhase, setTypingPhase] = useState('typing')
  const [mouseGlow, setMouseGlow] = useState({ x: -200, y: -200 })
  const typedRef = useRef(0)
  const charsRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (typingPhase === 'typing') {
        const word = TYPING_WORDS[typingIdx]
        charsRef.current++
        if (charsRef.current > word.length) {
          setTypingPhase('waiting')
          setTimeout(() => {
            setTypingPhase('deleting')
            charsRef.current = word.length
          }, 2000)
        } else {
          setTypingText(word.slice(0, charsRef.current))
        }
      } else if (typingPhase === 'deleting') {
        charsRef.current--
        if (charsRef.current < 0) {
          setTypingPhase('typing')
          charsRef.current = 0
          setTypingText('')
          setTypingIdx(prev => (prev + 1) % TYPING_WORDS.length)
        } else {
          setTypingText(TYPING_WORDS[typingIdx].slice(0, charsRef.current))
        }
      }
    }, typingPhase === 'typing' ? 90 : 50)
    return () => clearInterval(interval)
  }, [typingPhase, typingIdx])

  useEffect(() => {
    const handle = (e) => {
      if (heroRef.current) {
        const r = heroRef.current.getBoundingClientRect()
        setCursorPos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height })
        setMouseGlow({ x: e.clientX - r.left, y: e.clientY - r.top })
      }
    }
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  const [tiltStyle, setTiltStyle] = useState({})
  const heroContentRef = useRef(null)
  const handleHeroMove = useCallback((e) => {
    if (!heroContentRef.current) return
    const r = heroContentRef.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    setTiltStyle({
      transform: `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`,
      transition: 'transform 0.1s ease-out',
    })
  }, [])
  const handleHeroLeave = useCallback(() => {
    setTiltStyle({ transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg)', transition: 'transform 0.5s ease-out' })
  }, [])

  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handle = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Sora', sans-serif", overflowX: 'hidden' }}>

      {/* ─── HERO ─── */}
      <section ref={heroRef} onMouseMove={handleHeroMove} onMouseLeave={handleHeroLeave} style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '40px 24px', position: 'relative', overflow: 'hidden',
      }}>
        <GlowOrbs />
        <ParticleField />

        {/* Cursor glow */}
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,136,0.06), transparent 70%)',
          left: mouseGlow.x - 150, top: mouseGlow.y - 150,
          pointerEvents: 'none', transition: 'left 0.3s ease-out, top 0.3s ease-out',
        }} />

        <div ref={heroContentRef} style={{
          position: 'relative', zIndex: 2,
          ...tiltStyle,
        }}>
          {/* Versión Beta badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 18px', borderRadius: 99,
            background: 'rgba(245,197,66,0.07)', border: '1px solid rgba(245,197,66,0.12)',
            fontFamily: "'Sora', sans-serif",
            marginBottom: 16, fontSize: 12, fontWeight: 600,
            color: '#f5c542', letterSpacing: '0.04em',
          }}>
            <span style={{ fontSize: 14, lineHeight: 1 }}>✦</span>
            Versión Beta
          </div>

          {/* Logo animated */}
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, color: '#000', fontWeight: 900,
            boxShadow: '0 0 50px rgba(0,255,136,0.2), 0 8px 32px rgba(0,0,0,0.4)',
            margin: '0 auto 24px',
            animation: 'lp-logo-float 4s ease-in-out infinite',
            position: 'relative',
          }}>
            <i className="fa-solid fa-motorcycle"></i>
            <div style={{
              position: 'absolute', inset: -4, borderRadius: 22,
              border: '1.5px solid rgba(0,255,136,0.2)',
              animation: 'lp-logo-pulse 2s ease-in-out infinite',
            }} />
          </div>

          <h1 style={{
            fontSize: 'clamp(44px, 9vw, 80px)', fontWeight: 900, margin: 0, lineHeight: 1.0,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #f0f4ff 0%, #00ff88 45%, #33e6ff 70%, #f5c542 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', backgroundSize: '200% 200%',
            animation: 'lp-grad-shift 6s ease-in-out infinite',
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700,
          }}>
            TRANSI+
          </h1>

          <p style={{
            fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 500,
            letterSpacing: '0.28em', textTransform: 'uppercase', marginTop: 12,
            fontFamily: "'Sora', sans-serif",
          }}>
            <span style={{ display: 'inline-block', animation: 'lp-fade-in 1s ease-out' }}>Educación</span>{' '}
            <span style={{ display: 'inline-block', animation: 'lp-fade-in 1s ease-out 0.15s both' }}>Vial</span>{' '}
            <span style={{ display: 'inline-block', animation: 'lp-fade-in 1s ease-out 0.3s both', color: '#00ff88' }}>Interactiva</span>
          </p>

          {/* Typewriter */}
          <div style={{
            fontSize: 'clamp(17px, 2.2vw, 22px)', color: T.muted, maxWidth: 540,
            lineHeight: 1.7, marginTop: 16, margin: '16px auto 0',
          }}>
            Aprende sobre{' '}
            <span style={{ color: '#00ff88', fontWeight: 600, borderBottom: '1.5px solid rgba(0,255,136,0.2)' }}>
              {typingText}<span style={{ animation: 'lp-blink 0.8s step-end infinite', fontWeight: 200, opacity: 0.7 }}>|</span>
            </span>
            <br />de forma interactiva con lecciones, juegos y comunidad.
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => nav('/login')} className="lp-btn-primary" style={{
              padding: '18px 44px', borderRadius: 14,
              background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
              color: '#000', border: 'none', fontSize: 15, fontWeight: 700,
              fontFamily: 'inherit', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10,
              boxShadow: '0 4px 24px rgba(0,255,136,0.3)',
              transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
              position: 'relative', overflow: 'hidden',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 12px 48px rgba(0,255,136,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,255,136,0.3)' }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>Comenzar ahora</span>
              <i className="fa-solid fa-arrow-right" style={{ fontSize: 14, position: 'relative', zIndex: 1, animation: 'lp-arrow-bounce 1.4s ease-in-out infinite' }}></i>
            </button>
            <button onClick={() => document.getElementById('lp-features')?.scrollIntoView({ behavior: 'smooth' })} style={{
              padding: '18px 32px', borderRadius: 14,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              color: T.muted, fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.25s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = T.text; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = T.muted; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
            >
              Explorar
              <i className="fa-solid fa-chevron-down" style={{ fontSize: 11 }}></i>
            </button>
          </div>

          {/* Badge */}
          <div style={{
            marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 18px', borderRadius: 99,
            background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.08)',
            animation: 'lp-fade-in 1s ease-out 0.8s both',
          }}>
            <span style={{ display: 'flex', gap: 2 }}>
              {[1,2,3].map(i => <span key={i} style={{ display: 'inline-block', animation: `lp-star-pop 1.2s ease-out ${0.9 + i * 0.12}s both` }}>⭐</span>)}
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
              Gratuito · Acceso con Google
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
          <div style={{
            width: 1.5, height: 48,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)',
            animation: 'lp-scroll-line 2.2s ease-in-out infinite',
          }} />
        </div>

        {/* Ambient bottom gradient */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
          background: 'linear-gradient(to top, rgba(3,7,20,0.6), transparent)',
          pointerEvents: 'none',
        }} />
      </section>

      {/* ─── FEATURES ─── */}
      <section id="lp-features" style={{ padding: '100px 24px 120px', maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em',
              color: '#00ff88',               fontFamily: "'Sora', sans-serif",
              display: 'inline-block', padding: '4px 14px', borderRadius: 99,
              border: '1px solid rgba(0,255,136,0.15)',
            }}>Explora la plataforma</span>
            <h2 style={{
              fontSize: 'clamp(30px, 4.5vw, 42px)', fontWeight: 700, color: T.text,
              marginTop: 16, lineHeight: 1.15,
              fontFamily: "'Sora', sans-serif",
            }}>
              Todo lo que necesitas para{' '}
              <span style={{ background: 'linear-gradient(135deg, #00ff88, #33e6ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>aprender</span>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </section>

      {/* ─── ACHIEVEMENTS ─── */}
      <section style={{
        padding: '80px 24px 100px', position: 'relative',
        background: 'linear-gradient(180deg, transparent, rgba(0,255,136,0.015), transparent)',
        borderTop: '1px solid rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.02)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <Reveal>
            <span style={{
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em',
              color: '#f5c542',               fontFamily: "'Sora', sans-serif",
              display: 'inline-block', padding: '4px 14px', borderRadius: 99,
              border: '1px solid rgba(245,197,66,0.15)',
            }}>Nuestro alcance</span>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 700, color: T.text,
              marginTop: 12, marginBottom: 48, lineHeight: 1.15,
              fontFamily: "'Sora', sans-serif",
            }}>
              Lo que hemos <span style={{ background: 'linear-gradient(135deg, #00ff88, #f5c542)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>construido</span>
            </h2>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
            {ACHIEVEMENTS.map((a, i) => (
              <Reveal key={a.label} delay={i * 0.1}>
                <div style={{
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: 16, padding: '30px 20px',
                  transition: 'all 0.3s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,136,0.2)'; e.currentTarget.style.background = 'rgba(0,255,136,0.03)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = 'none' }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, color: '#00ff88', margin: '0 auto 16px',
                    animation: `lp-logo-float 3s ease-in-out infinite ${i * 0.5}s`,
                  }}>
                    <i className={a.icon}></i>
                  </div>
                  <div style={{
                    fontSize: 'clamp(22px, 2.5vw, 30px)', fontWeight: 800,
                    color: T.text, fontFamily: "'Space Mono', monospace",
                  }}>{a.value}</div>
                  <div style={{ fontSize: 12, color: T.faint, marginTop: 4 }}>{a.label}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4}>
            <div style={{
              marginTop: 48, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center',
            }}>
              {[
                'Autenticación Google', 'Panel administrador', 'Sistema XP y niveles',
                'Chatbot interactivo', 'Modo oscuro/claro', 'Foro comunitario',
                'Reportes de soporte', 'Juegos educativos', 'Accesibilidad total',
              ].map((f, i) => (
                <span key={f} style={{
                  padding: '6px 14px', borderRadius: 99,
                  background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.06)',
                  fontSize: 12, color: 'rgba(255,255,255,0.5)',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  transition: 'all 0.3s',
                  animation: `lp-fade-in 0.5s ease-out ${0.5 + i * 0.06}s both`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,136,0.2)'; e.currentTarget.style.background = 'rgba(0,255,136,0.08)'; e.currentTarget.style.color = '#00ff88'; e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,255,136,0.06)'; e.currentTarget.style.background = 'rgba(0,255,136,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.transform = 'none' }}
                >
                  <i className="fa-solid fa-check" style={{ fontSize: 9, color: '#00ff88' }}></i>
                  {f}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <Reveal>
          <div style={{
            maxWidth: 520, margin: '0 auto', padding: '56px 44px',
            borderRadius: 24,
            background: 'linear-gradient(145deg, rgba(0,255,136,0.03), rgba(0,0,0,0.15))',
            border: '1px solid rgba(0,255,136,0.06)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)',
              width: 350, height: 350, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,255,136,0.05), transparent)',
              animation: 'lp-orb-1 8s ease-in-out infinite',
            }} />
            <h2 style={{ fontSize: 28, fontWeight: 700, color: T.text, marginBottom: 8, position: 'relative', fontFamily: "'Sora', sans-serif" }}>
              ¿Listo para{' '}
              <span style={{ background: 'linear-gradient(135deg, #00ff88, #33e6ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>empezar</span>?
            </h2>
            <p style={{ fontSize: 14, color: T.muted, marginBottom: 32, position: 'relative' }}>
              Únete gratis y transforma tu conocimiento vial
            </p>
            <button onClick={() => nav('/login')} style={{
              padding: '18px 48px', borderRadius: 14,
              background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
              color: '#000', border: 'none', fontSize: 15, fontWeight: 700,
              fontFamily: 'inherit', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 10,
              boxShadow: '0 4px 24px rgba(0,255,136,0.25)',
              transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
              position: 'relative',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)'; e.currentTarget.style.boxShadow = '0 12px 48px rgba(0,255,136,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,255,136,0.25)' }}
            >
              <i className="fa-solid fa-rocket" style={{ animation: 'lp-rocket 1.6s ease-in-out infinite' }}></i>
              Comenzar ahora
            </button>
          </div>
        </Reveal>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        padding: '40px 24px', textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.02)',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, color: '#000', fontWeight: 900,
            }}><i className="fa-solid fa-motorcycle" style={{ fontSize: 11 }}></i></div>
            <span style={{
              fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.08em', fontFamily: "'Space Mono', monospace",
            }}>TRANSI+</span>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.1)', margin: 0 }}>
            Educación Vial Interactiva · {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      {/* ─── KEYFRAMES ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

        @keyframes lp-orb-1 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(40px,-30px) scale(1.08); } 66% { transform: translate(-25px,20px) scale(0.92); } }
        @keyframes lp-orb-2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-30px,25px) scale(1.05); } }
        @keyframes lp-orb-3 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(15px,20px) scale(0.95); } 66% { transform: translate(-20px,-10px) scale(1.06); } }
        @keyframes lp-orb-4 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(35px,15px) scale(1.04); } }
        @keyframes lp-logo-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes lp-logo-pulse { 0%,100% { transform: scale(1); opacity: 0.2; } 50% { transform: scale(1.08); opacity: 0.4; } }
        @keyframes lp-grad-shift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes lp-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes lp-blink { 50% { opacity: 0; } }
        @keyframes lp-arrow-bounce { 0%,100% { transform: translateX(0); } 50% { transform: translateX(4px); } }
        @keyframes lp-scroll-line { 0%,100% { transform: translateY(0); opacity: 1; } 50% { transform: translateY(8px); opacity: 0.25; } }
        @keyframes lp-star-pop { 0% { transform: scale(0) rotate(-30deg); opacity: 0; } 60% { transform: scale(1.3) rotate(5deg); opacity: 1; } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
        @keyframes lp-rocket { 0%,100% { transform: translateY(0) rotate(-45deg); } 50% { transform: translateY(-4px) rotate(-45deg); } }

        @keyframes lp-particle-0 { 0%,100% { transform: translate(0,0); opacity: 0; } 25% { opacity: var(--p-o,0.2); } 50% { transform: translate(20px,-15px); opacity: var(--p-o,0.2); } 75% { opacity: 0; } }
        @keyframes lp-particle-1 { 0%,100% { transform: translate(0,0); opacity: 0; } 25% { opacity: var(--p-o,0.15); } 50% { transform: translate(-15px,20px); opacity: var(--p-o,0.15); } 75% { opacity: 0; } }
        @keyframes lp-particle-2 { 0%,100% { transform: translate(0,0); opacity: 0; } 25% { opacity: var(--p-o,0.12); } 50% { transform: translate(10px,10px); opacity: var(--p-o,0.12); } 75% { opacity: 0; } }

        .lp-feature-card { position: relative; transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1); }
        .lp-feature-card:hover { transform: translateY(-6px) scale(1.01); }
        .lp-feature-card::before {
          content: ''; position: absolute; inset: 0; border-radius: 16;
          opacity: 0; transition: opacity 0.4s;
          background: linear-gradient(135deg, rgba(255,255,255,0.03), transparent);
        }
        .lp-feature-card:hover::before { opacity: 1; }
      `}</style>
    </div>
  )
}

function FeatureCard({ feature: f, index }) {
  const [ref, revealed] = useReveal()
  const cardRef = useRef(null)

  const handleMove = useCallback((e) => {
    if (!cardRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`
    cardRef.current.style.boxShadow = `${x * 12}px ${y * 12}px 30px ${f.color}08`
  }, [f.color])

  const handleLeave = useCallback(() => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)'
    cardRef.current.style.boxShadow = 'none'
  }, [])

  return (
    <div ref={(node) => { ref.current = node; cardRef.current = node }} style={{
      opacity: revealed ? 1 : 0,
      transform: revealed ? 'translateY(0)' : 'translateY(40px)',
      transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)',
      transitionDelay: `${index * 0.08}s`,
      background: `linear-gradient(145deg, ${T.card}, rgba(15,21,40,0.6))`,
      border: '1px solid rgba(255,255,255,0.03)',
      borderRadius: 16, padding: '28px 30px',
      position: 'relative', overflow: 'hidden',
      cursor: 'default',
    }}
      className="lp-feature-card"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div style={{
        position: 'absolute', top: '-60%', right: '-40%', width: 160, height: 160,
        borderRadius: '50%', background: f.color, opacity: 0.035, filter: 'blur(40px)',
        transition: 'all 0.5s',
      }} />
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: f.color + '12', border: `1px solid ${f.color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, color: f.color, marginBottom: 16,
        transition: 'all 0.3s',
      }}>
        <i className={f.icon}></i>
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text, margin: '0 0 8px', fontFamily: "'Sora', sans-serif" }}>{f.title}</h3>
      <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
    </div>
  )
}
