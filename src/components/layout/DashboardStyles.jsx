import { T } from '../../styles/tokens'

const DASHBOARD_CSS = `
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes glow-pulse {
    0%, 100% { opacity: 0.6; }
    50%       { opacity: 1; }
  }
  @keyframes hdr-glow {
    0%, 100% { opacity: 0.3; transform: scaleX(0.8); }
    50%      { opacity: 1;   transform: scaleX(1); }
  }
  .anim-up   { animation: slide-up 0.4s cubic-bezier(0.16,1,0.3,1) both; }
  .anim-fade { animation: fade-in 0.3s ease both; }
  .mono { font-family: 'Space Mono', monospace; }
  .card {
    background: ${T.card}; border: 1px solid ${T.border};
    border-radius: 14px; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .card-hover:hover { border-color: ${T.borderHi}; }
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 99px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  }
  .btn-primary {
    background: ${T.green}; color: #000; border: none; border-radius: 10px;
    font-size: 13px; font-weight: 700; font-family: 'DM Sans', sans-serif;
    cursor: pointer; padding: 10px 20px; transition: all 0.2s; letter-spacing: 0.02em;
  }
  .btn-primary:hover:not(:disabled) {
    background: #33eb91; transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(0,230,118,0.3);
  }
  .btn-primary:active:not(:disabled) { transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-ghost {
    background: transparent; color: ${T.muted};
    border: 1px solid ${T.border}; border-radius: 8px;
    font-size: 12px; font-weight: 500; font-family: 'DM Sans', sans-serif;
    cursor: pointer; padding: 6px 14px; transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: ${T.borderHi}; color: ${T.text}; }
  .nav-link {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 10px; font-size: 13px;
    color: ${T.muted}; text-decoration: none; font-weight: 500;
    border: 1px solid transparent; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .nav-link:hover { color: ${T.text}; background: rgba(255,255,255,0.04); }
  .nav-link.active { color: ${T.green}; background: rgba(0,230,118,0.08); border-color: rgba(0,230,118,0.18); }
  .grid-bg {
    background-image:
      linear-gradient(rgba(0,230,118,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,230,118,0.025) 1px, transparent 1px);
    background-size: 32px 32px;
  }
`

export function DashboardStyles() {
  return <style>{DASHBOARD_CSS}</style>
}