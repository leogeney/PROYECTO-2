import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import { Firestore } from '../services/firestore'

export function getLevelInfo(totalXp) {
  let level = 1
  let currentLevelBase = 0
  let nextLevelReq = 100
  while (totalXp >= nextLevelReq) {
    level++
    currentLevelBase = nextLevelReq
    nextLevelReq = currentLevelBase + (level * 100)
  }
  return {
    level,
    xpInCurrentLevel: totalXp - currentLevelBase,
    xpForNextLevel: nextLevelReq - currentLevelBase,
    nextLevelTotalReq: nextLevelReq,
    currentLevelBase,
    totalXp,
  }
}

const OLD_KEY = 'transi_progress'

function migrateLessons(lessons) {
  if (!lessons || lessons.length === 0) return []
  if (typeof lessons[0] === 'object') return lessons
  return lessons.map(id => ({ id, date: Date.now() }))
}

export function completedIds(lessons) {
  return lessons.map(l => (typeof l === 'object' ? l.id : l))
}

function storageKey(userId) {
  return userId ? `transi_progress_${userId}` : 'transi_progress_guest'
}

function loadLocal(userId) {
  try {
    const key = storageKey(userId)
    const saved = localStorage.getItem(key)
    if (saved) return JSON.parse(saved)
    // Fallback to old shared key for migration
    if (userId) {
      const old = localStorage.getItem(OLD_KEY)
      if (old) {
        const data = JSON.parse(old)
        // Migrate to new key
        localStorage.setItem(key, old)
        localStorage.removeItem(OLD_KEY)
        return data
      }
    }
  } catch {}
  return null
}

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [userId, setUserId] = useState(null)
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [completedLessons, setCompletedLessons] = useState([])
  const [ready, setReady] = useState(false)
  const initRef = useRef(true) // start true — no initial load for null user
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
    if (!userId) { initRef.current = true; setReady(true); return }
    ;(async () => {
      let loaded = false
      try {
        const data = await Firestore.get('users', userId)
        if (data) {
          setXp(data.xp || 0)
          setStreak(data.streak || 0)
          setCompletedLessons(migrateLessons(data.completedLessons || []))
          loaded = true
        }
      } catch {}
      if (!loaded) {
        const local = loadLocal(userId)
        if (local) {
          setXp(local.xp || 0)
          setStreak(local.streak || 0)
          setCompletedLessons(migrateLessons(local.completedLessons || []))
        }
      }
      initRef.current = true
      setReady(true)
    })()
  }, [userId])

  useEffect(() => {
    if (!initRef.current) return
    const data = { xp, streak, completedLessons }
    localStorage.setItem(storageKey(userId), JSON.stringify(data))
    if (userId) {
      const fb = auth.currentUser
      Firestore.set('users', userId, { ...data, email: fb?.email || '', name: fb?.displayName || fb?.email || '' }).catch(() => {})
    }
  }, [xp, streak, completedLessons, userId])

  const addXp = useCallback((amount) => {
    setXp(prev => prev + amount)
  }, [])

  const completeLesson = useCallback((id) => {
    setCompletedLessons(prev => {
      const exists = prev.some(l => (typeof l === 'object' ? l.id : l) === id)
      if (exists) return prev
      return [...prev, { id, date: Date.now() }]
    })
  }, [])

  const levelInfo = useMemo(() => getLevelInfo(xp), [xp])

  const lessonIds = useMemo(() => completedLessons.map(l => (typeof l === 'object' ? l.id : l)), [completedLessons])

  const contextValue = useMemo(() => ({
    xp, addXp, streak, setStreak,
    levelInfo,
    completedLessons, completeLesson, lessonIds,
    ready,
  }), [xp, addXp, streak, setStreak, completedLessons, completeLesson, levelInfo, ready])

  return (
    <ProgressContext.Provider value={contextValue}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  return useContext(ProgressContext)
}
