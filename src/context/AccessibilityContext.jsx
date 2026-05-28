import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { THEMES } from '../styles/tokens'

const A11Y_KEY = 'transi_a11y'

const defaults = {
  lightMode: false,
  dyslexicFont: false,
  reducedMotion: false,
  lineSpacing: 1.3,
  colorblindMode: 'none',
  readingGuide: false,
}

const STYLE_ID = 'transi-a11y-styles'

const LIGHT_OVERRIDES = `
/* ══════════════════════════════════════════════════════════════
   REACT LOWERCASE: React serializa camelCase inline styles a
   kebab-case.  Todos los selectores [style*=] usan kebab.
   ══════════════════════════════════════════════════════════════ */

/* ── title IMAGE BORDERS & DECORATIVE WHITE LINES → LIGHT ── */
[style*="rgba(255,255,255,0.01)"], [style*="rgba(255, 255, 255, 0.01)"] { background: rgba(0,0,0,0.01) !important; }
[style*="rgba(255,255,255,0.02)"], [style*="rgba(255, 255, 255, 0.02)"] { background: rgba(0,0,0,0.02) !important; }
[style*="rgba(255,255,255,0.03)"], [style*="rgba(255, 255, 255, 0.03)"] { background: rgba(0,0,0,0.03) !important; }
[style*="rgba(255,255,255,0.04)"], [style*="rgba(255, 255, 255, 0.04)"] { background: rgba(0,0,0,0.04) !important; }
[style*="rgba(255,255,255,0.05)"], [style*="rgba(255, 255, 255, 0.05)"] { background: rgba(0,0,0,0.05) !important; }
[style*="rgba(255,255,255,0.06)"], [style*="rgba(255, 255, 255, 0.06)"] { background: rgba(0,0,0,0.04) !important; border-color: rgba(0,0,0,0.12) !important; }
[style*="rgba(255,255,255,0.07)"], [style*="rgba(255, 255, 255, 0.07)"] { background: rgba(0,0,0,0.04) !important; border-color: rgba(0,0,0,0.14) !important; }
[style*="rgba(255,255,255,0.08)"], [style*="rgba(255, 255, 255, 0.08)"] { background: rgba(0,0,0,0.04) !important; border-color: rgba(0,0,0,0.16) !important; }
[style*="rgba(255,255,255,0.1) "],  [style*="rgba(255,255,255,0.1);"]  { background: rgba(0,0,0,0.05) !important; border-color: rgba(0,0,0,0.18) !important; }
[style*="rgba(255,255,255,0.12)"], [style*="rgba(255, 255, 255, 0.12)"] { border-color: rgba(0,0,0,0.22) !important; }
[style*="rgba(255,255,255,0.15)"], [style*="rgba(255, 255, 255, 0.15)"] { border-color: rgba(0,0,0,0.3) !important; }

/* ── DARK HEADER GRADIENT → LIGHT (incluye green border override) ── */
[style*="rgba(14,17,24,0.92)"] {
  background: linear-gradient(135deg, rgba(255,255,255,0.96), rgba(245,247,250,0.98)) !important;
  border-bottom: 1px solid rgba(0,0,0,0.08) !important;
}

/* ── HARDCODED DARK BGS → LIGHT ── */
[style*="background: #1a1a1a"] { background: #eef0f4 !important; }
[style*="background: #0a0a0a"] { background: #e8eaee !important; }

/* ── DARK MODAL OVERLAYS → LIGHTER ── */
[style*="background: rgba(0,0,0,0.8)"] { background: rgba(0,0,0,0.04) !important; }
[style*="background: rgba(0,0,0,0.88)"] { background: rgba(0,0,0,0.06) !important; }
[style*="background: rgba(0,0,0,0.7)"] { background: rgba(0,0,0,0.03) !important; }

/* ── WHITE TEXT ON DARK → DARK TEXT ── */
[style*="#f0f4f8"] { color: #1a1a2e !important; }
[style*="rgba(255,255,255,0.35)"], [style*="rgba(255, 255, 255, 0.35)"] { color: rgba(0,0,0,0.55) !important; }
[style*="rgba(255,255,255,0.3)"],  [style*="rgba(255, 255, 255, 0.3)"]  { color: rgba(0,0,0,0.45) !important; }
[style*="rgba(255,255,255,0.25)"], [style*="rgba(255, 255, 255, 0.25)"] { color: rgba(0,0,0,0.4) !important; }
[style*="rgba(255,255,255,0.2)"],  [style*="rgba(255, 255, 255, 0.2)"]  { color: rgba(0,0,0,0.35) !important; }
[style*="rgba(255,255,255,0.4)"],  [style*="rgba(255, 255, 255, 0.4)"]  { color: rgba(0,0,0,0.6) !important; }
[style*="color: rgba(255,255,255,"] { color: rgba(0,0,0,0.55) !important; }
[style*="color: #0a0a0a"] { color: #1a1a2e !important; }

/* ── SVG STROKES ── */
[style*="stroke: rgba(255,255,255,0.04)"], [style*="stroke: rgba(255, 255, 255, 0.04)"] { stroke: rgba(0,0,0,0.08) !important; }
[style*="stroke: rgba(255,255,255,0.05)"], [style*="stroke: rgba(255, 255, 255, 0.05)"] { stroke: rgba(0,0,0,0.1) !important; }

/* ── SCROLLBAR ── */
[style*="scrollbar-color: rgba(255,255,255,0.06)"] { scrollbar-color: rgba(0,0,0,0.15) transparent !important; }

/* ── BORDER SEPARATORS ── */
[style*="border-top: 1px solid rgba(255,255,255,0.04)"] { border-top-color: rgba(0,0,0,0.08) !important; }
[style*="border-top: 1px solid rgba(255,255,255,0.05)"] { border-top-color: rgba(0,0,0,0.1) !important; }
[style*="border-bottom: 1px solid rgba(255,255,255,0.05)"] { border-bottom-color: rgba(0,0,0,0.1) !important; }
[style*="border-bottom: 1px solid rgba(255,255,255,0.04)"] { border-bottom-color: rgba(0,0,0,0.08) !important; }
[style*="border-top: 1px solid rgba(255,255,255,0.03)"] { border-top-color: rgba(0,0,0,0.06) !important; }

/* ── GRADIENT OVERLAYS ── */
[style*="background: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.03)"] { background: rgba(0,0,0,0.02) !important; }
[style*="background: radial-gradient(circle, rgba(0,230,118,0.1), transparent 70%)"] { background: rgba(0,122,61,0.04) !important; }

/* ── BOX SHADOWS oscuras → sutiles ── */
[style*="box-shadow: 0 10px 30px rgba(0,0,0,0.5)"] { box-shadow: 0 4px 12px rgba(0,0,0,0.06) !important; }
[style*="box-shadow: 0 20px 40px rgba(0,0,0,0.5)"] { box-shadow: 0 8px 20px rgba(0,0,0,0.06) !important; }
[style*="box-shadow: 0 40px 100px rgba(0,0,0,0.8)"] { box-shadow: 0 20px 50px rgba(0,0,0,0.08) !important; }
[style*="box-shadow: 0 8px 32px rgba(0,0,0,0.4)"] { box-shadow: 0 4px 12px rgba(0,0,0,0.06) !important; }
[style*="box-shadow: 0 8px 24px rgba(0,0,0,0.2)"] { box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important; }
[style*="0 10px 20px rgba(0,0,0,0.15)"] { box-shadow: 0 4px 8px rgba(0,0,0,0.06) !important; }

/* ══════════════════════════════════════════════════════════════
   GREEN ACCENT → dark green para light mode (#007a3d)
   ══════════════════════════════════════════════════════════════ */

/* backgrounds with green tint */
[style*="rgba(0,230,118,0.03)"], [style*="rgba(0, 230, 118, 0.03)"] { background: rgba(0,122,61,0.03) !important; }
[style*="rgba(0,230,118,0.04)"], [style*="rgba(0, 230, 118, 0.04)"] { background: rgba(0,122,61,0.05) !important; }
[style*="rgba(0,230,118,0.05)"], [style*="rgba(0, 230, 118, 0.05)"] { background: rgba(0,122,61,0.06) !important; }
[style*="rgba(0,230,118,0.06)"], [style*="rgba(0, 230, 118, 0.06)"] { background: rgba(0,122,61,0.08) !important; border-color: rgba(0,122,61,0.15) !important; }
[style*="rgba(0,230,118,0.07)"], [style*="rgba(0, 230, 118, 0.07)"] { background: rgba(0,122,61,0.1) !important; }
[style*="rgba(0,230,118,0.08)"], [style*="rgba(0, 230, 118, 0.08)"] { background: rgba(0,122,61,0.12) !important; border-color: rgba(0,122,61,0.2) !important; }
[style*="rgba(0,230,118,0.09)"], [style*="rgba(0, 230, 118, 0.09)"] { background: rgba(0,122,61,0.14) !important; }
[style*="rgba(0,230,118,0.1)"],  [style*="rgba(0, 230, 118, 0.1)"]  { background: rgba(0,122,61,0.15) !important; border-color: rgba(0,122,61,0.25) !important; }
[style*="rgba(0,230,118,0.12)"], [style*="rgba(0, 230, 118, 0.12)"] { background: rgba(0,122,61,0.18) !important; border-color: rgba(0,122,61,0.3) !important; }
[style*="rgba(0,230,118,0.14)"], [style*="rgba(0, 230, 118, 0.14)"] { background: rgba(0,122,61,0.22) !important; }
[style*="rgba(0,230,118,0.15)"], [style*="rgba(0, 230, 118, 0.15)"] { background: rgba(0,122,61,0.25) !important; border-color: rgba(0,122,61,0.35) !important; }
[style*="rgba(0,230,118,0.18)"], [style*="rgba(0, 230, 118, 0.18)"] { background: rgba(0,122,61,0.3) !important; border-color: rgba(0,122,61,0.4) !important; }
[style*="rgba(0,230,118,0.2)"],  [style*="rgba(0, 230, 118, 0.2)"]  { background: rgba(0,122,61,0.35) !important; border-color: rgba(0,122,61,0.45) !important; }
[style*="rgba(0,230,118,0.25)"], [style*="rgba(0, 230, 118, 0.25)"] { border-color: rgba(0,122,61,0.5) !important; }
[style*="rgba(0,230,118,0.28)"], [style*="rgba(0, 230, 118, 0.28)"] { background: rgba(0,122,61,0.4) !important; border-color: rgba(0,122,61,0.55) !important; }
[style*="rgba(0,230,118,0.3)"],  [style*="rgba(0, 230, 118, 0.3)"]  { border-color: rgba(0,122,61,0.55) !important; }
[style*="rgba(0,230,118,0.5)"],  [style*="rgba(0, 230, 118, 0.5)"]  { border-color: rgba(0,122,61,0.7) !important; }

/* green box-shadows */
[style*="0 0 16px rgba(0,230,118,0.35)"] { box-shadow: 0 0 6px rgba(0,122,61,0.2) !important; }
[style*="0 0 12px rgba(0, 230, 118, 0.25)"] { box-shadow: 0 0 5px rgba(0,122,61,0.15) !important; }
[style*="0 0 12px rgba(0,230,118,0.2)"] { box-shadow: 0 0 4px rgba(0,122,61,0.12) !important; }
[style*="0 0 20px rgba(0, 230, 118, 0.2)"] { box-shadow: 0 0 8px rgba(0,122,61,0.12) !important; }
[style*="0 0 22px rgba(0,230,118,0.45)"] { box-shadow: 0 0 8px rgba(0,122,61,0.25) !important; }
[style*="0 0 0 1px rgba(0,230,118,0.04)"] { box-shadow: 0 0 0 1px rgba(0,122,61,0.06) !important; }

/* green gradients */
[style*="linear-gradient(135deg, rgba(0,230,118,0.06) 0%, rgba(0,0,0,0) 60%)"] {
  background: linear-gradient(135deg, rgba(0,122,61,0.06) 0%, rgba(0,0,0,0) 60%) !important;
}
[style*="linear-gradient(135deg, rgba(0, 230, 118, 0.1), rgba(0, 230, 118, 0.05))"] {
  background: linear-gradient(135deg, rgba(0,122,61,0.12), rgba(0,122,61,0.06)) !important;
}
[style*="linear-gradient(90deg, rgba(0,230,118,0.5), #00e676)"] {
  background: linear-gradient(90deg, rgba(0,122,61,0.6), #007a3d) !important;
}
/* gradient with var(--t-card) —the rgba(0,230,118,0.08) selector above handles the override */

/* ══════════════════════════════════════════════════════════════
   CLASS-BASED OVERRIDES (elementos sin inline styles)
   ══════════════════════════════════════════════════════════════ */

.a11y-light-mode header {
  background: linear-gradient(135deg, rgba(255,255,255,0.96), rgba(245,247,250,0.98)) !important;
}
.a11y-light-mode nav {
  background: #ffffff !important;
}
.a11y-light-mode main {
  background: var(--t-bg) !important;
}

/* inputs / textareas / selects */
.a11y-light-mode input,
.a11y-light-mode textarea,
.a11y-light-mode select {
  background-color: #ffffff !important;
  color: #1a1a2e !important;
  border-color: rgba(0,0,0,0.15) !important;
}

/* color-scheme for native scrollbars & form controls */
.a11y-light-mode { color-scheme: light !important; }

/* reading-guide accent in light mode */
#a11y-reading-guide {
  background: rgba(0,122,61,0.12) !important;
  border-top-color: rgba(0,122,61,0.5) !important;
  border-bottom-color: rgba(0,122,61,0.5) !important;
}
`

