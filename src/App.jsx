import { useMemo, useState } from 'react'
import AddTaskForm from './components/AddTaskForm.jsx'
import BottomNavigation from './components/BottomNavigation.jsx'
import BottomSheet from './components/BottomSheet.jsx'
import EmptyState from './components/EmptyState.jsx'
import FilterButtons from './components/FilterButtons.jsx'
import Header from './components/Header.jsx'
import Modal from './components/Modal.jsx'
import SearchBar from './components/SearchBar.jsx'
import SettingsSheet from './components/SettingsSheet.jsx'
import TaskList from './components/TaskList.jsx'
import Toast from './components/Toast.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { useTheme } from './hooks/useTheme.js'
import { createTask, normalizeTasks, TASK_STORAGE_KEY } from './utils/tasks.js'

export default function App() {
  const [tasks, setTasks, storageError] = useLocalStorage(TASK_STORAGE_KEY, [], normalizeTasks)
  const [theme, setTheme] = useTheme()
  const [section, setSection] = useState('today')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const today = useMemo(() => new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()), [])
  const activeCount = tasks.filter((task) => !task.completed).length
  const completedCount = tasks.length - activeCount
  const effectiveFilter = section === 'completed' ? 'completed' : filter
  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesFilter = effectiveFilter === 'all' || (effectiveFilter === 'active' ? !task.completed : task.completed)
    return matchesFilter && task.title.toLowerCase().includes(search.trim().toLowerCase())
  }), [tasks, effectiveFilter, search])

  const toggle = (id) => setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task))
  const remove = (id) => setTasks((current) => current.filter((task) => task.id !== id))
  const navigate = (next) => { setSection(next); setFilter(next === 'tasks' ? 'all' : next === 'completed' ? 'completed' : 'active'); setSearch('') }
  return <div className="page-shell">
    <main className="app-shell">
      <div className="scroll-content">
        <Header date={today} onSettings={() => setSettingsOpen(true)} />
        <section className="progress-card" aria-label={`${activeCount} tasks remaining`}><div><span>{activeCount ? 'Keep moving' : 'All caught up'}</span><strong>{activeCount} {activeCount === 1 ? 'task' : 'tasks'} left</strong></div><div className="progress-ring" style={{ '--progress': tasks.length ? `${completedCount / tasks.length * 360}deg` : '360deg' }}><span>{tasks.length ? Math.round(completedCount / tasks.length * 100) : 100}%</span></div></section>
        <AddTaskForm onAdd={(title) => { setTasks((current) => [createTask(title), ...current]); setSection('today'); setFilter('active') }} />
        <div className="list-heading"><div><p className="eyebrow">Your list</p><h2>{section === 'completed' ? 'Completed' : section === 'tasks' ? 'All tasks' : 'Today'}</h2></div><span>{visibleTasks.length}</span></div>
        <SearchBar value={search} onChange={setSearch} />
        {section !== 'completed' && <FilterButtons value={filter} onChange={setFilter} />}
        {visibleTasks.length ? <TaskList tasks={visibleTasks} onToggle={toggle} onActions={setSelected} /> : <EmptyState search={search} section={section} />}
      </div>
      <BottomNavigation current={section} onChange={navigate} />
    </main>
    <BottomSheet task={selected} onClose={() => setSelected(null)} onEdit={() => { setEditing(selected); setSelected(null) }} onToggle={() => { toggle(selected.id); setSelected(null) }} onDelete={() => { setDeleting(selected); setSelected(null) }} />
    {editing && <EditModal task={editing} onClose={() => setEditing(null)} onSave={(title) => { setTasks((current) => current.map((task) => task.id === editing.id ? { ...task, title } : task)); setEditing(null) }} />}
    {deleting && <Modal title="Delete this task?" onClose={() => setDeleting(null)}><p className="modal-copy">“{deleting.title}” will be permanently removed.</p><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setDeleting(null)}>Cancel</button><button type="button" className="danger-button" onClick={() => { remove(deleting.id); setDeleting(null) }}>Delete</button></div></Modal>}
    <SettingsSheet open={settingsOpen} theme={theme} onTheme={setTheme} completedCount={completedCount} onClose={() => setSettingsOpen(false)} onClear={() => { setTasks((current) => current.filter((task) => !task.completed)); setSettingsOpen(false) }} />
    <Toast message={storageError} />
  </div>
}

function EditModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task.title)
  return <Modal title="Edit task" onClose={onClose}><form onSubmit={(e) => { e.preventDefault(); if (title.trim()) onSave(title.trim().slice(0, 200)) }}><label className="field-label" htmlFor="edit-task">Task name</label><input className="modal-input" id="edit-task" autoFocus value={title} maxLength="200" onChange={(e) => setTitle(e.target.value)} /><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button" disabled={!title.trim()}>Save changes</button></div></form></Modal>
}
