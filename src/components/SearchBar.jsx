import { Search, X } from 'lucide-react'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <Search size={18} aria-hidden="true" />
      <label className="sr-only" htmlFor="task-search">Search tasks</label>
      <input id="task-search" type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Search tasks" />
      {value && <button type="button" aria-label="Clear search" onClick={() => onChange('')}><X size={17} /></button>}
    </div>
  )
}
