'use client'

import { useEffect, useState } from 'react'
import type { CaptionLine, TranslationStrings } from '@/types/meet'

interface CaptionsOverlayProps {
  lines: CaptionLine[]
  isEnabled: boolean
  t: TranslationStrings
}

interface DisplayLine {
  id: string
  speakerName: string
  text: string
  isFading: boolean
}

export function CaptionsOverlay({ lines, isEnabled, t }: CaptionsOverlayProps) {
  const [displayLines, setDisplayLines] = useState<DisplayLine[]>([])

  useEffect(() => {
    if (!isEnabled || lines.length === 0) {
      setDisplayLines([])
      return
    }

    // Show the last 3 lines
    const recentLines = lines.slice(-3)
    
    setDisplayLines(
      recentLines.map((line) => ({
        id: line.id,
        speakerName: line.speakerName,
        text: line.text,
        isFading: false,
      }))
    )

    // Schedule fade-out after 6 seconds
    const timers: NodeJS.Timeout[] = []
    
    recentLines.forEach((line) => {
      const timer = setTimeout(() => {
        setDisplayLines((prev) =>
          prev.map((l) =>
            l.id === line.id ? { ...l, isFading: true } : l
          )
        )
      }, 6000)
      timers.push(timer)
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [lines, isEnabled])

  if (!isEnabled || displayLines.length === 0) {
    return null
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 flex justify-center px-2 sm:px-4 pointer-events-none pb-20 sm:pb-24">
      <div className="max-w-sm sm:max-w-3xl w-full">
        <div className="bg-black/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-xs sm:text-sm leading-relaxed space-y-1">
          {displayLines.map((line) => (
            <div
              key={line.id}
              className={`transition-opacity duration-500 ${line.isFading ? 'opacity-0' : 'opacity-100'}`}
            >
              <span className="font-semibold text-amber-300">{line.speakerName}:</span>{' '}
              <span className="font-normal">{line.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
