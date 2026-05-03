import React from 'react'
import { LessonRunner } from './LessonShared'

const QUESTIONS = [
  { q: '¿Qué color predomina en las señales preventivas o de advertencia?', emoji: '⚠️', opts: ['Rojo', 'Azul', 'Amarillo', 'Verde'], correct: 2 },
  { q: '¿Qué significa una señal amarilla en forma de rombo con una curva?', emoji: '⤴️', opts: ['Curva peligrosa adelante', 'Intersección', 'Fin de camino', 'Zona de curvas para jugar'], correct: 0 },
  { q: 'Si ves una señal amarilla con un ciervo, ¿qué debes hacer?', emoji: '🦌', opts: ['Acelerar para asustarlo', 'Reducir la velocidad y estar atento a animales', 'Detenerte y alimentarlo', 'Tocar la bocina y seguir igual'], correct: 1 },
  { q: 'Las señales preventivas sirven principalmente para:', emoji: '💡', opts: ['Multarte si las desobedeces', 'Advertirte de condiciones peligrosas en la vía', 'Avisar sobre restaurantes cerca', 'Limitar la velocidad de forma estricta'], correct: 1 },
  { q: '¿Qué indica una señal de rombo amarillo con figuras de niños corriendo?', emoji: '🚸', opts: ['Parque recreativo', 'Zona deportiva', 'Cruce de niños o zona escolar', 'Paso de peatones exclusivo para adultos'], correct: 2 },
  { q: '¿Cuándo deberías tomar mayor precaución al ver estas señales?', emoji: '🌧️', opts: ['Solo de día', 'Solo si hay policía', 'Siempre, reduciendo la velocidad preventivamente', 'Al llegar de noche'], correct: 2 },
  { q: 'Si el rombo amarillo muestra un puente estrechándose...', emoji: '🌉', opts: ['Acelerar para pasar rápido', 'Mantener tu carril y reducir velocidad', 'Hacer un giro en U', 'Estacionar en el puente'], correct: 1 },
  { q: '¿Dónde se instalan usualmente estas señales preventivas?', emoji: '🛤️', opts: ['Antes del peligro para dar tiempo al conductor', 'Justo encima del peligro', 'Después de pasar el peligro', 'Sólo en zonas de ciudad'], correct: 0 },
]

export function Lesson2() {
  return <LessonRunner lessonId={2} allQuestions={QUESTIONS} />
}
