import React, { useState, useCallback, useMemo } from 'react'
import { T, GameStyles } from './GameShared'
import { useAchievements, AchievementsProvider } from './GameAchievements'
import { WordSearch } from './WordSearch'
import { MemoryMatch } from './MemoryMatch'
import { SignsQuiz } from './SignsQuiz'
import { VirtualDriver } from './VirtualDriver'
import { Icon } from '../components/ui/Icon'

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

// ⚙️ Selector Modal de Dificultad
function DifficultySelector({ game, onSelect, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, animation: 'fade-in .2s ease'
    }}>
      <div className="anim-up" style={{
        background: T.card, borderRadius: 20,
        border: `1px solid ${T.border}`,
        padding: '32px', maxWidth: 420, width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}><Icon icon={game.emoji} size={48} /></div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 6 }}>
            {game.title}
          </h2>
          <p style={{ fontSize: 13, color: T.muted }}>
            Elige tu nivel de dificultad
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {Object.entries(DIFFICULTY_LEVELS).map(([key, diff]) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className="option-btn"
              style={{
                background: diff.bg,
                borderColor: `${diff.color}44`,
                borderWidth: '2px',
                padding: '14px 16px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                <span style={{ fontSize: 20 }}><Icon icon={diff.icon} size={20} /></span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: diff.color }}>
                    {diff.label} {diff.recommended && <Icon icon="⭐" size={13} />}
                  </div>
                  <div style={{ fontSize: 11, color: T.muted }}>
                    {diff.desc} • ×{diff.multiplier} XP
                  </div>
                </div>
              </div>
              <div style={{
                fontSize: 20,
                color: diff.color,
                opacity: 0,
                transition: 'all .2s',
              }} className="difficulty-arrow">
                →
              </div>
              <style>{`
                button:hover .difficulty-arrow { 
                  opacity: 1;
                  transform: translateX(4px);
                }
              `}</style>
            </button>
          ))}
        </div>

        <button
          onClick={onCancel}
          className="btn-game secondary"
          style={{ width: '100%', marginTop: 12 }}
        >
          ← Cancelar
        </button>
      </div>
    </div>
  )
}

// 🏆 Panel de Logros Compacto
function AchievementsPanel({ achievements }) {
  const unlockedCount = Object.values(achievements).filter(a => a.unlocked).length
  const totalCount = Object.keys(achievements).length

  return (
    <div className="anim-up" style={{
      padding: '16px 20px', borderRadius: 12,
      background: `linear-gradient(135deg, rgba(255,215,64,.08) 0%, rgba(255,215,64,.02) 100%)`,
      border: `1px solid rgba(255,215,64,.2)`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 16
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon icon="🏆" size={24} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>
            Logros desbloqueados
          </div>
          <div style={{ fontSize: 11, color: T.muted }}>
            {unlockedCount} de {totalCount} completados
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: totalCount }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 8, height: 8, borderRadius: '50%',
              background: Object.values(achievements)[i]?.unlocked ? T.gold : T.faint,
              opacity: Object.values(achievements)[i]?.unlocked ? 1 : 0.3,
              transition: 'all .3s'
            }}
          />
        ))}
      </div>
    </div>
  )
}

// 📊 Tarjeta de Juego Premium
function GameCard({ game, onPlay, isNew }) {
  const diff = DIFFICULTY_LEVELS[game.diff]
  
  return (
    <div
      className="game-card anim-up"
      onClick={onPlay}
      style={{
        background: T.card,
        border: `1px solid ${game.color}22`,
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all .3s cubic-bezier(.16,1,.3,1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = `0 12px 32px ${game.color}1a`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{
        height: 4,
        background: `linear-gradient(90deg, ${game.color}, transparent)`,
        opacity: 0.8
      }} />

      {isNew && (
        <div style={{
          position: 'absolute', top: 10, right: 10,
          background: T.green, color: '#000',
          padding: '4px 10px', borderRadius: 99,
          fontSize: 9, fontWeight: 700,
          zIndex: 10, animation: 'pulse 2s infinite'
        }}>
          <> <Icon icon="✨" size={9} /> NUEVO</>
        </div>
      )}

      <div style={{ padding: '18px 20px' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', marginBottom: 12, gap: 10
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: `${game.color}14`, border: `1px solid ${game.color}28`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, boxShadow: `0 0 16px ${game.color}10`, flexShrink: 0
          }}>
            <Icon icon={game.emoji} size={24} />
          </div>
          <div style={{
            padding: '4px 10px', borderRadius: 99, background: diff.bg,
            color: diff.color, fontSize: 9, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '.06em', whiteSpace: 'nowrap'
          }}>
            {diff.label}
          </div>
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6, lineHeight: 1.3 }}>
          {game.title}
        </h3>
        <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.4, marginBottom: 12, minHeight: 32 }}>
          {game.desc}
        </p>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 10, borderTop: `1px solid ${T.border}`
        }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {game.tags.slice(0, 2).map(tag => (
              <span key={tag} style={{
                fontSize: 9, color: T.faint, background: T.surface,
                border: `1px solid ${T.border}`, borderRadius: 99,
                padding: '2px 8px', whiteSpace: 'nowrap'
              }}>
                #{tag}
              </span>
            ))}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 12, fontWeight: 700, color: T.gold,
            fontFamily: "'Space Mono', monospace"
          }}>
            <Icon icon="⚡" size={12} /> {game.baseXp}
            <span style={{ fontSize: 16, opacity: 0, transition: 'all .2s' }} className="play-arrow">→</span>
          </div>
        </div>
      </div>

      <style>{`
        .game-card:hover .play-arrow { opacity: 1; transform: translateX(4px); }
      `}</style>
    </div>
  )
}

