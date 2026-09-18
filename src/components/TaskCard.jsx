import { Check, MoreHorizontal } from 'lucide-react'

export default function TaskCard({ task, onToggle, onActions }) {
  return (
    <li className={`task-card ${task.completed ? 'completed' : ''}`}>
      <button className="check-button" type="button" onClick={() => onToggle(task.id)} aria-label={`${task.completed ? 'Mark active' : 'Complete'}: ${task.title}`} aria-pressed={task.completed}>
        {task.completed && <Check size={17} strokeWidth={3} />}
      </button>
      <button className="task-title" type="button" onClick={() => onToggle(task.id)}>{task.title}</button>
      <button className="more-button" type="button" onClick={() => onActions(task)} aria-label={`Actions for ${task.title}`}><MoreHorizontal size={21} /></button>
    </li>
  )
}
