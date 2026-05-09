import { useState } from 'react'
import { useParams, useNavigate, NavLink } from 'react-router-dom'
import { T } from '../styles/tokens'

// ─── Contenido por módulo ────────────────────────────────────────
const MODULE_CONTENT = {
  1: {
    icon: '🚦', title: 'Señales de tránsito', color: '#ff5252',
    description: 'Las señales viales son el lenguaje universal de la carretera. Conocerlas puede salvarte la vida.',
    lessons: [
      {
        id: 1,
        icon: '⛔', title: 'Señales Reglamentarias',
        diff: 'fácil', time: '5 min', xp: 50,
        // TIPO 1: Tarjetas de concepto (flashcards)
        type: 'flashcards',
        cards: [
          { front: '¿Qué son las señales reglamentarias?', back: 'Son señales que establecen normas y obligaciones que todo conductor DEBE cumplir. Ignorarlas puede resultar en multas o accidentes.' },
          { front: 'Forma y color característico', back: 'Generalmente son circulares con borde rojo. El rojo indica PROHIBICIÓN. También incluye el octágono rojo del STOP.' },
          { front: 'STOP — Señal octagonal roja', back: 'Exige detenerse completamente antes de la línea de parada. Aunque no veas vehículos, debes parar. Es obligatorio por ley.' },
          { front: 'Círculo rojo con barra blanca', back: 'Prohibición de entrada o paso. No puedes circular en esa dirección. Muy común en vías de un solo sentido.' },
          { front: 'Número dentro de círculo rojo', back: 'Indica la velocidad MÁXIMA permitida en ese tramo. Por encima de ese número eres sancionable y peligroso.' },
          { front: 'Triángulo invertido — Ceda el paso', back: 'No es un stop total, pero debes reducir y dejar pasar a quien tiene prioridad. Si está despejado, puedes continuar.' },
        ],
      },
      {
        id: 2,
        icon: '⚠️', title: 'Señales Preventivas',
        diff: 'fácil', time: '6 min', xp: 60,
        // TIPO 2: Artículo con tips
        type: 'article',
        sections: [
          {
            emoji: '🟡', heading: '¿Qué son?',
            body: 'Las señales preventivas te AVISAN de un peligro próximo. No obligan a parar, pero sí a reducir la velocidad y aumentar tu atención. Son tu sistema de alerta temprana en la carretera.',
          },
          {
            emoji: '🔶', heading: 'Forma y color',
            body: 'Son rombos (cuadrado girado 45°) de color AMARILLO con dibujos negros en el interior. En Colombia, el amarillo siempre significa "¡ojo, peligro posible adelante!"',
          },
          {
            emoji: '🦌', heading: 'Ejemplos comunes',
            tips: [
              '🔀 Curva peligrosa — Reduce velocidad antes de entrar',
              '🚸 Zona escolar — Niños pueden cruzar en cualquier momento',
              '🦌 Cruce de animales — Especialmente en vías rurales nocturnas',
              '🌉 Puente angosto — Ajusta tu posición y reduce velocidad',
              '⛏️ Zona de obras — Obreros en la vía, máxima precaución',
            ],
          },
          {
            emoji: '📍', heading: '¿Dónde se ubican?',
            body: 'Siempre ANTES del peligro, a suficiente distancia para que el conductor pueda reaccionar. A mayor velocidad permitida en la vía, más lejos se instala la señal.',
          },
          {
            emoji: '💡', heading: 'Truco para recordarlas',
            body: 'Rombo amarillo = Prepárate. No es una orden, es un aviso. Piensa en ellas como un amigo que te susurra "oye, ten cuidado ahí adelante".',
          },
        ],
      },
    ],
  },
  2: {
    icon: '📋', title: 'Normas básicas', color: '#18ffff',
    description: 'Las reglas del juego en la vía pública. Sin ellas, el tráfico sería un caos total.',
    lessons: [
      {
        id: 3,
        icon: '🚦', title: 'Semáforos y Prioridades',
        diff: 'medio', time: '8 min', xp: 80,
        // TIPO 3: Historia narrativa
        type: 'story',
        character: { name: 'Camilo', emoji: '🧑‍💼', role: 'Conductor nuevo en Bogotá' },
        scenes: [
          {
            emoji: '🌅',
            title: 'Primer día manejando solo',
            text: 'Camilo arrancó el carro nervioso. Era su primer día manejando solo en Bogotá. Sabía que la ciudad era caótica, pero confiaba en lo que había aprendido.',
          },
          {
            emoji: '🔴',
            title: 'Semáforo en rojo',
            text: 'En la primera intersección, el semáforo estaba en ROJO. Camilo frenó suavemente antes de la línea blanca. Un taxi detrás tocó la bocina de impaciencia, pero Camilo no se movió. La ley es clara: rojo es STOP total.',
            highlight: '💡 Rojo = Detención completa, siempre, sin excepciones.',
          },
          {
            emoji: '🟡',
            title: 'El tentador amarillo',
            text: 'Dos cuadras después, el semáforo cambió a AMARILLO cuando estaba a 10 metros. Camilo evaluó: no podía frenar de golpe sin causar un choque. Cruzó con precaución. Pero tomó nota mental: la próxima vez reduciría antes para poder parar.',
            highlight: '💡 Amarillo = Prepárate para detenerte si es seguro hacerlo.',
          },
          {
            emoji: '🚶',
            title: 'El peatón tiene prioridad',
            text: 'En un cruce sin semáforo, una señora comenzó a cruzar. Camilo frenó de inmediato y le hizo señas para que pasara. Ella cruzó tranquila. Otro conductor se quejó por el atraso. Camilo sonrió — había hecho lo correcto.',
            highlight: '💡 El peatón SIEMPRE tiene prioridad en cruces peatonales señalizados.',
          },
          {
            emoji: '🚑',
            title: 'La ambulancia',
            text: 'De repente, detrás de él, escuchó sirenas. Camilo inmediatamente se arrimó al borde derecho de la vía y frenó. La ambulancia pasó veloz. Un segundo de reacción puede salvar una vida.',
            highlight: '💡 Vehículos de emergencia con sirena: cede la vía siempre, sin dudar.',
          },
          {
            emoji: '🏠',
            title: 'Llegó sano y salvo',
            text: 'Camilo llegó a casa. No fue el viaje más rápido, pero fue el más seguro. Comprendió que las normas no son obstáculos — son el sistema que hace posible que miles de personas compartan la vía sin matarse.',
            highlight: '🎯 Las normas de tránsito no son burocracia. Son convivencia.',
          },
        ],
      },
      {
        id: 4,
        icon: '🏎️', title: 'Velocidades Máximas',
        diff: 'fácil', time: '7 min', xp: 70,
        // TIPO 1: Flashcards
        type: 'flashcards',
        cards: [
          { front: '¿Por qué existen límites de velocidad?', back: 'A mayor velocidad, mayor distancia de frenado y más graves las consecuencias en un accidente. El límite salva vidas, literalmente.' },
          { front: 'Zona urbana — Velocidad general', back: 'En Colombia, la velocidad máxima en zonas urbanas suele ser 50 km/h salvo que una señal indique otro valor.' },
          { front: 'Zona escolar', back: '30 km/h o menos, especialmente en horarios de entrada y salida. Niños pueden aparecer de repente sin avisar.' },
          { front: 'Carretera nacional', back: 'Hasta 80 km/h para autos particulares, aunque la señal específica manda. Siempre observa las señales locales.' },
          { front: '¿El límite aplica en el carril "rápido"?', back: 'Sí. El carril izquierdo es para adelantar, no para ignorar el límite. La velocidad máxima aplica en TODOS los carriles.' },
          { front: 'Lluvia o niebla — ¿Qué hago con la velocidad?', back: 'Reduce por debajo del límite. Las condiciones del clima cambian la distancia de frenado. Ser legal no significa ser seguro si el asfalto está mojado.' },
        ],
      },
    ],
  },
}

