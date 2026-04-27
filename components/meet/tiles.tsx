'use client'

import { Mic, MicOff, Phone } from 'lucide-react'
import type { ParticipantTile, LocalParticipant } from '@/types/meet'

// Shared type for tiles that can render either local or remote participants
type TileParticipant = ParticipantTile | LocalParticipant

interface VideoTileProps {
  participant: ParticipantTile
  isLocal?: boolean
}

export function VideoTile({ participant, isLocal = false }: VideoTileProps) {
  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden group animate-in fade-in scale-in duration-300">
      {/* Video placeholder */}
      <div className="w-full h-full bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          {participant.avatar ? (
            <img src={participant.avatar} alt={participant.displayName} className="w-16 h-16 rounded-full mx-auto mb-2" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-2 flex items-center justify-center text-xl font-bold text-muted-foreground">
              {participant.displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <p className="text-sm text-white font-medium">{participant.displayName}</p>
        </div>
      </div>

      {/* Display name overlay */}
      <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white font-medium flex items-center gap-1">
        <span>{participant.displayName}</span>
        {participant.isInitiator && <span className="text-amber-400">•</span>}
      </div>

      {/* Mic indicator */}
      {!participant.micOn && (
        <div className="absolute bottom-2 right-2 bg-black/60 p-1.5 rounded-full">
          <MicOff className="w-4 h-4 text-red-500" />
        </div>
      )}

      {/* Speaking indicator - animated border pulse */}
      {participant.isSpeaking && (
        <>
          <div className="absolute inset-0 rounded-lg pointer-events-none">
            <div className="absolute inset-0 border-2 border-emerald-400 rounded-lg animate-pulse" />
            <div className="absolute inset-1 border border-emerald-400/50 rounded-lg" />
          </div>
        </>
      )}

      {/* Connection quality dot */}
      <div 
        className="absolute bottom-2 right-2 w-2 h-2 rounded-full"
        style={{
          backgroundColor: 
            participant.connectionQuality === 'excellent' ? '#10b981' :
            participant.connectionQuality === 'good' ? '#3b82f6' :
            participant.connectionQuality === 'fair' ? '#f59e0b' :
            '#ef4444'
        }}
        title={`Connection: ${participant.connectionQuality}`}
      />

      {/* Dual presence badge */}
      {participant.isOnPstn && (
        <div className="absolute top-2 right-2 bg-slate-600/80 px-2 py-1 rounded text-xs text-white font-medium flex items-center gap-1">
          <Phone className="w-3 h-3" />
          PSTN
        </div>
      )}
    </div>
  )
}

interface AudioTileProps {
  participant: ParticipantTile
}

export function AudioTile({ participant }: AudioTileProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden flex flex-col items-center justify-center gap-4 p-4 animate-in fade-in scale-in duration-300">
      {/* Avatar */}
      {participant.avatar ? (
        <img src={participant.avatar} alt={participant.displayName} className="w-20 h-20 rounded-full" />
      ) : (
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
          {participant.displayName.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Display name */}
      <div className="text-center">
        <p className="text-sm text-white font-medium">{participant.displayName}</p>
        {participant.isInitiator && <p className="text-xs text-amber-400">Initiator</p>}
      </div>

      {/* Speaking indicator with animation */}
      {participant.isSpeaking && (
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

      {/* Mic status */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {participant.micOn ? (
          <>
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Mic on</span>
          </>
        ) : (
          <>
            <MicOff className="w-3 h-3 text-red-500" />
            <span>Mic off</span>
          </>
        )}
      </div>
    </div>
  )
}

interface SelfPIPProps {
  participant: TileParticipant
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  onDragStart?: (e: React.MouseEvent) => void
}

export function SelfPIP({ participant, position = 'bottom-right', onDragStart }: SelfPIPProps) {
  const positionClass = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  }[position]

  return (
    <div 
      className={`absolute ${positionClass} w-24 h-24 rounded-lg overflow-hidden shadow-lg cursor-move hover:shadow-xl transition-shadow`} 
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
