import { Pencil, RotateCcw, Trash2, X } from 'lucide-react'

export default function BottomSheet({ task, onClose, onEdit, onToggle, onDelete }) {
  if (!task) return null
  return <div className="overlay sheet-overlay" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <section className="bottom-sheet" role="dialog" aria-modal="true" aria-label={`Actions for ${task.title}`}>
      <div className="grabber" />
      <div className="sheet-title"><div><span>Task options</span><strong>{task.title}</strong></div><button type="button" className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button></div>
      <button type="button" onClick={onEdit}><Pencil size={20} /><span>Edit task</span></button>
      {task.completed && <button type="button" onClick={onToggle}><RotateCcw size={20} /><span>Mark as active</span></button>}
      <button type="button" className="danger" onClick={onDelete}><Trash2 size={20} /><span>Delete task</span></button>
    </section>
  </div>
}
