'use client'

import { useState, useRef, useEffect } from 'react'
import { AlertCircle, Volume2, Play, Mic, VideoOff, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { CemPilotLogo } from '@/brand-kit'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SplitButtonControl } from '@/components/meet/split-button-control'
import type {
  AvailableDevices,
  JoinParams,
  Meeting,
  LocalUser,
  TenantBranding,
  MeetState,
  OtherParty,
  TranslationStrings,
} from '@/types/meet'

interface PreJoinProps {
  meeting: Meeting
  meetingState: MeetState
  localUser: LocalUser
  tenantBranding: TenantBranding
  availableDevices: AvailableDevices
  otherParty?: OtherParty | null
  onJoin: (params: JoinParams) => void
  onCancel: () => void
  onSendNudge: () => void
  t: TranslationStrings
  isLoading?: boolean
  showSidePanelToggle?: boolean
  sidePanelCollapsed?: boolean
  onToggleSidePanel?: () => void
}

export function PreJoin({
  meeting,
  meetingState,
  localUser,
  tenantBranding,
  availableDevices,
  otherParty,
  onJoin,
  onCancel,
  onSendNudge,
  t,
  isLoading = false,
  showSidePanelToggle = false,
  sidePanelCollapsed = false,
  onToggleSidePanel,
}: PreJoinProps) {
  // Helper to format scheduled time
  const getScheduledTimeString = () => {
    if (!meeting.scheduledStart) return ''
    const start = new Date(meeting.scheduledStart)
    const time = start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    const date = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return `${time} • ${date}`
  }

  const scheduledTime = getScheduledTimeString()
  const [displayName, setDisplayName] = useState(localUser.displayName)
  const [micId, setMicId] = useState(availableDevices.mics[0]?.id || '')
  const [cameraId, setCameraId] = useState(availableDevices.cameras[0]?.id || '')
  const [speakerId, setSpeakerId] = useState(availableDevices.speakers[0]?.id || '')
  const [micEnabled, setMicEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [sendingNudge, setSendingNudge] = useState(false)
  const [micLevel, setMicLevel] = useState(0)
  const [testState, setTestState] = useState<'idle' | 'recording' | 'recorded' | 'playing'>('idle')

  const videoPreviewRef = useRef<HTMLVideoElement>(null)
  const [previewPortrait, setPreviewPortrait] = useState(false)
  const micAnimationRef = useRef<number | null>(null)
  const testRecordingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const cameraStreamRef = useRef<MediaStream | null>(null)

  // Camera preview using getUserMedia
  useEffect(() => {
    const startCamera = async () => {
      if (cameraEnabled && videoPreviewRef.current) {
        try {
          // Stop any existing stream first
          if (cameraStreamRef.current) {
            cameraStreamRef.current.getTracks().forEach(track => track.stop())
          }
          
          const constraints: MediaStreamConstraints = {
            video: cameraId ? { deviceId: { exact: cameraId } } : true,
            audio: false, // We don't need audio for preview
          }
          
          const stream = await navigator.mediaDevices.getUserMedia(constraints)
          cameraStreamRef.current = stream
          
          if (videoPreviewRef.current) {
            videoPreviewRef.current.srcObject = stream
          }
        } catch (error) {
          console.log('[v0] Camera access error:', error instanceof Error ? error.message : error)
        }
      } else {
        // Stop camera when disabled
        if (cameraStreamRef.current) {
          cameraStreamRef.current.getTracks().forEach(track => track.stop())
          cameraStreamRef.current = null
        }
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null
        }
      }
    }
    
    startCamera()
    
    // Cleanup on unmount
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [cameraEnabled, cameraId])

  // Simulate mic level animation when mic is enabled
  useEffect(() => {
    if (micEnabled) {
      const animateMicLevel = () => {
        // Simulate varying mic levels (in real app, use AudioContext analyser)
        const baseLevel = 20 + Math.random() * 30
        const variation = Math.sin(Date.now() / 200) * 15
        setMicLevel(Math.min(100, Math.max(0, baseLevel + variation)))
        micAnimationRef.current = requestAnimationFrame(animateMicLevel)
      }
      micAnimationRef.current = requestAnimationFrame(animateMicLevel)
      return () => {
        if (micAnimationRef.current) {
          cancelAnimationFrame(micAnimationRef.current)
        }
      }
    } else {
      setMicLevel(0)
    }
  }, [micEnabled])

  // Test mic/speaker functions
  const handleStartRecording = () => {
    setTestState('recording')
    // In real app, start MediaRecorder to capture audio
    // For demo, record for 3 seconds then stop
    testRecordingTimerRef.current = setTimeout(() => {
      setTestState('recorded')
    }, 3000)
  }

  const handlePlayRecording = () => {
    setTestState('playing')
    // In real app, play the recorded audio blob
    // For demo, play for 3 seconds then reset
    testRecordingTimerRef.current = setTimeout(() => {
      setTestState('idle')
    }, 3000)
  }

  const handleCancelTest = () => {
    if (testRecordingTimerRef.current) {
      clearTimeout(testRecordingTimerRef.current)
    }
    setTestState('idle')
  }

  const handleJoinClick = (mode: 'voice' | 'video') => {
    if (!displayName.trim()) return
    onJoin({
      displayName: displayName.trim(),
      micId,
      cameraId,
      speakerId,
      mode,
    })
  }

  const handleSendNudge = async () => {
    setSendingNudge(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      onSendNudge()
    } finally {
      setSendingNudge(false)
    }
  }

  const isDisplayNameEmpty = !displayName.trim()
  const isJoinDisabled = isDisplayNameEmpty || meetingState !== 'ready'
  const scheduledStartTime = meeting.scheduledStart ? new Date(meeting.scheduledStart).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : null

  return (
    <div className="relative h-screen flex flex-col items-center bg-background p-4 overflow-y-auto">
      {/* Logo - mobile only: tenant white-label if present, otherwise CEMPilot */}
      <div className="absolute top-6 left-6 md:hidden">
        {tenantBranding.logoUrl ? (
          <img src={tenantBranding.logoUrl} alt="Tenant logo" className="h-8" />
        ) : (
          <CemPilotLogo size="sm" />
        )}
      </div>

      {/* Mobile layout (< md) */}
      <div className="md:hidden w-full max-w-md flex flex-col items-center gap-3 my-auto py-4">
        {/* Camera preview */}
        <div className="w-40 h-40 rounded-xl bg-black border-2 border-border overflow-hidden flex items-center justify-center relative">
          {cameraEnabled ? (
            <div className="w-full h-full relative">
              <video
                ref={(video) => {
                  if (video && cameraStreamRef.current) {
                    video.srcObject = cameraStreamRef.current
                  }
                }}
                className="w-full h-full object-cover scale-x-[-1]"
                autoPlay
                muted
                playsInline
              />
              {/* Camera active indicator */}
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full bg-muted gap-2">
              <VideoOff className="w-8 h-8 text-muted-foreground" />
              <div className="text-2xl font-bold text-muted-foreground">
                {displayName.charAt(0).toUpperCase() || '?'}
              </div>
            </div>
          )}
        </div>

        {/* Meeting info */}
        <div className="text-center">
          <h1 className="text-lg font-semibold text-foreground">{meeting.title || t.meeting_title || 'Join Meeting'}</h1>
          {scheduledTime && <p className="text-xs text-muted-foreground mt-0.5">{scheduledTime}</p>}
          {meeting.initiatorName && (
            <p className="text-xs text-muted-foreground mt-1">{t.initiated_by || 'Meeting with'} {meeting.initiatorName}</p>
          )}
        </div>

        {/* State messages */}
        {meetingState === 'too-early' && scheduledStartTime && (
          <Alert className="bg-blue-50 border-blue-200 text-blue-900">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t.call_starts_at || 'Call starts at'} {scheduledStartTime}
            </AlertDescription>
          </Alert>
        )}

        {meetingState === 'waiting-for-other' && otherParty && (
          <Alert className="bg-amber-50 border-amber-200 text-amber-900">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between gap-2">
              <span>
                {t.waiting_for_other || `Waiting for ${otherParty.displayName} to join`}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSendNudge}
                disabled={sendingNudge}
                className="ml-2"
              >
                {t.send_nudge || 'Send nudge'}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {meetingState === 'too-late' && (
          <Alert className="bg-red-50 border-red-200 text-red-900">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{t.call_ended || 'This call has ended'}</AlertDescription>
          </Alert>
        )}

        {/* Display name input */}
        <div className="w-full">
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={t.display_name_placeholder || 'Your name'}
            className="text-center h-9 text-sm"
          />
        </div>

        {/* Display name required warning */}
        {isDisplayNameEmpty && (
          <p className="text-xs text-destructive text-center">
            {t.display_name_required || 'Please enter your name to continue'}
          </p>
        )}

        {/* Device controls — icon row with inline dropdown */}
        <div className="w-full flex justify-around items-start">
          {testState === 'idle' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartRecording}
              disabled={!micEnabled}
              className="flex-1"
            >
              <Mic className="w-4 h-4 mr-2" />
              {t.test_mic || 'Test audio'}
            </Button>
          )}
          {testState === 'recording' && (
            <>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                disabled
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-2" />
                {t.recording || 'Recording...'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelTest}
              >
                {t.cancel || 'Cancel'}
              </Button>
            </>
          )}
          {testState === 'recorded' && (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={handlePlayRecording}
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                {t.play_recording || 'Play recording'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelTest}
              >
                {t.discard || 'Discard'}
              </Button>
            </>
          )}
          {testState === 'playing' && (
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              disabled
            >
              <Volume2 className="w-4 h-4 mr-2 animate-pulse" />
              {t.playing || 'Playing...'}
            </Button>
          )}
        </div>

        {/* Device controls — same split-button as in-call */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <SplitButtonControl
              type="mic"
              isOn={micEnabled}
              devices={availableDevices.mics}
              selectedDeviceId={micId}
              onToggle={() => setMicEnabled(!micEnabled)}
              onSwitchDevice={setMicId}
              label={t.microphone || 'Microphone'}
            />
            <span className="text-[10px] text-muted-foreground">{t.microphone || 'Mic'}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <SplitButtonControl
              type="camera"
              isOn={cameraEnabled}
              devices={availableDevices.cameras}
              selectedDeviceId={cameraId}
              onToggle={() => setCameraEnabled(!cameraEnabled)}
              onSwitchDevice={setCameraId}
              label={t.camera || 'Camera'}
            />
            <span className="text-[10px] text-muted-foreground">{t.camera || 'Camera'}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <SplitButtonControl
              type="speaker"
              devices={availableDevices.speakers}
              selectedDeviceId={speakerId}
              onSwitchDevice={setSpeakerId}
              label={t.speaker || 'Speaker'}
            />
            <span className="text-[10px] text-muted-foreground">{t.speaker || 'Speaker'}</span>
          </div>
        </div>

        {/* Join button */}
        <div className="w-full flex gap-3">
          <Button
            onClick={() => handleJoinClick(cameraEnabled ? 'video' : 'voice')}
            disabled={isJoinDisabled || isLoading}
            className="flex-1"
            size="lg"
          >
            {t.join_meeting || 'Join Meeting'}
          </Button>
        </div>

        {/* Cancel */}
        <Button onClick={onCancel} variant="ghost" className="-mt-2">
          {t.cancel || 'Cancel'}
        </Button>

        {/* Tenant branding footer */}
        {localUser.isGuest && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">{t.powered_by || 'Powered by CEMPilot'}</span>
            <CemPilotLogo size="sm" />
          </div>
        )}
      </div>

      {/* Desktop layout (md+) — fullscreen with sidebar */}
      <div className="hidden md:flex w-full h-screen bg-background">

        {/* LEFT: Camera preview — takes majority of space */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
          {/* Large preview box — aspect ratio switches on rotate */}
          <div
            className={`rounded-3xl bg-muted border border-border overflow-hidden flex items-center justify-center relative shadow-lg group transition-all duration-300 ${
              previewPortrait
                ? 'h-full max-h-[70vh] aspect-[9/16]'
                : 'w-full max-w-2xl aspect-video'
            }`}
          >
            {cameraEnabled ? (
              <div className="w-full h-full relative bg-black">
                <video
                  ref={(video) => {
                    videoPreviewRef.current = video
                    if (video && cameraStreamRef.current) {
                      video.srcObject = cameraStreamRef.current
                    }
                  }}
                  className="w-full h-full object-cover scale-x-[-1]"
                  autoPlay
                  muted
                  playsInline
                />
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-white">{t.camera_on || 'Camera on'}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full gap-4">
                <div className="w-32 h-32 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                  <span className="text-6xl font-bold text-muted-foreground/60">
                    {displayName.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">{t.camera_off || 'Camera off'}</span>
              </div>
            )}

            {/* Rotate toggle button */}
            <button
              onClick={() => setPreviewPortrait(p => !p)}
              className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 px-2.5 py-1.5 rounded-full flex items-center gap-1.5"
              title={previewPortrait ? 'Switch to landscape' : 'Switch to portrait'}
            >
              <RotateCcw className={`w-3.5 h-3.5 text-white transition-transform duration-300 ${previewPortrait ? 'rotate-90' : ''}`} />
              <span className="text-xs text-white">{previewPortrait ? 'Landscape' : 'Portrait'}</span>
            </button>
          </div>

          {/* Controls below preview */}
          <div className="flex flex-col items-center gap-4 w-full">
            {/* Device controls row - compact icon buttons only */}
            <div className="flex items-center justify-center gap-3 w-full max-w-2xl">
              <SplitButtonControl
                type="mic"
                isOn={micEnabled}
                devices={availableDevices.mics}
                selectedDeviceId={micId}
                onToggle={() => setMicEnabled(!micEnabled)}
                onSwitchDevice={setMicId}
                label={t.microphone || 'Microphone'}
              />

              <SplitButtonControl
                type="camera"
                isOn={cameraEnabled}
                devices={availableDevices.cameras}
                selectedDeviceId={cameraId}
                onToggle={() => setCameraEnabled(!cameraEnabled)}
                onSwitchDevice={setCameraId}
                label={t.camera || 'Camera'}
              />

              <SplitButtonControl
                type="speaker"
                devices={availableDevices.speakers}
                selectedDeviceId={speakerId}
                onSwitchDevice={setSpeakerId}
                label={t.speaker || 'Speaker'}
              />
            </div>

            {/* Test mic */}
            <div className="flex gap-2">
              {testState === 'idle' && (
                <Button variant="outline" size="sm" onClick={handleStartRecording} disabled={!micEnabled}>
                  <Mic className="w-4 h-4 mr-2" />
                  {t.test_mic || 'Test audio'}
                </Button>
              )}
              {testState === 'recording' && (
                <>
                  <Button variant="destructive" size="sm" disabled>
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-2" />
                    {t.recording || 'Recording...'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancelTest}>
                    {t.cancel || 'Cancel'}
                  </Button>
                </>
              )}
              {testState === 'recorded' && (
                <>
                  <Button variant="default" size="sm" onClick={handlePlayRecording}>
                    <Play className="w-4 h-4 mr-2" />
                    {t.play_recording || 'Play recording'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancelTest}>
                    {t.discard || 'Discard'}
                  </Button>
                </>
              )}
              {testState === 'playing' && (
                <Button variant="secondary" size="sm" disabled>
                  <Volume2 className="w-4 h-4 mr-2 animate-pulse" />
                  {t.playing || 'Playing...'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Sidebar — meeting info + join */}
        <div className="w-96 bg-muted/30 border-l border-border flex flex-col p-8 gap-8 justify-center">
          {/* Logo — tenant white-label if present, otherwise CEMPilot */}
          {tenantBranding.logoUrl ? (
            <img src={tenantBranding.logoUrl} alt="Tenant logo" className="h-10" />
          ) : (
            <CemPilotLogo size="lg" />
          )}

          {/* Meeting info */}
          <div>
            <h1 className="text-2xl font-bold text-foreground text-pretty leading-tight">
              {meeting.title || t.meeting_title || 'Join Meeting'}
            </h1>
            {scheduledTime && (
              <p className="text-sm text-muted-foreground mt-2">{scheduledTime}</p>
            )}
            {meeting.initiatorName && (
              <p className="text-base text-muted-foreground mt-3">
                {t.initiated_by || 'Meeting with'} {meeting.initiatorName}
              </p>
            )}
          </div>

          {/* Name input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              {t.display_name_label || 'Your name'}
            </label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t.display_name_placeholder || 'Enter your name'}
              className="h-11"
            />
            {isDisplayNameEmpty && (
              <p className="text-xs text-destructive">
                {t.display_name_required || 'Please enter your name to continue'}
              </p>
            )}
          </div>

          {/* Join button */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={() => handleJoinClick(cameraEnabled ? 'video' : 'voice')}
              disabled={isJoinDisabled || isLoading}
              size="lg"
              className="w-full"
            >
              {t.join_meeting || 'Join Meeting'}
            </Button>
          </div>

          {/* Cancel */}
          <Button onClick={onCancel} variant="ghost" className="w-full">
            {t.cancel || 'Cancel'}
          </Button>

          {/* Powered by */}
          {localUser.isGuest && (
            <div className="flex flex-col items-center gap-2 pt-4 border-t border-border/50">
              <span className="text-xs text-muted-foreground">{t.powered_by || 'Powered by CEMPilot'}</span>
              <CemPilotLogo size="sm" />
            </div>
          )}
        </div>
      </div>

      {/* Side panel toggle — bottom-right corner */}
      {showSidePanelToggle && (
        <button
          onClick={onToggleSidePanel}
          className="absolute bottom-4 right-4 bg-muted hover:bg-muted/80 border border-border p-2 rounded-full transition-colors"
          title={sidePanelCollapsed ? 'Show panel' : 'Hide panel'}
        >
          {sidePanelCollapsed ? (
            <ChevronLeft className="w-4 h-4 text-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-foreground" />
          )}
        </button>
      )}
    </div>
  )
}