// ─── Componente Flashcard ────────────────────────────────────────
function Flashcard({ card, index, total }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div style={{ perspective: 1000 }}>
      <div
        onClick={() => setFlipped(f => !f)}
        style={{
          position: 'relative', width: '100%', minHeight: 180,
          cursor: 'pointer',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          background: '#0e1118', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: '28px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', gap: 16,
        }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: "'Space Mono',monospace", letterSpacing: '0.1em' }}>
            {index + 1} / {total} — toca para voltear
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#f0f4f8', lineHeight: 1.5 }}>{card.front}</p>
          <div style={{ fontSize: 24 }}>❓</div>
        </div>
        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: 'linear-gradient(135deg, #0e1118 60%, rgba(0,230,118,0.06))',
          border: '1px solid rgba(0,230,118,0.2)',
          borderRadius: 16, padding: '28px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', gap: 12,
        }}>
          <div style={{ fontSize: 20 }}>✅</div>
          <p style={{ fontSize: 14, color: '#f0f4f8', lineHeight: 1.6 }}>{card.back}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Tipo: Flashcards ────────────────────────────────────────────
function FlashcardsLesson({ lesson, color, onStartQuiz }) {
  const [idx, setIdx] = useState(0)
  const cards = lesson.cards
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{
        background: 'rgba(255,255,255,0.02)', borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.06)', padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 18 }}>🃏</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#f0f4f8' }}>Tarjetas de concepto</div>
          <div style={{ fontSize: 11, color: T.muted }}>Toca cada tarjeta para revelar la respuesta</div>
        </div>
      </div>

      <Flashcard card={cards[idx]} index={idx} total={cards.length} />

      {/* Nav */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <button
          onClick={() => setIdx(i => Math.max(0, i - 1))}
          disabled={idx === 0}
          style={{
            padding: '8px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent', color: idx === 0 ? T.faint : '#f0f4f8',
            cursor: idx === 0 ? 'default' : 'pointer', fontSize: 13,
          }}
        >← Anterior</button>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {cards.map((_, i) => (
            <div key={i} onClick={() => setIdx(i)} style={{
              width: 7, height: 7, borderRadius: '50%', cursor: 'pointer',
              background: i === idx ? color : 'rgba(255,255,255,0.12)',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>
        <button
          onClick={() => setIdx(i => Math.min(cards.length - 1, i + 1))}
          disabled={idx === cards.length - 1}
          style={{
            padding: '8px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent', color: idx === cards.length - 1 ? T.faint : '#f0f4f8',
            cursor: idx === cards.length - 1 ? 'default' : 'pointer', fontSize: 13,
          }}
        >Siguiente →</button>
      </div>

      {idx === cards.length - 1 && (
        <button onClick={onStartQuiz} style={{
          padding: '14px', borderRadius: 14, border: 'none',
          background: color, color: '#000', fontWeight: 700, fontSize: 14,
          cursor: 'pointer', marginTop: 8,
          boxShadow: `0 0 24px ${color}40`,
        }}>
          ✅ Listo — Hacer el quiz →
        </button>
      )}
    </div>
  )
}

// ─── Tipo: Artículo con tips ─────────────────────────────────────
function ArticleLesson({ lesson, color, onStartQuiz }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        background: 'rgba(255,255,255,0.02)', borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.06)', padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 18 }}>📖</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#f0f4f8' }}>Artículo de aprendizaje</div>
          <div style={{ fontSize: 11, color: T.muted }}>Lee con calma, luego pon a prueba lo aprendido</div>
        </div>
      </div>

      {lesson.sections.map((sec, i) => (
        <div key={i} style={{
          background: '#0e1118', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14, padding: '20px 22px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 22 }}>{sec.emoji}</span>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: color }}>{sec.heading}</h3>
          </div>
          {sec.body && (
            <p style={{ fontSize: 13, color: 'rgba(240,244,248,0.85)', lineHeight: 1.7 }}>{sec.body}</p>
          )}
          {sec.tips && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sec.tips.map((tip, j) => (
                <div key={j} style={{
                  padding: '10px 14px', borderRadius: 10,
                  background: `${color}0d`, border: `1px solid ${color}20`,
                  fontSize: 13, color: '#f0f4f8', lineHeight: 1.5,
                }}>{tip}</div>
              ))}
            </div>
          )}
        </div>
      ))}

      <button onClick={onStartQuiz} style={{
        padding: '14px', borderRadius: 14, border: 'none',
        background: color, color: '#000', fontWeight: 700, fontSize: 14,
        cursor: 'pointer', marginTop: 4,
        boxShadow: `0 0 24px ${color}40`,
      }}>
        ✅ Entendido — Hacer el quiz →
      </button>
    </div>
  )
}

