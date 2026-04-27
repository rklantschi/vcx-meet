/**
 * Vortex CX Meet Surface Types
 * UX-level data shapes for rendering the meeting interface
 */

export type MeetState = 'ready' | 'too-early' | 'waiting-for-other' | 'too-late'
export type MeetingEndReason = 'left' | 'initiator-ended' | 'kicked' | 'connection-lost' | 'too-late'
export type JoinMode = 'voice' | 'video'
export type CaptionId = string

export interface MediaDevice {
  id: string
  label: string
}

export interface AvailableDevices {
  mics: MediaDevice[]
  cameras: MediaDevice[]
  speakers: MediaDevice[]
}

export interface TenantBranding {
  logoUrl: string
  accentColor: string
  supportLinkUrl?: string
}

export interface LocalUser {
  displayName: string
  isGuest: boolean
  isInitiator: boolean
}

export interface Meeting {
  title: string
  initiatorName?: string
  initiatorUserId?: string
  scheduledStart?: Date
  scheduledEnd?: Date
  isAudioOnlyLocked?: boolean
  recordingActive?: boolean
  voiceOnlyLocked?: boolean
  startedAt?: Date
  durationMs?: number
  isStillActive?: boolean
}

export interface OtherParty {
  displayName: string
  hasJoined: boolean
}

export interface LocalParticipant {
  id: string
  userId?: string | null
  displayName: string
  avatar?: string
  isInitiator: boolean
  micOn: boolean
  cameraOn: boolean
  sharingScreen: boolean
  captionsOn: boolean
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor'
  // Required for tile compatibility
  hasVideoTrack: boolean
  hasAudioTrack: boolean
  isSpeaking?: boolean
}

export interface ParticipantTile {
  id: string
  displayName: string
  avatar?: string
  isInitiator: boolean
  micOn: boolean
  cameraOn: boolean
  sharingScreen: boolean
  hasVideoTrack: boolean
  hasAudioTrack: boolean
  isSpeaking: boolean
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor'
  dualPresenceGroup?: string | null
  isOnPstn?: boolean
}

export interface CaptionLine {
  id: CaptionId
  speakerName: string
  text: string
  sentAt: Date
}

// Props for component callbacks (intent-level, no return values needed)
export interface JoinParams {
  displayName: string
  micId: string
  cameraId: string
  speakerId: string
  mode: JoinMode
}

export interface GenerateGuestLinkParams {
  sendVia: 'whatsapp' | 'sms' | 'email' | 'copy'
  channelId?: string
}

export interface FeedbackSubmission {
  rating: number
  comment: string
}

// Translation map type
export interface TranslationStrings {
  [key: string]: string
}
