import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'

const NotificationContext = createContext(null)

// Definimos el tiempo de inactividad (60 segundos)
const IDLE_TIMEOUT = 60000

const INACTIVITY_MESSAGES = [
  "¿Sigues ahí, conductor?",
  "Tu aventura vial continúa...",
  "¡Aún hay señales por descubrir!",
  "¡Volante listo! ¿Seguimos?"
]

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const timerRef = useRef(null)
  const isIdleRef = useRef(false)

  // Función para agregar una notificación
  const showNotification = useCallback((type, message, duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5)
    
    setNotifications(prev => [...prev, { id, type, message }])

    // Autocerrar después de 'duration'
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }, [])

  // Función para remover notificación manualmente
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  // === Lógica de Inactividad ===
  const resetIdleTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    
    // Si estaba inactivo y vuelve a interactuar, podemos quitar la notificación de inactividad si queremos
    // O simplemente marcar como activo
    isIdleRef.current = false

    timerRef.current = setInterval(() => {
      isIdleRef.current = true
      // Mostrar notificación aleatoria de inactividad
      const randomMsg = INACTIVITY_MESSAGES[Math.floor(Math.random() * INACTIVITY_MESSAGES.length)]
      showNotification('inactivity', randomMsg, 8000) // 8 segundos para que la vea bien
    }, IDLE_TIMEOUT)
  }, [showNotification])

  useEffect(() => {
    // Iniciar temporizador
    resetIdleTimer()

    // Listeners de actividad
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    const handleActivity = () => resetIdleTimer()

    events.forEach(e => window.addEventListener(e, handleActivity))

    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity))
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [resetIdleTimer])

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  return useContext(NotificationContext)
}
