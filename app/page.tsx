'use client'

import { useState } from 'react'
import { MeetSurface } from '@/components/meet'
import type { InternalUser, CaptionLine } from '@/types/meet'

// DEMO HARNESS — replace with real data wiring when consumed in production.
// Every state and sub-state of <MeetSurface> can be exercised from here.

const DEMO_INTERNAL_USERS: InternalUser[] = [
  {
    id: '1',
    displayName: 'Alice Johnson',
    role: 'Manager',
    team: 'Sales',
    isOnline: true,
    avatar: '',
  },
  {
    id: '2',
    displayName: 'Bob Smith',
    role: 'Engineer',
    team: 'Product',
    isOnline: true,
    avatar: '',
  },
  {
    id: '3',
    displayName: 'Carol White',
    role: 'Designer',
    team: 'Design',
    isOnline: false,
    avatar: '',
  },
  {
    id: '4',
    displayName: 'David Brown',
    role: 'PM',
    team: 'Product',
    isOnline: true,
    avatar: '',
  },
  {
    id: '5',
    displayName: 'Emma Davis',
    role: 'Marketer',
    team: 'Marketing',
    isOnline: true,
    avatar: '',
  },
  {
    id: '6',
    displayName: 'Frank Miller',
    role: 'Developer',
    team: 'Product',
    isOnline: false,
    avatar: '',
  },
]

