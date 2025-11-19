import { createContext, useMemo, useState } from 'react'

export const StoreContext = createContext({})

export function StoreProvider({ children }) {
  const [template, setTemplate] = useState({ header: null, footer: null, watermark: null })
  const [content, setContent] = useState('')

  const value = useMemo(() => ({ template, setTemplate, content, setContent }), [template, content])
  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  )
}
