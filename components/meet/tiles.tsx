'use client'

import { useState } from 'react'
import { Mic, MicOff, Phone, RotateCcw } from 'lucide-react'
import type { ParticipantTile, LocalParticipant } from '@/types/meet'

// Shared type for tiles that can render either local or remote participants
type TileParticipant = ParticipantTile | LocalParticipant

interface VideoTileProps {
  participant: ParticipantTile
  isLocal?: boolean
  allowRotate?: boolean
  isPinned?: boolean
  isSpeaking?: boolean
  compact?: boolean
  onClick?: () => void
}

export function VideoTile({ participant, isLocal = false, allowRotate = false, isPinned = false, isSpeaking = false, compact = false, onClick }: VideoTileProps) {
  const [isPortrait, setIsPortrait] = useState(false)

  return (
    <div
      className={`relative bg-black rounded-lg overflow-hidden group animate-in fade-in scale-in duration-300 transition-all cursor-pointer ${
        allowRotate && isPortrait ? 'w-auto h-full aspect-[9/16] mx-auto' : 'w-full h-full'
      } ${isSpeaking ? 'ring-2 ring-emerald-400' : ''} ${isPinned ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
      title={compact ? participant.displayName : undefined}
    >
      {/* Video placeholder */}
      <div className="w-full h-full bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          {participant.avatar ? (
            <img src={participant.avatar} alt={participant.displayName} className={`rounded-full mx-auto ${compact ? 'w-8 h-8' : 'w-16 h-16 mb-2'}`} />
          ) : (
            <div className={`rounded-full bg-muted mx-auto flex items-center justify-center font-bold text-muted-foreground ${compact ? 'w-8 h-8 text-sm' : 'w-16 h-16 mb-2 text-xl'}`}>
              {participant.displayName.charAt(0).toUpperCase()}
            </div>
          )}
          {!compact && <p className="text-sm text-white font-medium">{participant.displayName}</p>}
        </div>
      </div>

      {/* Display name overlay */}
      {compact ? (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-1.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-xs font-medium truncate">{participant.displayName}</p>
        </div>
      ) : (
        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          {participant.isInitiator && <span className="text-amber-400 text-xs">•</span>}
        </div>
      )}

      {/* Mic indicator */}
      {!participant.micOn && (
        <div className="absolute bottom-2 right-2 bg-black/60 p-1.5 rounded-full">
          <MicOff className="w-4 h-4 text-red-500" />
        </div>
      )}

      {/* Connection quality dot */}
      <div 
        className="absolute bottom-2 left-2 w-2 h-2 rounded-full"
        style={{
          backgroundColor: 
            participant.connectionQuality === 'excellent' ? '#10b981' :
            participant.connectionQuality === 'good' ? '#3b82f6' :
            participant.connectionQuality === 'fair' ? '#f59e0b' :
            '#ef4444'
        }}
        title={`Connection: ${participant.connectionQuality}`}
      />

      {/* Top-right badges area - stack vertically */}
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        {/* Dual presence badge */}
        {participant.isOnPstn && (
          <div className="bg-slate-600/80 px-2 py-1 rounded text-xs text-white font-medium flex items-center gap-1">
            <Phone className="w-3 h-3" />
            PSTN
          </div>
        )}
      </div>

      {/* Rotate button (desktop only) */}
      {allowRotate && (
        <button
          onClick={() => setIsPortrait(p => !p)}
          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 p-1.5 rounded-full"
          title={isPortrait ? 'Switch to landscape' : 'Switch to portrait'}
        >
          <RotateCcw className={`w-3.5 h-3.5 text-white transition-transform ${isPortrait ? 'rotate-90' : ''}`} />
        </button>
      )}
    </div>
  )
}

interface AudioTileProps {
  participant: ParticipantTile
  allowRotate?: boolean
  isPinned?: boolean
  isSpeaking?: boolean
  compact?: boolean
  onClick?: () => void
}

export function AudioTile({ participant, allowRotate = false, isPinned = false, isSpeaking = false, compact = false, onClick }: AudioTileProps) {
  const [isPortrait, setIsPortrait] = useState(false)

  return (
    <div
      className={`relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden flex flex-col items-center justify-center animate-in fade-in scale-in duration-300 transition-all group border cursor-pointer ${
        compact ? 'gap-1 p-1' : 'gap-3 p-4'
      } ${allowRotate && isPortrait ? 'w-auto h-full aspect-[9/16] mx-auto' : 'w-full h-full'
      } ${isSpeaking ? 'border-emerald-400 ring-2 ring-emerald-400' : 'border-slate-700/50'} ${isPinned ? 'border-primary ring-2 ring-primary' : ''}`}
      onClick={onClick}
      title={compact ? participant.displayName : undefined}
    >
      {/* Audio-only badge - only in non-compact */}
      {!compact && (
        <div className="absolute top-2 right-2 bg-slate-700/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs text-slate-100 border border-slate-600/50">
          <Mic className="w-3 h-3" />
          <span className="font-medium">Audio only</span>
        </div>
      )}

      {/* Rotate button - top left */}
      {allowRotate && (
        <button
          onClick={() => setIsPortrait(p => !p)}
          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 p-1.5 rounded-full"
          title={isPortrait ? 'Switch to landscape' : 'Switch to portrait'}
        >
          <RotateCcw className={`w-3.5 h-3.5 text-white transition-transform ${isPortrait ? 'rotate-90' : ''}`} />
        </button>
      )}

      {/* Avatar */}
      {participant.avatar ? (
        <img src={participant.avatar} alt={participant.displayName} className={`rounded-full border-2 border-slate-600/50 ${compact ? 'w-8 h-8' : 'w-20 h-20'}`} />
      ) : (
        <div className={`rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center font-bold text-slate-300 border-2 border-slate-600/50 ${compact ? 'w-8 h-8 text-sm' : 'w-20 h-20 text-2xl'}`}>
          {participant.displayName.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Display name */}
      {compact ? (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-1.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-xs font-medium truncate">{participant.displayName}</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm text-slate-100 font-medium">{participant.displayName}</p>
          {participant.isInitiator && <p className="text-xs text-amber-400 mt-0.5">Initiator</p>}
        </div>
      )}

      {/* Speaking indicator with animation - only in non-compact */}
      {!compact && participant.isSpeaking && (
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}

      {/* Mic status - only in non-compact */}
      {!compact && (
        <div className="flex items-center gap-1 text-xs text-slate-300">
          {participant.micOn ? (
            <>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Mic on</span>
            </>
          ) : (
            <>
              <MicOff className="w-3 h-3 text-red-500" />
              <span>Mic off</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}

interface SelfPIPProps {
  participant: TileParticipant
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  onDragStart?: (e: React.MouseEvent) => void
  isLandscape?: boolean
}

export function SelfPIP({ participant, position = 'bottom-right', onDragStart, isLandscape = false }: SelfPIPProps) {
  const positionClass = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  }[position]

  // In landscape mobile, PIP is wider (16:9) instead of square
  const sizeClass = isLandscape ? 'w-36 h-20' : 'w-24 h-24'

  return (
    <div 
      className={`absolute ${positionClass} ${sizeClass} rounded-lg overflow-hidden shadow-lg cursor-move hover:shadow-xl transition-all duration-300`} 
      onMouseDown={onDragStart}
    >
      <div className="w-full h-full bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
        {participant.avatar ? (
          <img src={participant.avatar} alt={participant.displayName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground bg-muted">
            {participant.displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Speaking indicator */}
      {participant.isSpeaking && (
        <div className="absolute inset-0 border-2 border-emerald-400 rounded-lg animate-pulse" />
      )}

      {/* Mic indicator */}
      {!participant.micOn && (
        <div className="absolute bottom-1 right-1 bg-black/60 p-1 rounded-full">
          <MicOff className="w-3 h-3 text-red-500" />
        </div>
      )}
    </div>
  )
}
