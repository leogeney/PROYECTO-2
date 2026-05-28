import React, { useState, useCallback, useMemo } from 'react'
import { T } from '../styles/tokens'
import { GameStyles } from './GameShared'
import { useAchievements, AchievementsProvider } from './GameAchievements'
import { WordSearch } from './WordSearch'
import { MemoryMatch } from './MemoryMatch'
import { SignsQuiz } from './SignsQuiz'
import { VirtualDriver } from './VirtualDriver'

const GAMES_CONFIG = [
  {
    id: 'quiz',
    emoji: '🚦',
    title: 'Quiz de Señales',
    desc: 'Identifica señales de tránsito contra el reloj. Múltiples opciones rápidas.',
    color: T.red,
    baseXp: 160,
    baseTime: 15,
    diff: 'fácil',
    tags: ['señales', 'tiempo', 'reflejos'],
    component: SignsQuiz,
    stats: { played: 0, best: 0 },
  },
  {
    id: 'wordsearch',
    emoji: '🔍',
    title: 'Sopa de Letras',
    desc: 'Encuentra las palabras ocultas. Varios niveles de cuadrículas con dificultad progresiva.',
    color: T.orange,
    baseXp: 150,
    diff: 'medio',
    tags: ['palabras', 'visual', 'lógica'],
    component: WordSearch,
    stats: { played: 0, best: 0 },
  },
  {
    id: 'memory',
    emoji: '🧠',
    title: 'Memoria de Señales',
    desc: 'Voltea cartas y encuentra parejas. Múltiples tableros crecientes en dificultad.',
    color: T.purple,
    baseXp: 170,
    diff: 'fácil',
    tags: ['memoria', 'concentración', 'reflejos'],
    component: MemoryMatch,
    stats: { played: 0, best: 0 },
  },
  {
    id: 'driver',
    emoji: '🚗',
    title: 'Conductor Virtual',
    desc: 'Esquiva obstáculos, respeta señales. Juego arcade con velocidad variable.',
    color: T.green,
    baseXp: 200,
    diff: 'difícil',
    tags: ['arcade', 'reflejos', 'velocidad'],
    component: VirtualDriver,
    stats: { played: 0, best: 0 },
  },
]

const DIFFICULTY_LEVELS = {
  fácil: { 
    label: 'FÁCIL',
    multiplier: 1,
    color: T.green,
    bg: 'rgba(0,230,118,.1)',
    desc: 'Perfecto para aprender',
    icon: '🟢'
  },
  medio: { 
    label: 'NORMAL',
    multiplier: 1.5,
    color: T.gold,
    bg: 'rgba(255,215,64,.1)',
    desc: 'Balance perfecto',
    icon: '🟡',
    recommended: true
  },
  difícil: { 
    label: 'DIFÍCIL',
    multiplier: 2,
    color: T.red,
    bg: 'rgba(255,82,82,.1)',
    desc: 'Desafío extremo',
    icon: '🔴'
  },
}

// 🏆 Panel de Logros Compacto
function AchievementsPanel({ achievements }) {
  const unlockedCount = Object.values(achievements).filter(a => a.unlocked).length
  const totalCount = Object.keys(achievements).length

  return (
    <div style={{
      padding: '12px 16px', borderRadius: 12,
      border: '1px solid rgba(255,215,64,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14, opacity: 0.6 }}>🏆</span>
        <div style={{ fontSize: 11, color: T.muted }}>
          {unlockedCount}/{totalCount} logros
        </div>
      </div>
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: totalCount }).map((_, i) => (
          <div key={i} style={{
            width: 5, height: 5, borderRadius: '50%',
            background: Object.values(achievements)[i]?.unlocked ? T.gold : 'rgba(255,255,255,0.05)',
          }} />
        ))}
      </div>
    </div>
  )
}

