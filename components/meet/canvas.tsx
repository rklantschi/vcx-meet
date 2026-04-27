'use client'

import { useState, useEffect } from 'react'
import { MicOff, Grid, Maximize2 } from 'lucide-react'
import { VideoTile, AudioTile, SelfPIP } from './tiles'
import type { LocalParticipant, ParticipantTile } from '@/types/meet'

interface CanvasProps {
  localParticipant: LocalParticipant
  participants: ParticipantTile[]
  isAudioOnly?: boolean
  recordingActive?: boolean
  captionsEnabled?: boolean
  remoteScreenShare: ParticipantTile | null
  screenShareSource: 'screen' | 'window' | null
  screenShareStream?: MediaStream
  meetingTitle?: string
}

export function Canvas({
  localParticipant,
  participants,
  isAudioOnly = false,
  recordingActive = false,
  captionsEnabled = false,
  remoteScreenShare = null,
  screenShareSource = null,
  screenShareStream,
  meetingTitle,
}: CanvasProps) {
  const [pipPosition, setPipPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right')
  const [isLandscape, setIsLandscape] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  // layoutMode: 'grid' | 'spotlight'
  // spotlightMode: 'follow' (auto-follows speaker) | 'pinned' (locked to one person)
  const [layoutMode, setLayoutMode] = useState<'grid' | 'spotlight'>('grid')
  const [spotlightMode, setSpotlightMode] = useState<'follow' | 'pinned'>('follow')
  const [pinnedParticipantId, setPinnedParticipantId] = useState<string | null>(null)

  useEffect(() => {
    const checkOrientation = () => {
      const landscape = window.innerWidth > window.innerHeight
      const mobile = window.innerWidth <= 768
      setIsLandscape(landscape)
      setIsMobile(mobile)
    }
    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)
    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [])

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

  // Clicking any tile toggles pin on that participant.
  // Pinning always switches to spotlight view.
  // Unpinning in spotlight stays in follow-speaker mode (does not exit spotlight).
  const handleTileClick = (participantId: string) => {
    if (pinnedParticipantId === participantId) {
      // Unpin — stay in spotlight, follow speaker
      setPinnedParticipantId(null)
      setSpotlightMode('follow')
    } else {
      // Pin this participant and enter spotlight
      setPinnedParticipantId(participantId)
      setSpotlightMode('pinned')
      setLayoutMode('spotlight')
    }
  }

  // Get the spotlighted participant (pinned or current speaker)
  const getSpotlightParticipant = () => {
    if (spotlightMode === 'pinned' && pinnedParticipantId) {
      return regularParticipants.find(p => p.id === pinnedParticipantId) || regularParticipants[0]
    }
    // Follow-speaker mode: find currently speaking participant
    const speaker = regularParticipants.find(p => p.isSpeaking)
    return speaker || regularParticipants[0]
  }

  const spotlightParticipant = layoutMode === 'spotlight' ? getSpotlightParticipant() : null
  const thumbnailParticipants = spotlightParticipant 
    ? regularParticipants.filter(p => p.id !== spotlightParticipant.id)
    : []

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Meeting title - only in grid mode */}
      {meetingTitle && layoutMode === 'grid' && !remoteScreenShare && (
        <div className="absolute top-4 left-4 text-white font-medium text-sm z-30 max-w-xs truncate">
          {meetingTitle}
        </div>
      )}

      {/* Screen share banner */}
      {hasLocalScreenShare && (
        <div className="absolute top-0 left-0 right-0 bg-red-600 text-white px-4 py-2 flex items-center justify-between text-sm font-medium z-50">
          <span>You&apos;re sharing {screenShareSource || 'your screen'}</span>
          <button className="hover:opacity-80 transition-opacity">Stop sharing</button>
        </div>
      )}

      {/* Recording + captions + connection quality + layout toggle */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-40">
        {/* Layout toggle (only show for 3+ participants) */}
        {participantCount >= 3 && !remoteScreenShare && (
          <button
            onClick={() => {
              if (layoutMode === 'grid') {
                setLayoutMode('spotlight')
                setSpotlightMode('follow')
                setPinnedParticipantId(null)
              } else {
                setLayoutMode('grid')
                setSpotlightMode('follow')
                setPinnedParticipantId(null)
              }
            }}
            className="flex items-center gap-1.5 bg-black/60 hover:bg-black/80 px-2.5 py-1.5 rounded-full transition-colors"
            title={layoutMode === 'grid' ? 'Switch to spotlight view' : 'Switch to grid view'}
          >
            {layoutMode === 'grid' ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-white" />
                <span className="text-xs text-white">Spotlight</span>
              </>
            ) : (
              <>
                <Grid className="w-3.5 h-3.5 text-white" />
                <span className="text-xs text-white">Grid</span>
              </>
            )}
          </button>
        )}
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
          <div className="flex-1 bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
            {screenShareStream ? (
              <video
                ref={(video) => {
                  if (video && screenShareStream) {
                    video.srcObject = screenShareStream
                    video.play().catch(() => {})
                  }
                }}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center">
                <div className="text-white font-medium mb-2">{remoteScreenShare.displayName} is sharing</div>
                <div className="text-sm text-slate-400">Screen content loading...</div>
              </div>
            )}
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
        <>
          {/* Mobile landscape: remote fills left, self video strip on right */}
          {isMobile && isLandscape ? (
            <div className="w-full h-full flex">
              <div className="flex-1 h-full">
                {isAudioOnly || !remoteTile.hasVideoTrack ? (
                  <AudioTile participant={remoteTile} />
                ) : (
                  <VideoTile participant={remoteTile} />
                )}
              </div>
              {/* Self as landscape sidebar */}
              <div className="w-32 h-full flex-shrink-0 border-l border-white/10">
                <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                  {localParticipant.avatar ? (
                    <img src={localParticipant.avatar} alt={localParticipant.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">
                      {localParticipant.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {!localParticipant.micOn && (
                    <div className="absolute bottom-1 right-1 bg-black/60 p-1 rounded-full">
                      <MicOff className="w-3 h-3 text-red-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Default: remote full screen + PIP */
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-full">
                {isAudioOnly || !remoteTile.hasVideoTrack ? (
                  <AudioTile participant={remoteTile} />
                ) : (
                  <VideoTile participant={remoteTile} allowRotate={!isMobile} />
                )}
              </div>
              <SelfPIP participant={localParticipant} position={pipPosition} isLandscape={isLandscape && !isMobile} />
            </div>
          )}
        </>
      )}

      {/* Grid layout for groups */}
      {!remoteScreenShare && !is1to1 && layoutMode === 'grid' && (
        <>
          {/* Mobile landscape: local PIP bottom-right, others in grid */}
          {isMobile && isLandscape ? (
            <div className="w-full h-full flex">
              <div
                className="flex-1 h-full grid gap-1 p-1"
                style={{
                  gridTemplateColumns: `repeat(${Math.max(layout.cols - 1, 1)}, 1fr)`,
                }}
              >
                {participants.map((participant) => (
                  <div key={participant.id} className="w-full h-full min-h-0">
                    {isAudioOnly || !participant.hasVideoTrack ? (
                      <AudioTile participant={participant} isSpeaking={participant.isSpeaking} onClick={() => handleTileClick(participant.id)} />
                    ) : (
                      <VideoTile participant={participant} isSpeaking={participant.isSpeaking} onClick={() => handleTileClick(participant.id)} />
                    )}
                  </div>
                ))}
              </div>
              {/* Self sidebar */}
              <div className="w-28 h-full flex-shrink-0 border-l border-white/10 bg-slate-900 flex items-center justify-center relative">
                {localParticipant.avatar ? (
                  <img src={localParticipant.avatar} alt={localParticipant.displayName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">
                    {localParticipant.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                {!localParticipant.micOn && (
                  <div className="absolute bottom-2 right-2 bg-black/60 p-1 rounded-full">
                    <MicOff className="w-3 h-3 text-red-500" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Desktop / mobile portrait: standard grid */
            <div
              className="w-full h-full grid gap-1 p-1"
              style={{
                gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
              }}
            >
              {regularParticipants.map((participant) => (
                <div key={participant.id} className="w-full h-full min-h-0 flex items-center justify-center">
                  {isAudioOnly || !participant.hasVideoTrack ? (
                    <AudioTile 
                      participant={participant} 
                      allowRotate={!isMobile}
                      isSpeaking={participant.isSpeaking}
                      onClick={() => handleTileClick(participant.id)}
                    />
                  ) : (
                    <VideoTile
                      participant={participant}
                      isLocal={participant.id === localParticipant.id}
                      allowRotate={!isMobile}
                      isSpeaking={participant.isSpeaking}
                      onClick={() => handleTileClick(participant.id)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Spotlight layout - one maximized + thumbnails */}
      {!remoteScreenShare && !is1to1 && layoutMode === 'spotlight' && spotlightParticipant && (
        <>
          {/* Mobile portrait: thumbnails on top, spotlight below */}
          {isMobile && !isLandscape ? (
            <div className="w-full h-full flex flex-col gap-1 p-1">
              {/* Thumbnail strip - horizontal scrollable at top */}
              <div className="h-16 flex-shrink-0 flex gap-1 overflow-x-auto">
                {thumbnailParticipants.map((participant) => (
                  <div key={participant.id} className="h-full aspect-video flex-shrink-0">
                    {isAudioOnly || !participant.hasVideoTrack ? (
                      <AudioTile 
                        participant={participant}
                        isSpeaking={participant.isSpeaking}
                        isPinned={pinnedParticipantId === participant.id}
                        compact
                        onClick={() => handleTileClick(participant.id)}
                      />
                    ) : (
                      <VideoTile 
                        participant={participant}
                        isSpeaking={participant.isSpeaking}
                        isPinned={pinnedParticipantId === participant.id}
                        compact
                        onClick={() => handleTileClick(participant.id)}
                      />
                    )}
                  </div>
                ))}
              </div>
              {/* Spotlight tile */}
              <div className="flex-1 relative">
                {isAudioOnly || !spotlightParticipant.hasVideoTrack ? (
                  <AudioTile 
                    participant={spotlightParticipant}
                    isSpeaking={spotlightParticipant.isSpeaking}
                    isPinned={spotlightMode === 'pinned'}
                    onClick={() => handleTileClick(spotlightParticipant.id)}
                  />
                ) : (
                  <VideoTile 
                    participant={spotlightParticipant}
                    isSpeaking={spotlightParticipant.isSpeaking}
                    isPinned={spotlightMode === 'pinned'}
                    onClick={() => handleTileClick(spotlightParticipant.id)}
                  />
                )}
              </div>
            </div>
          ) : (
            /* Desktop / mobile landscape: thumbnails on side, spotlight fills rest */
            <div className="w-full h-full flex gap-1 p-1">
              {/* Spotlight tile */}
              <div className="flex-1 relative">
                {isAudioOnly || !spotlightParticipant.hasVideoTrack ? (
                  <AudioTile 
                    participant={spotlightParticipant}
                    allowRotate={!isMobile}
                    isSpeaking={spotlightParticipant.isSpeaking}
                    isPinned={spotlightMode === 'pinned'}
                    onClick={() => handleTileClick(spotlightParticipant.id)}
                  />
                ) : (
                  <VideoTile 
                    participant={spotlightParticipant}
                    allowRotate={!isMobile}
                    isSpeaking={spotlightParticipant.isSpeaking}
                    isPinned={spotlightMode === 'pinned'}
                    onClick={() => handleTileClick(spotlightParticipant.id)}
                  />
                )}
              </div>
              {/* Thumbnail strip - vertical scrollable on side */}
              <div className="w-24 flex-shrink-0 flex flex-col gap-1 overflow-y-auto">
                {thumbnailParticipants.map((participant) => (
                  <div key={participant.id} className="w-full aspect-video flex-shrink-0">
                    {isAudioOnly || !participant.hasVideoTrack ? (
                      <AudioTile 
                        participant={participant}
                        isSpeaking={participant.isSpeaking}
                        isPinned={pinnedParticipantId === participant.id}
                        compact
                        onClick={() => handleTileClick(participant.id)}
                      />
                    ) : (
                      <VideoTile 
                        participant={participant}
                        isSpeaking={participant.isSpeaking}
                        isPinned={pinnedParticipantId === participant.id}
                        compact
                        onClick={() => handleTileClick(participant.id)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
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
