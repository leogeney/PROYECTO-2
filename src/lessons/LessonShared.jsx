import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { MODULES } from '../data/lessons'
import { T } from '../styles/tokens'
import { useNotification } from '../context/NotificationContext'
import { Icon } from '../components/ui/Icon'

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

  useEffect(() => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
    setQuizPool(shuffled.slice(0, 5))
  }, [allQuestions])

  if (!lesson) return (
    <div style={{ padding: 40, textAlign: 'center', color: T.muted }}>
      Lección no encontrada.
      <button className="btn-ghost" onClick={() => navigate(-1)} style={{ marginLeft: 12 }}>Volver</button>
    </div>
  )

  if (quizPool.length === 0) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{lesson.icon}</div>
      <h2 style={{ fontSize: 18, marginBottom: 8 }}>{lesson.title}</h2>
      <p style={{ color: T.muted, marginBottom: 20, fontSize: 13 }}>Cargando preguntas...</p>
    </div>
  )

  if (finished) {
    const correct = results.filter(Boolean).length
    const xpEarned = Math.round((correct / quizPool.length) * lesson.xp)
    const perfect = correct === quizPool.length
    return (
      <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 60 }}>{perfect ? <Icon icon="🏆" size={60} /> : correct > 0 ? <Icon icon="⭐" size={60} /> : <Icon icon="😅" size={60} />}</div>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>{perfect ? '¡Perfecto!' : '¡Completado!'}</h2>
        <p style={{ color: T.muted, fontSize: 14 }}>Respondiste <strong style={{ color: T.text }}>{correct}/{quizPool.length}</strong> correctamente</p>
        <div className="card" style={{ padding: '20px 44px', borderColor: 'rgba(255,215,64,0.25)', background: 'rgba(255,215,64,0.04)' }}>
          <div className="mono" style={{ fontSize: 32, fontWeight: 700, color: T.gold }}>+{xpEarned}</div>
          <div style={{ fontSize: 11, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>XP ganados</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" onClick={() => navigate('/dashboard/lecciones')}>← Lecciones</button>
          <button className="btn-primary" onClick={() => { 
            setStep(0); setSelected(null); setResults([]); setFinished(false)
            const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
            setQuizPool(shuffled.slice(0, 5))
          }}>Reintentar</button>
        </div>
      </div>
    )
  }

  const q = quizPool[step]
  const handleNext = () => {
    const nr = [...results, selected === q.correct]
    setResults(nr)
    if (step + 1 >= quizPool.length) {
      setFinished(true)
      const correctCount = nr.filter(Boolean).length
      const xpEarned = Math.round((correctCount / quizPool.length) * lesson.xp)
      addXp(xpEarned)
      completeLesson(lesson.id)
      
      const percentage = correctCount / quizPool.length
      if (percentage === 1) {
        showNotification?.('performance', <>¡Excelente trabajo! Puntaje perfecto. <Icon icon="🌟" size={14} /></>, 5000)
      } else if (percentage >= 0.6) {
        showNotification?.('performance', <>¡Muy bien! Te fue bien, sigue practicando. <Icon icon="👍" size={14} /></>, 5000)
      } else {
        showNotification?.('performance', <>¡No te rindas! Tienes que mejorar un poco. <Icon icon="💪" size={14} /></>, 5000)
      }
    } else {
      setStep(step + 1)
      setSelected(null)
    }
  }

  return (
    <div style={{ maxWidth: 580, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="btn-ghost" onClick={() => navigate(-1)} style={{ padding: '6px 10px' }}>←</button>
        <span style={{ fontSize: 20 }}>{lesson.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{lesson.title}</div>
          <div className="mono" style={{ fontSize: 10, color: T.faint }}>{step + 1}/{quizPool.length}</div>
        </div>
        <span className="mono" style={{ fontSize: 10, color: T.green }}>{Math.round((step / quizPool.length) * 100)}%</span>
      </div>

      <div style={{ height: 2, background: T.faint, borderRadius: 99, marginBottom: 28, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${(step / quizPool.length) * 100}%`,
          background: T.green, borderRadius: 99,
          transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: `0 0 8px ${T.green}`,
        }} />
      </div>

      <div className="card anim-fade" style={{ padding: '28px', marginBottom: 24, textAlign: 'center' }}>
        {q.emoji && <div style={{ marginBottom: 12 }}><Icon icon={q.emoji} size={44} /></div>}
        <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.4, margin: 0, color: T.text }}>{q.q}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {q.opts.map((opt, i) => {
          const isCorrect = i === q.correct
          const isSelected = i === selected
          let bg = T.card, border = T.border, color = T.text
          if (selected !== null) {
            if (isCorrect) { bg = 'rgba(0,230,118,0.08)'; border = T.green; color = T.green }
            else if (isSelected) { bg = 'rgba(255,82,82,0.08)'; border = T.red; color = T.red }
          }
          return (
            <button key={i} onClick={() => { if (selected === null) setSelected(i) }} style={{
              background: bg, border: `1px solid ${border}`, borderRadius: 10,
              padding: '13px 16px', color, fontSize: 13, fontFamily: 'DM Sans, sans-serif',
              textAlign: 'left', cursor: selected !== null ? 'default' : 'pointer',
              transition: 'all 0.2s', fontWeight: (isSelected || (selected !== null && isCorrect)) ? 600 : 400,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span className="mono" style={{
                width: 24, height: 24, borderRadius: 6, background: T.surface,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: T.faint, flexShrink: 0,
              }}>{['A', 'B', 'C', 'D'][i]}</span>
              <span style={{ flex: 1 }}>{opt}</span>
              {selected !== null && isCorrect && <Icon icon="✓" size={14} color={T.green} />}
              {selected !== null && isSelected && !isCorrect && <Icon icon="✗" size={14} color={T.red} />}
            </button>
          )
        })}
      </div>

      {selected !== null && (
        <div className="anim-up">
          <div style={{
            padding: '12px 16px', borderRadius: 10, marginBottom: 12,
            background: selected === q.correct ? 'rgba(0,230,118,0.08)' : 'rgba(255,82,82,0.08)',
            border: `1px solid ${selected === q.correct ? 'rgba(0,230,118,0.3)' : 'rgba(255,82,82,0.3)'}`,
            fontSize: 13, color: selected === q.correct ? T.green : T.red,
          }}>
            {selected === q.correct ? <><Icon icon="✅" size={14} /> ¡Correcto!</> : <><Icon icon="❌" size={14} /> La respuesta correcta es: "{q.opts[q.correct]}"</>}
          </div>
          <button className="btn-primary" style={{ width: '100%', padding: '13px' }} onClick={handleNext}>
            {step + 1 >= quizPool.length ? 'Ver resultados →' : 'Siguiente →'}
          </button>
        </div>
      )}
    </div>
  )
}