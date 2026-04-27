'use client'

import { useState } from 'react'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  Users,
  MessageSquare,
  MoreVertical,
  LogOut,
  ChevronDown,
  Volume2,
  Settings,
  Lock,
  Square,
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
import { EndCallConfirmation } from './end-call-confirmation'
import type { AvailableDevices, TranslationStrings } from '@/types/meet'

interface ActionBarProps {
  micOn: boolean
  cameraOn: boolean
  sharingScreen: boolean
  captionsOn: boolean
  recordingActive?: boolean
  voiceOnlyLocked?: boolean
  isInitiator?: boolean
  availableDevices: AvailableDevices
  onToggleMic: () => void
  onToggleCamera: () => void
  onSwitchMic: (deviceId: string) => void
  onSwitchCamera: (deviceId: string) => void
  onSwitchSpeaker: (deviceId: string) => void
  onStartScreenShare: () => void
  onStopScreenShare: () => void
  onAddParticipant: () => void
  onToggleCaptions: () => void
  onToggleRecording?: () => void
  onToggleVoiceOnlyLock?: () => void
  onRemoveParticipant?: (participantId: string) => void
  onEndCallForEveryone?: () => void
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
  availableDevices,
  onToggleMic,
  onToggleCamera,
  onSwitchMic,
  onSwitchCamera,
  onSwitchSpeaker,
  onStartScreenShare,
  onStopScreenShare,
  onAddParticipant,
  onToggleCaptions,
  onToggleRecording,
  onToggleVoiceOnlyLock,
  onEndCallForEveryone,
  onLeave,
  t,
}: ActionBarProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [showEndCallDialog, setShowEndCallDialog] = useState(false)

  return (
    <TooltipProvider>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-black/50 px-4 py-3 flex items-center justify-center gap-2 transition-opacity">
        {/* Mic control */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={micOn ? 'default' : 'destructive'}
              size="icon"
              className="rounded-full"
              onClick={onToggleMic}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
          </DropdownMenuTrigger>
          {availableDevices.mics.length > 1 && (
            <DropdownMenuContent align="center" className="w-48">
              <DropdownMenuLabel className="text-xs">{t.microphone || 'Microphone'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableDevices.mics.map((mic) => (
                <DropdownMenuItem key={mic.id} onClick={() => onSwitchMic(mic.id)}>
                  {mic.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          )}
        </DropdownMenu>

        {/* Camera control */}
        {!voiceOnlyLocked && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={cameraOn ? 'default' : 'destructive'}
                size="icon"
                className="rounded-full"
                onClick={onToggleCamera}
              >
                {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>
            </DropdownMenuTrigger>
            {availableDevices.cameras.length > 1 && (
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuLabel className="text-xs">{t.camera || 'Camera'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableDevices.cameras.map((camera) => (
                  <DropdownMenuItem key={camera.id} onClick={() => onSwitchCamera(camera.id)}>
                    {camera.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        )}

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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={onAddParticipant}
            >
              <Users className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t.add_participant || 'Add participant'}</TooltipContent>
        </Tooltip>

        {/* Captions */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={captionsOn ? 'default' : 'outline'}
              size="icon"
              className="rounded-full"
              onClick={onToggleCaptions}
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t.captions || 'Live captions'}</TooltipContent>
        </Tooltip>

        {/* More menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* Speaker selection */}
            {availableDevices.speakers.length > 0 && (
              <>
                <DropdownMenuLabel className="text-xs flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  {t.speaker || 'Speaker'}
                </DropdownMenuLabel>
                {availableDevices.speakers.map((speaker) => (
                  <DropdownMenuItem key={speaker.id} onClick={() => onSwitchSpeaker(speaker.id)}>
                    {speaker.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}

            {/* Initiator controls */}
            {isInitiator && (
              <>
                <DropdownMenuLabel className="text-xs">{t.host_controls || 'Host Controls'}</DropdownMenuLabel>
                <DropdownMenuItem onClick={onToggleRecording}>
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
                  <LogOut className="w-4 h-4 mr-2" />
                  {t.end_call_for_all || 'End call for everyone'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              {t.settings || 'Settings'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Leave button */}
        <Button
          variant="destructive"
          size="icon"
          className="rounded-full ml-2"
          onClick={onLeave}
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

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
