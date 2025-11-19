import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

// A4 size in points
const A4_WIDTH = 595.28
const A4_HEIGHT = 841.89

export default function Generator({ template, contentHtml }) {
  const generate = async () => {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])

    // White background
    page.drawRectangle({ x: 0, y: 0, width: A4_WIDTH, height: A4_HEIGHT, color: rgb(1,1,1) })

    // Helper to embed image from data URL
    const embedImage = async (dataUrl) => {
      if (!dataUrl) return null
      const bytes = await fetch(dataUrl).then(r => r.arrayBuffer())
      // Try png first then jpg
      try { return await pdfDoc.embedPng(bytes) } catch {}
      try { return await pdfDoc.embedJpg(bytes) } catch {}
      return null
    }

    // Header
    if (template?.header?.type === 'image') {
      const img = await embedImage(template.header.data)
      if (img) {
        const imgWidth = A4_WIDTH - 72 // 1 inch margins total left+right
        const scale = imgWidth / img.width
        const imgHeight = img.height * scale
        page.drawImage(img, { x: 36, y: A4_HEIGHT - 36 - imgHeight, width: imgWidth, height: imgHeight })
      }
    }

    // Footer
    if (template?.footer?.type === 'image') {
      const img = await embedImage(template.footer.data)
      if (img) {
        const imgWidth = A4_WIDTH - 72
        const scale = imgWidth / img.width
        const imgHeight = img.height * scale
        page.drawImage(img, { x: 36, y: 36, width: imgWidth, height: imgHeight })
      }
    }

    // Watermark centered with low opacity
    if (template?.watermark?.type === 'image') {
      const img = await embedImage(template.watermark.data)
      if (img) {
        const targetWidth = A4_WIDTH * 0.6
        const scale = targetWidth / img.width
        const targetHeight = img.height * scale
        const x = (A4_WIDTH - targetWidth) / 2
        const y = (A4_HEIGHT - targetHeight) / 2
        page.drawImage(img, { x, y, width: targetWidth, height: targetHeight, opacity: 0.15 })
      }
    }

    // Render text content (basic): convert HTML -> plain text and draw with wrapping
    const plain = contentHtml
      ? new DOMParser().parseFromString(contentHtml, 'text/html').body.innerText
      : ''

    const left = 54, right = A4_WIDTH - 54, top = A4_HEIGHT - 140, bottom = 120
    const maxWidth = right - left

    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const fontSize = 12
    let x = left
    let y = top

    const paragraphs = plain.split(/\n\s*\n/)
    const lineHeight = fontSize * 1.3

    const wrapText = (text) => {
      const words = text.split(/\s+/)
      let line = ''
      const lines = []
      for (const w of words) {
        const test = line ? line + ' ' + w : w
        const width = font.widthOfTextAtSize(test, fontSize)
        if (width > maxWidth && line) {
          lines.push(line)
          line = w
        } else {
          line = test
        }
      }
      if (line) lines.push(line)
      return lines
    }

    for (const p of paragraphs) {
      const lines = wrapText(p.trim())
      for (const l of lines) {
        if (y - lineHeight < bottom) {
          // new page
          y = top
          const np = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
          // draw watermark again on new pages if present
          if (template?.watermark?.type === 'image') {
            const img = await embedImage(template.watermark.data)
            if (img) {
              const targetWidth = A4_WIDTH * 0.6
              const scale = targetWidth / img.width
              const targetHeight = img.height * scale
              const xW = (A4_WIDTH - targetWidth) / 2
              const yW = (A4_HEIGHT - targetHeight) / 2
              np.drawImage(img, { x: xW, y: yW, width: targetWidth, height: targetHeight, opacity: 0.15 })
            }
          }
          // switch page reference
          page = np
        }
        page.drawText(l, { x, y, size: fontSize, font, color: rgb(0,0,0) })
        y -= lineHeight
      }
      y -= lineHeight
    }

    const bytes = await pdfDoc.save()
    const blob = new Blob([bytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'letter.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-3">
      <button onClick={generate} className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">Generate PDF</button>
      <p className="text-sm text-blue-200/70">A4 size with 1-inch margins. Header and footer stretch across; watermark centered.</p>
    </div>
  )
}
