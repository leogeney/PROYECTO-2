import React, { useState, useEffect, useRef } from 'react'
import { T, ResultScreen, ScoreBadge, ProgressBar } from './GameShared'

const LEVELS = [
  {
    words: ['PARE', 'CEDA', 'VIA', 'LUZ'],
    grid: [
      ['P', 'A', 'R', 'E', 'X', 'L'],
      ['C', 'V', 'I', 'A', 'M', 'U'],
      ['E', 'B', 'N', 'C', 'O', 'Z'],
      ['D', 'Q', 'W', 'E', 'R', 'T'],
      ['A', 'S', 'D', 'F', 'G', 'H'],
      ['Z', 'X', 'C', 'V', 'B', 'N']
    ],
  },
  {
    words: ['SEÑAL', 'PEATON', 'CRUCE', 'MOTO'],
    grid: [
      ['S', 'E', 'Ñ', 'A', 'L', 'P', 'X', 'M'],
      ['T', 'Y', 'U', 'I', 'O', 'E', 'C', 'O'],
      ['A', 'B', 'C', 'D', 'E', 'A', 'R', 'T'],
      ['Z', 'X', 'C', 'V', 'B', 'T', 'U', 'O'],
      ['N', 'M', 'Q', 'W', 'E', 'O', 'C', 'P'],
      ['R', 'T', 'Y', 'U', 'I', 'N', 'E', 'L']
    ]
  }
]

export function WordSearch({ onBack }) {
  const [levelIdx, setLevelIdx] = useState(0)
  const [foundWords, setFoundWords] = useState([])
  const [score, setScore] = useState(0)
  const [selection, setSelection] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [done, setDone] = useState(false)
  const gridRef = useRef(null)

  const level = LEVELS[levelIdx]

  const handlePointerDown = (r, c) => {
    setIsDragging(true)
    setSelection([{ r, c }])
  }

  const handlePointerEnter = (r, c) => {
    if (!isDragging) return
    const start = selection[0]
    // Solo permitir horizontal o vertical o diagonal
    const dr = Math.abs(r - start.r)
    const dc = Math.abs(c - start.c)
    
    if (dr === 0 || dc === 0 || dr === dc) {
      const newSel = []
      const steps = Math.max(dr, dc)
      const rStep = dr === 0 ? 0 : (r - start.r) / dr
      const cStep = dc === 0 ? 0 : (c - start.c) / dc
      
      for (let i = 0; i <= steps; i++) {
        newSel.push({ r: start.r + i * rStep, c: start.c + i * cStep })
      }
      setSelection(newSel)
    }
  }

  const handlePointerUp = () => {
    setIsDragging(false)
    if (selection.length === 0) return

    const word1 = selection.map(pos => level.grid[pos.r][pos.c]).join('')
    const word2 = selection.map(pos => level.grid[pos.r][pos.c]).reverse().join('')

    const match = level.words.find(w => (w === word1 || w === word2) && !foundWords.some(fw => fw.word === w))

    if (match) {
      setFoundWords([...foundWords, { word: match, path: selection }])
      setScore(s => s + 50)
      
      if (foundWords.length + 1 === level.words.length) {
        setTimeout(() => {
          if (levelIdx + 1 < LEVELS.length) {
            setLevelIdx(levelIdx + 1)
            setFoundWords([])
            setSelection([])
          } else {
            setDone(true)
          }
        }, 1500)
      }
    }
    setSelection([])
  }

  useEffect(() => {
    const cancel = () => setIsDragging(false)
    window.addEventListener('pointerup', cancel)
    return () => window.removeEventListener('pointerup', cancel)
  }, [])

  if (done) {
    const maxScore = LEVELS.reduce((acc, l) => acc + l.words.length * 50, 0)
    return (
      <ResultScreen
        score={score} maxScore={maxScore}
        title="Sopa de Letras"
        emoji="🔍"
        messages={[{ text: '¡Encontraste todas las palabras!', ok: true }]}
        onRetry={() => { setLevelIdx(0); setFoundWords([]); setSelection([]); setScore(0); setDone(false) }}
        onHome={onBack}
      />
    )
  }

  const isSelected = (r, c) => selection.some(pos => pos.r === r && pos.c === c)
  const isFound = (r, c) => foundWords.some(fw => fw.path.some(pos => pos.r === r && pos.c === c))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, userSelect: 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 12, color: T.muted }}>
          Nivel {levelIdx + 1} de {LEVELS.length}
        </div>
        <ScoreBadge score={score} />
      </div>

      <ProgressBar current={foundWords.length} total={level.words.length} />

      <div style={{ display: 'flex',flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        {/* Grid de letras */}
        <div
          ref={gridRef}
          onPointerLeave={() => setIsDragging(false)}
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(${level.grid.length}, 1fr)`,
            gap: 4,
            background: T.surface,
            padding: 12,
            borderRadius: 16,
            border: `1px solid ${T.border}`,
            touchAction: 'none'
          }}
        >
          {level.grid.map((row, r) => (
            <div key={r} style={{ display: 'flex', gap: 4 }}>
              {row.map((letter, c) => {
                const sel = isSelected(r, c)
                const fnd = isFound(r, c)
                let bg = T.card
                let color = T.text
                let borderColor = T.border
                if (sel) { bg = 'rgba(68,138,255,.2)'; borderColor = T.blue; color = T.blue }
                else if (fnd) { bg = 'rgba(0,230,118,.15)'; borderColor = T.green; color = T.green }

                return (
                  <div
                    key={c}
                    onPointerDown={() => handlePointerDown(r, c)}
                    onPointerEnter={() => handlePointerEnter(r, c)}
                    onPointerUp={handlePointerUp}
                    className="mono anim-fade"
                    style={{
                      width: 40, height: 40,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, fontWeight: 700,
                      background: bg, border: `2px solid ${borderColor}`,
                      borderRadius: 8, color,
                      cursor: 'pointer', transition: 'all .15s',
                      transform: sel ? 'scale(1.1)' : 'scale(1)',
                      zIndex: sel ? 10 : 1
                    }}
                  >
                    {letter}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Lista de palabras */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {level.words.map(w => {
            const found = foundWords.some(fw => fw.word === w)
            return (
              <div
                key={w}
                className="anim-up"
                style={{
                  padding: '8px 16px', borderRadius: 99,
                  background: found ? 'rgba(0,230,118,.1)' : T.card,
                  border: `1px solid ${found ? T.green : T.border}`,
                  color: found ? T.green : T.muted,
                  fontWeight: 600, fontSize: 13,
                  textDecoration: found ? 'line-through' : 'none',
                  transition: 'all .3s'
                }}
              >
                {w} {found && '✓'}
              </div>
            )
          })}
        </div>
      </div>
      
      <div style={{ fontSize: 11, color: T.faint, textAlign: 'center', marginTop: 10 }}>
        Arrastra para seleccionar las palabras (horizontal, vertical o diagonal)
      </div>
    </div>
  )
}
