import { CalendarDays, CheckCircle2, ListTodo } from 'lucide-react'

const items = [{ id: 'today', label: 'Today', Icon: CalendarDays }, { id: 'tasks', label: 'Tasks', Icon: ListTodo }, { id: 'completed', label: 'Completed', Icon: CheckCircle2 }]
export default function BottomNavigation({ current, onChange }) {
  return <nav className="bottom-nav" aria-label="Main navigation">{items.map(({ id, label, Icon }) => <button type="button" key={id} className={current === id ? 'selected' : ''} aria-current={current === id ? 'page' : undefined} onClick={() => onChange(id)}><Icon size={21} /><span>{label}</span></button>)}</nav>
}
