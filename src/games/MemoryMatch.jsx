import React, { useState, useEffect } from 'react'
import { T, ResultScreen, ScoreBadge, ProgressBar } from './GameShared'

const MEMORY_SIGNS = [
  { emoji: '⛔', label: 'STOP' },
  { emoji: '⚠️', label: 'Peligro' },
  { emoji: '🚶', label: 'Peatones' },
  { emoji: '🏫', label: 'Escuela' },
  { emoji: '🔵', label: 'Info' },
  { emoji: '🟡', label: 'Prioridad' },
  { emoji: '🚲', label: 'Bici' },
  { emoji: '🚦', label: 'Semáforo' },
]

const LEVELS = [
  { pairs: 3, grid: 'repeat(3, 1fr)' },
  { pairs: 6, grid: 'repeat(4, 1fr)' },
  { pairs: 8, grid: 'repeat(4, 1fr)' }
]

export function MemoryMatch({ onBack }) {
  const [levelIdx, setLevelIdx] = useState(0)
  const [cards, setCards] = useState([])
  const [first, setFirst] = useState(null)
  const [second, setSecond] = useState(null)
  const [locked, setLocked] = useState(false)
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const level = LEVELS[levelIdx]

  const initGame = (idx) => {
    const p = LEVELS[idx].pairs
    const subset = MEMORY_SIGNS.slice(0, p)
    const deck = [...subset, ...subset].map((s, i) => ({
      ...s, uid: i, id: s.label, flipped: false, matched: false
    }))
    setCards(deck.sort(() => Math.random() - 0.5))
    setFirst(null)
    setSecond(null)
    setLocked(false)
  }

  useEffect(() => {
    initGame(levelIdx)
  }, [levelIdx])

  const flip = (uid) => {
    if (locked) return
    const card = cards.find(c => c.uid === uid)
    if (!card || card.flipped || card.matched) return

    const updated = cards.map(c => c.uid === uid ? { ...c, flipped: true } : c)
    setCards(updated)

    if (!first) {
      setFirst(card)
    } else {
      setSecond(card)
      setMoves(m => m + 1)
      setLocked(true)
      setTimeout(() => {
        if (first.id === card.id) {
          // match
          const matched = updated.map(c => c.id === first.id ? { ...c, matched: true } : c)
          setCards(matched)
          setScore(s => s + 30)
          setFirst(null); setSecond(null); setLocked(false)
          if (matched.every(c => c.matched)) {
            setTimeout(() => {
              if (levelIdx + 1 < LEVELS.length) {
                setLevelIdx(l => l + 1)
              } else {
                setDone(true)
              }
            }, 800)
          }
        } else {
          // no match
          setCards(updated.map(c => (c.uid === uid || c.uid === first.uid) && !c.matched ? { ...c, flipped: false, wrong: true } : c))
          setTimeout(() => {
            setCards(prev => prev.map(c => ({ ...c, wrong: false })))
            setFirst(null); setSecond(null); setLocked(false)
          }, 400)
        }
      }, 800)
    }
  }

  if (done) {
    const maxScore = LEVELS.reduce((acc, l) => acc + l.pairs * 30, 0)
    return (
      <ResultScreen
        score={score} maxScore={maxScore}
        title={`Memoria — ${moves} movimientos`}
        messages={[{text: 'Entrenamiento de memoria superado', ok: true}]}
        onRetry={() => { setLevelIdx(0); setMoves(0); setScore(0); setDone(false); initGame(0) }}
        onHome={onBack}
      />
    )
  }

  const matchedPairs = cards.filter(c => c.matched).length / 2

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: T.muted }}>
          Nivel {levelIdx + 1}/{LEVELS.length} | Mov: <span className="mono" style={{ color: T.text }}>{moves}</span>
        </div>
        <ScoreBadge score={score} />
      </div>

      <ProgressBar current={matchedPairs} total={level.pairs} />

      <div style={{
        display: 'grid', gridTemplateColumns: level.grid, gap: 10, maxWidth: 400, margin: '0 auto', width: '100%'
      }}>
        {cards.map(card => (
          <div
            key={card.uid}
            onClick={() => flip(card.uid)}
            style={{
              aspectRatio: '1', borderRadius: 12,
              background: card.flipped || card.matched ? T.card : T.surface,
              border: `2px solid ${card.matched ? 'rgba(0,230,118,.35)' : card.wrong ? T.red : card.flipped ? T.borderHi : T.border}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: card.matched ? 'default' : 'pointer', transition: 'all .2s',
              opacity: card.matched ? .5 : 1,
              transform: card.wrong ? 'translateX(0) scale(1)' : (card.flipped && !card.matched ? 'scale(1.05)' : 'scale(1)'),
              animation: card.wrong ? 'shake .35s ease' : 'none'
            }}
            className={card.matched ? "bounce-in" : ""}
          >
            {card.flipped || card.matched ? (
              <>
                <div style={{ fontSize: level.pairs > 6 ? 24 : 32 }}>{card.emoji}</div>
                <div style={{ fontSize: 10, color: T.muted, marginTop: 4, textAlign: 'center', padding: '0 4px' }}>
                  {card.label}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 24, opacity: .2 }}>❓</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12, color: T.faint, textAlign: 'center' }}>
        Encuentra todas las parejas para avanzar de nivel
      </div>
    </div>
  )
}
