import React from 'react'
import { useNotification } from '../../context/NotificationContext'

const T = {
  bg: '#07090f', surface: '#0e1118', card: '#131720',
  border: 'rgba(255,255,255,0.1)', green: '#00e676', text: '#f0f4f8',
  blue: '#2979FF', purple: '#D500F9', yellow: '#FFD600', orange: '#FF9100'
}

// Configuración visual por tipo de notificación
const TYPE_CONFIG = {
  performance: {
    icon: '🌟',
    color: T.yellow,
    title: '¡Desempeño!',
    bgGradient: 'linear-gradient(135deg, rgba(255, 214, 0, 0.1), rgba(255, 214, 0, 0.05))'
  },
  inactivity: {
    icon: '👀',
    color: T.blue,
    title: '¡Hola!',
    bgGradient: 'linear-gradient(135deg, rgba(41, 121, 255, 0.1), rgba(41, 121, 255, 0.05))'
  },
  progress: {
    icon: '🚀',
    color: T.purple,
    title: '¡Progreso!',
    bgGradient: 'linear-gradient(135deg, rgba(213, 0, 249, 0.1), rgba(213, 0, 249, 0.05))'
  },
  default: {
    icon: '🔔',
    color: T.green,
    title: 'Notificación',
    bgGradient: 'linear-gradient(135deg, rgba(0, 230, 118, 0.1), rgba(0, 230, 118, 0.05))'
  }
}

// Estilos CSS inyectados para las animaciones
const NOTIFICATION_CSS = `
  .notif-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 12px;
    pointer-events: none; /* Para no bloquear clics debajo */
  }

  .notif-item {
    pointer-events: auto;
    width: 320px;
    background: ${T.card};
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 0 1px ${T.border};
    display: flex;
    align-items: center;
    gap: 16px;
    transform-origin: top right;
    animation: slideInBounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, fadeOut 0.5s ease-in forwards;
    /* La animación fadeOut se controlará indirectamente al desmontar si usáramos framer-motion, 
       pero con CSS puro, dejaremos que desaparezca abruptamente al borrar del estado, 
       o podríamos usar un efecto. Para simplicidad, solo animamos la entrada. */
    animation: slideInBounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    backdrop-filter: blur(10px);
    overflow: hidden;
    position: relative;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .notif-item:hover {
    transform: scale(1.02);
  }

  .notif-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
    position: relative;
    z-index: 2;
  }

  .notif-content {
    flex: 1;
    z-index: 2;
  }

  .notif-title {
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 4px;
    font-family: 'Space Mono', monospace;
  }

  .notif-message {
    font-size: 13px;
    color: rgba(255,255,255,0.7);
    line-height: 1.4;
  }

  .notif-bg {
    position: absolute;
    inset: 0;
    z-index: 1;
    opacity: 0.8;
  }

  @keyframes slideInBounce {
    0% {
      opacity: 0;
      transform: translateX(100px) scale(0.8);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }
`

export function NotificationRenderer() {
  const { notifications, removeNotification } = useNotification()

  if (notifications.length === 0) return null

  return (
    <>
      <style>{NOTIFICATION_CSS}</style>
      <div className="notif-container">
        {notifications.map((notif) => {
          const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.default
          
          return (
            <div 
              key={notif.id} 
              className="notif-item"
              onClick={() => removeNotification(notif.id)}
            >
              <div className="notif-bg" style={{ background: config.bgGradient }} />
              
              <div 
                className="notif-icon-wrapper" 
                style={{ 
                  background: `rgba(${hexToRgb(config.color)}, 0.15)`,
                  border: `1px solid rgba(${hexToRgb(config.color)}, 0.3)`,
                  color: config.color,
                  boxShadow: `0 0 15px rgba(${hexToRgb(config.color)}, 0.4)`
                }}
              >
                {config.icon}
              </div>
              
              <div className="notif-content">
                <div className="notif-title" style={{ color: config.color }}>
                  {config.title}
                </div>
                <div className="notif-message">
                  {notif.message}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

// Función auxiliar para convertir HEX a RGB
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '255, 255, 255';
}
