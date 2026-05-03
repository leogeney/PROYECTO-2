export const MODULES = [
  { id: 1, icon: '🚦', title: 'Señales de tránsito', color: '#ff5252', lessons: 5, done: 0, unlocked: true },
  { id: 2, icon: '📋', title: 'Normas básicas',       color: '#18ffff', lessons: 4, done: 0, unlocked: true },
  { id: 3, icon: '🤝', title: 'Comportamiento vial',  color: '#6b7a8d', lessons: 4, done: 0, unlocked: false },
  { id: 4, icon: '🌆', title: 'Situaciones reales',   color: '#6b7a8d', lessons: 6, done: 0, unlocked: false },
]

export const LESSONS = [
  { id: 1, icon: '⛔', title: 'Señales reglamentarias',  diff: 'fácil',   time: '5 min',  xp: 50,  locked: false },
  { id: 2, icon: '⚠️', title: 'Señales preventivas',     diff: 'fácil',   time: '6 min',  xp: 60,  locked: false },
  { id: 3, icon: '🚦', title: 'Semáforos y prioridades', diff: 'medio',   time: '8 min',  xp: 80,  locked: false },
  { id: 4, icon: '🏎️', title: 'Velocidades máximas',     diff: 'fácil',   time: '7 min',  xp: 70,  locked: false },
  { id: 5, icon: '🛡️', title: 'Conducción defensiva',    diff: 'difícil', time: '10 min', xp: 100, locked: false },
]
