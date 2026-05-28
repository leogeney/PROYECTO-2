import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import { Firestore } from '../services/firestore'
import { ActivityLogger } from '../services/activityLogger'

const SupportContext = createContext(null)
const CATEGORIES = { error: 'Error', sugerencia: 'Sugerencia', otro: 'Otro' }

export function SupportProvider({ children, user }) {
  const [reports, setReports] = useState([])
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fb) => {
      setUserId(fb?.uid || null)
    })
    return unsub
  }, [])

  // Real-time listener for support_reports
  useEffect(() => {
    if (!userId) { setReports([]); return }
    const q = query(collection(db, 'support_reports'), orderBy('date', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setReports(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [userId])

  const addReport = useCallback(async (title, content, category) => {
    if (!userId) return
    const report = {
      title: title.trim(),
      content: content.trim(),
      category: category || 'otro',
      author: user?.name || 'Anónimo',
      authorId: userId,
      date: Date.now(),
    }
    try {
      await Firestore.add('support_reports', report)
      ActivityLogger.log('support_report', { title: report.title, category: report.category }).catch(() => {})
    } catch {}
  }, [user, userId])

  const deleteReport = useCallback(async (id) => {
    if (userId) {
      Firestore.del('support_reports', id).catch(() => {})
    }
  }, [userId])

  const replyToReport = useCallback(async (id, content) => {
    if (userId) {
      try {
        await Firestore.update('support_reports', id, { adminReply: content.trim(), adminReplyDate: Date.now() })
      } catch {}
    }
  }, [userId])

  const value = useMemo(() => ({ reports, addReport, deleteReport, replyToReport, CATEGORIES }), [reports, addReport, deleteReport, replyToReport])

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
