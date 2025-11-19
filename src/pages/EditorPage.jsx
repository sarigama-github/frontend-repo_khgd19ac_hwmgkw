import { useContext } from 'react'
import Editor from '../components/Editor'
import { StoreContext } from '../state/store'

export default function EditorPage() {
  const { content, setContent } = useContext(StoreContext)
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Letter Editor</h2>
      <Editor value={content} onChange={setContent} />
    </div>
  )
}
