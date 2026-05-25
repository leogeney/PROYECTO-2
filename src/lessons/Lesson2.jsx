import React from 'react'
import { LessonRunner } from './LessonShared'

const QUESTIONS = [
  { q: '¿Qué color predomina en las señales preventivas o de advertencia?', img: 'Colombia_road_sign_SP-01.svg', opts: ['Rojo', 'Azul', 'Amarillo', 'Verde'], correct: 2 },
  { q: '¿Qué significa una señal amarilla en forma de rombo con una curva?', img: 'Colombia_road_sign_SP-01.svg', opts: ['Curva peligrosa adelante', 'Intersección', 'Fin de camino', 'Zona de curvas para jugar'], correct: 0 },
  { q: 'Si ves una señal amarilla con un animal, ¿qué debes hacer?', img: 'Colombia_road_sign_SP-49.svg', opts: ['Acelerar para asustarlo', 'Reducir la velocidad y estar atento a animales', 'Detenerte y alimentarlo', 'Tocar la bocina y seguir igual'], correct: 1 },
  { q: 'Las señales preventivas sirven principalmente para:', img: 'Colombia_road_sign_SP-01.svg', opts: ['Multarte si las desobedeces', 'Advertirte de condiciones peligrosas en la vía', 'Avisar sobre restaurantes cerca', 'Limitar la velocidad de forma estricta'], correct: 1 },
  { q: '¿Qué indica una señal de rombo amarillo con figuras de niños corriendo?', img: 'Colombia_road_sign_SP-47.svg', opts: ['Parque recreativo', 'Zona deportiva', 'Cruce de niños o zona escolar', 'Paso de peatones exclusivo para adultos'], correct: 2 },
  { q: '¿Cuándo deberías tomar mayor precaución al ver estas señales?', img: 'Colombia_road_sign_SP-44.svg', opts: ['Solo de día', 'Solo si hay policía', 'Siempre, reduciendo la velocidad preventivamente', 'Al llegar de noche'], correct: 2 },
  { q: 'Si la señal preventiva muestra un puente estrechándose...', img: 'Colombia_road_sign_SP-36.svg', opts: ['Acelerar para pasar rápido', 'Mantener tu carril y reducir velocidad', 'Hacer un giro en U', 'Estacionar en el puente'], correct: 1 },
  { q: '¿Dónde se instalan usualmente estas señales preventivas?', img: 'Colombia_road_sign_SP-11.svg', opts: ['Antes del peligro para dar tiempo al conductor', 'Justo encima del peligro', 'Después de pasar el peligro', 'Sólo en zonas de ciudad'], correct: 0 },
]

export function Lesson2() {
  return <LessonRunner lessonId={2} allQuestions={QUESTIONS} />
}
