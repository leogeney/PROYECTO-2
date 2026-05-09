import React, { createContext, useState, useCallback, useEffect } from 'react'

export const AchievementsContext = createContext()

export function AchievementsProvider({ children }) {
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('gameAchievements')
    return saved ? JSON.parse(saved) : {}
  })

  const ACHIEVEMENTS_LIST = {
    'first_blood': {
      id: 'first_blood',
      title: 'Primer intento',
      desc: 'Completa tu primer juego',
      icon: '🎮',
      unlock: () => true
    },
    'perfect_quiz': {
      id: 'perfect_quiz',
      title: 'Quiz Perfecto',
      desc: 'Obtén 100% en Quiz de Señales',
      icon: '🎯',
      unlock: (game, score, max) => game === 'quiz' && score === max
    },
    'memory_master': {
      id: 'memory_master',
      title: 'Maestro de Memoria',
      desc: 'Completa Memoria en menos de 10 movimientos',
      icon: '🧠',
      unlock: (game, moves) => game === 'memory' && moves < 10
    },
    'speed_runner': {
      id: 'speed_runner',
      title: 'Rápido y Furioso',
      desc: 'Alcanza velocidad 12x en Conductor Virtual',
      icon: '⚡',
      unlock: (game, speed) => game === 'driver' && speed >= 12
    },
    'word_wizard': {
      id: 'word_wizard',
      title: 'Mago de Palabras',
      desc: 'Encuentra todas las palabras sin errores',
      icon: '✨',
      unlock: (game, errors) => game === 'wordsearch' && errors === 0
    },
    'collector': {
      id: 'collector',
      title: 'Coleccionista',
      desc: 'Desbloquea 5 logros',
      icon: '🏅',
      unlock: (unlockedCount) => unlockedCount >= 5
    },
    'xp_master': {
      id: 'xp_master',
      title: 'Experto en XP',
      desc: 'Acumula 1000 XP totales',
      icon: '👑',
      unlock: (totalXp) => totalXp >= 1000
    }
  }

  const unlockAchievement = useCallback((achievementId) => {
    setAchievements(prev => {
      if (prev[achievementId]?.unlocked) return prev
      const updated = { ...prev, [achievementId]: { ...ACHIEVEMENTS_LIST[achievementId], unlocked: Date.now() } }
      localStorage.setItem('gameAchievements', JSON.stringify(updated))
      return updated
    })
  }, [])

  const getUnlockedCount = () => Object.values(achievements).filter(a => a.unlocked).length
  const getAchievementById = (id) => ACHIEVEMENTS_LIST[id]

  return (
    <AchievementsContext.Provider value={{
      achievements,
      unlockAchievement,
      getUnlockedCount,
      getAchievementById,
      ACHIEVEMENTS_LIST
    }}>
      {children}
    </AchievementsContext.Provider>
  )
}

export function useAchievements() {
  const ctx = React.useContext(AchievementsContext)
  if (!ctx) throw new Error('useAchievements debe estar dentro de AchievementsProvider')
  return ctx
}