// ─── Tipo: Historia narrativa ────────────────────────────────────
function StoryLesson({ lesson, color, onStartQuiz }) {
  const [scene, setScene] = useState(0)
  const scenes = lesson.scenes
  const current = scenes[scene]
  const isLast = scene === scenes.length - 1

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        background: 'rgba(255,255,255,0.02)', borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.06)', padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 18 }}>📖</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#f0f4f8' }}>
            Historia: {lesson.character.emoji} {lesson.character.name} — {lesson.character.role}
          </div>
          <div style={{ fontSize: 11, color: T.muted }}>Una historia real, una lección práctica</div>
        </div>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: T.faint }}>
          {scene + 1}/{scenes.length}
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
        {scenes.map((_, i) => (
          <div key={i} onClick={() => setScene(i)} style={{
            width: i === scene ? 20 : 7, height: 7, borderRadius: 99, cursor: 'pointer',
            background: i < scene ? color : i === scene ? color : 'rgba(255,255,255,0.1)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      {/* Scene card */}
      <div key={scene} style={{
        background: '#0e1118', border: `1px solid ${color}22`,
        borderRadius: 18, padding: '28px 26px',
        animation: 'fadeIn 0.35s ease both',
      }}>
        <div style={{ fontSize: 40, marginBottom: 16, textAlign: 'center' }}>{current.emoji}</div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color, marginBottom: 14, textAlign: 'center' }}>{current.title}</h3>
        <p style={{ fontSize: 14, color: 'rgba(240,244,248,0.85)', lineHeight: 1.8, marginBottom: current.highlight ? 20 : 0 }}>
          {current.text}
        </p>
        {current.highlight && (
          <div style={{
            padding: '12px 16px', borderRadius: 10,
            background: `${color}12`, border: `1px solid ${color}28`,
            fontSize: 13, fontWeight: 600, color, lineHeight: 1.5,
          }}>
            {current.highlight}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 10 }}>
        {scene > 0 && (
          <button onClick={() => setScene(s => s - 1)} style={{
            flex: 1, padding: '12px', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent', color: '#f0f4f8', fontSize: 13, cursor: 'pointer',
          }}>← Anterior</button>
        )}
        {!isLast ? (
          <button onClick={() => setScene(s => s + 1)} style={{
            flex: 1, padding: '12px', borderRadius: 12, border: 'none',
            background: `${color}20`, color, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>Siguiente escena →</button>
        ) : (
          <button onClick={onStartQuiz} style={{
            flex: 1, padding: '12px', borderRadius: 12, border: 'none',
            background: color, color: '#000', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            boxShadow: `0 0 24px ${color}40`,
          }}>✅ Hacer el quiz →</button>
        )}
      </div>
    </div>
  )
}

// ─── Vista de lección individual ────────────────────────────────
function LessonView({ lesson, color, onBack, onStartQuiz }) {
  const DIFF_COLOR = { fácil: '#00e676', medio: '#ffd740', difícil: '#ff5252' }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: T.muted,
          fontSize: 12, cursor: 'pointer', padding: 0, marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>← Volver al módulo</button>
        <div style={{
          background: '#0e1118', border: `1px solid ${color}22`,
          borderRadius: 18, padding: '22px 24px',
          background: `linear-gradient(135deg, #0e1118 60%, ${color}08)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: `${color}15`, border: `1.5px solid ${color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
            }}>{lesson.icon}</div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f0f4f8', marginBottom: 6 }}>{lesson.title}</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                  background: `${DIFF_COLOR[lesson.diff]}18`, color: DIFF_COLOR[lesson.diff],
                  fontFamily: "'Space Mono',monospace", textTransform: 'uppercase',
                }}>{lesson.diff}</span>
                <span style={{ fontSize: 11, color: T.muted }}>⏱ {lesson.time}</span>
                <span style={{ fontSize: 11, color: '#ffd740' }}>⚡ {lesson.xp} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido según tipo */}
      {lesson.type === 'flashcards' && (
        <FlashcardsLesson lesson={lesson} color={color} onStartQuiz={onStartQuiz} />
      )}
      {lesson.type === 'article' && (
        <ArticleLesson lesson={lesson} color={color} onStartQuiz={onStartQuiz} />
      )}
      {lesson.type === 'story' && (
        <StoryLesson lesson={lesson} color={color} onStartQuiz={onStartQuiz} />
      )}
    </div>
  )
}

