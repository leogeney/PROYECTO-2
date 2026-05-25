import React from 'react'
import { LessonRunner } from './LessonShared'

const QUESTIONS = [
  { q: '¿Cuál suele ser la velocidad máxima en una zona escolar durante horarios de clase?', img: 'Colombia_road_sign_SP-47.svg', opts: ['30 km/h o lo que indique la señal local', '60 km/h', '80 km/h', 'No hay límite'], correct: 0 },
  { q: '¿Cuál es el peligro de exceder la velocidad permitida?', img: 'Colombia_road_sign_SR-30B.svg', opts: ['Llegas más rápido', 'Consumes menos gasolina', 'Aumenta la probabilidad y gravedad de accidentes', 'Ninguno'], correct: 2 },
  { q: 'En autopistas, conducir por debajo o igual que la velocidad máxima te asegura:', img: 'Colombia_road_sign_SR-30C.svg', opts: ['Multas', 'Mayor control del vehículo y tiempo de reacción', 'Tardanza extrema', 'Desgaste del freno'], correct: 1 },
  { q: 'Si la señal indica 60 km/h pero ocurre un fuerte aguacero...', img: 'Colombia_road_sign_SP-44.svg', opts: ['Mantienes los 60', 'Aceleras para salir de la lluvia', 'Reduces la velocidad para prevenir derrapes', 'Te detienes bajo un puente'], correct: 2 },
  { q: '¿Cuál de los siguientes vehículos debe respetar siempre el límite de velocidad?', img: 'Colombia_road_sign_SR-30A.svg', opts: ['Autos deportivos', 'Ambulancias (con sirena)', 'Motociclistas', 'Transporte público con prisa'], correct: 1 },
  { q: '¿La velocidad máxima aplica en el carril izquierdo (rápido)?', img: 'Colombia_road_sign_SR-30A.svg', opts: ['Sí, aplica para todos los carriles por igual', 'No, ahí no hay límite', 'Solo si no tienes prisa', 'El carril izquierdo ignora señales'], correct: 0 },
  { q: 'Al ingresar a una rotonda o glorieta pequeña...', img: 'Colombia_road_sign_SP-20.svg', opts: ['Aceleras a máxima velocidad', 'No hay límite de velocidad', 'Debes reducir y adaptar la velocidad', 'Cierras los ojos'], correct: 2 },
  { q: 'Conducir demasiado lento obstaculizando a todos...', img: 'Colombia_road_sign_SR-30.svg', opts: ['Es la forma más segura de manejar', 'Puede ser tan peligroso como ir demasiado rápido', 'Ahorra neumáticos', 'Garantiza cero accidentes'], correct: 1 },
]

export function Lesson4() {
  return <LessonRunner lessonId={4} allQuestions={QUESTIONS} />
}
