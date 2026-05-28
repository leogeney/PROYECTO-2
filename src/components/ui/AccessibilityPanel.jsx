import { useState, useEffect, useRef } from 'react'
import { useAccessibility } from '../../context/AccessibilityContext'

const LINE_SPACINGS = [1.2, 1.4, 1.6, 1.8]
const COLORBLIND_OPTS = [
  { value: 'none',       label: 'Ninguno',     colors: ['#00e676', '#448aff', '#ff5252'] },
  { value: 'protanopia', label: 'Protanopia',  colors: ['#a0800a', '#6060ff', '#8a6030'] },
  { value: 'deuteranopia', label: 'Deuteranopia', colors: ['#8a8a00', '#6060ff', '#8a6030'] },
  { value: 'tritanopia', label: 'Tritanopia',  colors: ['#00e676', '#60a0a0', '#d08080'] },
]

const CATEGORIES = [
  {
    id: 'vision', icon: 'fa-solid fa-eye', label: 'Visión',
    opts: ['colorblindMode'],
  },
  {
    id: 'lectura', icon: 'fa-solid fa-book-open', label: 'Lectura',
    opts: ['lineSpacing', 'dyslexicFont', 'readingGuide'],
  },
  {
    id: 'movimiento', icon: 'fa-solid fa-person-walking', label: 'Movimiento',
    opts: ['reducedMotion'],
  },
]