const COLORBLIND_FILTERS = {
  none: '',
  protanopia: 'url(#a11y-protanopia)',
  deuteranopia: 'url(#a11y-deuteranopia)',
  tritanopia: 'url(#a11y-tritanopia)',
}

const COLORBLIND_SVG = `<svg style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">
  <defs>
    <filter id="a11y-protanopia">
      <feColorMatrix type="matrix" values="0.567,0.433,0,0,0  0.558,0.442,0,0,0  0,0.242,0.758,0,0  0,0,0,1,0"/>
    </filter>
    <filter id="a11y-deuteranopia">
      <feColorMatrix type="matrix" values="0.625,0.375,0,0,0  0.7,0.3,0,0,0  0,0.3,0.7,0,0  0,0,0,1,0"/>
    </filter>
    <filter id="a11y-tritanopia">
      <feColorMatrix type="matrix" values="0.95,0.05,0,0,0  0,0.433,0.567,0,0  0,0.475,0.525,0,0  0,0,0,1,0"/>
    </filter>
  </defs>
</svg>`

const READING_GUIDE_ID = 'a11y-reading-guide'

function injectStyles(css) {
  let el = document.getElementById(STYLE_ID)
  if (!el) {
    el = document.createElement('style')
    el.id = STYLE_ID
    document.head.appendChild(el)
  }
  el.textContent = css
}

