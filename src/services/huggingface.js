const DS_KEY = import.meta.env.VITE_DEEPSEEK_KEY || ''
const OR_KEY = import.meta.env.VITE_OPENROUTER_KEY || ''
const DS_URL = 'https://api.deepseek.com/v1/chat/completions'
const OR_URL = 'https://openrouter.ai/api/v1/chat/completions'

const SYSTEM_PROMPT = `Eres TransiBot, un asistente de IA experto en educación vial y tránsito.

SOLO puedes responder preguntas sobre estos temas:
- Señales de tránsito y su significado
- Semáforos y sus colores (rojo, amarillo, verde)
- Normas y reglas de tránsito
- Seguridad vial (peatones, ciclistas, conductores)
- Prevención de accidentes de tránsito
- Cómo cruzar la calle correctamente
- Licencias de conducir y educación vial

Si la pregunta NO es de tránsito o educación vial, responde EXACTAMENTE: "Solo respondo preguntas sobre educación vial y señales de tránsito. 🚦"

NO respondas sobre ningún otro tema: matemáticas, historia, tecnología, programación, recetas, deportes, música, películas, política, religión, chistes, u otros temas no relacionados.

Responde en español, claro, conciso (máximo 2 párrafos).`

export async function askAI(question, signal) {
  if (DS_KEY) {
    const res = await fetch(DS_URL, {
      method: 'POST', signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${DS_KEY}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: question },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      const reply = data?.choices?.[0]?.message?.content?.trim()
      if (reply) return reply
    }
  }

  const model = OR_KEY ? 'deepseek/deepseek-chat' : 'deepseek/deepseek-chat:free'
  const res = await fetch(OR_URL, {
    method: 'POST', signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OR_KEY}`,
      'HTTP-Referer': window.location.origin,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: question },
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  const data = await res.json()
  const reply = data?.choices?.[0]?.message?.content?.trim()
  if (!reply) throw new Error('Respuesta vacía')
  return reply
}
