import { useEffect, useState } from 'react'

export function useLocalStorage(key, fallback, validate = (value) => value) {
  const [initial] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return { value: saved === null ? fallback : validate(JSON.parse(saved)), error: '' }
    } catch {
      return { value: fallback, error: 'Saved data could not be loaded in this browser.' }
    }
  })
  const [storageError, setStorageError] = useState(initial.error)
  const [value, setValue] = useState(initial.value)

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      setStorageError('')
    } catch {
      setStorageError('Changes cannot be saved in this browser. Keep this page open to retain them.')
    }
  }, [key, value])

  return [value, setValue, storageError]
}
