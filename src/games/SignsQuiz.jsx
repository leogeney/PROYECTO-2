import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ResultScreen, ScoreBadge, Lives } from './GameShared'

// Wikimedia Commons REST API — devuelve URL directa del archivo
const WIKIMEDIA_API = 'https://commons.wikimedia.org/w/api.php'

async function getWikimediaUrl(filename) {
  const url = `${WIKIMEDIA_API}?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json&origin=*`
  const res = await fetch(url)
  const data = await res.json()
  const pages = data.query.pages
  const page = Object.values(pages)[0]
  return page?.imageinfo?.[0]?.url ?? null
}

// Señales colombianas reales de Wikimedia Commons (Manual de Señalización Vial)
const SIGNS_QUIZ_DATA = [
  {
    file: 'Colombia road sign SR-04.svg',
    meaning: 'Prohibido el paso',
    type: 'prohibición',
    options: ['Prohibido el paso', 'Ceda el paso', 'Zona escolar', 'Límite de velocidad'],
    correct: 0,
  },
  {
    file: 'Colombia road sign SP-34.svg',
    meaning: 'Peligro adelante',
    type: 'advertencia',
    options: ['Curva peligrosa', 'Peligro adelante', 'Cruce de peatones', 'Zona de obras'],
    correct: 1,
  },
  {
    file: 'Colombia road sign SR-30 (Zona Escolar).svg',
    meaning: 'Zona escolar',
    type: 'especial',
    options: ['Hospital cercano', 'Parque infantil', 'Zona escolar', 'Zona residencial'],
    correct: 2,
  },
  {
    file: 'Colombia road sign SP-46.svg',
    meaning: 'Cruce peatonal',
    type: 'información',
    options: ['Estacionamiento', 'Cruce peatonal', 'Zona de recreo', 'Paso de ciclistas'],
    correct: 1,
  },
  {
    file: 'Colombia road sign SR-30-30.svg',
    meaning: 'Velocidad máxima 30 km/h',
    type: 'prohibición',
    options: ['Velocidad mínima', 'Carril exclusivo', 'Velocidad máxima 30 km/h', 'Peso máximo'],
    correct: 2,
  },
  {
    file: 'Colombia road sign SR-02.svg',
    meaning: 'Ceda el paso',
    type: 'prioridad',
    options: ['Zona azul de pago', 'Vía libre', 'Ceda el paso', 'Área de descanso'],
    correct: 2,
  },
  {
    file: 'Colombia road sign SR-01.svg',
    meaning: 'Pare (STOP)',
    type: 'prohibición',
    options: ['Ceda el paso', 'Reducir velocidad', 'Pare (STOP)', 'Solo vehículos autorizados'],
    correct: 2,
  },
  {
    file: 'Colombia road sign SP-11.svg',
    meaning: 'Cruce de vías',
    type: 'advertencia',
    options: ['Cruce de vías', 'Zona de carga', 'Desvío obligatorio', 'Carretera principal'],
    correct: 0,
  },
]

const TYPE_META = {
  prohibición: { color: '#ff3030', bg: 'rgba(255,48,48,0.1)',  border: 'rgba(255,48,48,0.25)',  label: 'PROHIBICIÓN', icon: '⛔' },
  advertencia: { color: '#ffd740', bg: 'rgba(255,215,64,0.1)', border: 'rgba(255,215,64,0.25)', label: 'ADVERTENCIA', icon: '⚠️' },
  información: { color: '#448aff', bg: 'rgba(68,138,255,0.1)', border: 'rgba(68,138,255,0.25)', label: 'INFORMACIÓN', icon: 'ℹ️' },
  especial:    { color: '#ff7043', bg: 'rgba(255,112,67,0.1)', border: 'rgba(255,112,67,0.25)', label: 'ESPECIAL',    icon: '🏫' },
  prioridad:   { color: '#ea80fc', bg: 'rgba(234,128,252,0.1)',border: 'rgba(234,128,252,0.25)',label: 'PRIORIDAD',   icon: '🟡' },
}

const LETTERS = ['A', 'B', 'C', 'D']

