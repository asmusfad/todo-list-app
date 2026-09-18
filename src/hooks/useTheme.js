import { useEffect, useState } from 'react'

const KEY = 'daylist-theme'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(KEY)
      if (saved === 'light' || saved === 'dark') return saved
    } catch {
      // Private browsing can make storage unavailable; the system theme still works.
    }
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111214' : '#f4f5f7')
    try {
      localStorage.setItem(KEY, theme)
    } catch {
      // Theme selection remains active for this session when storage is unavailable.
    }
  }, [theme])

  return [theme, setTheme]
}