function removeStyles() {
  document.getElementById(STYLE_ID)?.remove()
  document.getElementById(READING_GUIDE_ID)?.remove()
  document.querySelector('#a11y-colorblind-svg')?.remove()
}

function cssVarsToBlock(vars) {
  return Object.entries(vars).map(([k, v]) => `${k}: ${v};`).join('\n')
}

function buildCSS(settings) {
  let rootVars = cssVarsToBlock(THEMES.dark)
  let extra = ''

  if (settings.lightMode) {
    rootVars = cssVarsToBlock(THEMES.light)
    extra += LIGHT_OVERRIDES
  }

  if (settings.dyslexicFont) {
    extra += `
      body, * { font-family: 'Comic Sans MS', 'Trebuchet MS', 'Verdana', sans-serif !important;
        letter-spacing: 0.04em !important; word-spacing: 0.08em !important; line-height: 1.6 !important; }`
  }

  if (settings.lineSpacing !== 1.3) {
    extra += `
      body, p, div, li, td, th { line-height: ${settings.lineSpacing} !important; }
      button, a, input, textarea, select, label { line-height: ${Math.min(settings.lineSpacing, 1.6)} !important; }`
  }

  if (settings.reducedMotion) {
    extra += `
      *, *::before, *::after { animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }`
  }

  return `:root {\n${rootVars}}\n${extra}`
}

