import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import { Firestore } from '../services/firestore'

const SupportContext = createContext(null)
const CATEGORIES = { error: 'Error', sugerencia: 'Sugerencia', otro: 'Otro' }

const OLD_KEY = 'transi_support'

function storageKey(userId) {
  return userId ? `transi_support_${userId}` : 'transi_support_guest'
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

export function SupportProvider({ children, user }) {
  const [reports, setReports] = useState([])
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
        const data = await Firestore.list('support_reports')
        if (data && data.length > 0) {
          setReports(data)
          loaded = true
        }
      } catch {}
      if (!loaded) {
        const local = loadLocal(userId)
        if (local) setReports(local)
      }
      initRef.current = true
    })()
  }, [userId])

  useEffect(() => {
    if (!initRef.current) return
    localStorage.setItem(storageKey(userId), JSON.stringify(reports))
  }, [reports, userId])

  const addReport = useCallback(async (title, content, category) => {
    const report = {
      title: title.trim(),
      content: content.trim(),
      category: category || 'otro',
      author: user?.name || 'Anónimo',
      date: Date.now(),
    }
    if (userId) {
      try {
        const id = await Firestore.add('support_reports', report)
        setReports(prev => [{ id, ...report }, ...prev])
        return
      } catch {}
    }
    const localReport = { id: Date.now().toString(36), ...report }
    setReports(prev => [localReport, ...prev])
  }, [user, userId])

  const deleteReport = useCallback(async (id) => {
    setReports(prev => prev.filter(r => r.id !== id))
    if (userId) {
      Firestore.del('support_reports', id).catch(() => {})
    }
  }, [userId])

  const value = useMemo(() => ({ reports, addReport, deleteReport, CATEGORIES }), [reports, addReport, deleteReport])

  return (
    <SupportContext.Provider value={value}>
      {children}
    </SupportContext.Provider>
  )
}

export function useSupport() {
  const ctx = useContext(SupportContext)
  if (!ctx) throw new Error('useSupport must be used within SupportProvider')
  return ctx
}
