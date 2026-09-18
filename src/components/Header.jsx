import { CalendarDays, Settings } from 'lucide-react'

export default function Header({ date, onSettings }) {
  return (
    <header className="header">
      <div>
        <p className="eyebrow">{date}</p>
        <h1>Good day.</h1>
        <p className="subtitle">Make a little progress today.</p>
      </div>
      <button className="icon-button" type="button" aria-label="Open settings" onClick={onSettings}>
        <Settings size={21} />
      </button>
      <div className="date-mark" aria-hidden="true"><CalendarDays size={16} /></div>
    </header>
  )
}
