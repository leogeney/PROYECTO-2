import React, { useState } from 'react'
import { T, GameStyles } from './GameShared'
import { WordSearch } from './WordSearch'
import { MemoryMatch } from './MemoryMatch'
import { SignsQuiz } from './SignsQuiz'
import { VirtualDriver } from './VirtualDriver'

const GAMES = [
  {
    id: 'quiz',
    emoji: '🚦',
    title: 'Quiz de Señales',
    desc: 'Identifica señales de tránsito contra el reloj. Múltiples opciones rápidas.',
    color: T.red,
    xp: '160 XP',
    diff: 'fácil',
    tags: ['señales', 'tiempo'],
  },
  {
    id: 'wordsearch',
    emoji: '🔍',
    title: 'Sopa de Letras',
    desc: 'Encuentra las palabras ocultas relacionadas con el tránsito. Varios niveles de cuadrículas.',
    color: T.orange,
    xp: '150 XP',
    diff: 'medio',
    tags: ['palabras', 'visual'],
  },
  {
    id: 'memory',
    emoji: '🧠',
    title: 'Memoria de Señales',
    desc: 'Voltea las cartas y encuentra las parejas. Múltiples tableros crecientes en dificultad.',
    color: T.purple,
    xp: '170 XP',
    diff: 'fácil',
    tags: ['memoria', 'concentración'],
  },
  {
    id: 'driver',
    emoji: '🚗',
    title: 'Conductor Virtual',
    desc: 'Esquiva obstáculos, respeta señales y peatones. Juego estilo arcade con velocidad.',
    color: T.green,
    xp: '∞ XP',
    diff: 'difícil',
    tags: ['arcade', 'reflejos'],
  },
]

const DIFF_STYLE = {
  fácil:   { color: T.green, bg: 'rgba(0,230,118,.1)'   },
  medio:   { color: T.gold,  bg: 'rgba(255,215,64,.1)'  },
  difícil: { color: T.red,   bg: 'rgba(255,82,82,.1)'   },
}

export function GameHub() {
  const [active, setActive] = useState(null)

  const renderGame = () => {
    switch (active) {
      case 'quiz':       return <SignsQuiz     onBack={() => setActive(null)} />
      case 'wordsearch': return <WordSearch    onBack={() => setActive(null)} />
      case 'memory':     return <MemoryMatch   onBack={() => setActive(null)} />
      case 'driver':     return <VirtualDriver onBack={() => setActive(null)} />
      default: return null
    }
  }

  const g = active ? GAMES.find(x => x.id === active) : null

  return (
    <>
      <GameStyles />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Hub principal de tarjetas */}
        {!active && (
          <>
            <div className="anim-up" style={{
              padding: '24px 28px', borderRadius: 16, position: 'relative', overflow: 'hidden',
              background: `linear-gradient(135deg, ${T.card} 55%, rgba(0,230,118,.06))`,
              border: `1px solid rgba(0,230,118,.14)`,
            }}>
              <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: .6 }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 10, color: T.green, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.green, animation: 'glow-pulse 2s infinite' }}/>
                  Centro de juegos interactivo
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6, lineHeight: 1.2 }}>
                  Aprende jugando <span style={{ color: T.green }}>🎮</span>
                </h1>
                <p style={{ fontSize: 13, color: T.muted }}>
                  Juegos interactivos diseñados para que domines las normas de tránsito de una manera atractiva y divertida.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {GAMES.map((game, i) => {
                const d = DIFF_STYLE[game.diff]
                return (
                  <div
                    key={game.id}
                    className="game-card anim-up"
                    style={{ animationDelay: `${i * 60}ms`, borderColor: `${game.color}22` }}
                    onClick={() => setActive(game.id)}
                  >
                    <div style={{ height: 3, background: game.color, borderRadius: '16px 16px 0 0', opacity: .8 }}/>
                    <div style={{ padding: '18px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 12,
                          background: `${game.color}14`, border: `1px solid ${game.color}28`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                          boxShadow: `0 0 16px ${game.color}10`
                        }}>{game.emoji}</div>
                        <div style={{
                          padding: '3px 10px', borderRadius: 99,
                          background: d.bg, color: d.color,
                          fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em',
                        }}>{game.diff}</div>
                      </div>

                      <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 8 }}>{game.title}</h3>
                      <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5, marginBottom: 14 }}>{game.desc}</p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {game.tags.map(tag => (
                            <span key={tag} style={{
                              fontSize: 10, color: T.faint,
                              background: T.surface, border: `1px solid ${T.border}`,
                              borderRadius: 99, padding: '2px 8px',
                            }}>#{tag}</span>
                          ))}
                        </div>
                        <span className="mono" style={{ fontSize: 11, color: T.gold, fontWeight: 700 }}>
                          {game.xp}
                        </span>
                      </div>
                    </div>

                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      padding: '12px 20px',
                      background: `linear-gradient(transparent, ${T.card})`,
                      display: 'flex', justifyContent: 'flex-end',
                      opacity: 0, transition: 'opacity .2s',
                    }} className="game-cta">
                      <span style={{ fontSize: 13, color: game.color, fontWeight: 700 }}>Jugar →</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <style>{`
              .game-card:hover .game-cta { opacity: 1 !important; }
            `}</style>
          </>
        )}

        {/* Vista del juego seleccionado */}
        {active && g && (
          <div>
            <div className="anim-fade" style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 18px', background: T.surface,
              border: `1px solid ${T.border}`, borderRadius: 12, marginBottom: 20,
            }}>
              <button
                className="btn-game secondary"
                style={{ padding: '8px 14px', fontSize: 12 }}
                onClick={() => setActive(null)}
              >← Juegos</button>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: `${g.color}18`, border: `1px solid ${g.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
              }}>{g.emoji}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{g.title}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <span className="mono" style={{ fontSize: 12, color: T.gold }}>Max {g.xp}</span>
              </div>
            </div>

            <div className="anim-up" style={{
              background: T.card, borderRadius: 16,
              border: `1px solid ${g.color}22`,
              padding: '24px',
            }}>
              {renderGame()}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
