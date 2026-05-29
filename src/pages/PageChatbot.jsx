import { useState, useRef, useEffect } from 'react'
import { T } from '../styles/tokens'
import { askAI } from '../services/huggingface'

const TOPIC_KEYWORDS = [
  'transito', 'trafico', 'senal', 'senalizacion', 'semaforo', 'semáforo',
  'auto', 'coche', 'vehiculo', 'conducir', 'manejar', 'conductor', 'chofer',
  'peaton', 'peatón', 'peatonal', 'calle', 'carretera', 'via', 'vial',
  'camino', 'autopista', 'cruce', 'esquina', 'bicicleta', 'bici', 'ciclista',
  'accidente', 'choque', 'multa', 'infraccion', 'infringir', 'sancion',
  'paso', 'alto', 'pare', 'ceda', 'velocidad', 'estacionar', 'aparcar',
  'estacionamiento', 'cinturon', 'casco', 'seguridad', 'educacion',
  'licencia', 'permiso', 'carnet', 'brevete', 'frenar', 'freno',
  'adelantar', 'girar', 'vuelta', 'direccion', 'carril', 'luz', 'luces',
  'rojo', 'verde', 'amarillo', 'naranja', 'escolar', 'escuela', 'colegio',
  'niños', 'curva', 'pendiente', 'descenso', 'tunel', 'túnel', 'puente',
  'resbaladiza', 'derrumbe', 'niebla', 'viento', 'animal', 'ganado',
  'tren', 'ferrocarril', 'tranvia', 'bus', 'autobus', 'colectivo',
  'rotonda', 'glorieta', 'redondel', 'radar', 'fotomulta', 'alcohol',
  'ebriedad', 'alcoholimetro', 'agente', 'policia', 'transit', 'traffic',
  'norma', 'normas', 'regla', 'reglas', 'colombia', 'mexico', 'peru',
  'chile', 'argentina', 'españa', 'conductores',
]

function isRelevant(query) {
  const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, '')
  const tokens = q.split(/\s+/).filter(w => w.length > 2)
  if (tokens.length === 0) return false
  const matchCount = tokens.filter(t => TOPIC_KEYWORDS.some(k => t.includes(k) || k.includes(t))).length
  return matchCount >= 1
}

const CS = `
@keyframes bot-fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes bot-typing {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
@keyframes bot-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 230, 118, 0.2); }
  50% { box-shadow: 0 0 0 8px rgba(0, 230, 118, 0); }
}
`

const suggestions = [
  '¿Qué significa una señal de alto?',
  '¿Cómo cruzar la calle correctamente?',
  '¿Qué significa el semáforo en rojo?',
  '¿Qué son las señales de tránsito?',
  '¿Cómo prevenir accidentes?',
  '¿Qué significa zona escolar?',
]

function renderBold(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((p, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ color: '#00ff88', fontWeight: 700, fontSize: 'inherit' }}>{p}</strong>
      : p
  )
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      animation: 'bot-fade-in 0.3s ease',
    }}>
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #00e676, #00b248)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginRight: 10, marginTop: 4,
          boxShadow: '0 0 12px rgba(0, 230, 118, 0.25)',
        }}>
          <i className="fa-solid fa-robot" style={{ fontSize: 14, color: '#000' }}></i>
        </div>
      )}
      <div style={{
        maxWidth: '78%',
        padding: '12px 16px',
        borderRadius: isUser ? '18px 18px 6px 18px' : '18px 18px 18px 6px',
        background: isUser ? T.green : T.card,
        color: isUser ? '#000000' : T.text,
        fontSize: 14,
        lineHeight: 1.7,
        fontWeight: 400,
        border: isUser ? 'none' : `1px solid ${T.border}`,
      }}>
        {msg.role === 'bot' ? renderBold(msg.text) : msg.text}
      </div>
      {isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          background: T.green + '22',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginLeft: 10, marginTop: 4,
          border: `1px solid ${T.green}44`,
        }}>
          <i className="fa-solid fa-user" style={{ fontSize: 13, color: T.green }}></i>
        </div>
      )}
    </div>
  )
}

function ChatBot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: '¡Hola! Soy TransiBot 🤖 Tu asistente de educación vial. Pregúntame sobre señales de tránsito, normas de seguridad, cómo cruzar la calle y más. ¿En qué puedo ayudarte?' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  const handleSend = async () => {
    const q = input.trim()
    if (!q || typing) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setTyping(true)

    if (!isRelevant(q)) {
      await new Promise(r => setTimeout(r, 400))
      setMessages(prev => [...prev, { role: 'bot', text: 'Solo respondo preguntas sobre educación vial y señales de tránsito. 🚦' }])
      setTyping(false)
      return
    }

    let reply = ''
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 12000)
      reply = await askAI(q, controller.signal)
      clearTimeout(timer)
    } catch {
      reply = 'Lo siento, no pude obtener una respuesta. Intenta de nuevo. 🚦'
    }

    setMessages(prev => [...prev, { role: 'bot', text: reply }])
    setTyping(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', maxWidth: 700, margin: '0 auto', width: '100%' }}>
      <style>{CS}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0', marginBottom: 8 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 16,
          background: 'linear-gradient(135deg, #00e676, #00b248)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0, 230, 118, 0.2)',
          animation: 'bot-pulse 2s infinite',
        }}>
          <i className="fa-solid fa-robot" style={{ fontSize: 22, color: '#000' }}></i>
        </div>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
            TransiBot
          </h1>
          <div style={{ fontSize: 11, color: T.faint, display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.green, display: 'inline-block' }}></span>
            <span>En línea • Educación vial</span>
          </div>
        </div>
      </div>

      <div style={{
        flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12,
        padding: '8px 4px 8px 0',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255,255,255,0.06) transparent',
      }}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}

        {typing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, animation: 'bot-fade-in 0.2s ease' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #00e676, #00b248)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 12px rgba(0, 230, 118, 0.2)',
            }}>
              <i className="fa-solid fa-robot" style={{ fontSize: 14, color: '#000' }}></i>
            </div>
            <div style={{
              padding: '12px 20px',
              borderRadius: 18,
              background: T.card,
              border: `1px solid ${T.border}`,
              display: 'flex',
              gap: 5,
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: T.green,
                  animation: `bot-typing 0.8s ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {messages.length === 1 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: T.faint, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
            <i className="fa-solid fa-lightbulb" style={{ color: '#ffeaa7', fontSize: 10 }}></i>
            <span>Preguntas rápidas:</span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => { setInput(s) }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 600,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: T.muted,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.green + '44'; e.currentTarget.style.color = T.green }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = T.muted }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{
        display: 'flex', gap: 8,
        padding: '8px 0',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <i className="fa-solid fa-message" style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: T.faint, fontSize: 12, zIndex: 1,
          }}></i>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
            placeholder="Escribe tu pregunta sobre tránsito..."
            style={{
              width: '100%',
              padding: '12px 14px 12px 38px',
              fontSize: 13,
              borderRadius: 16,
              outline: 'none',
              background: 'rgba(255,255,255,0.03)',
              border: '2px solid rgba(255,255,255,0.06)',
              color: T.text,
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.currentTarget.style.borderColor = T.green}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || typing}
          style={{
            padding: '12px 20px',
            borderRadius: 16,
            fontSize: 13,
            fontWeight: 700,
            background: input.trim() && !typing ? T.green : 'rgba(255,255,255,0.03)',
            color: input.trim() && !typing ? '#000000' : T.faint,
            border: 'none',
            cursor: input.trim() && !typing ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  )
}

export { ChatBot as PageBot }