const PCS = `
@keyframes a11y-scale-in {
  from { opacity: 0; transform: scale(0.92) translateY(16px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes a11y-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes a11y-slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes a11y-pulse-dot {
  0% { box-shadow: 0 0 0 0 rgba(0,230,118,0.4); }
  70% { box-shadow: 0 0 0 10px rgba(0,230,118,0); }
  100% { box-shadow: 0 0 0 0 rgba(0,230,118,0); }
}
@keyframes a11y-badge-pop {
  0% { transform: scale(0); }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.a11y-overlay {
  position: fixed; inset: 0; z-index: 9998;
  background: rgba(0,0,0,0.45); backdrop-filter: blur(4px);
  animation: a11y-fade-in 0.2s ease;
}

.a11y-container {
  position: fixed; bottom: 24px; right: 24px; z-index: 9999;
  display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
  font-family: 'DM Sans', sans-serif;
}

.a11y-panel {
  width: 330px; max-height: min(80vh, 600px); overflow-y: auto;
  background: var(--t-card); border: 1px solid var(--t-border-hi);
  border-radius: 24px; padding: 0;
  box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset;
  animation: a11y-scale-in 0.3s cubic-bezier(0.16,1,0.3,1);
}
.a11y-panel::-webkit-scrollbar { width: 3px; }
.a11y-panel::-webkit-scrollbar-thumb { background: var(--t-border); border-radius: 99px; }

/* ── HEADER ── */
.a11y-panel-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 20px 12px; border-bottom: 1px solid var(--t-border);
  position: sticky; top: 0; background: var(--t-card); z-index: 1;
  border-radius: 24px 24px 0 0;
}
.a11y-panel-title {
  display: flex; align-items: center; gap: 10px;
}
.a11y-panel-title h2 {
  font-size: 15px; font-weight: 700; color: var(--t-text);
  margin: 0; letter-spacing: -0.01em;
}
.a11y-active-count {
  font-size: 10px; font-weight: 700; padding: 2px 8px;
  border-radius: 99px; background: var(--t-green); color: #000;
  animation: a11y-badge-pop 0.3s cubic-bezier(0.175,0.885,0.32,1.275);
}
.a11y-reset-btn {
  display: flex; align-items: center; gap: 5px; padding: 6px 12px;
  border-radius: 10px; border: 1px solid var(--t-border);
  background: transparent; color: var(--t-muted); cursor: pointer;
  font-size: 11px; font-weight: 600; font-family: inherit;
  transition: all 0.2s ease;
}
.a11y-reset-btn:hover { color: var(--t-text); background: var(--t-border); border-color: var(--t-border-hi); }

/* ── CATEGORY ── */
.a11y-category {
  padding: 14px 20px 6px;
}
.a11y-category-header {
  display: flex; align-items: center; gap: 8px;
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--t-muted);
  padding: 0 4px 10px;
}
.a11y-category-header i { font-size: 12px; }

/* ── OPTION ROW ── */
.a11y-option {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 12px; border-radius: 14px; margin-bottom: 4px;
  cursor: pointer; transition: all 0.2s ease;
  border: 1px solid transparent; position: relative;
}
.a11y-option:hover { background: var(--t-border); }
.a11y-option:focus-visible { border-color: var(--t-green); box-shadow: 0 0 0 3px rgba(0,230,118,0.2); outline: none; }
.a11y-option.active { background: rgba(0,230,118,0.06); }

.a11y-option-left { display: flex; align-items: center; gap: 10px; }
.a11y-option-icon {
  width: 30px; height: 30px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  background: var(--t-border); color: var(--t-muted);
  flex-shrink: 0; font-size: 12px; transition: all 0.2s;
}
.a11y-option.active .a11y-option-icon {
  background: rgba(0,230,118,0.15); color: var(--t-green);
}
.a11y-option-label { font-size: 13px; font-weight: 600; color: var(--t-text); transition: color 0.2s; }
.a11y-option.active .a11y-option-label { color: var(--t-green); }
.a11y-option-desc { font-size: 10px; color: var(--t-muted); margin-top: 1px; }
.a11y-option-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

.a11y-toggle {
  width: 38px; height: 22px; border-radius: 99px;
  background: var(--t-border); cursor: pointer; position: relative;
  transition: background 0.25s ease; border: none; padding: 0; flex-shrink: 0;
}
.a11y-toggle.active { background: var(--t-green); }
.a11y-toggle-knob {
  position: absolute; top: 2px; left: 2px; width: 18px; height: 18px;
  border-radius: 50%; background: var(--t-text);
  transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), background 0.2s;
}
.a11y-toggle.active .a11y-toggle-knob {
  transform: translateX(16px);
  background: #fff;
}

/* ── FONT SIZE SLIDER ── */
.a11y-slider-group {
  padding: 4px 12px 14px;
}
.a11y-slider-labels {
  display: flex; justify-content: space-between; padding: 0 2px; margin-bottom: 4px;
}
.a11y-slider-labels span {
  font-size: 10px; color: var(--t-muted);
  transition: all 0.2s; cursor: pointer; padding: 4px 6px; border-radius: 6px;
  font-weight: 500;
}
.a11y-slider-labels span.active { color: var(--t-green); font-weight: 700; background: rgba(0,230,118,0.08); }
.a11y-slider-track {
  position: relative; height: 6px; border-radius: 99px;
  background: var(--t-border); cursor: pointer;
}
.a11y-slider-fill {
  height: 100%; border-radius: 99px;
  background: linear-gradient(90deg, var(--t-green-dim), var(--t-green));
  transition: width 0.2s ease;
}
.a11y-slider-thumb {
  position: absolute; top: 50%; width: 20px; height: 20px;
  border-radius: 50%; background: var(--t-card);
  border: 2px solid var(--t-green); transform: translate(-50%, -50%);
  box-shadow: 0 2px 8px rgba(0,230,118,0.3);
  transition: left 0.2s ease;
}
.a11y-slider-dots {
  display: flex; justify-content: space-between; padding: 0; margin-top: 2px;
}
.a11y-slider-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--t-border); border: none; cursor: pointer; padding: 0;
  transition: all 0.2s;
}
.a11y-slider-dot.active { background: var(--t-green); transform: scale(1.2); }

/* ── LINE SPACING ── */
.a11y-spacing-group { padding: 0 12px 14px; display: flex; gap: 6px; }
.a11y-spacing-btn {
  flex: 1; padding: 8px 4px; border-radius: 10px; border: 1px solid var(--t-border);
  background: transparent; color: var(--t-muted); cursor: pointer;
  font-size: 12px; font-weight: 600; font-family: inherit;
  text-align: center; transition: all 0.2s;
}
.a11y-spacing-btn:hover { border-color: var(--t-border-hi); color: var(--t-text); }
.a11y-spacing-btn.active { background: rgba(0,230,118,0.1); border-color: var(--t-green); color: var(--t-green); }

/* ── COLORBLIND SELECTOR ── */
.a11y-cb-group { padding: 0 12px 14px; display: flex; gap: 6px; }
.a11y-cb-btn {
  flex: 1; padding: 8px 4px 6px; border-radius: 12px; border: 1px solid var(--t-border);
  background: transparent; cursor: pointer; text-align: center;
  transition: all 0.2s; font-family: inherit;
}
.a11y-cb-btn:hover { border-color: var(--t-border-hi); }
.a11y-cb-btn.active { border-color: var(--t-green); background: rgba(0,230,118,0.08); }
.a11y-cb-swatch {
  display: flex; gap: 3px; justify-content: center; margin-bottom: 4px;
}
.a11y-cb-dot {
  width: 10px; height: 10px; border-radius: 50%; display: inline-block;
}
.a11y-cb-label { font-size: 9px; font-weight: 600; color: var(--t-muted); }
.a11y-cb-btn.active .a11y-cb-label { color: var(--t-green); }

/* ── FAB ── */
.a11y-fab {
  width: 56px; height: 56px; border-radius: 50%;
  border: 1px solid var(--t-border);
  background: var(--t-card); color: var(--t-muted);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 16px rgba(0,0,0,0.3);
  transition: all 0.3s cubic-bezier(0.175,0.885,0.32,1.275);
  position: relative; outline: none; font-size: 22px;
}
.a11y-fab:hover { transform: scale(1.08); color: var(--t-text); border-color: var(--t-border-hi); }
.a11y-fab:active { transform: scale(0.95); }
.a11y-fab:focus-visible { border-color: var(--t-green); box-shadow: 0 0 0 3px rgba(0,230,118,0.3); }
.a11y-fab.active {
  background: linear-gradient(135deg, var(--t-green), var(--t-green-dim));
  color: #000; border-color: transparent;
  box-shadow: 0 8px 24px rgba(0,230,118,0.4);
  animation: a11y-pulse-dot 2s infinite;
}
.a11y-fab-dot {
  position: absolute; top: -2px; right: -2px;
  width: 12px; height: 12px; border-radius: 50%;
  background: var(--t-green); border: 2px solid var(--t-card);
}
.a11y-shortcut-hint {
  font-size: 9px; color: var(--t-faint); padding: 10px 20px 14px; border-top: 1px solid var(--t-border); 
  display: flex; align-items: center; gap: 6px;
}
.a11y-shortcut-hint kbd {
  padding: 2px 6px; border-radius: 4px; background: var(--t-border); 
  font-family: inherit; font-size: 10px; color: var(--t-muted); font-weight: 600;
}
`