// ─── Vista del módulo (lista de lecciones) ───────────────────────
function ModuleView({ mod, onSelectLesson }) {
  const DIFF_COLOR = { fácil: '#00e676', medio: '#ffd740', difícil: '#ff5252' }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, #0e1118 50%, ${mod.color}0d)`,
        border: `1px solid ${mod.color}25`,
        borderRadius: 20, padding: '28px 26px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -40, top: -40, width: 200, height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${mod.color}12, transparent 70%)`,
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>{mod.icon}</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f0f4f8', marginBottom: 8 }}>{mod.title}</h1>
          <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 18 }}>{mod.description}</p>
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: mod.color, fontFamily: "'Space Mono',monospace" }}>
                {mod.lessons.length}
              </div>
              <div style={{ fontSize: 10, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.07em' }}>lecciones</div>
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#ffd740', fontFamily: "'Space Mono',monospace" }}>
                {mod.lessons.reduce((a, l) => a + l.xp, 0)}
              </div>
              <div style={{ fontSize: 10, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.07em' }}>XP total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lecciones */}
      <div>
        <h2 style={{ fontSize: 11, fontWeight: 700, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
          📚 Lecciones del módulo
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {mod.lessons.map((lesson, i) => (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson)}
              style={{
                background: '#0e1118', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, padding: '16px 18px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
                transition: 'all 0.2s', width: '100%',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${mod.color}40`
                e.currentTarget.style.transform = 'translateX(4px)'
                e.currentTarget.style.boxShadow = `-4px 0 0 0 ${mod.color}`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.transform = 'translateX(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Número */}
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: `${mod.color}15`, border: `1px solid ${mod.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700, color: mod.color,
              }}>{i + 1}</div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f4f8', marginBottom: 4 }}>
                  {lesson.icon} {lesson.title}
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                    background: `${DIFF_COLOR[lesson.diff]}18`, color: DIFF_COLOR[lesson.diff],
                    fontFamily: "'Space Mono',monospace", textTransform: 'uppercase',
                  }}>{lesson.diff}</span>
                  <span style={{ fontSize: 11, color: T.faint }}>⏱ {lesson.time}</span>
                  <span style={{ fontSize: 11, color: '#ffd740' }}>⚡ {lesson.xp} XP</span>
                  <span style={{ fontSize: 10, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {lesson.type === 'flashcards' ? '🃏 Tarjetas' : lesson.type === 'story' ? '📖 Historia' : '📰 Artículo'}
                  </span>
                </div>
              </div>

              <span style={{ color: T.faint, fontSize: 16 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Page principal ──────────────────────────────────────────────
export function PageModulo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const mod = MODULE_CONTENT[Number(id)]
  const [activeLesson, setActiveLesson] = useState(null)

  if (!mod) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
      <h2 style={{ fontSize: 18, color: '#f0f4f8', marginBottom: 8 }}>Módulo no disponible</h2>
      <p style={{ color: T.muted, marginBottom: 20 }}>Este módulo aún no está desbloqueado.</p>
      <button onClick={() => navigate(-1)} style={{
        padding: '10px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
        background: 'transparent', color: '#f0f4f8', cursor: 'pointer',
      }}>← Volver</button>
    </div>
  )

  const handleStartQuiz = (lesson) => {
    navigate(`/dashboard/leccion/${lesson.id}`)
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {activeLesson ? (
          <LessonView
            lesson={activeLesson}
            color={mod.color}
            onBack={() => setActiveLesson(null)}
            onStartQuiz={() => handleStartQuiz(activeLesson)}
          />
        ) : (
          <ModuleView mod={mod} onSelectLesson={setActiveLesson} />
        )}
      </div>
    </>
  )
}