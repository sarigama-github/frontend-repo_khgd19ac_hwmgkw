import { useEffect, useRef, useState } from 'react'

export default function Settings({ onUpdate }) {
  const [header, setHeader] = useState(null)
  const [footer, setFooter] = useState(null)
  const [watermark, setWatermark] = useState(null)
  const headerRef = useRef(null)
  const footerRef = useRef(null)
  const watermarkRef = useRef(null)

  useEffect(() => {
    onUpdate?.({ header, footer, watermark })
  }, [header, footer, watermark, onUpdate])

  const handleFile = async (file, setter) => {
    if (!file) return
    const isPdf = file.type === 'application/pdf'
    if (isPdf) {
      const arrayBuffer = await file.arrayBuffer()
      setter({ type: 'pdf', data: arrayBuffer, name: file.name })
    } else {
      const reader = new FileReader()
      reader.onload = () => setter({ type: 'image', data: reader.result, name: file.name })
      reader.readAsDataURL(file)
    }
  }

  const resetAll = () => {
    setHeader(null); setFooter(null); setWatermark(null)
    if (headerRef.current) headerRef.current.value = ''
    if (footerRef.current) footerRef.current.value = ''
    if (watermarkRef.current) watermarkRef.current.value = ''
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-blue-100 mb-2">Header (PNG/JPG/PDF)</label>
          <input ref={headerRef} type="file" accept="image/*,application/pdf" onChange={(e) => handleFile(e.target.files?.[0], setHeader)} className="w-full text-blue-100" />
          {header?.type === 'image' && (
            <img src={header.data} alt="Header" className="mt-3 rounded border border-blue-500/20" />
          )}
        </div>
        <div>
          <label className="block text-blue-100 mb-2">Footer (PNG/JPG/PDF)</label>
          <input ref={footerRef} type="file" accept="image/*,application/pdf" onChange={(e) => handleFile(e.target.files?.[0], setFooter)} className="w-full text-blue-100" />
          {footer?.type === 'image' && (
            <img src={footer.data} alt="Footer" className="mt-3 rounded border border-blue-500/20" />
          )}
        </div>
        <div>
          <label className="block text-blue-100 mb-2">Watermark (PNG/JPG)</label>
          <input ref={watermarkRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0], setWatermark)} className="w-full text-blue-100" />
          {watermark?.type === 'image' && (
            <img src={watermark.data} alt="Watermark" className="mt-3 rounded border border-blue-500/20 max-h-48 object-contain" />
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={resetAll} className="px-4 py-2 rounded-lg bg-slate-700 text-blue-100 hover:bg-slate-600 transition">Reset</button>
      </div>

      <div className="text-sm text-blue-200/70">
        Files stay in your browser memory. Reloading the page clears them.
      </div>
    </div>
  )
}
