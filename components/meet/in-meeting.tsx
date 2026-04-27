'use client'

import { useState, useEffect } from 'react'
import { Canvas } from './canvas'
import { ActionBar } from './action-bar'
import { CaptionsOverlay } from './captions-overlay'
import type {
  LocalParticipant,
  ParticipantTile,
  AvailableDevices,
  Meeting,
  TranslationStrings,
  GenerateGuestLinkParams,
  CaptionLine,
} from '@/types/meet'

interface InMeetingProps {
  meeting: Meeting
  localParticipant: LocalParticipant
  participants: ParticipantTile[]
  availableDevices: AvailableDevices
  captionLines?: CaptionLine[]
  onToggleMic: () => void
  onToggleCamera: () => void
  onSwitchMic: (deviceId: string) => void
  onSwitchCamera: (deviceId: string) => void
  onSwitchSpeaker: (deviceId: string) => void
  onStartScreenShare: () => void
  onStopScreenShare: () => void
  onAddInternalParticipant: (userId: string) => void
  onGenerateGuestLink: (params: GenerateGuestLinkParams) => void
  onToggleCaptions: () => void
  onToggleRecording?: () => void
  onToggleVoiceOnlyLock?: () => void
  onRemoveParticipant?: (participantId: string) => void
  onEndCallForEveryone?: () => void
  onLeave: () => void
  t: TranslationStrings
}

export function InMeeting({
  meeting,
  localParticipant,
  participants,
  availableDevices,
  captionLines = [],
  onToggleMic,
  onToggleCamera,
  onSwitchMic,
  onSwitchCamera,
  onSwitchSpeaker,
  onStartScreenShare,
  onStopScreenShare,
  onAddInternalParticipant,
  onGenerateGuestLink,
  onToggleCaptions,
  onToggleRecording,
  onToggleVoiceOnlyLock,
  onRemoveParticipant,
  onEndCallForEveryone,
  onLeave,
  t,
}: InMeetingProps) {
  const [actionBarVisible, setActionBarVisible] = useState(true)
  const [hideActionBarTimeout, setHideActionBarTimeout] = useState<NodeJS.Timeout | null>(null)

  // Auto-hide action bar
  useEffect(() => {
    if (hideActionBarTimeout) {
      clearTimeout(hideActionBarTimeout)
    }

    const timeout = setTimeout(() => {
      setActionBarVisible(false)
    }, 3000)

    setHideActionBarTimeout(timeout)

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [actionBarVisible])

  const handleCanvasInteraction = () => {
    setActionBarVisible(true)
  }

  // Get screen share participant if any
  const screenShareParticipant = participants.find((p) => p.sharingScreen) || 
                                 (localParticipant.sharingScreen ? localParticipant : null)

  const isAudioOnly = meeting.voiceOnlyLocked || participants.every((p) => !p.hasVideoTrack)

  return (
    <div
      className="relative w-full h-screen bg-black overflow-hidden"
      onMouseMove={handleCanvasInteraction}
      onClick={handleCanvasInteraction}
      onTouchStart={handleCanvasInteraction}
    >
      {/* Canvas */}
      <Canvas
        localParticipant={localParticipant}
        participants={participants}
        isAudioOnly={isAudioOnly}
        recordingActive={meeting.recordingActive}
        captionsEnabled={localParticipant.captionsOn}
        remoteScreenShare={screenShareParticipant}
      />

      {/* Captions overlay */}
      {localParticipant.captionsOn && (
        <CaptionsOverlay
          lines={captionLines}
          isEnabled={localParticipant.captionsOn}
          t={t}
        />
      )}

      {/* Action bar */}
      {actionBarVisible && (
        <ActionBar
          micOn={localParticipant.micOn}
          cameraOn={localParticipant.cameraOn}
          sharingScreen={localParticipant.sharingScreen}
          captionsOn={localParticipant.captionsOn}
          recordingActive={meeting.recordingActive}
          voiceOnlyLocked={meeting.voiceOnlyLocked}
          isInitiator={localParticipant.isInitiator}
          availableDevices={availableDevices}
          onToggleMic={onToggleMic}
          onToggleCamera={onToggleCamera}
          onSwitchMic={onSwitchMic}
          onSwitchCamera={onSwitchCamera}
          onSwitchSpeaker={onSwitchSpeaker}
          onStartScreenShare={onStartScreenShare}
          onStopScreenShare={onStopScreenShare}
          onAddParticipant={() => {
            // Opens add participant modal/panel
          }}
          onToggleCaptions={onToggleCaptions}
          onToggleRecording={onToggleRecording}
          onToggleVoiceOnlyLock={onToggleVoiceOnlyLock}
          onEndCallForEveryone={onEndCallForEveryone}
          onLeave={onLeave}
          t={t}
        />
      )}
    </div>
  )
}
