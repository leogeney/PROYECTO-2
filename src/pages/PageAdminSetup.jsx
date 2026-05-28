import { useEffect, useState } from 'react'
import { auth } from '../config/firebase'
import { Firestore } from '../services/firestore'

export function NavigateToAdminSetup() {
  const [status, setStatus] = useState('Esperando...')
  const key = new URLSearchParams(window.location.search).get('key')

  useEffect(() => {
    if (key !== 'admin2024') {
      window.location.href = '/'
      return
    }
    ;(async () => {
      localStorage.setItem('transi_admin', 'true')
      setStatus('LocalStorage activado.')

      const user = auth.currentUser
      if (user?.uid) {
        try {
          await Firestore.set('users', user.uid, { isAdmin: true })
          await user.getIdTokenResult(true)
          setStatus('Admin activado en Firestore. Redirigiendo...')
        } catch (e) {
          setStatus('Firestore no disponible, pero localStorage está activado.')
        }
      }

      setTimeout(() => { window.location.href = '/admin' }, 500)
    })()
  }, [key])

  return (
    <div style={{
      minHeight: '100vh', background: '#030714', color: '#00ff88',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif", fontSize: 14, gap: 10, flexDirection: 'column',
    }}>
      <div style={{ width: 20, height: 20, border: '2px solid rgba(0,255,136,0.2)', borderTopColor: '#00ff88', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      {status}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
