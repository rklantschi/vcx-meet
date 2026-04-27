'use client'

import { PreJoin } from './pre-join'
import { InMeeting } from './in-meeting'
import { EndedState } from './ended-state'
import type {
  MeetState,
  MeetingEndReason,
  Meeting,
  LocalUser,
  LocalParticipant,
  ParticipantTile,
  TenantBranding,
  AvailableDevices,
  OtherParty,
  JoinParams,
  GenerateGuestLinkParams,
  FeedbackSubmission,
  TranslationStrings,
  CaptionLine,
  InternalUser,
} from '@/types/meet'

type AppState = 'pre-join' | 'in-meeting' | 'ended'

interface MeetSurfaceProps {
  // Current state
  appState: AppState
  meetingState?: MeetState
  endedReason?: MeetingEndReason

  // Data
  meeting: Meeting
  localUser: LocalUser
  localParticipant?: LocalParticipant
  participants?: ParticipantTile[]
  tenantBranding: TenantBranding
  availableDevices: AvailableDevices
  internalUsers?: InternalUser[]
  meetingLinkUrl?: string
  otherParty?: OtherParty | null
  captionLines?: CaptionLine[]
  screenShareSource?: string | null

  // Callbacks
  onJoin: (params: JoinParams) => void
  onCancel: () => void
  onSendNudge: () => void
  onToggleMic?: () => void
  onToggleCamera?: () => void
  onSwitchMic?: (deviceId: string) => void
  onSwitchCamera?: (deviceId: string) => void
  onSwitchSpeaker?: (deviceId: string) => void
  onStartScreenShare?: () => void
  onStopScreenShare?: () => void
  onAddInternalParticipant?: (userId: string) => void
  onGenerateGuestLink?: (params: GenerateGuestLinkParams) => void
  onToggleCaptions?: () => void
  onToggleRecording?: () => void
  onToggleVoiceOnlyLock?: () => void
  onRemoveParticipant?: (participantId: string) => void
  onEndCallForEveryone?: () => void
  onLeave?: () => void
  onRejoin?: () => void
  onSubmitFeedback?: (feedback: FeedbackSubmission) => void
  onReturn?: () => void

  // Translation
  t: TranslationStrings

  // Optional
  isLoading?: boolean
}

export function MeetSurface({
  appState,
  meetingState = 'ready',
  endedReason = 'left',
  meeting,
  localUser,
  localParticipant,
  participants = [],
  tenantBranding,
  availableDevices,
  otherParty,
  captionLines = [],
  onJoin,
  onCancel,
  onSendNudge,
  onToggleMic = () => {},
  onToggleCamera = () => {},
  onSwitchMic = () => {},
  onSwitchCamera = () => {},
  onSwitchSpeaker = () => {},
  onStartScreenShare = () => {},
  onStopScreenShare = () => {},
  onAddInternalParticipant = () => {},
  onGenerateGuestLink = () => {},
  onToggleCaptions = () => {},
  onToggleRecording = () => {},
  onToggleVoiceOnlyLock = () => {},
  onRemoveParticipant = () => {},
  onEndCallForEveryone = () => {},
  onLeave = () => {},
  onRejoin,
  onSubmitFeedback = () => {},
  onReturn = () => {},
  t,
  isLoading = false,
}: MeetSurfaceProps) {
  // Default translations
  const translations: TranslationStrings = {
    meeting_title: 'Join Meeting',
    initiated_by: 'Meeting with',
    call_starts_at: 'Call starts at',
    waiting_for_other: 'Waiting for other participant',
    send_nudge: 'Send nudge',
    call_ended: 'This call has ended',
    microphone_level: 'Microphone level',
    toggle_microphone: 'Toggle microphone',
    toggle_camera: 'Toggle camera',
    display_name_placeholder: 'Your name',
    display_name_required: 'Please enter your name to continue',
    join_voice: 'Join voice',
    join_video: 'Join video',
    cancel: 'Cancel',
    powered_by: 'Powered by Vortex CX',
    screen_share: 'Share screen',
    add_participant: 'Add participant',
    captions: 'Live captions',
    speaker: 'Speaker',
    stop_recording: 'Stop recording',
    start_recording: 'Start recording',
    allow_video: 'Allow video',
    voice_only: 'Voice only',
    end_call_for_all: 'End call for everyone',
    settings: 'Settings',
    you_left: 'You left the call',
    call_ended_by_initiator: 'Call ended by initiator',
    you_were_removed: 'You were removed from the call',
    connection_lost: 'Connection lost',
    call_has_ended: 'This call has ended',
    duration: 'Duration',
    rejoin: 'Rejoin',
    leave_feedback: 'Leave feedback',
    rating: 'How was your experience?',
    comment_placeholder: 'Share your feedback (optional)',
    submit: 'Submit',
    skip: 'Skip',
    return_to_dashboard: 'Return to dashboard',
    ...t,
  }

  if (appState === 'pre-join') {
    return (
      <PreJoin
        meeting={meeting}
        meetingState={meetingState}
        localUser={localUser}
        tenantBranding={tenantBranding}
        availableDevices={availableDevices}
        otherParty={otherParty}
        onJoin={onJoin}
        onCancel={onCancel}
        onSendNudge={onSendNudge}
        t={translations}
        isLoading={isLoading}
      />
    )
  }

  if (appState === 'in-meeting' && localParticipant) {
    return (
      <InMeeting
        meeting={meeting}
        localParticipant={localParticipant}
        participants={participants}
        availableDevices={availableDevices}
        internalUsers={internalUsers}
        meetingLinkUrl={meetingLinkUrl}
        captionLines={captionLines}
        screenShareSource={screenShareSource}
        onToggleMic={onToggleMic}
        onToggleCamera={onToggleCamera}
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
        onRemoveParticipant={onRemoveParticipant}
        onEndCallForEveryone={onEndCallForEveryone}
        onLeave={onLeave}
        t={translations}
      />
    )
  }

  if (appState === 'ended') {
    return (
      <EndedState
        endedReason={endedReason}
        meeting={meeting}
        tenantBranding={tenantBranding}
        onRejoin={onRejoin}
        onSubmitFeedback={onSubmitFeedback}
        onReturn={onReturn}
        t={translations}
      />
    )
  }

  // Fallback
  return <div className="h-screen flex items-center justify-center bg-background">Invalid state</div>
}
