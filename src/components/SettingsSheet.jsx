import { Moon, Sun, Trash2, X } from 'lucide-react'
export default function SettingsSheet({ open, theme, onTheme, completedCount, onClear, onClose }) {
  if (!open) return null
  return <div className="overlay sheet-overlay" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <section className="bottom-sheet settings-sheet" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="grabber" />
      <div className="sheet-title"><h2 id="settings-title">Settings</h2><button type="button" className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button></div>
      <p className="setting-label">Appearance</p>
      <div className="theme-picker"><button type="button" aria-pressed={theme === 'light'} onClick={() => onTheme('light')}><Sun size={19} />Light</button><button type="button" aria-pressed={theme === 'dark'} onClick={() => onTheme('dark')}><Moon size={19} />Dark</button></div>
      <button className="danger clear-row" type="button" disabled={!completedCount} onClick={onClear}><Trash2 size={20} /><span>Clear completed</span><small>{completedCount || ''}</small></button>
    </section>
  </div>
}
