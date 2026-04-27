'use client'

import { Mic, MicOff, Video, VideoOff, ChevronUp, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import type { MediaDevice } from '@/types/meet'

interface SplitButtonControlProps {
  type: 'mic' | 'camera' | 'speaker'
  isOn?: boolean
  devices: MediaDevice[]
  onToggle?: () => void
  onSwitchDevice: (deviceId: string) => void
  label?: string
}

export function SplitButtonControl({
  type,
  isOn = true,
  devices,
  onToggle,
  onSwitchDevice,
  label = type === 'mic' ? 'Microphone' : type === 'camera' ? 'Camera' : 'Speaker',
}: SplitButtonControlProps) {
  const Icon =
    type === 'mic' ? (isOn ? Mic : MicOff) :
    type === 'camera' ? (isOn ? Video : VideoOff) :
    isOn ? Volume2 : VolumeX

  const hasMultipleDevices = devices.length > 1
  const canToggle = !!onToggle

  return (
    <div className="flex items-center rounded-full overflow-hidden bg-slate-700 hover:bg-slate-600 transition-colors">
      {/* Main button - toggle on/off (or just icon for speaker) */}
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-none border-0 h-10 w-10 ${
          canToggle && !isOn
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-transparent text-white'
        }`}
        onClick={canToggle ? onToggle : undefined}
      >
        <Icon className="w-5 h-5" />
      </Button>

      {/* Divider */}
      {hasMultipleDevices && (
        <div className="w-px h-6 bg-slate-500 opacity-50" />
      )}

      {/* Chevron button - open device selector */}
      {hasMultipleDevices && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-none border-0 h-10 w-8 text-white hover:bg-slate-500"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-48">
            <DropdownMenuLabel className="text-xs">{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {devices.map((device) => (
              <DropdownMenuItem
                key={device.id}
                onClick={() => onSwitchDevice(device.id)}
              >
                {device.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