let guideCleanup = null

function toggleReadingGuide(enabled) {
  if (guideCleanup) { guideCleanup(); guideCleanup = null }
  if (!enabled) return

  const el = document.createElement('div')
  el.id = READING_GUIDE_ID
  Object.assign(el.style, {
    position: 'fixed', pointerEvents: 'none', zIndex: 2147483647,
    left: 0, right: 0, height: '28px',
    background: 'rgba(0,230,118,0.12)',
    borderTop: '2px solid rgba(0,230,118,0.5)',
    borderBottom: '2px solid rgba(0,230,118,0.5)',
    transform: 'translateY(-14px)',
    transition: 'top 0.05s linear',
    willChange: 'top',
  })
  document.body.appendChild(el)

  const handler = (e) => { el.style.top = `${e.clientY}px` }
  window.addEventListener('mousemove', handler, { passive: true })
  guideCleanup = () => { window.removeEventListener('mousemove', handler); el.remove() }
}

const A11yCtx = createContext(null)

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(A11Y_KEY)
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults
    } catch { return defaults }
  })

  useEffect(() => {
    localStorage.setItem(A11Y_KEY, JSON.stringify(settings))

    const root = document.documentElement
    root.classList.toggle('a11y-light-mode', !!settings.lightMode)
    root.classList.toggle('a11y-reduced-motion', !!settings.reducedMotion)

    const anyOn = Object.values(settings).some(v => v !== false && v !== 'none' && v !== 1.3)
    if (anyOn) {
      injectStyles(buildCSS(settings))
    } else {
      injectStyles(`:root {\n${cssVarsToBlock(THEMES.dark)}\n}`)
    }

    // Colorblind filter
    let prevSvg = document.querySelector('#a11y-colorblind-svg')
    if (prevSvg) prevSvg.remove()
    if (settings.colorblindMode && settings.colorblindMode !== 'none') {
      const wrapper = document.createElement('div')
      wrapper.id = 'a11y-colorblind-svg'
      wrapper.innerHTML = COLORBLIND_SVG
      document.body.appendChild(wrapper)
      root.style.filter = COLORBLIND_FILTERS[settings.colorblindMode]
    } else {
      root.style.filter = ''
    }

    // Reading guide
    toggleReadingGuide(settings.readingGuide)
  }, [settings])

  useEffect(() => {
    return () => {
      removeStyles()
      if (guideCleanup) guideCleanup()
    }
  }, [])

  const setOption = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  const toggle = useCallback((key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const reset = useCallback(() => {
    setSettings(defaults)
  }, [])

  return (
    <A11yCtx.Provider value={{ settings, setOption, toggle, reset, defaults }}>
      {children}
    </A11yCtx.Provider>
  )
}

export function useAccessibility() {
  const ctx = useContext(A11yCtx)
  if (!ctx) throw new Error('useAccessibility must be inside AccessibilityProvider')
  return ctx
}
