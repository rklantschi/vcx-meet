'use client'

import { useEffect, useState } from 'react'
import type { CaptionLine, TranslationStrings } from '@/types/meet'

interface CaptionsOverlayProps {
  lines: CaptionLine[]
  isEnabled: boolean
  t: TranslationStrings
}

export function CaptionsOverlay({ lines, isEnabled, t }: CaptionsOverlayProps) {
  const [displayLines, setDisplayLines] = useState<CaptionLine[]>([])

  useEffect(() => {
    if (!isEnabled || lines.length === 0) {
      setDisplayLines([])
      return
    }

    // Show the last 2-3 lines
    setDisplayLines(lines.slice(-3))

    // Auto-fade old lines after 6 seconds
    const timeout = setTimeout(() => {
      setDisplayLines([])
    }, 6000)

    return () => clearTimeout(timeout)
  }, [lines, isEnabled])

  if (!isEnabled || displayLines.length === 0) {
    return null
  }

  return (
    <div className="absolute bottom-20 left-0 right-0 mx-auto w-full max-w-2xl px-4 z-40">
      <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
        {displayLines.map((line) => (
          <div key={line.id} className="mb-2 last:mb-0">
            <p className="text-xs font-semibold text-slate-400">{line.speakerName}</p>
            <p className="text-sm text-white leading-relaxed">{line.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
