import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const SupportContext = createContext(null)

const CATEGORIES = { error: 'Error', sugerencia: 'Sugerencia', otro: 'Otro' }

export function SupportProvider({ children, user }) {
  const [reports, setReports] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('transi_support')
      if (saved) setReports(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('transi_support', JSON.stringify(reports))
  }, [reports])

  const addReport = useCallback((title, content, category) => {
    const report = {
      id: Date.now().toString(36),
      title: title.trim(),
      content: content.trim(),
      category: category || 'otro',
      author: user?.name || 'Anónimo',
      date: Date.now(),
    }
    setReports(prev => [report, ...prev])
  }, [user])

  const deleteReport = useCallback((id) => {
    setReports(prev => prev.filter(r => r.id !== id))
  }, [])

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
