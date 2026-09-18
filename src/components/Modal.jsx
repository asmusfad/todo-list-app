import { X } from 'lucide-react'
import { useEffect } from 'react'

export default function Modal({ title, children, onClose }) {
  useEffect(() => {
    const close = (event) => event.key === 'Escape' && onClose()
    addEventListener('keydown', close)
    return () => removeEventListener('keydown', close)
  }, [onClose])
  return <div className="overlay" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-head"><h2 id="modal-title">{title}</h2><button type="button" className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button></div>
      {children}
    </section>
  </div>
}
