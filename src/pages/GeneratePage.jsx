import { useContext } from 'react'
import Generator from '../components/Generator'
import { StoreContext } from '../state/store'

export default function GeneratePage() {
  const { template, content } = useContext(StoreContext)
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Generate Letter</h2>
      <Generator template={template} contentHtml={content} />
    </div>
  )
}
