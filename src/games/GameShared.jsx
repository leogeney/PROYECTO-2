import React, { useEffect, useRef } from 'react'
import { useProgress } from '../context/ProgressContext'
import { Icon } from '../components/ui/Icon'
import { T } from '../styles/tokens'

const GAME_CSS = `
  @keyframes bounce-in {
    0%   { transform: scale(0.3); opacity: 0; }
    60%  { transform: scale(1.08); opacity: 1; }
    80%  { transform: scale(0.97); }
    100% { transform: scale(1); }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-6px); }
    80%      { transform: translateX(6px); }
  }
  @keyframes pop {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.18); }
    100% { transform: scale(1); }
  }
  @keyframes float-up {
    0%   { opacity:1; transform: translateY(0); }
    100% { opacity:0; transform: translateY(-48px); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes slide-up {
    from { opacity:0; transform: translateY(14px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @keyframes glow-pulse { 0%,100%{opacity:.5} 50%{opacity:1} }
  @keyframes fade-in { from{opacity:0} to{opacity:1} }
  @keyframes road-scroll {
    from { background-position: 0 0; }
    to   { background-position: 0 60px; }
  }

  .anim-up   { animation: slide-up .35s cubic-bezier(.16,1,.3,1) both; }
  .anim-fade { animation: fade-in .3s ease both; }
  .bounce-in { animation: bounce-in .5s cubic-bezier(.34,1.56,.64,1) both; }
  .mono { font-family: 'Space Mono', monospace; }

  .game-card {
    background: ${T.card};
    border: 1px solid ${T.border};
    border-radius: 16px;
    transition: all .2s;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .game-card:hover {
    border-color: ${T.borderHi};
    transform: translateY(-3px);
  }

  .btn-game {
    border: none; border-radius: 12px;
    font-size: 14px; font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; padding: 12px 24px;
    transition: all .2s; letter-spacing: .02em;
  }
  .btn-game:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.4); }
  .btn-game:active:not(:disabled) { transform: translateY(0); }
  .btn-game:disabled { opacity: .35; cursor: not-allowed; }
  .btn-game.primary { background: ${T.green}; color: #000; }
  .btn-game.primary:hover:not(:disabled) { background: #33eb91; }
  .btn-game.secondary { background: ${T.surface}; color: ${T.text}; border: 1px solid ${T.border}; }
  .btn-game.danger  { background: ${T.red};  color: #fff; }
  .btn-game.gold    { background: ${T.gold}; color: #000; }
  .btn-game.blue    { background: ${T.blue}; color: #fff; }

  .option-btn {
    background: ${T.card}; border: 2px solid ${T.border};
    border-radius: 12px; padding: 14px 18px;
    font-size: 14px; font-weight: 500; color: ${T.text};
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all .15s; text-align: left;
    display: flex; align-items: center; gap: 12px;
  }
  .option-btn:hover:not(:disabled) { border-color: ${T.blue}; background: rgba(68,138,255,.06); }
  .option-btn.correct  { border-color: ${T.green}!important; background: rgba(0,230,118,.1)!important; animation: pop .3s ease; }
  .option-btn.wrong    { border-color: ${T.red}!important;   background: rgba(255,82,82,.1)!important; animation: shake .35s ease; }
  .option-btn:disabled { cursor: default; }

  .lives-heart { font-size: 20px; transition: all .3s; }
  .lives-heart.lost { opacity: .2; filter: grayscale(1); transform: scale(.8); }

  .car {
    transition: left .15s linear;
    user-select: none;
    font-size: 28px;
    position: absolute;
    text-shadow: 0 2px 8px rgba(0,0,0,.5);
  }
  .obstacle {
    position: absolute;
    font-size: 26px;
    transition: top .05s linear;
  }

  .progress-bar-outer {
    height: 6px; background: ${T.faint}; border-radius: 99px; overflow: hidden;
  }
  .progress-bar-inner {
    height: 100%; background: linear-gradient(90deg, ${T.greenDim}, ${T.green});
    border-radius: 99px; box-shadow: 0 0 8px ${T.green};
    transition: width .3s ease;
  }

  .timer-bar-outer {
    height: 4px; background: ${T.faint}; border-radius: 99px; overflow: hidden;
  }
  .timer-bar-inner {
    height: 100%; background: linear-gradient(90deg, ${T.orange}, ${T.red});
    border-radius: 99px;
    transition: width .1s linear;
  }

  .grid-bg {
    background-image:
      linear-gradient(rgba(0,230,118,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,230,118,.025) 1px, transparent 1px);
    background-size: 32px 32px;
  }
`

