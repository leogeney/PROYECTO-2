import { useState, useEffect } from 'react'
import { Firestore } from '../services/firestore'
import { T } from '../styles/tokens'

export function PageAdminSettings() {
  const [settings, setSettings] = useState({
    appName: 'Viality', appVersion: '2.0.0', maxXp: 999999,
    maintenanceMode: false, allowRegistration: true,
    forumEnabled: true, newsEnabled: true,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    Firestore.get('config', 'platform').then(doc => {
      if (doc) setSettings(prev => ({ ...prev, ...doc }))
    }).catch(() => {})
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await Firestore.set('config', 'platform', settings).catch(() => {})
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: T.text, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <i className="fa-solid fa-gear" style={{ color: T.muted }}></i> Configuración
        </h1>
        <p style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Ajustes generales de la plataforma</p>
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20, maxWidth: 480 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Nombre de la app" value={settings.appName} onChange={v => setSettings(p => ({ ...p, appName: v }))} />
          <Field label="Versión" value={settings.appVersion} onChange={v => setSettings(p => ({ ...p, appVersion: v }))} />
          <Field label="XP máximo" type="number" value={settings.maxXp} onChange={v => setSettings(p => ({ ...p, maxXp: Number(v) }))} />

          <Toggle label="Modo mantenimiento" checked={settings.maintenanceMode} onChange={v => setSettings(p => ({ ...p, maintenanceMode: v }))} />
          <Toggle label="Permitir registro" checked={settings.allowRegistration} onChange={v => setSettings(p => ({ ...p, allowRegistration: v }))} />
          <Toggle label="Foro habilitado" checked={settings.forumEnabled} onChange={v => setSettings(p => ({ ...p, forumEnabled: v }))} />
          <Toggle label="Noticias habilitadas" checked={settings.newsEnabled} onChange={v => setSettings(p => ({ ...p, newsEnabled: v }))} />
        </div>

        <button onClick={handleSave} disabled={saving} style={{
          marginTop: 18, width: '100%', padding: '10px 0', borderRadius: 8,
          background: T.green, color: '#000', border: 'none', fontSize: 13,
          fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
        }}>{saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar cambios'}</button>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: T.faint, marginBottom: 4 }}>{label}</div>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} style={{
        width: '100%', padding: '9px 12px', fontSize: 13, borderRadius: 8,
        background: 'rgba(255,255,255,0.03)', border: `1px solid ${T.border}`,
        color: T.text, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
      }} />
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: 12, color: T.text }}>{label}</div>
      <button onClick={() => onChange(!checked)} style={{
        width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
        background: checked ? T.green : 'rgba(255,255,255,0.1)',
        position: 'relative', transition: 'background 0.2s',
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 3, transition: 'left 0.2s',
          left: checked ? 21 : 3,
        }} />
      </button>
    </div>
  )
}
