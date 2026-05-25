import React from 'react'
import { LessonRunner } from './LessonShared'

const QUESTIONS = [
  { q: '¿Cuál es el principio principal de la conducción defensiva?', img: 'Colombia_road_sign_SP-44.svg', opts: ['Manejar asustado', 'Anticipar peligros para evitar siniestros', 'No salir de casa', 'Usar un auto blindado'], correct: 1 },
  { q: 'Un conductor defensivo SIEMPRE mantiene:', img: 'Colombia_road_sign_SR-30A.svg', opts: ['Poca distancia del auto de adelante', 'Música alta para no dormirse', 'Distancia de seguimiento (regla de 3 segundos)', 'Las luces altas encendidas'], correct: 2 },
  { q: 'Si el clima está lluvioso, la conducción defensiva dicta:', img: 'Colombia_road_sign_SP-44.svg', opts: ['Ignorarlo porque tienes frenos ABS', 'Aumentar la distancia y reducir velocidad', 'Conducir igual que siempre', 'Detenerte en pleno carril'], correct: 1 },
  { q: '¿Qué revisa constantemente un conductor defensivo?', img: 'Colombia_road_sign_SP-11.svg', opts: ['El teléfono móvil', 'Los espejos retrovisores cada 5-8 segundos', 'El tablero de revoluciones', 'El auto del lado'], correct: 1 },
  { q: 'Si un vehículo se te pega por detrás y actúa agresivo:', img: 'Colombia_road_sign_SR-04.svg', opts: ['Frenas bruscamente', 'Aceleras para competir', 'Mantienes tu velocidad y te apartas cuando sea seguro', 'Le gritas por la ventana'], correct: 2 },
  { q: 'La conducción defensiva significa entender que:', img: 'Colombia_road_sign_SP-01.svg', opts: ['Tú nunca te equivocas', 'Tu seguridad solo depende de la suerte', 'No puedes controlar a otros, pero puedes evitar sus errores', 'Todos respetan las señales'], correct: 2 },
  { q: '¿Por qué evitar el teléfono mientras conduces?', img: 'Colombia_road_sign_SIO-00_(apagar_radios_y_celulares).svg', opts: ['Porque gasta batería', 'Distrae visual, manual y cognitivamente', 'Porque te lo pueden robar', 'No hay problema si vas lento'], correct: 1 },
  { q: 'Si ves una pelota rodando a la calle desde el andén...', img: 'Colombia_road_sign_SP-47.svg', opts: ['La pelota siga rodando', 'Apunte bien para no pisarla', 'Un niño puede venir detrás, frena preventivamente', 'Nada, sigue igual'], correct: 2 },
]

export function Lesson5() {
  return <LessonRunner lessonId={5} allQuestions={QUESTIONS} />
}
