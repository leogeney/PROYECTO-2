import React, { useState, useEffect, useRef } from 'react'
import { T, ResultScreen, Lives } from './GameShared'

const GAME_WIDTH  = 500
const GAME_HEIGHT = 260
const LANE_W      = 100
const LANE_COUNT  = 4
const LANE_X      = [60, 160, 260, 360]

const OBSTACLES_POOL = [
  { emoji: '🚧', avoid: true,  label: 'Obstáculo' },
  { emoji: '🚦', avoid: false, label: 'Semáforo en verde' },
  { emoji: '🛑', avoid: true,  label: '¡STOP!' },
  { emoji: '🚸', avoid: true,  label: 'Peatón cruzando' },
  { emoji: '⚠️', avoid: true,  label: '¡Peligro!' },
  { emoji: '🟢', avoid: false, label: '¡Vía libre!' },
]

export function VirtualDriver({ onBack }) {
  const [lane, setLane]           = useState(1)
  const [obstacles, setObstacles] = useState([])
  const [score, setScore]         = useState(0)
  const [lives, setLives]         = useState(3)
  const [playing, setPlaying]     = useState(false)
  const [gameOver, setGameOver]   = useState(false)
  const [speed, setSpeed]         = useState(4)
  const [message, setMessage]     = useState(null)
  
  const frameRef   = useRef(null)
  const obsRef     = useRef([])
  const laneRef    = useRef(1)
  const scoreRef   = useRef(0)
  const livesRef   = useRef(3)
  const speedRef   = useRef(4)
  const spawnRef   = useRef(0)
  const frameCount = useRef(0)

  const showMsg = (text, color = T.gold) => {
    setMessage({ text, color })
    setTimeout(() => setMessage(null), 800)
  }

  const startGame = () => {
    obsRef.current   = []
    laneRef.current  = 1
    scoreRef.current = 0
    livesRef.current = 3
    speedRef.current = 4
    frameCount.current = 0
    
    setLane(1)
    setObstacles([])
    setScore(0)
    setLives(3)
    setSpeed(4)
    setGameOver(false)
    setPlaying(true)
    setMessage(null)
  }

  useEffect(() => {
    if (!playing) return
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft')  { laneRef.current = Math.max(0, laneRef.current - 1); setLane(laneRef.current) }
      if (e.key === 'ArrowRight') { laneRef.current = Math.min(LANE_COUNT - 1, laneRef.current + 1); setLane(laneRef.current) }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [playing])

  useEffect(() => {
    if (!playing) return

    const loop = () => {
      frameCount.current++

      // Mover obstáculos
      obsRef.current = obsRef.current
        .map(o => ({ ...o, y: o.y + speedRef.current }))
        .filter(o => {
          if (o.y > GAME_HEIGHT + 20) {
            scoreRef.current += 5
            setScore(scoreRef.current)
            return false
          }
          return true
        })

      // Spawn
      spawnRef.current++
      const spawnRate = Math.max(28, 70 - frameCount.current / 8)
      if (spawnRef.current >= spawnRate) {
        spawnRef.current = 0
        const pool = OBSTACLES_POOL[Math.floor(Math.random() * OBSTACLES_POOL.length)]
        const laneIdx = Math.floor(Math.random() * LANE_COUNT)
        obsRef.current.push({ ...pool, lane: laneIdx, y: -30, id: Date.now() + Math.random() })
      }

      // Colisiones
      const carY = GAME_HEIGHT - 60
      let hitDetected = false
      
      obsRef.current = obsRef.current.filter(o => {
        const hit = o.lane === laneRef.current && o.y > carY - 20 && o.y < carY + 40
        if (hit && !hitDetected) {
          hitDetected = true
          if (o.avoid) {
            livesRef.current--
            setLives(livesRef.current)
            showMsg(`💥 ${o.label}`, T.red)
            if (livesRef.current <= 0) {
              setGameOver(true); setPlaying(false);
            }
          } else {
            scoreRef.current += 10
            setScore(scoreRef.current)
            showMsg(`+10 ${o.label}`, T.green)
          }
          return false
        }
        return true
      })

      if (frameCount.current % 120 === 0) {
        speedRef.current = Math.min(12, speedRef.current + .5)
        setSpeed(speedRef.current)
      }

      setObstacles([...obsRef.current])
      if (!hitDetected || livesRef.current > 0) {
        frameRef.current = requestAnimationFrame(loop)
      }
    }

    frameRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameRef.current)
  }, [playing])

  const moveLane = (dir) => {
    if (!playing) return
    laneRef.current = Math.max(0, Math.min(LANE_COUNT - 1, laneRef.current + dir))
    setLane(laneRef.current)
  }

  if (gameOver) {
    return (
      <ResultScreen
        score={score * 3} maxScore={Math.max(300, score * 3)}
        title="Conductor Virtual"
        messages={[
          { text: `Puntaje final: ${score} puntos`, ok: score > 30 },
          { text: 'Sigue practicando para mejorar tus reflejos', ok: true },
        ]}
        onRetry={startGame}
        onHome={onBack}
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: GAME_WIDTH }}>
        <Lives lives={lives} max={3} />
        <span className="mono" style={{ fontSize: 13, color: T.cyan }}>Vel. {speed.toFixed(1)}x</span>
        <span className="mono" style={{ fontSize: 13, color: T.gold }}>⚡ {score} pts</span>
      </div>

      {/* Pantalla del juego */}
      <div style={{
        width: '100%', maxWidth: GAME_WIDTH, height: GAME_HEIGHT, position: 'relative',
        background: '#0d1117', borderRadius: 14, overflow: 'hidden',
        border: `2px solid ${playing ? T.green : T.border}`,
        boxShadow: playing ? `0 0 32px rgba(0,230,118,.12)` : 'none',
        transition: 'all .3s',
      }}>
        {/* Carretera */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            repeating-linear-gradient(180deg,
              transparent 0px, transparent 22px,
              rgba(255,215,64,.12) 22px, rgba(255,215,64,.12) 24px
            )`,
          animation: playing ? 'road-scroll .3s linear infinite' : 'none',
        }}/>

        {/* Carriles */}
        {LANE_X.map((x, i) => (
          <div key={i} style={{
            position: 'absolute', top: 0, bottom: 0,
            left: x, width: LANE_W,
            borderLeft: i > 0 ? '1px dashed rgba(255,255,255,.05)' : 'none',
          }}/>
        ))}

        {/* Obstáculos */}
        {obstacles.map(o => (
          <div key={o.id} className="obstacle" style={{
            left: LANE_X[o.lane] + LANE_W / 2 - 14,
            top: o.y,
          }}>
            {o.emoji}
          </div>
        ))}

        {/* Coche */}
        <div className="car" style={{
          left: LANE_X[lane] + LANE_W / 2 - 16,
          top: GAME_HEIGHT - 62,
          filter: `drop-shadow(0 0 8px ${T.blue}88)`,
        }}>🚗</div>

        {/* Mensaje flotante */}
        {message && (
          <div style={{
            position: 'absolute', top: '30%', left: '50%',
            transform: 'translateX(-50%)',
            color: message.color, fontSize: 16, fontWeight: 700,
            fontFamily: 'Space Mono, monospace',
            animation: 'float-up .8s ease forwards',
            pointerEvents: 'none', whiteSpace: 'nowrap',
          }}>
            {message.text}
          </div>
        )}

        {/* Pantalla inicio */}
        {!playing && !gameOver && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(7,9,15,.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 12,
          }}>
            <div style={{ fontSize: 40 }}>🚗</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Conductor Virtual</div>
            <div style={{ fontSize: 12, color: T.muted, textAlign: 'center', maxWidth: 260 }}>
              Evita obstáculos, respeta señales. Usa ← → o los botones.
            </div>
            <button className="btn-game primary" style={{ marginTop: 8 }} onClick={startGame}>
              ▶ Iniciar
            </button>
          </div>
        )}
      </div>

      {/* Controles táctiles */}
      {playing && (
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          <button
            className="btn-game secondary"
            style={{ padding: '14px 32px', fontSize: 20, borderRadius: 14 }}
            onClick={() => moveLane(-1)}
          >←</button>
          <button
            className="btn-game secondary"
            style={{ padding: '14px 32px', fontSize: 20, borderRadius: 14 }}
            onClick={() => moveLane(1)}
          >→</button>
        </div>
      )}

      <div style={{ fontSize: 12, color: T.faint, textAlign: 'center' }}>
        🟢 Recoge vía libre • 🚧 Evita obstáculos • ← → para moverse
      </div>
    </div>
  )
}
