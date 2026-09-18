import TaskCard from './TaskCard.jsx'

export default function TaskList({ tasks, onToggle, onActions }) {
  return <ul className="task-list" aria-label="Tasks">{tasks.map((task) => <TaskCard key={task.id} task={task} onToggle={onToggle} onActions={onActions} />)}</ul>
}
