'use client'

import { useState } from 'react'
import { VideoTile, AudioTile, SelfPIP } from './tiles'
import type { LocalParticipant, ParticipantTile } from '@/types/meet'

interface CanvasProps {
  localParticipant: LocalParticipant
  participants: ParticipantTile[]
  isAudioOnly?: boolean
  recordingActive?: boolean
  captionsEnabled?: boolean
  remoteScreenShare?: (ParticipantTile | LocalParticipant) | null
}

export function Canvas({
  localParticipant,
  participants,
  isAudioOnly = false,
  recordingActive = false,
  captionsEnabled = false,
  remoteScreenShare = null,
}: CanvasProps) {
  const [pipPosition, setPipPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right')

  const allParticipants = [localParticipant, ...participants]
  const participantCount = allParticipants.length
  const hasLocalScreenShare = localParticipant.sharingScreen

  // Determine grid layout based on participant count
  const getGridLayout = (count: number) => {
    if (count === 1) return { cols: 1, rows: 1 }
    if (count === 2) return { cols: 2, rows: 1 }
    if (count <= 4) return { cols: 2, rows: 2 }
    if (count <= 6) return { cols: 3, rows: 2 }
    if (count <= 9) return { cols: 3, rows: 3 }
    if (count <= 16) return { cols: 4, rows: 4 }
    return { cols: 5, rows: 4 }
  }

  const layout = getGridLayout(participantCount)

  // For 1:1 calls, show big tile + PIP
  const is1to1 = participantCount === 2
  const remoteTile = participants[0]

  // Filter out screen share participants from regular grid
  const regularParticipants = allParticipants.filter((p) => !p.sharingScreen)

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Screen share banner */}
      {hasLocalScreenShare && (
        <div className="absolute top-0 left-0 right-0 bg-red-600 text-white px-4 py-2 flex items-center justify-between text-sm font-medium z-50">
          <span>You&apos;re sharing your screen</span>
          <button className="hover:opacity-80 transition-opacity">Stop sharing</button>
        </div>
      )}

      {/* Recording + captions + connection quality indicators */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-40">
        {recordingActive && (
          <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full animate-pulse">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-white font-medium">Recording</span>
          </div>
        )}
        {captionsEnabled && (
          <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded-full">
            <span className="text-xs text-white font-medium">CC</span>
          </div>
        )}
        {/* Connection quality */}
        <div className="w-2 h-2 rounded-full bg-green-500" title="Connection quality: good" />
      </div>

      {/* Screen share layout - full size screen with tiles on side */}
      {remoteScreenShare && (
        <div className="w-full h-full flex gap-1 p-1">
          {/* Screen share content - main area */}
          <div className="flex-1 bg-slate-900 rounded-lg flex items-center justify-center relative">
            <div className="text-center">
              <div className="text-white font-medium mb-2">{remoteScreenShare.displayName} is sharing</div>
              <div className="w-48 h-32 bg-slate-800 rounded flex items-center justify-center text-slate-600">
                [Screen Content]
              </div>
            </div>
          </div>

          {/* Participant tiles strip */}
          <div className="w-24 flex flex-col gap-1 overflow-auto">
            {regularParticipants.map((participant) => (
              <div key={participant.id} className="w-full h-20 flex-shrink-0">
                {isAudioOnly || !participant.hasVideoTrack ? (
                  <AudioTile participant={participant} />
                ) : (
                  <VideoTile participant={participant} isLocal={participant.id === localParticipant.id} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1:1 layout */}
      {!remoteScreenShare && is1to1 && remoteTile && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full h-full">
            {isAudioOnly || !remoteTile.hasVideoTrack ? (
              <AudioTile participant={remoteTile} />
            ) : (
              <VideoTile participant={remoteTile} />
            )}
          </div>
          <SelfPIP participant={localParticipant} position={pipPosition} />
        </div>
      )}

      {/* Grid layout for groups */}
      {!remoteScreenShare && !is1to1 && (
        <div
          className="w-full h-full grid gap-1 p-1"
          style={{
            gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
            gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
          }}
        >
          {regularParticipants.map((participant) => (
            <div key={participant.id} className="w-full h-full min-h-0">
              {isAudioOnly || !participant.hasVideoTrack ? (
                <AudioTile participant={participant} />
              ) : (
                <VideoTile participant={participant} isLocal={participant.id === localParticipant.id} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {participantCount === 0 && !remoteScreenShare && (
        <div className="w-full h-full flex items-center justify-center flex-col gap-4">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-4xl font-bold text-muted-foreground">
            {localParticipant.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">{localParticipant.displayName}</p>
            <p className="text-sm text-muted-foreground">Waiting for other participants...</p>
          </div>
        </div>
      )}
    </div>
  )
}