const QUIZ_CSS = `
  @keyframes sq-slide-in {
    from { opacity: 0; transform: translateX(32px) scale(0.97); }
    to   { opacity: 1; transform: translateX(0) scale(1); }
  }
  @keyframes sq-pop {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.12); }
    100% { transform: scale(1); }
  }
  @keyframes sq-shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-10px); }
    40%     { transform: translateX(10px); }
    60%     { transform: translateX(-7px); }
    80%     { transform: translateX(7px); }
  }
  @keyframes sq-countdown-warn {
    0%, 100% { color: #ff5252; transform: scale(1); }
    50%      { color: #ff1744; transform: scale(1.15); }
  }
  @keyframes sq-xp-float {
    0%   { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-48px) scale(1.3); }
  }
  @keyframes sq-sign-enter {
    from { opacity: 0; transform: scale(0.65) rotate(-6deg); }
    to   { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  @keyframes sq-spin-load {
    to { transform: rotate(360deg); }
  }

  .sq-slide  { animation: sq-slide-in 0.38s cubic-bezier(0.16,1,0.3,1) both; }
  .sq-pop    { animation: sq-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
  .sq-shake  { animation: sq-shake 0.4s ease both; }
  .sq-sign-img { animation: sq-sign-enter 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }

  .sq-option {
    position: relative; overflow: hidden;
    background: #131720;
    border: 1.5px solid rgba(255,255,255,0.07);
    border-radius: 14px; padding: 0; cursor: pointer;
    transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
    text-align: left; width: 100%;
    font-family: 'DM Sans', sans-serif;
  }
  .sq-option:hover:not(:disabled) {
    border-color: rgba(255,255,255,0.18);
    transform: translateX(4px);
    box-shadow: -4px 0 0 0 #448aff;
  }
  .sq-option:disabled { cursor: default; }
  .sq-option.correct {
    border-color: #00e676 !important;
    box-shadow: 0 0 0 1px #00e676, -4px 0 0 0 #00e676 !important;
    animation: sq-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .sq-option.wrong {
    border-color: #ff5252 !important;
    box-shadow: 0 0 0 1px #ff5252, -4px 0 0 0 #ff5252 !important;
    animation: sq-shake 0.4s ease both;
  }
  .sq-option.dimmed { opacity: 0.3; }

  .sq-timer-track {
    height: 3px; background: rgba(255,255,255,0.06);
    border-radius: 99px; overflow: hidden;
  }
  .sq-timer-fill { height: 100%; border-radius: 99px; transition: width 0.95s linear; }
  .sq-step-dot {
    width: 6px; height: 6px; border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  .sq-spinner {
    width: 28px; height: 28px;
    border: 3px solid rgba(255,255,255,0.08);
    border-top-color: #448aff;
    border-radius: 50%;
    animation: sq-spin-load 0.8s linear infinite;
  }
`

// ── Hook: prefetch de todas las URLs ─────────────────────────────
function useSignImages(quizData) {
  const [urls, setUrls] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const entries = await Promise.all(
        quizData.map(async (q) => {
          try {
            const url = await getWikimediaUrl(q.file)
            return [q.file, url]
          } catch {
            return [q.file, null]
          }
        })
      )
      if (!cancelled) {
        setUrls(Object.fromEntries(entries))
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { urls, loading }
}

// ── Subcomponentes ────────────────────────────────────────────────
function StepDots({ total, current, results }) {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current
        const res  = results[i]
        const color = done ? (res?.ok ? '#00e676' : '#ff5252') : i === current ? '#448aff' : 'rgba(255,255,255,0.1)'
        const scale = i === current ? 1.6 : done ? 1 : 0.8
        return (
          <div key={i} className="sq-step-dot" style={{
            background: color,
            transform: `scale(${scale})`,
            boxShadow: i === current ? `0 0 8px ${color}` : 'none',
          }} />
        )
      })}
    </div>
  )
}

