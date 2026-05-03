import React from 'react'
import { LessonRunner } from './LessonShared'

const QUESTIONS = [
  { q: '¿Qué indica un semáforo en rojo?', emoji: '🔴', opts: ['Acelerar rápido', 'Detenerse por completo detrás de la línea', 'Reducir velocidad', 'Girar a la derecha libremente'], correct: 1 },
  { q: '¿Qué significa el semáforo amarillo?', emoji: '🟡', opts: ['Paso libre', 'Detenerse si es seguro, cambia a rojo', 'Acelerar antes de que cambie', 'Ignorar'], correct: 1 },
  { q: 'Si el semáforo está verde pero la intersección está bloqueada, tú...', emoji: '🟢', opts: ['Avanzas porque está verde', 'Te quedas esperando hasta que haya espacio', 'Tocas la bocina', 'Rodeas los autos por el lado'], correct: 1 },
  { q: '¿Quién tiene prioridad en un cruce peatonal sin semáforo?', emoji: '🚶', opts: ['El vehículo más pesado', 'El que llegó primero', 'El peatón', 'Las motocicletas'], correct: 2 },
  { q: '¿Quién tiene prioridad en una intersección en T sin señales?', emoji: '🛣️', opts: ['El conductor que va en la vía recta', 'El que está girando', 'El de la derecha', 'Nadie'], correct: 0 },
  { q: 'Un semáforo peatonal en rojo con figura de persona inmóvil significa:', emoji: '🛑', opts: ['Corre para cruzar rápido', 'Espera en la acera, prohibido cruzar', 'Cruza si no ves autos', 'Camina lentamente'], correct: 1 },
  { q: 'Si escuchas una ambulancia con sirena detrás de ti...', emoji: '🚑', opts: ['Aceleras para no estorbar', 'Te apartas hacia el borde derecho y te detienes o reduces drásticamente', 'Sigues como si nada', 'Frenas en seco'], correct: 1 },
  { q: 'Un semáforo con luz roja intermitente equivale a:', emoji: '🚨', opts: ['Ceda el paso y siga sin parar', 'Un STOP, detenerse y luego cruzar si es seguro', 'El semáforo está dañado, acelere', 'Precaución continua'], correct: 1 },
]

export function Lesson3() {
  return <LessonRunner lessonId={3} allQuestions={QUESTIONS} />
}