export function AccessibilityPanel() {
  const { settings, setOption, toggle, reset } = useAccessibility()
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const announceRef = useRef(null)

  const anyActive = Object.entries(settings).some(([k, v]) =>
    k !== 'lineSpacing' && k !== 'colorblindMode'
      ? v !== false
      : k === 'lineSpacing' ? v !== 1.3 : v !== 'none'
  )

  const activeCount = Object.entries(settings).filter(([k, v]) =>
    k !== 'lineSpacing' && k !== 'colorblindMode'
      ? v !== false
      : k === 'lineSpacing' ? v !== 1.3 : v !== 'none'
  ).length

  // Keyboard shortcut: Alt+A to toggle panel
  useEffect(() => {
    const handler = (e) => {
      if (e.altKey && e.key === 'a') {
        e.preventDefault()
        setOpen(p => !p)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Escape to close
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  // Focus trap when open
  useEffect(() => {
    if (!open || !panelRef.current) return
    const firstFocusable = panelRef.current.querySelector('button')
    firstFocusable?.focus()
  }, [open])

  // Announce changes
  useEffect(() => {
    if (!announceRef.current) return
    const parts = []
    if (settings.lightMode) parts.push('modo claro')
    if (settings.dyslexicFont) parts.push('fuente amigable')
    if (settings.lineSpacing !== 1.3) parts.push(`espaciado ${settings.lineSpacing}`)
    if (settings.colorblindMode !== 'none') parts.push(`filtro ${settings.colorblindMode}`)
    if (settings.readingGuide) parts.push('guía de lectura')
    if (settings.reducedMotion) parts.push('sin movimiento')
    announceRef.current.textContent = parts.length
      ? `Accesibilidad activa: ${parts.join(', ')}.`
      : 'Sin ajustes de accesibilidad activos.'
  }, [settings])

  return (
    <>
      <style>{PCS}</style>
      <div aria-live="polite" aria-atomic="true" ref={announceRef}
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}
      />

      {open && (
        <div className="a11y-overlay" onClick={() => setOpen(false)} aria-hidden="true" />
      )}

      <div className="a11y-container">
        {open && (
          <div className="a11y-panel" ref={panelRef} role="dialog" aria-label="Panel de accesibilidad">
            <div className="a11y-panel-header">
              <div className="a11y-panel-title">
                <i className="fa-solid fa-universal-access" style={{ color: 'var(--t-green)', fontSize: 16 }}></i>
                <h2>Accesibilidad</h2>
                {activeCount > 0 && (
                  <span className="a11y-active-count" aria-label={`${activeCount} ajustes activos`}>
                    {activeCount}
                  </span>
                )}
              </div>
              <button className="a11y-reset-btn" onClick={reset} aria-label="Restablecer todos los ajustes">
                <i className="fa-solid fa-rotate-left"></i>
                Reset
              </button>
            </div>

            {/* Visión */}
            <div className="a11y-category">
              <div className="a11y-category-header">
                <i className="fa-solid fa-eye"></i> Visión
              </div>

              {/* Colorblind selector */}
              <div style={{ padding: '4px 0 6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px 8px' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 10, background: 'var(--t-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t-muted)', fontSize: 12 }}>
                    <i className="fa-solid fa-palette"></i>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t-text)' }}>Filtro daltónico</div>
                    <div style={{ fontSize: 10, color: 'var(--t-muted)' }}>Simula daltonismo para diseñar inclusivo</div>
                  </div>
                </div>
                <div className="a11y-cb-group">
                  {COLORBLIND_OPTS.map(opt => (
                    <button key={opt.value}
                      className={`a11y-cb-btn${settings.colorblindMode === opt.value ? ' active' : ''}`}
                      onClick={() => setOption('colorblindMode', opt.value)}
                      aria-pressed={settings.colorblindMode === opt.value}
                      aria-label={`Modo daltónico: ${opt.label}`}
                    >
                      <div className="a11y-cb-swatch">
                        {opt.colors.map((c, i) => <span key={i} className="a11y-cb-dot" style={{ background: c }} />)}
                      </div>
                      <div className="a11y-cb-label">{opt.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Lectura */}
            <div className="a11y-category">
              <div className="a11y-category-header">
                <i className="fa-solid fa-book-open"></i> Lectura
              </div>

              {/* Line spacing */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px 6px' }}>
                <div style={{ width: 30, height: 30, borderRadius: 10, background: 'var(--t-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t-muted)', fontSize: 12 }}>
                  <i className="fa-solid fa-arrows-alt-v"></i>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t-text)' }}>Espaciado</div>
                  <div style={{ fontSize: 10, color: 'var(--t-muted)' }}>Interlineado: {settings.lineSpacing}</div>
                </div>
              </div>
              <div className="a11y-spacing-group">
                {LINE_SPACINGS.map(sp => (
                  <button key={sp}
                    className={`a11y-spacing-btn${settings.lineSpacing === sp ? ' active' : ''}`}
                    onClick={() => setOption('lineSpacing', sp)}
                    aria-pressed={settings.lineSpacing === sp}
                  >{sp}</button>
                ))}
              </div>

              <ToggleOption icon="fa-solid fa-font" label="Fuente amigable" desc="Tipografía para dislexia"
                active={settings.dyslexicFont} onToggle={() => toggle('dyslexicFont')} />

              <ToggleOption icon="fa-solid fa-ruler" label="Guía de lectura" desc="Línea horizontal al hacer scroll"
                active={settings.readingGuide} onToggle={() => toggle('readingGuide')} />
            </div>

            {/* Movimiento */}
            <div className="a11y-category">
              <div className="a11y-category-header">
                <i className="fa-solid fa-person-walking"></i> Movimiento
              </div>
              <ToggleOption icon="fa-solid fa-person-running" label="Sin movimiento" desc="Desactiva animaciones"
                active={settings.reducedMotion} onToggle={() => toggle('reducedMotion')} />
            </div>

            <div className="a11y-shortcut-hint">
              <i className="fa-solid fa-keyboard"></i>
              Atajo: <kbd>Alt</kbd> + <kbd>A</kbd>
            </div>
          </div>
        )}

        <button className={`a11y-fab${anyActive ? ' active' : ''}`}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label="Abrir panel de accesibilidad (Alt+A)"
          title="Accesibilidad (Alt+A)"
        >
          <i className="fa-solid fa-universal-access"></i>
          {anyActive && <div className="a11y-fab-dot" aria-hidden="true" />}
        </button>
      </div>
    </>
  )
}

function ToggleOption({ icon, label, desc, active, onToggle }) {
  return (
    <div className={`a11y-option${active ? ' active' : ''}`}
      onClick={onToggle}
      role="button" tabIndex={0}
      aria-pressed={active}
      aria-label={`${label}: ${desc}`}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
    >
      <div className="a11y-option-left">
        <div className="a11y-option-icon">
          <i className={icon}></i>
        </div>
        <div>
          <div className="a11y-option-label">{label}</div>
          <div className="a11y-option-desc">{desc}</div>
        </div>
      </div>
      <div className="a11y-option-right">
        <div className={`a11y-toggle${active ? ' active' : ''}`} aria-hidden="true">
          <div className="a11y-toggle-knob" />
        </div>
      </div>
    </div>
  )
}
