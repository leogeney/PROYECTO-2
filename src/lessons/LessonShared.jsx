import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { useSignImages } from '../utils/wikimedia'
import { MODULES } from '../data/lessons'
import { T } from '../styles/tokens'
import { useNotification } from '../context/NotificationContext'
import { Icon } from '../components/ui/Icon'

const LESSON_CSS = `
@keyframes lq-fadeIn { from{opacity:0;transform:scale(0.95) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
@keyframes lq-shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
@keyframes lq-pop { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
@keyframes lq-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
@keyframes lq-pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
@keyframes lq-glow { 0%,100%{box-shadow:0 0 12px rgba(0,230,118,0.4)} 50%{box-shadow:0 0 28px rgba(0,230,118,0.7)} }
@keyframes lq-timerPulse { 0%{transform:scale(1)} 50%{transform:scale(1.1)} 100%{transform:scale(1)} }
@keyframes lq-slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes lq-confetti { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(-120px) rotate(720deg);opacity:0} }
@keyframes lq-scaleUp { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
@keyframes lq-ripple { 0%{box-shadow:0 0 0 0 rgba(0,230,118,0.4)} 100%{box-shadow:0 0 0 20px rgba(0,230,118,0)} }
@keyframes lq-spinCheck { 0%{transform:rotate(-30deg) scale(0);opacity:0} 60%{transform:rotate(10deg) scale(1.15)} 100%{transform:rotate(0deg) scale(1);opacity:1} }
@keyframes lq-wrongPulse { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
.lq-card{transition:all 0.25s cubic-bezier(.16,1,.3,1)}
.lq-card:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.3)}
.lq-opt{transition:all 0.2s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden}
.lq-opt:not(.lq-disabled):hover{border-color:rgba(255,255,255,0.25);background:rgba(255,255,255,0.04)}
.lq-disabled{cursor:default !important}
.lq-timer{transition:width 1s linear}
.lq-img-wrap{transition:transform 0.4s cubic-bezier(.16,1,.3,1)}
.lq-img-wrap:hover{transform:scale(1.05)}
`