// 🎮 GameHub interno (usa el contexto)
function GameHubInner() {
  const { achievements } = useAchievements()
  const [activeGame, setActiveGame] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState(null)
  const [showDifficultySelector, setShowDifficultySelector] = useState(false)
  const [gameStats, setGameStats] = useState({})

  const currentGame = useMemo(() =>
    GAMES_CONFIG.find(g => g.id === activeGame),
    [activeGame]
  )

  const handlePlayGame = useCallback((gameId) => {
    setActiveGame(gameId)
    setShowDifficultySelector(true)
  }, [])

  const handleDifficultySelect = useCallback((difficulty) => {
    setSelectedDifficulty(difficulty)
    setShowDifficultySelector(false)
  }, [])

  const handleGameBack = useCallback(() => {
    setActiveGame(null)
    setSelectedDifficulty(null)
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
    if (!currentGame || !selectedDifficulty) return null
    const GameComponent = currentGame.component
    const diffMultiplier = DIFFICULTY_LEVELS[selectedDifficulty].multiplier
    return (
      <GameComponent
        onBack={handleGameBack}
        difficulty={selectedDifficulty}
        diffMultiplier={diffMultiplier}
        baseXp={currentGame.baseXp}
        onComplete={handleGameComplete}
      />
    )
  }

  return (
    <>
      <GameStyles />

      {showDifficultySelector && currentGame && (
        <DifficultySelector
          game={currentGame}
          onSelect={handleDifficultySelect}
          onCancel={() => setShowDifficultySelector(false)}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fade-in .3s ease' }}>
        {!activeGame && (
          <>
            <div className="anim-up" style={{
              padding: '32px 28px', borderRadius: 18, position: 'relative', overflow: 'hidden',
              background: `linear-gradient(135deg, ${T.card} 40%, rgba(0,230,118,.05) 100%)`,
              border: `1px solid rgba(0,230,118,.15)`,
              boxShadow: '0 8px 32px rgba(0,230,118,.08)'
            }}>
              <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  fontSize: 10, color: T.green, fontWeight: 700, letterSpacing: '.14em',
                  textTransform: 'uppercase', marginBottom: 12,
                  display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: T.green, animation: 'glow-pulse 2s infinite'
                  }} />
                  Centro de Juegos Interactivo
                </div>
                <h1 style={{
                  fontSize: 32, fontWeight: 800, marginBottom: 8,
                  lineHeight: 1.2, color: T.text, letterSpacing: '-0.5px'
                }}>
                  Aprende jugando <Icon icon="🎮" size={32} color={T.green} />
                </h1>
                <p style={{ fontSize: 14, color: T.muted, maxWidth: 480, lineHeight: 1.6 }}>
                  Domina las normas de tránsito a través de juegos interactivos y desafiantes.
                  Elige tu dificultad, desbloquea logros y compite por la puntuación más alta.
                </p>
              </div>
            </div>

            {Object.keys(achievements).length > 0 && (
              <AchievementsPanel achievements={achievements} />
            )}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16, marginTop: 8
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

            <div style={{
              padding: '20px', borderRadius: 12,
              background: `rgba(${68},${138},${255},.05)`,
              border: `1px solid ${T.borderHi}`,
              textAlign: 'center', fontSize: 12, color: T.muted, marginTop: 12
            }}>
              <Icon icon="💡" size={12} /> Completa todos los juegos y desbloquea logros épicos.
              Tu puntuación se guarda automáticamente.
            </div>
          </>
        )}

        {activeGame && currentGame && selectedDifficulty &&(
          <div className="anim-fade">
            <div className="anim-fade" style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 18px', background: T.surface,
              border: `1px solid ${T.border}`, borderRadius: 12,
              marginBottom: 20, marginTop: -4
            }}>
              <button
                className="btn-game secondary"
                onClick={handleGameBack}
                style={{ padding: '8px 14px', fontSize: 12, transition: 'all .2s' }}
              >
                ← Atrás
              </button>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: `${currentGame.color}18`, border: `1px solid ${currentGame.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0
              }}>
                <Icon icon={currentGame.emoji} size={18} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{currentGame.title}</div>
                <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>
                  {DIFFICULTY_LEVELS[selectedDifficulty].label} • ×{DIFFICULTY_LEVELS[selectedDifficulty].multiplier} XP
                </div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span className="mono" style={{ fontSize: 12, color: T.gold, fontWeight: 700 }}>
                  <Icon icon="⚡" size={12} /> {Math.round(currentGame.baseXp * DIFFICULTY_LEVELS[selectedDifficulty].multiplier)} XP
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