export default function MeetPage() {
  // App state
  const [appState, setAppState] = useState<'pre-join' | 'in-meeting' | 'ended'>('pre-join')
  const [meetingState, setMeetingState] = useState<'ready' | 'too-early' | 'waiting-for-other' | 'too-late'>('ready')
  const [endedReason, setEndedReason] = useState<'left' | 'initiator-ended' | 'kicked' | 'connection-lost' | 'too-late'>('left')
  const [participantCount, setParticipantCount] = useState(0)
  const [isInitiator, setIsInitiator] = useState(true)
  const [recordingActive, setRecordingActive] = useState(false)
  const [voiceOnlyLocked, setVoiceOnlyLocked] = useState(false)
  const [sharingScreen, setSharingScreen] = useState(false)
  const [captionsOn, setCaptionsOn] = useState(false)
  const [captionLines, setCaptionLines] = useState<CaptionLine[]>([])
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [controlsMinimized, setControlsMinimized] = useState(false)
  const [micVolume, setMicVolume] = useState(80)
  const [speakerVolume, setSpeakerVolume] = useState(80)

  // Meeting data
  const demoMeeting = {
    title: 'Team Sync - Sales Meeting',
    initiatorName: 'Sarah Johnson',
    scheduledStart: new Date(Date.now() + 300000),
    scheduledEnd: new Date(Date.now() + 3900000),
    recordingActive,
    voiceOnlyLocked,
    startedAt: new Date(),
    durationMs: 5 * 60 * 1000,
    isStillActive: true,
  }

  const demoLocalUser = {
    displayName: 'You',
    isGuest: true,
    isInitiator,
  }

  const demoLocalParticipant = {
    id: 'local-user',
    displayName: 'You',
    isInitiator,
    micOn,
    cameraOn,
    sharingScreen,
    captionsOn,
    connectionQuality: 'excellent' as const,
    avatar: '',
    hasVideoTrack: true,
    hasAudioTrack: true,
    isSpeaking: false,
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
    ...(participantCount > 3
      ? Array.from({ length: Math.min(participantCount - 3, 9) }, (_, i) => ({
          id: `participant-${i + 4}`,
          displayName: `Guest ${i + 4}`,
          isInitiator: false,
          micOn: Math.random() > 0.3,
          cameraOn: Math.random() > 0.5,
          sharingScreen: false,
          hasVideoTrack: Math.random() > 0.4,
          hasAudioTrack: true,
          isSpeaking: false,
          connectionQuality: ('excellent' | 'good' | 'fair') as any,
          avatar: '',
        }))
      : []),
  ]

  const demoTenantBranding = {
    logoUrl: '',
    accentColor: '#FF6B35',
    supportLinkUrl: 'https://support.vortex-cx.com',
  }

  const demoAvailableDevices = {
    mics: [
      { id: 'mic-1', label: 'Built-in Microphone' },
      { id: 'mic-2', label: 'USB Microphone' },
      { id: 'mic-3', label: 'Wireless Headset' },
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

  const handleAddCaption = () => {
    const speakers = ['You', 'Sarah Johnson', 'Mike Chen', 'Emily Davis']
    const texts = [
      'That sounds great!',
      'Let me share my thoughts on this.',
      'I agree with that approach.',
      'Can you elaborate on that point?',
      "I think we should move forward with this.",
    ]
    const newCaption: CaptionLine = {
      id: `caption-${Date.now()}`,
      speakerName: speakers[Math.floor(Math.random() * speakers.length)],
      text: texts[Math.floor(Math.random() * texts.length)],
      sentAt: new Date(),
    }
    setCaptionLines((prev) => [...prev, newCaption])
  }

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
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
        internalUsers={DEMO_INTERNAL_USERS}
        meetingLinkUrl="https://meet.vortex-cx.com/abc-123-xyz"
        otherParty={appState === 'pre-join' && meetingState === 'waiting-for-other' ? demoOtherParty : undefined}
        captionLines={captionLines}
        screenShareSource={sharingScreen ? 'Entire Screen' : null}
        micVolume={micVolume}
        speakerVolume={speakerVolume}
        onJoin={(params) => {
          console.log('[Demo] Join with:', params)
          setAppState('in-meeting')
        }}
        onCancel={() => {
          console.log('[Demo] Cancel')
          setAppState('ended')
          setEndedReason('left')
        }}
        onSendNudge={() => {
          console.log('[Demo] Nudge sent!')
        }}
        onToggleMic={() => {
          console.log('[Demo] Toggle mic')
          setMicOn(!micOn)
        }}
        onToggleCamera={() => {
          console.log('[Demo] Toggle camera')
          setCameraOn(!cameraOn)
        }}
        onSwitchMic={(id) => console.log('[Demo] Switch mic:', id)}
        onSwitchCamera={(id) => console.log('[Demo] Switch camera:', id)}
        onSwitchSpeaker={(id) => console.log('[Demo] Switch speaker:', id)}
        onStartScreenShare={() => {
          console.log('[Demo] Start screen share')
          setSharingScreen(true)
        }}
        onStopScreenShare={() => {
          console.log('[Demo] Stop screen share')
          setSharingScreen(false)
        }}
        onAddInternalParticipant={(id) => {
          console.log('[Demo] Add internal participant:', id)
        }}
        onGenerateGuestLink={(params) => {
          console.log('[Demo] Generate guest link:', params)
        }}
        onToggleCaptions={() => {
          console.log('[Demo] Toggle captions')
          setCaptionsOn(!captionsOn)
        }}
        onToggleRecording={() => {
          console.log('[Demo] Toggle recording')
          setRecordingActive(!recordingActive)
        }}
        onToggleVoiceOnlyLock={() => {
          console.log('[Demo] Toggle voice-only lock')
          setVoiceOnlyLocked(!voiceOnlyLocked)
        }}
        onRemoveParticipant={(id) => console.log('[Demo] Remove participant:', id)}
        onEndCallForEveryone={() => {
          console.log('[Demo] End call for everyone')
          setAppState('ended')
          setEndedReason('initiator-ended')
        }}
        onLeave={() => {
          console.log('[Demo] Leave')
          setAppState('ended')
          setEndedReason('left')
        }}
        onMicVolumeChange={(volume) => {
          console.log('[Demo] Mic volume:', volume)
          setMicVolume(volume)
        }}
        onSpeakerVolumeChange={(volume) => {
          console.log('[Demo] Speaker volume:', volume)
          setSpeakerVolume(volume)
        }}
        onRejoin={() => {
          console.log('[Demo] Rejoin')
          setAppState('in-meeting')
        }}
        onSubmitFeedback={(feedback) => {
          console.log('[Demo] Submit feedback:', feedback)
        }}
        onReturn={() => {
          console.log('[Demo] Return to dashboard')
          setAppState('pre-join')
          setMeetingState('ready')
          setParticipantCount(0)
          setCaptionLines([])
          setSharingScreen(false)
          setCaptionsOn(false)
          setRecordingActive(false)
          setVoiceOnlyLocked(false)
          setMicOn(true)
          setCameraOn(true)
        }}
        t={{}}
      />

      {/* Debug controls floating widget */}
      <div className="fixed top-4 right-4 bg-slate-900/95 text-white rounded-lg shadow-lg z-50 max-w-sm text-xs">
        <button
          onClick={() => setControlsMinimized(!controlsMinimized)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <span className="font-bold text-sm">Demo Controls</span>
          <span className="text-slate-400 text-xs">{controlsMinimized ? '▲ expand' : '▼ minimize'}</span>
        </button>

        {!controlsMinimized && <div className="px-4 pb-4 space-y-2 max-h-[calc(100vh-6rem)] overflow-y-auto">

        {/* State switcher */}
        <div className="space-y-1">
          <div className="font-semibold text-slate-300">App State:</div>
          <div className="flex gap-1 flex-wrap">
            {(['pre-join', 'in-meeting', 'ended'] as const).map((state) => (
              <button
                key={state}
                onClick={() => setAppState(state)}
                className={`px-2 py-1 rounded text-xs ${
                  appState === state
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>

        {/* Meeting state (pre-join only) */}
        {appState === 'pre-join' && (
          <div className="space-y-1">
            <div className="font-semibold text-slate-300">Meeting State:</div>
            <div className="flex gap-1 flex-wrap">
              {(['ready', 'too-early', 'waiting-for-other', 'too-late'] as const).map((state) => (
                <button
                  key={state}
                  onClick={() => setMeetingState(state)}
                  className={`px-2 py-1 rounded text-xs ${
                    meetingState === state
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ended reason (ended only) */}
        {appState === 'ended' && (
          <div className="space-y-1">
            <div className="font-semibold text-slate-300">Ended Reason:</div>
            <div className="flex gap-1 flex-wrap">
              {(['left', 'initiator-ended', 'kicked', 'connection-lost', 'too-late'] as const).map((reason) => (
                <button
                  key={reason}
                  onClick={() => setEndedReason(reason)}
                  className={`px-2 py-1 rounded text-xs ${
                    endedReason === reason
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Participant count */}
        {appState === 'in-meeting' && (
          <div className="space-y-1">
            <div className="font-semibold text-slate-300">Participants:</div>
            <div className="flex gap-1 flex-wrap">
              {[0, 1, 2, 3, 6, 12].map((count) => (
                <button
                  key={count}
                  onClick={() => setParticipantCount(count)}
                  className={`px-2 py-1 rounded text-xs ${
                    participantCount === count
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* In-meeting toggles */}
        {appState === 'in-meeting' && (
          <>
            <div className="space-y-1">
              <div className="font-semibold text-slate-300">In-meeting Flags:</div>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-800 p-1 rounded">
                <input
                  type="checkbox"
                  checked={recordingActive}
                  onChange={(e) => setRecordingActive(e.target.checked)}
                  className="w-3 h-3"
                />
                <span>Recording</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-800 p-1 rounded">
                <input
                  type="checkbox"
                  checked={voiceOnlyLocked}
                  onChange={(e) => setVoiceOnlyLocked(e.target.checked)}
                  className="w-3 h-3"
                />
                <span>Voice-only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-800 p-1 rounded">
                <input
                  type="checkbox"
                  checked={sharingScreen}
                  onChange={(e) => setSharingScreen(e.target.checked)}
                  className="w-3 h-3"
                />
                <span>Screen share</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-800 p-1 rounded">
                <input
                  type="checkbox"
                  checked={captionsOn}
                  onChange={(e) => setCaptionsOn(e.target.checked)}
                  className="w-3 h-3"
                />
                <span>Captions on</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-800 p-1 rounded">
                <input
                  type="checkbox"
                  checked={micOn}
                  onChange={(e) => setMicOn(e.target.checked)}
                  className="w-3 h-3"
                />
                <span>Mic on</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-800 p-1 rounded">
                <input
                  type="checkbox"
                  checked={cameraOn}
                  onChange={(e) => setCameraOn(e.target.checked)}
                  className="w-3 h-3"
                />
                <span>Camera on</span>
              </label>
            </div>

            {/* Caption test button */}
            <button
              onClick={handleAddCaption}
              className="w-full px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs"
            >
              + Add caption
            </button>
          </>
        )}

        {/* Initiator toggle (all states) */}
        <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-800 p-1 rounded">
          <input
            type="checkbox"
            checked={isInitiator}
            onChange={(e) => setIsInitiator(e.target.checked)}
            className="w-3 h-3"
          />
          <span>Is Initiator</span>
        </label>
        </div>}
      </div>
    </div>
  )
}

