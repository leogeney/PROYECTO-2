import { createContext, useState, useCallback, useEffect, useContext, useRef } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import { Firestore } from '../services/firestore'

export const AchievementsContext = createContext()

const OLD_KEY = 'gameAchievements'

function storageKey(userId) {
  return userId ? `gameAchievements_${userId}` : 'gameAchievements_guest'
}

function loadLocal(userId) {
  try {
    const key = storageKey(userId)
    const saved = localStorage.getItem(key)
    if (saved) return JSON.parse(saved)
    if (userId) {
      const old = localStorage.getItem(OLD_KEY)
      if (old) {
        const data = JSON.parse(old)
        localStorage.setItem(key, old)
        localStorage.removeItem(OLD_KEY)
        return data
      }
    }
  } catch {}
  return null
}

const ACHIEVEMENTS_LIST = {
  first_blood: {
    id: 'first_blood', title: 'Primer intento', desc: 'Completa tu primer juego',
    icon: '🎮', unlock: () => true,
  },
  perfect_quiz: {
    id: 'perfect_quiz', title: 'Quiz Perfecto', desc: 'Obtén 100% en Quiz de Señales',
    icon: '🎯', unlock: (game, score, max) => game === 'quiz' && score === max,
  },
  memory_master: {
    id: 'memory_master', title: 'Maestro de Memoria', desc: 'Completa Memoria en menos de 10 movimientos',
    icon: '🧠', unlock: (game, moves) => game === 'memory' && moves < 10,
  },
  speed_runner: {
    id: 'speed_runner', title: 'Rápido y Furioso', desc: 'Alcanza velocidad 12x en Conductor Virtual',
    icon: '⚡', unlock: (game, speed) => game === 'driver' && speed >= 12,
  },
  word_wizard: {
    id: 'word_wizard', title: 'Mago de Palabras', desc: 'Encuentra todas las palabras sin errores',
    icon: '✨', unlock: (game, errors) => game === 'wordsearch' && errors === 0,
  },
  collector: {
    id: 'collector', title: 'Coleccionista', desc: 'Desbloquea 5 logros',
    icon: '🏅', unlock: (unlockedCount) => unlockedCount >= 5,
  },
  xp_master: {
    id: 'xp_master', title: 'Experto en XP', desc: 'Acumula 1000 XP totales',
    icon: '👑', unlock: (totalXp) => totalXp >= 1000,
  },
}

export function AchievementsProvider({ children }) {
  const [achievements, setAchievements] = useState({})
  const [userId, setUserId] = useState(null)
  const initRef = useRef(true)
  const prevUserIdRef = useRef(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fb) => {
      setUserId(fb?.uid || null)
    })
    return unsub
  }, [])

  // Trigger reload on every userId change
  useEffect(() => {
    if (prevUserIdRef.current !== userId) {
      initRef.current = false
    }
    prevUserIdRef.current = userId
  }, [userId])

  useEffect(() => {
    if (initRef.current) return
    if (!userId) { initRef.current = true; return }
    ;(async () => {
      let loaded = false
      try {
        const data = await Firestore.get('game_achievements', userId)
        if (data?.achievements) {
          setAchievements(data.achievements)
          loaded = true
        }
      } catch {}
      if (!loaded) {
        const local = loadLocal(userId)
        if (local) setAchievements(local)
      }
      initRef.current = true
    })()
  }, [userId])

  useEffect(() => {
    if (!initRef.current) return
    localStorage.setItem(storageKey(userId), JSON.stringify(achievements))
    if (userId) {
      Firestore.set('game_achievements', userId, { achievements }).catch(() => {})
    }
  }, [achievements, userId])

  const unlockAchievement = useCallback((achievementId) => {
    setAchievements(prev => {
      if (prev[achievementId]?.unlocked) return prev
      return { ...prev, [achievementId]: { ...ACHIEVEMENTS_LIST[achievementId], unlocked: Date.now() } }
    })
  }, [])

  const getUnlockedCount = () => Object.values(achievements).filter(a => a.unlocked).length
  const getAchievementById = (id) => ACHIEVEMENTS_LIST[id]

  return (
    <AchievementsContext.Provider value={{
      achievements, unlockAchievement, getUnlockedCount, getAchievementById, ACHIEVEMENTS_LIST,
    }}>
      {children}
    </AchievementsContext.Provider>
  )
}

export function useAchievements() {
  const ctx = useContext(AchievementsContext)
  if (!ctx) throw new Error('useAchievements debe estar dentro de AchievementsProvider')
  return ctx
}
