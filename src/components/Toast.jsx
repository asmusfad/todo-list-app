import { AlertCircle } from 'lucide-react'
export default function Toast({ message }) {
  return message ? <div className="toast" role="status"><AlertCircle size={18} />{message}</div> : null
}
