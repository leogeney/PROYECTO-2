import React from 'react'
import { Icon } from '../components/ui/Icon'
import { LessonRunner } from './LessonShared'

const QUESTIONS = [
  { q: '¿Cuál es el principio principal de la conducción defensiva?', emoji: '🛡️', opts: ['Manejar asustado', 'Anticipar peligros y errores de otros conductores para evitar siniestros', 'No salir de casa', 'Usar un auto blindado'], correct: 1 },
  { q: 'Un conductor defensivo SIEMPRE mantiene:', emoji: '🚗', opts: ['Poca distancia del auto de adelante para presionarlo', 'Música alta para no dormirse', 'Suficiente distancia de seguimiento (regla de los 3 segundos)', 'Las luces altas encendidas'], correct: 2 },
  { q: 'Si el clima está lluvioso, la conducción defensiva dicta:', emoji: '🌧️', opts: ['Ignorarlo porque tienes frenos ABS', 'Aumentar la distancia de seguimiento y reducir la velocidad', 'Conducir igual que siempre', 'Detenerte en pleno carril'], correct: 1 },
  { q: '¿Qué revisa constantemente un conductor defensivo?', emoji: '👁️', opts: ['El teléfono móvil', 'Los espejos retrovisores y puntos ciegos (cada 5-8 segundos)', 'El tablero de revoluciones', 'El auto del lado'], correct: 1 },
  { q: 'Si un vehículo se te pega mucho por detrás y actúa agresivo, tú:', emoji: '👿', opts: ['Frenas bruscamente para asustarlo', 'Aceleras para competir con él', 'Te calmas, mantienes tu velocidad, y te apartas o dejas que pase cuando sea seguro', 'Le gritas por la ventana'], correct: 2 },
  { q: 'La conducción defensiva significa entender que:', emoji: '🧠', opts: ['Tú nunca te equivocas', 'Tu seguridad depende solo de la suerte', 'No puedes controlar a los demás, pero puedes evitar sus errores si estás alerta', 'Todos respetarán las señales'], correct: 2 },
  { q: '¿Por qué evitar el teléfono mientras conduces?', emoji: '📱', opts: ['Porque gasta batería', 'Porque distrae visual, manual y cognitivamente tu mente, aumentando inmensamente el riesgo', 'Porque te lo pueden robar', 'No hay problema si vas lento'], correct: 1 },
  { q: 'Si ves una pelota rodando a la calle desde el andén, un conductor defensivo espera que:', emoji: '⚽', opts: ['La pelota siga rodando', 'Apunte bien para no pisarla', 'Llegue un perro o un niño corriendo de manera inmediata, por lo que frena preventivamente', 'Nada, sigue igual'], correct: 2 },
]

export function Lesson5() {
  return <LessonRunner lessonId={5} allQuestions={QUESTIONS} />
}
