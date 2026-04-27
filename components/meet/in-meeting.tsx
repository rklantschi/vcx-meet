'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
  InternalUser,
} from '@/types/meet'

interface InMeetingProps {
  meeting: Meeting
  localParticipant: LocalParticipant
  participants: ParticipantTile[]
  availableDevices: AvailableDevices
  internalUsers?: InternalUser[]
  meetingLinkUrl?: string
  captionLines?: CaptionLine[]
  screenShareSource?: string | null
  micVolume?: number
  speakerVolume?: number
  onToggleMic: () => void
  onToggleCamera: () => void
  onToggleSpeaker?: () => void
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
  onMicVolumeChange?: (volume: number) => void
  onSpeakerVolumeChange?: (volume: number) => void
  onLeave: () => void
  t: TranslationStrings
}

export function InMeeting({
  meeting,
  localParticipant,
  participants,
  availableDevices,
  internalUsers = [],
  meetingLinkUrl = '',
  captionLines = [],
  screenShareSource = null,
  micVolume = 80,
  speakerVolume = 80,
  onToggleMic,
  onToggleCamera,
  onToggleSpeaker,
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
  onMicVolumeChange,
  onSpeakerVolumeChange,
  onLeave,
  t,
}: InMeetingProps) {
  const [actionBarVisible, setActionBarVisible] = useState(true)
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Reset auto-hide timer
  const resetHideTimer = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }
    hideTimeoutRef.current = setTimeout(() => {
      setActionBarVisible(false)
    }, 3000)
  }, [])

  // Start timer on mount, cleanup on unmount
  useEffect(() => {
    resetHideTimer()
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [resetHideTimer])

  const handleCanvasInteraction = useCallback(() => {
    setActionBarVisible(true)
    resetHideTimer()
  }, [resetHideTimer])

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
        screenShareSource={screenShareSource}
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
          speakerOn={localParticipant.speakerOn}
          sharingScreen={localParticipant.sharingScreen}
          captionsOn={localParticipant.captionsOn}
          recordingActive={meeting.recordingActive}
          voiceOnlyLocked={meeting.voiceOnlyLocked}
          isInitiator={localParticipant.isInitiator}
          displayName={localParticipant.displayName}
          meeting={meeting}
          localParticipant={localParticipant}
          availableDevices={availableDevices}
          internalUsers={internalUsers}
          meetingLinkUrl={meetingLinkUrl}
          micVolume={micVolume}
          speakerVolume={speakerVolume}
          onToggleMic={onToggleMic}
          onToggleCamera={onToggleCamera}
          onToggleSpeaker={onToggleSpeaker}
          onSwitchMic={onSwitchMic}
          onSwitchCamera={onSwitchCamera}
          onSwitchSpeaker={onSwitchSpeaker}
          onStartScreenShare={onStartScreenShare}
          onStopScreenShare={onStopScreenShare}
          onAddInternalParticipant={onAddInternalParticipant}
          onGenerateGuestLink={onGenerateGuestLink}
          onToggleCaptions={onToggleCaptions}
          onToggleRecording={onToggleRecording}
          onToggleVoiceOnlyLock={onToggleVoiceOnlyLock}
          onEndCallForEveryone={onEndCallForEveryone}
          onMicVolumeChange={onMicVolumeChange}
          onSpeakerVolumeChange={onSpeakerVolumeChange}
          onLeave={onLeave}
          t={t}
        />
      )}
    </div>
  )
}