function QuestionCard({ q, step, total, selected, onSelect, urls }) {
  const imgUrl = q.img ? urls?.[q.img] : null
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  const letters = ['A', 'B', 'C', 'D']

  return (
    <div key={step} style={{ animation: 'lq-scaleUp 0.35s ease' }}>
      {/* Sign image — hero */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
        <div style={{
          width: 180, height: 180, borderRadius: 24,
          background: `linear-gradient(145deg, ${T.card}, rgba(255,255,255,0.02))`,
          border: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
          animation: 'lq-float 3s ease-in-out infinite',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(circle at 50% 30%, rgba(255,255,255,0.03), transparent 70%)`,
            pointerEvents: 'none',
          }} />
          {(imgUrl && !imgErr) ? (
              <>
                {!imgLoaded && (
                  <div style={{ position: 'absolute', animation: 'lq-pulse 1s ease-in-out infinite' }}>
                    <Icon icon="🔍" size={28} color={T.faint} />
                  </div>
                )}
                <img
                  src={imgUrl} alt="Señal"
                  className="lq-img-wrap"
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgErr(true)}
                  style={{
                    width: '100%', height: '100%', objectFit: 'contain', padding: 20,
                    opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s',
                    filter: imgLoaded ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' : 'none',
                  }}
                />
              </>
            ) : (
              <div style={{ animation: 'lq-float 2s ease-in-out infinite' }}>
                <Icon icon="🚦" size={48} />
              </div>
            )}
          {/* Step badge */}
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: T.card, borderRadius: 99,
            padding: '4px 10px', fontSize: 10, fontWeight: 700, color: T.faint,
            border: `1px solid ${T.border}`,
          }}>
            {step + 1}/{total}
          </div>
        </div>
      </div>

      {/* Question */}
      <div style={{
        padding: '18px 20px', borderRadius: 14, marginBottom: 20,
        background: T.card, border: `1px solid ${T.border}`,
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${T.green}, transparent)`,
        }} />
        <p style={{
          fontSize: 18, fontWeight: 600, lineHeight: 1.55, margin: 0,
          color: T.text, letterSpacing: '-0.01em',
        }}>
          {q.q}
        </p>
      </div>

      {/* Options — 2x2 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {q.opts.map((opt, i) => {
          const isCorrect = i === q.correct
          const isSelected = i === selected
          let bg = T.card, border = T.border, color = T.text, badgeBg = T.surface, badgeColor = T.faint
          if (selected !== null) {
            if (isCorrect) { bg = 'rgba(0,230,118,0.07)'; border = T.green; color = T.green; badgeBg = T.green; badgeColor = '#000' }
            else if (isSelected) { bg = 'rgba(255,82,82,0.07)'; border = T.red; color = T.red; badgeBg = T.red; badgeColor = '#fff' }
          }

          return (
            <button
              key={i}
              className={`lq-opt${selected !== null ? ' lq-disabled' : ''}`}
              onClick={() => { if (selected === null) onSelect(i) }}
              style={{
                background: bg, border: `1px solid ${border}`, borderRadius: 14,
                padding: '14px 12px', color, fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                textAlign: 'left', cursor: selected !== null ? 'default' : 'pointer',
                fontWeight: (isSelected || (selected !== null && isCorrect)) ? 600 : 400,
                display: 'flex', alignItems: 'center', gap: 14,
                animation: selected !== null && isCorrect ? 'lq-pop 0.3s ease' : selected !== null && isSelected && !isCorrect ? 'lq-shake 0.4s ease' : 'none',
                boxShadow: selected !== null && isCorrect ? '0 0 0 1px rgba(0,230,118,0.2)' : 'none',
              }}
            >
              <span className="mono" style={{
                width: 30, height: 30, borderRadius: 10,
                background: badgeBg, border: `1px solid ${isSelected ? border : T.border}`,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: badgeColor, flexShrink: 0,
                transition: 'all 0.2s',
              }}>{letters[i]}</span>

              <span style={{ flex: 1, lineHeight: 1.4 }}>{opt}</span>

              {selected !== null && isCorrect && (
                <div style={{ animation: 'lq-spinCheck 0.4s ease' }}>
                  <Icon icon="✓" size={18} color={T.green} />
                </div>
              )}
              {selected !== null && isSelected && !isCorrect && (
                <div style={{ animation: 'lq-pop 0.3s ease' }}>
                  <Icon icon="✗" size={18} color={T.red} />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {selected !== null && (
        <div style={{ animation: 'lq-slideUp 0.35s ease' }}>
          <div style={{
            marginTop: 18, padding: '16px 20px', borderRadius: 14,
            background: selected === q.correct ? 'rgba(0,230,118,0.06)' : 'rgba(255,82,82,0.06)',
            border: `1px solid ${selected === q.correct ? 'rgba(0,230,118,0.2)' : 'rgba(255,82,82,0.2)'}`,
            fontSize: 14, color: selected === q.correct ? T.green : T.red, lineHeight: 1.5,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 20 }}>
              {selected === q.correct ? '✅' : '❌'}
            </span>
            <span>
              {selected === q.correct ? (
                '¡Correcto!'
              ) : (
                <>La respuesta correcta es: <strong>{q.opts[q.correct]}</strong></>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function TimerBar({ timeLeft, total }) {
  const pct = (timeLeft / total) * 100
  const color = pct > 50 ? T.green : pct > 25 ? T.gold : T.red
  return (
    <div style={{
      width: '100%', height: 4, background: T.faint, borderRadius: 99,
      overflow: 'hidden', position: 'relative',
    }}>
      <div className="lq-timer" style={{
        height: '100%', width: `${pct}%`,
        background: `linear-gradient(90deg, ${color}, ${color})`,
        borderRadius: 99,
        boxShadow: pct < 25 ? `0 0 12px ${T.red}` : `0 0 8px ${color}`,
      }} />
      {pct < 25 && (
        <div style={{
          position: 'absolute', right: 0, top: -2,
          width: 8, height: 8, borderRadius: '50%',
          background: T.red, animation: 'lq-pulse 0.6s ease-in-out infinite',
        }} />
      )}
    </div>
  )
}

function ProgressHeader({ step, total, lesson, timeLeft, timerTotal }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <button className="btn-ghost" onClick={() => window.history.back()} style={{ padding: '6px 10px', fontSize: 13, borderRadius: 8, opacity: 0.7 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{lesson.title}</div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: T.card, borderRadius: 99, padding: '4px 12px 4px 8px',
          border: `1px solid ${T.border}`,
        }}>
          <Icon icon="⏱" size={12} color={timeLeft < 5 ? T.red : T.faint} />
          <span className="mono" style={{
            fontSize: 13, fontWeight: 700,
            color: timeLeft < 5 ? T.red : T.text,
            animation: timeLeft < 5 ? 'lq-timerPulse 0.5s ease-in-out infinite' : 'none',
          }}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 12 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 5, borderRadius: 99,
            background: i < step ? T.green : i === step ? lesson.color : T.faint,
            opacity: i > step ? 0.2 : 1,
            transition: 'all 0.35s cubic-bezier(.16,1,.3,1)',
            transform: i === step ? 'scaleY(1.3)' : 'scaleY(1)',
            boxShadow: i === step ? `0 0 8px ${lesson.color}44` : 'none',
          }} />
        ))}
      </div>

      <TimerBar timeLeft={timeLeft} total={timerTotal} />
    </div>
  )
}

function ResultBreakdown({ results, questions }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 400 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
        Desglose
      </div>
      {results.map((correct, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 14px', borderRadius: 10,
          background: correct ? 'rgba(0,230,118,0.04)' : 'rgba(255,82,82,0.04)',
          border: `1px solid ${correct ? 'rgba(0,230,118,0.12)' : 'rgba(255,82,82,0.12)'}`,
          fontSize: 12, color: correct ? T.green : T.red,
          animation: 'lq-slideUp 0.3s ease',
        }}>
          <span className="mono" style={{ fontWeight: 700, fontSize: 11, opacity: 0.6, width: 24 }}>#{i + 1}</span>
          <Icon icon={correct ? '✓' : '✗'} size={14} />
          <span style={{ color: T.faint, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {questions[i]?.opts[questions[i]?.correct] || ''}
          </span>
        </div>
      ))}
    </div>
  )
}

export function LessonRunner({ lessonId, allQuestions }) {
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  const lesson = MODULES.find(l => l.id === lessonId)
  const { addXp, completeLesson } = useProgress()

  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(null)
  const [results, setResults] = useState([])
  const [finished, setFinished] = useState(false)
  const [quizPool, setQuizPool] = useState([])
  const [timeLeft, setTimeLeft] = useState(15)
  const timerRef = useRef(null)
  const timePerQuestion = 15

  useEffect(() => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
    setQuizPool(shuffled.slice(0, 5))
  }, [allQuestions])

  const imgFiles = [...new Set(quizPool.map(q => q.img).filter(Boolean))]
  const { urls } = useSignImages(imgFiles)

  useEffect(() => {
    if (finished || quizPool.length === 0 || selected !== null) {
      clearInterval(timerRef.current)
      return
    }
    setTimeLeft(timePerQuestion)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          setSelected(-1)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [step, finished, quizPool.length, selected])

  const handleSelect = useCallback((i) => {
    if (selected !== null) return
    clearInterval(timerRef.current)
    setSelected(i)
  }, [selected])

  const handleNext = useCallback(() => {
    const isCorrect = selected === quizPool[step]?.correct
    const nr = [...results, isCorrect]
    setResults(nr)
    if (step + 1 >= quizPool.length) {
      setFinished(true)
      const correctCount = nr.filter(Boolean).length
      const xpEarned = Math.round((correctCount / quizPool.length) * (lesson?.xp || 50))
      addXp(xpEarned)
      completeLesson(lesson?.id)
      const pct = correctCount / quizPool.length
      if (pct === 1) showNotification?.('performance', <>¡Perfecto! <Icon icon="🌟" size={14} /></>, 5000)
      else if (pct >= 0.6) showNotification?.('performance', <>¡Bien hecho! <Icon icon="👍" size={14} /></>, 5000)
      else showNotification?.('performance', <>¡Sigue practicando! <Icon icon="💪" size={14} /></>, 5000)
    } else {
      setStep(s => s + 1)
      setSelected(null)
    }
  }, [selected, step, quizPool, results, lesson, addXp, completeLesson, showNotification])

  if (!lesson) return (
    <div style={{ padding: 40, textAlign: 'center', color: T.muted }}>
      Lección no encontrada.
      <button className="btn-ghost" onClick={() => navigate(-1)} style={{ marginLeft: 12 }}>Volver</button>
    </div>
  )

  if (quizPool.length === 0) return (
    <div style={{ padding: 60, textAlign: 'center' }}>
      <div style={{ animation: 'lq-float 2s ease-in-out infinite', marginBottom: 16 }}>
        <Icon icon="📚" size={48} color={lesson.color} />
      </div>
      <h2 style={{ fontSize: 18, marginBottom: 8, color: T.text }}>{lesson.title}</h2>
      <p style={{ color: T.muted, marginBottom: 20, fontSize: 13 }}>Preparando preguntas...</p>
    </div>
  )

  if (finished) {
    const correct = results.filter(Boolean).length
    const xpEarned = Math.round((correct / quizPool.length) * lesson.xp)
    const pct = Math.round((correct / quizPool.length) * 100)
    let grade = pct === 100 ? { icon: '🏆', title: '¡Perfecto!', phrase: 'Eres un experto vial.', color: T.gold }
      : pct >= 80 ? { icon: '⭐', title: '¡Excelente!', phrase: 'Conoces muy bien las normas.', color: T.green }
      : pct >= 60 ? { icon: '🌟', title: '¡Bien hecho!', phrase: 'Sigue practicando para mejorar.', color: T.blue }
      : { icon: '📚', title: 'Sigue estudiando', phrase: 'Revisa los temas y vuelve a intentarlo.', color: T.muted }

    return (
      <div className="anim-up" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '60vh', gap: 16, textAlign: 'center',
        padding: '20px 0',
      }}>
        <div style={{ animation: 'lq-pop 0.5s ease', fontSize: 64 }}>
          <Icon icon={grade.icon} size={64} color={grade.color} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: grade.color }}>{grade.title}</h2>
        <p style={{ color: T.muted, fontSize: 14 }}>{grade.phrase}</p>

        <div style={{
          padding: '24px 44px', borderRadius: 16,
          border: `1px solid rgba(255,215,64,0.25)`,
          background: 'rgba(255,215,64,0.04)',
        }}>
          <div className="mono" style={{ fontSize: 36, fontWeight: 700, color: T.gold, lineHeight: 1 }}>
            +{xpEarned}
          </div>
          <div style={{ fontSize: 11, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>
            XP ganados
          </div>
        </div>

        <div style={{
          display: 'flex', gap: 8,
          padding: '8px 20px', borderRadius: 99,
          background: 'rgba(255,255,255,0.04)',
        }}>
          <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{correct}/{quizPool.length}</span>
          <span style={{ fontSize: 12, color: T.faint }}>correctas ({pct}%)</span>
        </div>

        <ResultBreakdown results={results} questions={quizPool} />

        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button className="btn-ghost" onClick={() => navigate('/dashboard/lecciones')}>
            ← Lecciones
          </button>
          <button className="btn-primary" onClick={() => {
            setStep(0); setSelected(null); setResults([]); setFinished(false)
            const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
            setQuizPool(shuffled.slice(0, 5))
          }}>
            ↺ Reintentar
          </button>
        </div>
      </div>
    )
  }

  const q = quizPool[step]

  return (
    <>
      <style>{LESSON_CSS}</style>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 4px' }}>
        <ProgressHeader
          step={step}
          total={quizPool.length}
          lesson={lesson}
          timeLeft={timeLeft}
          timerTotal={timePerQuestion}
        />

        <QuestionCard
          key={step}
          q={q}
          step={step}
          total={quizPool.length}
          selected={selected}
          onSelect={handleSelect}
          urls={urls}
        />

        {selected !== null && (
          <button
            className="btn-primary"
            style={{
              width: '100%', padding: '16px', fontSize: 15, borderRadius: 14,
              marginTop: 8, fontWeight: 600, letterSpacing: '0.01em',
            }}
            onClick={handleNext}
          >
            {step + 1 >= quizPool.length ? 'Ver resultados →' : 'Siguiente pregunta →'}
          </button>
        )}
      </div>
    </>
  )
}