export function GameStyles() {
  return <style>{GAME_CSS}</style>
}

export function Lives({ lives, max = 3 }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`lives-heart${i >= lives ? ' lost' : ''}`}><Icon icon="❤️" size={20} /></span>
      ))}
    </div>
  )
}

export function ScoreBadge({ score, color = T.gold }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span className="mono" style={{ fontSize: 13, color, fontWeight: 700 }}>
        <Icon icon="⚡" size={13} /> {score} XP
      </span>
    </div>
  )
}

export function ProgressBar({ current, total }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 10, color: T.faint, textTransform: 'uppercase', letterSpacing: '.08em' }}>
          Progreso
        </span>
        <span className="mono" style={{ fontSize: 10, color: T.green }}>
          {current}/{total}
        </span>
      </div>
      <div className="progress-bar-outer">
        <div className="progress-bar-inner" style={{ width: `${(current / total) * 100}%` }} />
      </div>
    </div>
  )
}

export function TimerBar({ timeLeft, total }) {
  const pct = (timeLeft / total) * 100
  const color = pct > 50 ? T.green : pct > 25 ? T.gold : T.red
  return (
    <div className="timer-bar-outer">
      <div className="timer-bar-inner" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color})` }} />
    </div>
  )
}

export function ResultScreen({ score, maxScore, title, emoji, onRetry, onHome, messages = [] }) {
  const { addXp } = useProgress()
  const pct = Math.round((score / maxScore) * 100)
  const medal = pct === 100 ? <Icon icon="🏆" size={64} /> : pct >= 70 ? <Icon icon="⭐" size={64} /> : pct >= 40 ? <Icon icon="😊" size={64} /> : <Icon icon="😅" size={64} />
  const phrase = pct === 100 ? '¡Perfecto! Eres un experto vial.' : pct >= 70 ? '¡Muy bien! Sigue practicando.' : pct >= 40 ? '¡Buen intento! Puedes mejorar.' : 'Sigue estudiando.'

  const added = useRef(false)

  useEffect(() => {
    if (score > 0 && !added.current) {
      addXp(score)
      added.current = true
    }
  }, [addXp, score])

  return (
    <div className="anim-up" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: 400, gap: 20, textAlign: 'center', padding: 32
    }}>
      <div style={{ fontSize: 64, animation: 'bounce-in .6s ease' }}>{medal}</div>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{title}</h2>
        <p style={{ color: T.muted, fontSize: 14 }}>{phrase}</p>
      </div>

      <div className="game-card" style={{
        padding: '20px 40px',
        borderColor: 'rgba(255,215,64,.25)',
        background: 'rgba(255,215,64,.04)',
        cursor: 'default',
      }}>
        <div className="mono" style={{ fontSize: 36, fontWeight: 700, color: T.gold }}>{score}</div>
        <div style={{ fontSize: 11, color: T.faint, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 4 }}>
          de {maxScore} XP posibles
        </div>
      </div>

      {messages.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 340 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              fontSize: 12, color: m.ok ? T.green : T.red,
              background: m.ok ? 'rgba(0,230,118,.06)' : 'rgba(255,82,82,.06)',
              border: `1px solid ${m.ok ? 'rgba(0,230,118,.2)' : 'rgba(255,82,82,.2)'}`,
              borderRadius: 8, padding: '6px 12px', textAlign: 'left',
            }}>
              {m.ok ? <Icon icon="✓" size={12} /> : <Icon icon="✗" size={12} />} {m.text}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button className="btn-game secondary" onClick={onHome}>← Juegos</button>
        <button className="btn-game primary" onClick={onRetry}>↺ Reintentar</button>
      </div>
    </div>
  )
}
