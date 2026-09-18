export const TASK_STORAGE_KEY = 'simple-todo-list-v1'

export function createTask(title) {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `task-${Date.now()}-${Math.random()}`,
    title: title.trim().slice(0, 200),
    completed: false,
    createdAt: new Date().toISOString(),
  }
}

export function normalizeTasks(value) {
  if (!Array.isArray(value)) throw new Error('Invalid saved list')
  return value
    .filter((task) => task && typeof task.title === 'string' && task.title.trim() && typeof task.completed === 'boolean')
    .map((task) => ({
      id: typeof task.id === 'string' ? task.id : createTask(task.title).id,
      title: task.title.trim().slice(0, 200),
      completed: task.completed,
      createdAt: task.createdAt ?? new Date().toISOString(),
    }))
}