function OptionButton({ label, letter, index, selected, correctIdx, disabled, onClick }) {
  const isCorrect  = index === correctIdx
  const isSelected = index === selected
  const isRevealed = selected !== null
  let cls = 'sq-option'
  if (isRevealed) {
    if (isCorrect) cls += ' correct'
    else if (isSelected) cls += ' wrong'
    else cls += ' dimmed'
  }
  return (
    <button className={cls} onClick={onClick} disabled={disabled}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{
          width: 48, height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRight: '1.5px solid rgba(255,255,255,0.06)', flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700,
            color: isRevealed && isCorrect ? '#00e676' : isRevealed && isSelected ? '#ff5252' : 'rgba(255,255,255,0.25)',
            transition: 'color 0.2s',
          }}>{letter}</span>
        </div>
        <span style={{
          flex: 1, padding: '0 16px', fontSize: 13, fontWeight: 500,
          color: isRevealed && isCorrect ? '#00e676' : isRevealed && isSelected && !isCorrect ? '#ff5252' : '#f0f4f8',
          transition: 'color 0.2s', lineHeight: 1.4,
        }}>{label}</span>
        {isRevealed && (isCorrect || isSelected) && (
          <div style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
            {isCorrect ? '✓' : '✗'}
          </div>
        )}
      </div>
    </button>
  )
}

function XpFloat({ visible }) {
  return visible ? (
    <div style={{
      position: 'absolute', top: -8, right: 0,
      fontFamily: "'Space Mono', monospace",
      fontSize: 16, fontWeight: 700, color: '#00e676',
      animation: 'sq-xp-float 1s ease forwards',
      pointerEvents: 'none', zIndex: 10,
      textShadow: '0 0 12px #00e676',
    }}>+20 XP</div>
  ) : null
}

