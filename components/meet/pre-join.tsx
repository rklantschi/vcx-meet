'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Video, VideoOff, ChevronDown, AlertCircle, Volume2, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
}: PreJoinProps) {
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
  const micAnimationRef = useRef<number | null>(null)
  const testRecordingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate camera preview
  useEffect(() => {
    if (videoPreviewRef.current && cameraEnabled) {
      // In real app, this would use getUserMedia
      videoPreviewRef.current.style.backgroundColor = 'rgba(0,0,0,0.1)'
    }
  }, [cameraEnabled])

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
    <div className="h-screen flex flex-col items-center bg-background p-4 overflow-y-auto">
      {/* Logo - mobile only */}
      {tenantBranding.logoUrl && (
        <div className="absolute top-6 left-6 md:hidden">
          <img src={tenantBranding.logoUrl} alt="Tenant logo" className="h-8" />
        </div>
      )}

      {/* Mobile layout (< md) */}
      <div className="md:hidden w-full max-w-md flex flex-col items-center gap-6 my-auto py-6">
        {/* Camera preview */}
        <div className="w-32 h-32 rounded-2xl bg-muted border-2 border-border overflow-hidden flex items-center justify-center relative">
          {cameraEnabled ? (
            <div className="w-full h-full relative">
              <video
                ref={videoPreviewRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
              {/* Simulated camera preview overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <div className="text-3xl font-bold text-foreground/80">
                  {displayName.charAt(0).toUpperCase() || '?'}
                </div>
              </div>
              {/* Camera active indicator */}
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full bg-muted">
              <VideoOff className="w-8 h-8 text-muted-foreground mb-1" />
              <div className="text-2xl font-bold text-muted-foreground">
                {displayName.charAt(0).toUpperCase() || '?'}
              </div>
            </div>
          )}
        </div>

        {/* Meeting info */}
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground">{meeting.title || t.meeting_title || 'Join Meeting'}</h1>
          {meeting.initiatorName && (
            <p className="text-sm text-muted-foreground">{t.initiated_by || 'Meeting with'} {meeting.initiatorName}</p>
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

        {/* Mic level indicator */}
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t.microphone_level || 'Microphone level'}</span>
            <span>{micEnabled ? `${Math.round(micLevel)}%` : t.muted || 'Muted'}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent rounded-full transition-all duration-75"
              style={{ width: `${micLevel}%` }}
            />
          </div>
        </div>

        {/* Test mic/speaker buttons */}
        <div className="w-full flex gap-2">
          {testState === 'idle' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartRecording}
              disabled={!micEnabled}
              className="flex-1"
            >
              <Mic className="w-4 h-4 mr-2" />
              {t.test_mic || 'Test mic'}
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

        {/* Device controls */}
        <div className="w-full flex gap-2 justify-center">
          <button
            onClick={() => setMicEnabled(!micEnabled)}
            className="w-10 h-10 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
            title={t.toggle_microphone || 'Toggle microphone'}
          >
            {micEnabled ? (
              <Mic className="w-5 h-5 text-foreground" />
            ) : (
              <MicOff className="w-5 h-5 text-destructive" />
            )}
          </button>
          <button
            onClick={() => setCameraEnabled(!cameraEnabled)}
            className="w-10 h-10 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
            title={t.toggle_camera || 'Toggle camera'}
          >
            {cameraEnabled ? (
              <Video className="w-5 h-5 text-foreground" />
            ) : (
              <VideoOff className="w-5 h-5 text-destructive" />
            )}
          </button>
        </div>

        {/* Display name input */}
        <div className="w-full">
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={t.display_name_placeholder || 'Your name'}
            className="text-center"
          />
        </div>

        {/* Device pickers */}
        <div className="w-full space-y-3">
          {/* Microphone select */}
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-muted-foreground" />
            <Select value={micId} onValueChange={setMicId}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableDevices.mics.map((mic) => (
                  <SelectItem key={mic.id} value={mic.id}>
                    {mic.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Camera select */}
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-muted-foreground" />
            <Select value={cameraId} onValueChange={setCameraId}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableDevices.cameras.map((camera) => (
                  <SelectItem key={camera.id} value={camera.id}>
                    {camera.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Speaker select */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <Select value={speakerId} onValueChange={setSpeakerId}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableDevices.speakers.map((speaker) => (
                  <SelectItem key={speaker.id} value={speaker.id}>
                    {speaker.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Display name required warning */}
        {isDisplayNameEmpty && (
          <p className="text-xs text-destructive text-center">
            {t.display_name_required || 'Please enter your name to continue'}
          </p>
        )}

        {/* Join buttons */}
        <div className="w-full flex gap-3 pt-4">
          <Button
            onClick={() => handleJoinClick('voice')}
            disabled={isJoinDisabled || isLoading}
            className="flex-1"
            size="lg"
          >
            {t.join_voice || 'Join voice'}
          </Button>
          <Button
            onClick={() => handleJoinClick('video')}
            disabled={isJoinDisabled || isLoading}
            className="flex-1"
            size="lg"
          >
            {t.join_video || 'Join video'}
          </Button>
        </div>

        {/* Cancel */}
        <Button onClick={onCancel} variant="ghost" className="w-full">
          {t.cancel || 'Cancel'}
        </Button>

        {/* Powered by footer - mobile */}
        {localUser.isGuest && (
          <div className="text-xs text-muted-foreground pt-4">
            {t.powered_by || 'Powered by Vortex CX'}
          </div>
        )}
      </div>

      {/* Desktop layout (md+) */}
      <div className="hidden md:flex max-w-4xl mx-auto w-full h-full items-center justify-center gap-12">
        {/* LEFT: Camera preview + controls */}
        <div className="flex-1 flex flex-col items-center gap-6">
          {/* Logo */}
          {tenantBranding.logoUrl && (
            <div className="absolute top-6 left-6">
              <img src={tenantBranding.logoUrl} alt="Tenant logo" className="h-10" />
            </div>
          )}

          {/* Large camera preview */}
          <div className="w-80 h-80 rounded-2xl bg-muted border-4 border-border overflow-hidden flex items-center justify-center relative">
            {cameraEnabled ? (
              <div className="w-full h-full relative">
                <video
                  ref={videoPreviewRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                {/* Simulated camera preview overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <div className="text-7xl font-bold text-foreground/80">
                    {displayName.charAt(0).toUpperCase() || '?'}
                  </div>
                </div>
                {/* Camera active indicator */}
                <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/50 px-2 py-1 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-white">{t.camera_on || 'Camera on'}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full bg-muted gap-2">
                <VideoOff className="w-12 h-12 text-muted-foreground" />
                <div className="text-6xl font-bold text-muted-foreground">
                  {displayName.charAt(0).toUpperCase() || '?'}
                </div>
                <span className="text-sm text-muted-foreground">{t.camera_off || 'Camera off'}</span>
              </div>
            )}
          </div>

          {/* Mic level indicator */}
          <div className="w-80 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t.microphone_level || 'Microphone level'}</span>
              <span>{micEnabled ? `${Math.round(micLevel)}%` : t.muted || 'Muted'}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent rounded-full transition-all duration-75"
                style={{ width: `${micLevel}%` }}
              />
            </div>
          </div>

          {/* Test mic/speaker buttons */}
          <div className="w-80 flex gap-2">
            {testState === 'idle' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleStartRecording}
                disabled={!micEnabled}
                className="flex-1"
              >
                <Mic className="w-4 h-4 mr-2" />
                {t.test_mic || 'Test mic'}
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

          {/* Device controls */}
          <div className="flex gap-3">
            <button
              onClick={() => setMicEnabled(!micEnabled)}
              className="w-12 h-12 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
              title={t.toggle_microphone || 'Toggle microphone'}
            >
              {micEnabled ? (
                <Mic className="w-6 h-6 text-foreground" />
              ) : (
                <MicOff className="w-6 h-6 text-destructive" />
              )}
            </button>
            <button
              onClick={() => setCameraEnabled(!cameraEnabled)}
              className="w-12 h-12 rounded-full bg-muted hover:bg-muted-foreground/20 flex items-center justify-center transition-colors"
              title={t.toggle_camera || 'Toggle camera'}
            >
              {cameraEnabled ? (
                <Video className="w-6 h-6 text-foreground" />
              ) : (
                <VideoOff className="w-6 h-6 text-destructive" />
              )}
            </button>
          </div>
        </div>

        {/* RIGHT: Form */}
        <div className="flex-1 flex flex-col gap-6 max-w-sm">
          {/* Meeting title */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">{t.meeting || 'Meeting'}</p>
            <h1 className="text-2xl font-bold text-foreground">{meeting.title || t.meeting_title || 'Join Meeting'}</h1>
            {meeting.initiatorName && (
              <p className="text-sm text-muted-foreground mt-1">{t.initiated_by || 'With'} {meeting.initiatorName}</p>
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
              <AlertDescription className="flex flex-col gap-2">
                <span>{t.waiting_for_other || `Waiting for ${otherParty.displayName}`}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSendNudge}
                  disabled={sendingNudge}
                  className="w-fit"
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
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t.your_name || 'Your name'}
            </label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t.display_name_placeholder || 'Your name'}
            />
            {isDisplayNameEmpty && (
              <p className="text-xs text-destructive mt-1">
                {t.display_name_required || 'Please enter your name to continue'}
              </p>
            )}
          </div>

          {/* Device pickers */}
          <div className="space-y-3">
            {/* Microphone select */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                <Mic className="w-4 h-4" />
                {t.microphone || 'Microphone'}
              </label>
              <Select value={micId} onValueChange={setMicId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableDevices.mics.map((mic) => (
                    <SelectItem key={mic.id} value={mic.id}>
                      {mic.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Camera select */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                <Video className="w-4 h-4" />
                {t.camera || 'Camera'}
              </label>
              <Select value={cameraId} onValueChange={setCameraId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableDevices.cameras.map((camera) => (
                    <SelectItem key={camera.id} value={camera.id}>
                      {camera.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Speaker select */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                {t.speaker || 'Speaker'}
              </label>
              <Select value={speakerId} onValueChange={setSpeakerId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableDevices.speakers.map((speaker) => (
                    <SelectItem key={speaker.id} value={speaker.id}>
                      {speaker.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Join buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => handleJoinClick('voice')}
              disabled={isJoinDisabled || isLoading}
              className="flex-1"
              size="lg"
            >
              {t.join_voice || 'Join voice'}
            </Button>
            <Button
              onClick={() => handleJoinClick('video')}
              disabled={isJoinDisabled || isLoading}
              className="flex-1"
              size="lg"
            >
              {t.join_video || 'Join video'}
            </Button>
          </div>

          {/* Cancel */}
          <Button onClick={onCancel} variant="ghost">
            {t.cancel || 'Cancel'}
          </Button>
        </div>
      </div>

      {/* Tenant branding footer - desktop only */}
      {localUser.isGuest && (
        <div className="hidden md:block absolute bottom-6 text-xs text-muted-foreground">
          {t.powered_by || 'Powered by Vortex CX'}
        </div>
      )}
    </div>
  )
}
