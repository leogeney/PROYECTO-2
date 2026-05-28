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
    '--t-bg': '#07090f', '--t-surface': '#0e1118', '--t-card': '#131720',
    '--t-border': 'rgba(255,255,255,0.06)', '--t-border-hi': 'rgba(255,255,255,0.12)',
    '--t-green': '#00e676', '--t-green-dim': '#00c853',
    '--t-blue': '#448aff', '--t-gold': '#ffd740',
    '--t-red': '#ff5252', '--t-cyan': '#18ffff', '--t-orange': '#ff7043',
    '--t-text': '#f0f4f8', '--t-muted': '#6b7a8d', '--t-faint': '#3a4455',
  },
  light: {
    '--t-bg': '#f0f2f5', '--t-surface': '#ffffff', '--t-card': '#ffffff',
    '--t-border': 'rgba(0,0,0,0.08)', '--t-border-hi': 'rgba(0,0,0,0.15)',
    '--t-green': '#007a3d', '--t-green-dim': '#006633',
    '--t-blue': '#1565c0', '--t-gold': '#b8860b',
    '--t-red': '#c62828', '--t-cyan': '#007c7c', '--t-orange': '#c43e00',
    '--t-text': '#1a1a2e', '--t-muted': '#555555', '--t-faint': '#888888',
  },
  highContrast: {
    '--t-bg': '#000000', '--t-surface': '#0a0a0a', '--t-card': '#111111',
    '--t-border': 'rgba(255,255,255,0.25)', '--t-border-hi': 'rgba(255,255,255,0.4)',
    '--t-green': '#00ff88', '--t-green-dim': '#00dd77',
    '--t-blue': '#66bbff', '--t-gold': '#ffdd44',
    '--t-red': '#ff6666', '--t-cyan': '#66ffff', '--t-orange': '#ff9944',
    '--t-text': '#ffffff', '--t-muted': '#cccccc', '--t-faint': '#999999',
  },
}