// ── Main ──────────────────────────────────────────────────────────
export function SignsQuiz({ onBack }) {
  const { urls, loading } = useSignImages(SIGNS_QUIZ_DATA)

  const [step, setStep]               = useState(0)
  const [selected, setSelected]       = useState(null)
  const [score, setScore]             = useState(0)
  const [lives, setLives]             = useState(3)
  const [done, setDone]               = useState(false)
  const [timeLeft, setTimeLeft]       = useState(15)
  const [timeExpired, setTimeExpired] = useState(false)
  const [results, setResults]         = useState([])
  const [showXp, setShowXp]           = useState(false)
  const [slideKey, setSlideKey]       = useState(0)
  const timerRef = useRef(null)

  const q        = SIGNS_QUIZ_DATA[step]
  const meta     = TYPE_META[q.type] || TYPE_META.información
  const maxScore = SIGNS_QUIZ_DATA.length * 20
  const timerPct = (timeLeft / 15) * 100
  const timerColor = timeLeft > 8 ? '#00e676' : timeLeft > 4 ? '#ffd740' : '#ff5252'
  const imgUrl   = urls[q.file]

  const advance = useCallback((wasCorrect) => {
    const nr = [...results, { text: SIGNS_QUIZ_DATA[step].meaning, ok: wasCorrect }]
    setResults(nr)
    const nextLives = wasCorrect ? lives : lives - 1
    const nextStep  = step + 1
    if (nextStep >= SIGNS_QUIZ_DATA.length || nextLives <= 0) {
      setTimeout(() => setDone(true), 900)
    } else {
      setTimeout(() => {
        setStep(nextStep); setSelected(null)
        setTimeLeft(15); setTimeExpired(false)
        setSlideKey(k => k + 1)
      }, 900)
    }
  }, [step, results, lives])

  useEffect(() => {
    if (loading || done || selected !== null) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setTimeExpired(true)
          setLives(l => l - 1)
          setTimeout(() => advance(false), 900)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [step, done, selected, loading, advance])

  const handleSelect = (idx) => {
    if (selected !== null || timeExpired) return
    clearInterval(timerRef.current)
    setSelected(idx)
    const correct = idx === q.correct
    if (correct) {
      setScore(s => s + 20)
      setShowXp(true)
      setTimeout(() => setShowXp(false), 1100)
    } else {
      setLives(l => l - 1)
    }
    advance(correct)
  }

  const handleRetry = () => {
    setStep(0); setSelected(null); setScore(0); setLives(3)
    setDone(false); setResults([]); setTimeLeft(15)
    setTimeExpired(false); setSlideKey(k => k + 1)
  }

  if (done || lives === 0) {
    return (
      <ResultScreen
        score={score} maxScore={maxScore}
        title="Quiz de Señales" emoji="🚦"
        messages={results}
        onRetry={handleRetry}
        onHome={onBack}
      />
    )
  }

  return (
    <>
      <style>{QUIZ_CSS}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, maxWidth: 600, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12 }}>
          <Lives lives={lives} max={3} />
          <StepDots total={SIGNS_QUIZ_DATA.length} current={step} results={results} />
          <ScoreBadge score={score} />
        </div>

        {/* Timer */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
              Tiempo
            </span>
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700,
              color: timerColor,
              animation: !loading && timeLeft <= 5 ? 'sq-countdown-warn 0.6s ease infinite' : 'none',
              transition: 'color 0.3s',
            }}>
              {loading ? '–' : `${timeLeft}s`}
            </span>
          </div>
          <div className="sq-timer-track">
            <div className="sq-timer-fill" style={{
              width: loading ? '100%' : `${timerPct}%`,
              background: loading
                ? 'rgba(255,255,255,0.1)'
                : `linear-gradient(90deg, ${timerColor}88, ${timerColor})`,
              boxShadow: loading ? 'none' : `0 0 8px ${timerColor}60`,
            }} />
          </div>
        </div>

        {/* Sign card */}
        <div key={slideKey} className="sq-slide" style={{
          background: '#0e1118',
          border: `1px solid ${meta.border}`,
          borderRadius: 20, padding: '32px 28px',
          marginBottom: 16, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse at 50% 0%, ${meta.color}0d 0%, transparent 65%)`,
            pointerEvents: 'none',
          }} />

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: meta.bg, border: `1px solid ${meta.border}`,
            borderRadius: 99, padding: '4px 12px', marginBottom: 24, position: 'relative',
          }}>
            <span style={{ fontSize: 11 }}>{meta.icon}</span>
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: meta.color,
              fontFamily: "'Space Mono', monospace",
            }}>{meta.label}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 28, position: 'relative' }}>
            {/* Imagen real desde Wikimedia */}
            <div style={{
              width: 110, height: 110, flexShrink: 0,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 8, overflow: 'hidden',
            }}>
              {loading || !imgUrl ? (
                <div className="sq-spinner" />
              ) : (
                <img
                  key={`img-${slideKey}`}
                  src={imgUrl}
                  alt={q.meaning}
                  className="sq-sign-img"
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.6))',
                  }}
                />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 11, color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 8,
              }}>
                Pregunta {step + 1} de {SIGNS_QUIZ_DATA.length}
              </div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#f0f4f8', lineHeight: 1.35, margin: 0 }}>
                ¿Qué significa esta señal?
              </p>
            </div>
          </div>

          <div style={{ position: 'absolute', top: 16, right: 20 }}>
            <XpFloat visible={showXp} />
          </div>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {q.options.map((opt, i) => (
            <OptionButton
              key={`${slideKey}-${i}`}
              label={opt} letter={LETTERS[i]} index={i}
              selected={selected} correctIdx={q.correct}
              disabled={selected !== null || timeExpired || loading}
              onClick={() => handleSelect(i)}
            />
          ))}
        </div>

        {/* Time expired */}
        {timeExpired && selected === null && (
          <div style={{
            marginTop: 16, padding: '14px 18px', borderRadius: 12,
            background: 'rgba(255,112,67,0.07)', border: '1px solid rgba(255,112,67,0.25)',
            display: 'flex', alignItems: 'center', gap: 10,
            animation: 'sq-slide-in 0.3s ease both',
          }}>
            <span style={{ fontSize: 20 }}>⏰</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#ff7043' }}>¡Tiempo agotado!</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                Era: <strong style={{ color: '#f0f4f8' }}>{q.options[q.correct]}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Step counter */}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em' }}>
            {step + 1} / {SIGNS_QUIZ_DATA.length}
          </span>
        </div>
      </div>
    </>
  )
}