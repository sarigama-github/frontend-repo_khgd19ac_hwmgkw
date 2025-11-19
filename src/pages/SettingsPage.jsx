import { useContext } from 'react'
import Settings from '../components/Settings'
import { StoreContext } from '../state/store'

export default function SettingsPage() {
  const { template, setTemplate } = useContext(StoreContext)
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Settings</h2>
      <Settings onUpdate={setTemplate} initial={template} />
    </div>
  )
}
