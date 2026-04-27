'use client'

import { useState } from 'react'
import {
  Share2,
  MoreVertical,
  PhoneOff,
  Square,
  Lock,
  Settings,
  Captions,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { SplitButtonControl } from './split-button-control'
import { AddParticipantPopover } from './add-participant-popover'
import { SettingsDialog } from './settings-dialog'
import { RecordingConsentDialog } from './recording-consent-dialog'
import { EndCallConfirmation } from './end-call-confirmation'
import type { AvailableDevices, TranslationStrings, InternalUser, Meeting, LocalParticipant } from '@/types/meet'

interface ActionBarProps {
  micOn: boolean
  cameraOn: boolean
  sharingScreen: boolean
  captionsOn: boolean
  recordingActive?: boolean
  voiceOnlyLocked?: boolean
  isInitiator?: boolean
  displayName: string
  meeting: Meeting
  localParticipant: LocalParticipant
  availableDevices: AvailableDevices
  internalUsers: InternalUser[]
  meetingLinkUrl: string
  micVolume?: number
  speakerVolume?: number
  onToggleMic: () => void
  onToggleCamera: () => void
  onSwitchMic: (deviceId: string) => void
  onSwitchCamera: (deviceId: string) => void
  onSwitchSpeaker: (deviceId: string) => void
  onStartScreenShare: () => void
  onStopScreenShare: () => void
  onAddInternalParticipant: (userId: string) => void
  onGenerateGuestLink: (params: { sendVia: 'whatsapp' | 'sms' | 'email' | 'copy' }) => void
  onToggleCaptions: () => void
  onToggleRecording?: () => void
  onToggleVoiceOnlyLock?: () => void
  onEndCallForEveryone?: () => void
  onMicVolumeChange?: (volume: number) => void
  onSpeakerVolumeChange?: (volume: number) => void
  onLeave: () => void
  t: TranslationStrings
}

export function ActionBar({
  micOn,
  cameraOn,
  sharingScreen,
  captionsOn,
  recordingActive = false,
  voiceOnlyLocked = false,
  isInitiator = false,
  displayName,
  meeting,
  localParticipant,
  availableDevices,
  internalUsers,
  meetingLinkUrl,
  micVolume = 80,
  speakerVolume = 80,
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
  onEndCallForEveryone,
  onMicVolumeChange,
  onSpeakerVolumeChange,
  onLeave,
  t,
}: ActionBarProps) {
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [showEndCallDialog, setShowEndCallDialog] = useState(false)
  const [showRecordingConsent, setShowRecordingConsent] = useState(false)
  const [recordingConsentGiven, setRecordingConsentGiven] = useState(false)

  const handleToggleRecording = () => {
    if (!recordingActive && !recordingConsentGiven && isInitiator) {
      setShowRecordingConsent(true)
    } else {
      onToggleRecording?.()
    }
  }

  const handleConfirmRecording = () => {
    setShowRecordingConsent(false)
    setRecordingConsentGiven(true)
    onToggleRecording?.()
  }

  return (
    <TooltipProvider>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-black/50 px-3 py-3 sm:px-4 flex items-center justify-between sm:justify-center gap-2 sm:gap-3">
        {/* Always-visible core controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mic split button */}
          <SplitButtonControl
            type="mic"
            isOn={micOn}
            devices={availableDevices.mics}
            onToggle={onToggleMic}
            onSwitchDevice={onSwitchMic}
            label={t.microphone || 'Microphone'}
          />

          {/* Camera split button */}
          {!voiceOnlyLocked && (
            <SplitButtonControl
              type="camera"
              isOn={cameraOn}
              devices={availableDevices.cameras}
              onToggle={onToggleCamera}
              onSwitchDevice={onSwitchCamera}
              label={t.camera || 'Camera'}
            />
          )}
        </div>

        {/* Secondary controls — hidden on mobile, shown on sm+ */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Screen share */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={sharingScreen ? 'default' : 'outline'}
                size="icon"
                className="rounded-full"
                onClick={sharingScreen ? onStopScreenShare : onStartScreenShare}
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t.screen_share || 'Share screen'}</TooltipContent>
          </Tooltip>

          {/* Add participant */}
          <AddParticipantPopover
            internalUsers={internalUsers}
            meetingLinkUrl={meetingLinkUrl}
            onAddInternalParticipant={onAddInternalParticipant}
            onGenerateGuestLink={onGenerateGuestLink}
          />

          {/* Captions */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={captionsOn ? 'default' : 'outline'}
                size="icon"
                className="rounded-full"
                onClick={onToggleCaptions}
              >
                <Captions className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t.captions || 'Live captions'}</TooltipContent>
          </Tooltip>
        </div>

        {/* More menu — always visible; on mobile also includes secondary controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-56">
              {/* Mobile-only secondary controls */}
              <div className="sm:hidden">
                <DropdownMenuItem onClick={sharingScreen ? onStopScreenShare : onStartScreenShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  {sharingScreen ? t.stop_sharing || 'Stop sharing' : t.screen_share || 'Share screen'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onToggleCaptions}>
                  <Captions className="w-4 h-4 mr-2" />
                  {captionsOn ? t.hide_captions || 'Hide captions' : t.captions || 'Live captions'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>

              {/* Initiator controls */}
              {isInitiator && (
                <>
                  <DropdownMenuItem onClick={handleToggleRecording}>
                    <Square className="w-4 h-4 mr-2" />
                    {recordingActive ? t.stop_recording || 'Stop recording' : t.start_recording || 'Start recording'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onToggleVoiceOnlyLock}>
                    <Lock className="w-4 h-4 mr-2" />
                    {voiceOnlyLocked ? t.allow_video || 'Allow video' : t.voice_only || 'Voice only'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowEndCallDialog(true)}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {t.end_call_for_all || 'End call for everyone'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuItem onClick={() => setShowSettingsDialog(true)}>
                <Settings className="w-4 h-4 mr-2" />
                {t.settings || 'Settings'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Leave button */}
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full"
            onClick={onLeave}
          >
            <PhoneOff className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Settings dialog */}
      <SettingsDialog
        isOpen={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        displayName={displayName}
        meeting={meeting}
        availableDevices={availableDevices}
        localParticipant={localParticipant}
        micVolume={micVolume}
        speakerVolume={speakerVolume}
        onSwitchMic={onSwitchMic}
        onSwitchCamera={onSwitchCamera}
        onSwitchSpeaker={onSwitchSpeaker}
        onToggleCaptions={onToggleCaptions}
        onMicVolumeChange={onMicVolumeChange}
        onSpeakerVolumeChange={onSpeakerVolumeChange}
        t={t}
      />

      {/* Recording consent dialog */}
      <RecordingConsentDialog
        isOpen={showRecordingConsent}
        onConfirm={handleConfirmRecording}
        onCancel={() => setShowRecordingConsent(false)}
      />

      {/* End call confirmation */}
      {isInitiator && onEndCallForEveryone && (
        <EndCallConfirmation
          isOpen={showEndCallDialog}
          onConfirm={() => {
            setShowEndCallDialog(false)
            onEndCallForEveryone()
          }}
          onCancel={() => setShowEndCallDialog(false)}
          t={t}
        />
      )}
    </TooltipProvider>
  )
}

