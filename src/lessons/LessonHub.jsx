import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Lesson1 } from './Lesson1'
import { Lesson2 } from './Lesson2'
import { Lesson3 } from './Lesson3'
import { Lesson4 } from './Lesson4'
import { Lesson5 } from './Lesson5'

export function LessonHub() {
  const { id } = useParams()
  const navigate = useNavigate()

  switch (id) {
    case '1': return <Lesson1 />
    case '2': return <Lesson2 />
    case '3': return <Lesson3 />
    case '4': return <Lesson4 />
    case '5': return <Lesson5 />
    default:
      return (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>Lección no disponible</h2>
          <button onClick={() => navigate(-1)} style={{ padding: '8px 16px', borderRadius: 8, marginTop: 10 }}>Volver</button>
        </div>
      )
  }
}
