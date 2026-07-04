'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { AiRuneBadge } from '@/brand-kit'
import type { AvailableDevices, LocalParticipant, Meeting, TranslationStrings } from '@/types/meet'

interface SettingsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  displayName: string
  meeting: Meeting
  availableDevices: AvailableDevices
  localParticipant: LocalParticipant
  micVolume?: number
  speakerVolume?: number
  onSwitchMic: (deviceId: string) => void
  onSwitchCamera: (deviceId: string) => void
  onSwitchSpeaker: (deviceId: string) => void
  onToggleCaptions: () => void
  onMicVolumeChange?: (volume: number) => void
  onSpeakerVolumeChange?: (volume: number) => void
  t: TranslationStrings
}

export function SettingsDialog({
  isOpen,
  onOpenChange,
  displayName,
  meeting,
  availableDevices,
  localParticipant,
  micVolume = 80,
  speakerVolume = 80,
  onSwitchMic,
  onSwitchCamera,
  onSwitchSpeaker,
  onToggleCaptions,
  onMicVolumeChange,
  onSpeakerVolumeChange,
  t,
}: SettingsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t.settings || 'Settings'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Your name */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              {t.your_name || 'Your name'}
            </Label>
            <div className="text-sm font-medium text-foreground">{displayName}</div>
          </div>

          {/* Meeting */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              {t.meeting || 'Meeting'}
            </Label>
            <div className="text-sm font-medium text-foreground truncate">
              {meeting.title}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Microphone */}
          <div className="space-y-2">
            <Label htmlFor="mic-select" className="text-sm">
              {t.microphone || 'Microphone'}
            </Label>
            <Select
              value={availableDevices.mics[0]?.id || ''}
              onValueChange={onSwitchMic}
            >
              <SelectTrigger id="mic-select" className="h-8">
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

          {/* Camera */}
          <div className="space-y-2">
            <Label htmlFor="camera-select" className="text-sm">
              {t.camera || 'Camera'}
            </Label>
            <Select
              value={availableDevices.cameras[0]?.id || ''}
              onValueChange={onSwitchCamera}
            >
              <SelectTrigger id="camera-select" className="h-8">
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

          {/* Speaker */}
          <div className="space-y-2">
            <Label htmlFor="speaker-select" className="text-sm">
              {t.speaker || 'Speaker'}
            </Label>
            <Select
              value={availableDevices.speakers[0]?.id || ''}
              onValueChange={onSwitchSpeaker}
            >
              <SelectTrigger id="speaker-select" className="h-8">
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

          {/* Live captions */}
          <div className="flex items-center justify-between">
            <Label htmlFor="captions-toggle" className="text-sm cursor-pointer flex items-center gap-2">
              <AiRuneBadge size={18} runeSize={11} aria-label="AI" />
              {t.live_captions || 'Live captions'}
            </Label>
            <Switch
              id="captions-toggle"
              checked={localParticipant.captionsOn}
              onCheckedChange={onToggleCaptions}
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Microphone Volume */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="mic-volume" className="text-sm">
                {t.microphone_volume || 'Microphone volume'}
              </Label>
              <span className="text-xs text-muted-foreground">{micVolume}%</span>
            </div>
            <Slider
              id="mic-volume"
              min={0}
              max={100}
              step={1}
              value={[micVolume]}
              onValueChange={(value) => onMicVolumeChange?.(value[0])}
              className="w-full"
            />
          </div>

          {/* Speaker Volume */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="speaker-volume" className="text-sm">
                {t.speaker_volume || 'Speaker volume'}
              </Label>
              <span className="text-xs text-muted-foreground">{speakerVolume}%</span>
            </div>
            <Slider
              id="speaker-volume"
              min={0}
              max={100}
              step={1}
              value={[speakerVolume]}
              onValueChange={(value) => onSpeakerVolumeChange?.(value[0])}
              className="w-full"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            {t.done || 'Done'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
