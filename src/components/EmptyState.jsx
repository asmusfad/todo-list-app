import { CheckCircle2, SearchX } from 'lucide-react'

export default function EmptyState({ search, section }) {
  const searched = Boolean(search)
  return <div className="empty-state">
    <div className="empty-icon">{searched ? <SearchX /> : <CheckCircle2 />}</div>
    <h2>{searched ? 'Nothing found' : section === 'completed' ? 'Nothing completed yet' : 'A clear day ahead'}</h2>
    <p>{searched ? 'Try another search or clear your filters.' : section === 'completed' ? 'Finished tasks will collect here.' : 'Add a task when something comes to mind.'}</p>
  </div>
}