// 📊 Tarjeta de Juego Premium
function GameCard({ game, onPlay, isNew }) {
  const [hover, setHover] = useState(false)
  
  return (
    <div
      className="anim-up"
      onClick={onPlay}
      style={{
        background: hover
          ? `linear-gradient(145deg, ${T.card}, ${game.color}04)`
          : T.card,
        borderRadius: 14,
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.4s cubic-bezier(.16,1,.3,1)',
        transform: hover ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hover
          ? `0 20px 50px rgba(0,0,0,0.3), 0 0 0 1px ${game.color}10`
          : '0 1px 3px rgba(0,0,0,0.2)',
        padding: '24px 22px 18px',
        display: 'flex', flexDirection: 'column',
        minHeight: 200,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {isNew && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: T.green,
            boxShadow: `0 0 6px ${T.green}`,
          }} />
          <span style={{
            fontSize: 8, color: T.faint, fontWeight: 500,
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>Nuevo</span>
        </div>
      )}

      {/* Icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `${game.color}0a`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, marginBottom: 14,
      }}>
        {game.emoji}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: 15, fontWeight: 600, color: T.text,
        marginBottom: 6, lineHeight: 1.3,
      }}>
        {game.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: 11, color: T.muted, lineHeight: 1.5,
        margin: 0, flex: 1,
      }}>
        {game.desc}
      </p>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 14, paddingTop: 12,
        borderTop: '1px solid rgba(255,255,255,0.03)',
      }}>
        <span style={{
          fontSize: 10, color: T.faint,
          fontFamily: "'Space Mono', monospace",
          fontWeight: 500,
        }}>
          ⚡ {game.baseXp} XP
        </span>

        <span style={{
          fontSize: 11, fontWeight: 500, color: hover ? game.color : 'rgba(255,255,255,0.15)',
          transition: 'color 0.3s',
        }}>
          {hover ? 'Jugar →' : 'Empezar'}
        </span>
      </div>
    </div>
  )
}

// 🎮 GameHub interno (usa el contexto)
function GameHubInner() {
  const { achievements } = useAchievements()
  const [activeGame, setActiveGame] = useState(null)
  const [gameStats, setGameStats] = useState({})

  const currentGame = useMemo(() =>
    GAMES_CONFIG.find(g => g.id === activeGame),
    [activeGame]
  )

  const handlePlayGame = useCallback((gameId) => {
    setActiveGame(gameId)
  }, [])

  const handleGameBack = useCallback(() => {
    setActiveGame(null)
  }, [])

  const handleGameComplete = useCallback((score, maxScore) => {
    setGameStats(prev => ({
      ...prev,
      [activeGame]: {
        ...prev[activeGame],
        played: (prev[activeGame]?.played || 0) + 1,
        best: Math.max(prev[activeGame]?.best || 0, score)
      }
    }))
  }, [activeGame])

  const renderGame = () => {
    if (!currentGame) return null
    const GameComponent = currentGame.component
    const diff = 'medio'
    const diffMultiplier = DIFFICULTY_LEVELS[diff].multiplier
    return (
      <GameComponent
        onBack={handleGameBack}
        difficulty={diff}
        diffMultiplier={diffMultiplier}
        baseXp={currentGame.baseXp}
        onComplete={handleGameComplete}
      />
    )
  }

  return (
    <>
      <GameStyles />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fade-in .3s ease' }}>
        {!activeGame && (
          <>
            <div style={{
              borderRadius: 14, position: 'relative', overflow: 'hidden',
              background: `linear-gradient(145deg, ${T.card}, #0d101a)`,
              padding: '24px 22px 20px',
              boxShadow: '0 0 0 1px rgba(0,230,118,0.04)',
            }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  fontSize: 9, color: T.green, fontWeight: 600, letterSpacing: '.16em',
                  textTransform: 'uppercase', marginBottom: 8,
                }}>
                  Centro de Juegos
                </div>
                <h1 style={{
                  fontSize: 22, fontWeight: 600, margin: 0,
                  lineHeight: 1.2, color: T.text, letterSpacing: '-0.02em',
                }}>
                  Aprende jugando
                </h1>
                <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5, marginTop: 6, marginBottom: 0 }}>
                  Elige tu juego, define la dificultad y gana XP.
                </p>
              </div>
            </div>

            {Object.keys(achievements).length > 0 && (
              <AchievementsPanel achievements={achievements} />
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 12,
            }}>
              {GAMES_CONFIG.map((game, idx) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onPlay={() => handlePlayGame(game.id)}
                  isNew={idx === GAMES_CONFIG.length - 1}
                />
              ))}
            </div>
          </>
        )}

        {activeGame && currentGame &&(
          <div className="anim-fade">
            <div className="anim-fade" style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px', background: T.surface,
              border: `1px solid ${T.border}`, borderRadius: 12,
              marginBottom: 20,
            }}>
              <button
                className="btn-game secondary"
                onClick={handleGameBack}
                style={{ padding: '7px 12px', fontSize: 11 }}
              >
                ← Atrás
              </button>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: `${currentGame.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0
              }}>
                {currentGame.emoji}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{currentGame.title}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span className="mono" style={{ fontSize: 11, color: T.gold, fontWeight: 600 }}>
                  ⚡ {currentGame.baseXp} XP
                </span>
              </div>
            </div>

            <div className="anim-up" style={{
              background: T.card, borderRadius: 18,
              border: `1px solid ${currentGame.color}22`,
              padding: '28px', boxShadow: `0 8px 32px ${currentGame.color}0a`
            }}>
              {renderGame()}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes gc-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes gc-pulse{0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:0.7;transform:scale(1.08)}}
      `}</style>
    </>
  )
}

// 🎮 GameHub exportado — provee el contexto internamente
export function GameHub() {
  return (
    <AchievementsProvider>
      <GameHubInner />
    </AchievementsProvider>
  )
}