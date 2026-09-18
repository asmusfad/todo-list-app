import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const submit = (event) => {
    event.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setTitle('')
  }
  return (
    <form className="add-form" onSubmit={submit}>
      <label className="sr-only" htmlFor="new-task">New task</label>
      <input id="new-task" value={title} onChange={(e) => setTitle(e.target.value)} maxLength="200" placeholder="What would you like to do?" autoComplete="off" />
      <button className="add-button" type="submit" aria-label="Add task" disabled={!title.trim()}><Plus size={22} /></button>
    </form>
  )
}
