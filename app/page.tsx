'use client'

import { useState } from 'react'
import { MeetSurface } from '@/components/meet'
import type { AppState } from '@/types/demo'

export default function MeetPage() {
  const [appState, setAppState] = useState<'pre-join' | 'in-meeting' | 'ended'>('pre-join')
  const [meetingState, setMeetingState] = useState<'ready' | 'too-early' | 'waiting-for-other' | 'too-late'>('ready')
  const [endedReason, setEndedReason] = useState<'left' | 'initiator-ended' | 'kicked' | 'connection-lost' | 'too-late'>('left')
  const [participantCount, setParticipantCount] = useState(0)

  // Demo data
  const demoMeeting = {
    title: 'Team Sync - Sales Meeting',
    initiatorName: 'Sarah Johnson',
    scheduledStart: new Date(Date.now() + 300000),
    scheduledEnd: new Date(Date.now() + 3900000),
    recordingActive: false,
    voiceOnlyLocked: false,
    startedAt: new Date(),
    durationMs: 5 * 60 * 1000,
    isStillActive: true,
  }

  const demoLocalUser = {
    displayName: 'You',
    isGuest: true,
    isInitiator: false,
  }

  const demoLocalParticipant = {
    id: 'local-user',
    displayName: 'You',
    isInitiator: false,
    micOn: true,
    cameraOn: true,
    sharingScreen: false,
    captionsOn: false,
    connectionQuality: 'excellent' as const,
    avatar: '',
    hasVideoTrack: true,
    hasAudioTrack: true,
  }

  const demoParticipants = [
    {
      id: 'participant-1',
      displayName: 'Sarah Johnson',
      isInitiator: true,
      micOn: true,
      cameraOn: true,
      sharingScreen: false,
      hasVideoTrack: true,
      hasAudioTrack: true,
      isSpeaking: false,
      connectionQuality: 'excellent' as const,
      avatar: '',
    },
    ...(participantCount > 1
      ? [
          {
            id: 'participant-2',
            displayName: 'Mike Chen',
            isInitiator: false,
            micOn: true,
            cameraOn: false,
            sharingScreen: false,
            hasVideoTrack: false,
            hasAudioTrack: true,
            isSpeaking: false,
            connectionQuality: 'good' as const,
            avatar: '',
          },
        ]
      : []),
    ...(participantCount > 2
      ? [
          {
            id: 'participant-3',
            displayName: 'Emily Davis',
            isInitiator: false,
            micOn: false,
            cameraOn: true,
            sharingScreen: false,
            hasVideoTrack: true,
            hasAudioTrack: true,
            isSpeaking: false,
            connectionQuality: 'good' as const,
            avatar: '',
          },
        ]
      : []),
  ]

  const demoTenantBranding = {
    logoUrl: '/logo.png',
    accentColor: '#FF6B35',
    supportLinkUrl: 'https://support.vortex-cx.com',
  }

  const demoAvailableDevices = {
    mics: [
      { id: 'mic-1', label: 'Built-in Microphone' },
      { id: 'mic-2', label: 'USB Microphone' },
    ],
    cameras: [
      { id: 'cam-1', label: 'Built-in Camera' },
      { id: 'cam-2', label: 'External USB Camera' },
    ],
    speakers: [
      { id: 'speaker-1', label: 'Built-in Speaker' },
      { id: 'speaker-2', label: 'Headphones' },
    ],
  }

  const demoOtherParty = {
    displayName: 'Sarah Johnson',
    hasJoined: false,
  }

  return (
    <div className="w-full h-screen">
      <MeetSurface
        appState={appState}
        meetingState={meetingState}
        endedReason={endedReason}
        meeting={demoMeeting}
        localUser={demoLocalUser}
        localParticipant={demoLocalParticipant}
        participants={demoParticipants}
        tenantBranding={demoTenantBranding}
        availableDevices={demoAvailableDevices}
        otherParty={appState === 'pre-join' && meetingState === 'waiting-for-other' ? demoOtherParty : undefined}
        captionLines={[]}
        onJoin={(params) => {
          console.log('Join:', params)
          setAppState('in-meeting')
        }}
        onCancel={() => {
          console.log('Cancel')
          setAppState('ended')
          setEndedReason('left')
        }}
        onSendNudge={() => {
          console.log('Send nudge')
        }}
        onToggleMic={() => console.log('Toggle mic')}
        onToggleCamera={() => console.log('Toggle camera')}
        onSwitchMic={(id) => console.log('Switch mic:', id)}
        onSwitchCamera={(id) => console.log('Switch camera:', id)}
        onSwitchSpeaker={(id) => console.log('Switch speaker:', id)}
        onStartScreenShare={() => console.log('Start screen share')}
        onStopScreenShare={() => console.log('Stop screen share')}
        onAddInternalParticipant={(id) => console.log('Add participant:', id)}
        onGenerateGuestLink={(params) => console.log('Generate guest link:', params)}
        onToggleCaptions={() => console.log('Toggle captions')}
        onToggleRecording={() => console.log('Toggle recording')}
        onToggleVoiceOnlyLock={() => console.log('Toggle voice only')}
        onRemoveParticipant={(id) => console.log('Remove participant:', id)}
        onEndCallForEveryone={() => {
          console.log('End call for everyone')
          setAppState('ended')
          setEndedReason('initiator-ended')
        }}
        onLeave={() => {
          console.log('Leave')
          setAppState('ended')
          setEndedReason('left')
        }}
        onRejoin={() => {
          console.log('Rejoin')
          setAppState('in-meeting')
        }}
        onSubmitFeedback={(feedback) => {
          console.log('Submit feedback:', feedback)
        }}
        onReturn={() => {
          console.log('Return')
          setAppState('pre-join')
          setMeetingState('ready')
          setParticipantCount(0)
        }}
        t={{}}
      />

      {/* Debug controls */}
      {appState === 'in-meeting' && (
        <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded space-y-2 z-50">
          <button
            onClick={() => setParticipantCount(0)}
            className="block w-32 px-2 py-1 bg-slate-600 rounded hover:bg-slate-700 text-sm"
          >
            0 Participants
          </button>
          <button
            onClick={() => setParticipantCount(1)}
            className="block w-32 px-2 py-1 bg-slate-600 rounded hover:bg-slate-700 text-sm"
          >
            1 Participant
          </button>
          <button
            onClick={() => setParticipantCount(2)}
            className="block w-32 px-2 py-1 bg-slate-600 rounded hover:bg-slate-700 text-sm"
          >
            2 Participants
          </button>
        </div>
      )}
    </div>
  )
}
