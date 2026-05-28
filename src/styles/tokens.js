// ── Tokens de diseño (CSS variables para theming) ──
const _ = (n) => `var(--t-${n})`

export const T = {
  bg: _('bg'), surface: _('surface'), card: _('card'),
  border: _('border'), borderHi: _('border-hi'),
  green: _('green'), greenDim: _('green-dim'),
  blue: _('blue'), gold: _('gold'),
  red: _('red'), cyan: _('cyan'), orange: _('orange'),
  text: _('text'), muted: _('muted'), faint: _('faint'),
}

export const DIFF = {
  fácil:   { color: T.green, bg: 'rgba(0,230,118,0.1)',  label: 'FÁCIL'   },
  medio:   { color: T.gold,  bg: 'rgba(255,215,64,0.1)', label: 'MEDIO'   },
  difícil: { color: T.red,   bg: 'rgba(255,82,82,0.1)',  label: 'DIFÍCIL' },
}

// Temas con valores concretos para inyectar en CSS
export const THEMES = {
  dark: {
    '--t-bg': '#030714', '--t-surface': '#090e1e', '--t-card': '#0f1528',
    '--t-border': 'rgba(255,255,255,0.06)', '--t-border-hi': 'rgba(255,255,255,0.12)',
    '--t-green': '#00ff88', '--t-green-dim': '#00cc6a',
    '--t-blue': '#5b8def', '--t-gold': '#f5c542',
    '--t-red': '#ff6b6b', '--t-cyan': '#33e6ff', '--t-orange': '#ff8552',
    '--t-text': '#f0f4ff', '--t-muted': '#94a3b8', '--t-faint': '#5a6a82',
  },
  light: {
    '--t-bg': '#eef1f7', '--t-surface': '#ffffff', '--t-card': '#ffffff',
    '--t-border': 'rgba(0,0,0,0.08)', '--t-border-hi': 'rgba(0,0,0,0.15)',
    '--t-green': '#006633', '--t-green-dim': '#005227',
    '--t-blue': '#1446a0', '--t-gold': '#735500',
    '--t-red': '#991111', '--t-cyan': '#004a4a', '--t-orange': '#7a3a00',
    '--t-text': '#000000', '--t-muted': '#1a1a1a', '--t-faint': '#2e2e2e',
  },
  highContrast: {
    '--t-bg': '#000000', '--t-surface': '#0a0a0a', '--t-card': '#111111',
    '--t-border': 'rgba(255,255,255,0.25)', '--t-border-hi': 'rgba(255,255,255,0.4)',
    '--t-green': '#00ffaa', '--t-green-dim': '#00dd88',
    '--t-blue': '#66bbff', '--t-gold': '#ffdd44',
    '--t-red': '#ff6666', '--t-cyan': '#66ffff', '--t-orange': '#ff9944',
    '--t-text': '#ffffff', '--t-muted': '#cccccc', '--t-faint': '#999999',
  },
}