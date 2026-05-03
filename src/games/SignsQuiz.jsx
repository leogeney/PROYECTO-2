import React, { useState, useEffect, useRef, useCallback } from 'react'
import { T, ResultScreen, ScoreBadge, ProgressBar, TimerBar, Lives } from './GameShared'

const SIGNS_QUIZ = [
  { emoji: '🔴', shape: 'circle', color: '#ff3030', meaning: 'Prohibido el paso', type: 'prohibición',
    options: ['Prohibido el paso', 'Ceda el paso', 'Zona escolar', 'Límite de velocidad'], correct: 0 },
  { emoji: '⚠️', shape: 'triangle', color: '#ffd740', meaning: 'Peligro adelante', type: 'advertencia',
    options: ['Curva peligrosa', 'Peligro adelante', 'Cruce de peatones', 'Zona de obras'], correct: 1 },
  { emoji: '🏫', shape: 'pentagon', color: '#ff7043', meaning: 'Zona escolar', type: 'especial',
    options: ['Hospital cercano', 'Parque infantil', 'Zona escolar', 'Zona residencial'], correct: 2 },
  { emoji: '🚶', shape: 'square', color: '#448aff', meaning: 'Cruce peatonal', type: 'información',
    options: ['Estacionamiento', 'Cruce peatonal', 'Zona de recreo', 'Paso de ciclistas'], correct: 1 },
  { emoji: '⛔', shape: 'circle', color: '#ff3030', meaning: 'Velocidad máxima 30', type: 'prohibición',
    options: ['Velocidad mínima', 'Carril exclusivo', 'Velocidad máxima 30', 'Peso máximo'], correct: 2 },
  { emoji: '🔵', shape: 'circle', color: '#2196f3', meaning: 'Información de servicio', type: 'información',
    options: ['Zona azul de pago', 'Información de servicio', 'Hospital', 'Área de descanso'], correct: 1 },
  { emoji: '🛑', shape: 'octagon', color: '#ff1744', meaning: 'Parada obligatoria (STOP)', type: 'prohibición',
    options: ['Ceda el paso', 'Reducir velocidad', 'Parada obligatoria (STOP)', 'Solo vehículos autorizados'], correct: 2 },
  { emoji: '🟡', shape: 'diamond', color: '#ffd740', meaning: 'Prioridad de paso', type: 'prioridad',
    options: ['Prioridad de paso', 'Zona de carga', 'Desvío obligatorio', 'Carretera principal'], correct: 0 },
]

export function SignsQuiz({ onBack }) {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [done, setDone] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15)
  const [timeExpired, setTimeExpired] = useState(false)
  const [results, setResults] = useState([])
  const timerRef = useRef(null)

  const q = SIGNS_QUIZ[step]
  const maxScore = SIGNS_QUIZ.length * 20

  const advance = useCallback((wasCorrect) => {
    const nr = [...results, { text: SIGNS_QUIZ[step].meaning, ok: wasCorrect }]
    setResults(nr)
    const nextStep = step + 1
    if (nextStep >= SIGNS_QUIZ.length || lives - (wasCorrect ? 0 : 1) <= 0) {
      setDone(true)
    } else {
      setTimeout(() => {
        setStep(nextStep)
        setSelected(null)
        setTimeLeft(15)
        setTimeExpired(false)
      }, 1000)
    }
  }, [step, results, lives])

  useEffect(() => {
    if (done || selected !== null) return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setTimeExpired(true)
          setLives(l => l - 1)
          setTimeout(() => advance(false, true), 1000)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [step, done, selected, advance])

  const handleSelect = (idx) => {
    if (selected !== null || timeExpired) return
    clearInterval(timerRef.current)
    setSelected(idx)
    const correct = idx === q.correct
    if (correct) setScore(s => s + 20)
    else setLives(l => l - 1)
    advance(correct)
  }

  if (done || lives === 0) {
    return (
      <ResultScreen
        score={score} maxScore={maxScore}
        title="Quiz de Señales"
        emoji="🚦"
        messages={results}
        onRetry={() => { setStep(0); setSelected(null); setScore(0); setLives(3); setDone(false); setResults([]); setTimeLeft(15); setTimeExpired(false) }}
        onHome={onBack}
      />
    )
  }

  const typeColors = { prohibición: T.red, advertencia: T.gold, información: T.cyan, especial: T.orange, prioridad: T.purple }
  const tc = typeColors[q.type] || T.muted

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 580, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Lives lives={lives} />
        <ScoreBadge score={score} />
        <div className="mono" style={{ fontSize: 13, color: timeLeft <= 5 ? T.red : T.muted }}>
          ⏱ {timeLeft}s
        </div>
      </div>

      <TimerBar timeLeft={timeLeft} total={15} />
      <ProgressBar current={step} total={SIGNS_QUIZ.length} />

      {/* Señal visual */}
      <div className="game-card anim-fade" style={{
        padding: '28px', textAlign: 'center', cursor: 'default',
        background: `linear-gradient(135deg, ${T.card} 60%, ${tc}0a)`,
        borderColor: `${tc}28`,
      }}>
        <div style={{ fontSize: 72, marginBottom: 12, lineHeight: 1 }}>{q.emoji}</div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: `${tc}18`, border: `1px solid ${tc}40`,
          borderRadius: 99, padding: '4px 12px',
        }}>
          <span style={{ fontSize: 10, color: tc, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>
            {q.type}
          </span>
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, marginTop: 14, color: T.text }}>
          ¿Qué significa esta señal?
        </p>
      </div>

      {/* Opciones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correct
          const isSelected = i === selected
          let cls = 'option-btn'
          if (selected !== null) {
            if (isCorrect) cls += ' correct'
            else if (isSelected) cls += ' wrong'
          }
          const letters = ['A', 'B', 'C', 'D']
          return (
            <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={selected !== null || timeExpired}>
              <span className="mono" style={{
                width: 28, height: 28, borderRadius: 7, background: T.surface,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: T.faint, flexShrink: 0,
              }}>{letters[i]}</span>
              <span style={{ flex: 1 }}>{opt}</span>
              {selected !== null && isCorrect && <span style={{ color: T.green, fontSize: 16 }}>✓</span>}
              {selected !== null && isSelected && !isCorrect && <span style={{ color: T.red, fontSize: 16 }}>✗</span>}
            </button>
          )
        })}
      </div>

      {timeExpired && selected === null && (
        <div className="anim-up" style={{
          padding: '12px 16px', borderRadius: 10,
          background: 'rgba(255,112,67,.08)', border: '1px solid rgba(255,112,67,.3)',
          fontSize: 13, color: T.orange,
        }}>
          ⏰ ¡Tiempo agotado! La respuesta era: <strong>{q.options[q.correct]}</strong>
        </div>
      )}
    </div>
  )
}
