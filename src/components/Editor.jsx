import { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

export default function Editor({ value, onChange }) {
  const containerRef = useRef(null)
  const quillRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const editorEl = document.createElement('div')
    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(editorEl)

    const q = new Quill(editorEl, {
      theme: 'snow',
      modules: { toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link']
      ]}
    })

    if (value) q.root.innerHTML = value

    q.on('text-change', () => {
      onChange?.(q.root.innerHTML)
    })

    quillRef.current = q
    return () => { q.off('text-change'); q instanceof Quill && (quillRef.current = null) }
  }, [])

  useEffect(() => {
    if (quillRef.current && value !== undefined && quillRef.current.root.innerHTML !== value) {
      quillRef.current.root.innerHTML = value
    }
  }, [value])

  return <div className="bg-white rounded overflow-hidden"><div ref={containerRef} /></div>
}
