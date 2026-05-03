import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'

export function getLevelInfo(totalXp) {
  let level = 1
  let currentLevelBase = 0
  let nextLevelReq = 100 // El nivel 2 pide 100 XP
  
  while (totalXp >= nextLevelReq) {
    level++
    currentLevelBase = nextLevelReq
    // Cada nivel requiere más XP que el anterior
    nextLevelReq = currentLevelBase + (level * 100) 
  }
  
  return {
    level,
    xpInCurrentLevel: totalXp - currentLevelBase,
    xpForNextLevel: nextLevelReq - currentLevelBase,
    nextLevelTotalReq: nextLevelReq,
    currentLevelBase,
    totalXp
  }
}

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  // Puedes expandirlo aquí para guardar fechas, lecciones completadas, etc.
  const [completedLessons, setCompletedLessons] = useState([])

  // Cargar de localStorage
  useEffect(() => {
    const saved = localStorage.getItem('transi_progress')
    if (saved) {
      const data = JSON.parse(saved)
      setXp(data.xp || 0)
      setStreak(data.streak || 0)
      setCompletedLessons(data.completedLessons || [])
    }
  }, [])

  // Guardar a localStorage
  useEffect(() => {
    localStorage.setItem('transi_progress', JSON.stringify({
      xp, streak, completedLessons
    }))
  }, [xp, streak, completedLessons])

  const addXp = useCallback((amount) => {
    setXp(prev => prev + amount)
  }, [])

  const completeLesson = useCallback((id) => {
    setCompletedLessons(prev => {
      if (!prev.includes(id)) return [...prev, id]
      return prev
    })
  }, [])

  const levelInfo = useMemo(() => getLevelInfo(xp), [xp])

  const contextValue = useMemo(() => ({
    xp, addXp, streak, setStreak, 
    levelInfo, 
    completedLessons, completeLesson
  }), [xp, streak, completedLessons, addXp, completeLesson, levelInfo])

  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  return useContext(ProgressContext)
}
