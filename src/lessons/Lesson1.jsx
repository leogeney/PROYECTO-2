import React from 'react'
import { LessonRunner } from './LessonShared'

const QUESTIONS = [
  { q: '¿Qué indican las señales de color ROJO y forma hexagonal?', img: 'Colombia_road_sign_SR-01.svg', opts: ['Advertencia', 'Parada obligatoria (STOP)', 'Información turística', 'Velocidad sugerida'], correct: 1 },
  { q: '¿Qué significa un círculo rojo con una barra blanca horizontal?', img: 'Colombia_road_sign_SR-04.svg', opts: ['Prohibido el paso', 'Zona escolar', 'Ceda el paso', 'Permitido estacionar'], correct: 0 },
  { q: '¿Si ves una señal de velocidad en un círculo con borde rojo, qué indica?', img: 'Colombia_road_sign_SR-30A.svg', opts: ['Velocidad mínima', 'Velocidad máxima permitida', 'Velocidad recomendada', 'Distancia al destino'], correct: 1 },
  { q: '¿Qué debes hacer ante la señal de Ceda el Paso?', img: 'Colombia_road_sign_SR-02.svg', opts: ['Acelerar para pasar primero', 'Detenerse obligatoriamente', 'Reducir la velocidad y ceder prioridad', 'Girar en U'], correct: 2 },
  { q: '¿Cuál es el propósito principal de las señales reglamentarias?', img: 'Colombia_road_sign_SR-01.svg', opts: ['Mostrar sitios turísticos', 'Instruir sobre normas, prohibiciones y restricciones', 'Advertir sobre peligros futuros', 'Adornar la vía'], correct: 1 },
  { q: '¿Qué pasa si ignoras una señal reglamentaria?', img: 'Colombia_road_sign_SR-04.svg', opts: ['Nada, son sugerencias', 'Puedes recibir una infracción o causar un accidente', 'Llegas más rápido', 'Te dan XP extra'], correct: 1 },
  { q: '¿Qué indica una letra E negra dentro de un círculo con borde rojo tachada?', img: 'Colombia_road_sign_SR-38.svg', opts: ['Prohibido estacionarse', 'Estacionamiento exclusivo', 'Zona de emergencia', 'Prohibido girar a la izquierda'], correct: 0 },
  { q: 'Si la señal es un triángulo invertido, el conductor debe:', img: 'Colombia_road_sign_SR-02.svg', opts: ['Detener el vehículo por completo', 'Ceder el paso a los demás vehículos', 'Efectuar un giro', 'Mirar por el retrovisor y pitar'], correct: 1 },
]

export function Lesson1() {
  return <LessonRunner lessonId={1} allQuestions={QUESTIONS} />
}
