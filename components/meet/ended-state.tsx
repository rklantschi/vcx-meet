'use client'

import { MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CemPilotLogo } from '@/brand-kit'
import type { Meeting, TenantBranding, MeetingEndReason, TranslationStrings } from '@/types/meet'

interface EndedStateProps {
  endedReason: MeetingEndReason
  meeting: Meeting
  tenantBranding: TenantBranding
  onRejoin?: () => void
  onReturn: () => void
  t: TranslationStrings
  showSidePanelToggle?: boolean
  sidePanelCollapsed?: boolean
  onToggleSidePanel?: () => void
}

export function EndedState({
  endedReason,
  meeting,
  tenantBranding,
  onRejoin,
  onReturn,
  t,
  showSidePanelToggle = false,
  sidePanelCollapsed = false,
  onToggleSidePanel,
}: EndedStateProps) {
  const getHeadline = () => {
    switch (endedReason) {
      case 'left':
        return t.you_left || 'You left the call'
      case 'initiator-ended':
        return t.call_ended_by_initiator || 'Call ended by initiator'
      case 'kicked':
        return t.you_were_removed || 'You were removed from the call'
      case 'connection-lost':
        return t.connection_lost || 'Connection lost'
      case 'too-late':
        return t.call_has_ended || 'This call has ended'
      default:
        return t.call_ended || 'Call ended'
    }
  }

  const getDuration = () => {
    if (!meeting.durationMs) return null
    const minutes = Math.floor(meeting.durationMs / 60000)
    const seconds = Math.floor((meeting.durationMs % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-background p-4 gap-8">
      {/* Logo — tenant white-label if present, otherwise CEMPilot */}
      <div className="absolute top-6 left-6">
        {tenantBranding.logoUrl ? (
          <img src={tenantBranding.logoUrl} alt="Tenant logo" className="h-8" />
        ) : (
          <CemPilotLogo size="sm" />
        )}
      </div>

      {/* Main content */}
      <div className="w-full max-w-md flex flex-col items-center gap-6 text-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <MessageSquare className="w-8 h-8 text-muted-foreground" />
        </div>

        {/* Headline */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">{getHeadline()}</h1>
          {meeting.title && <p className="text-sm text-muted-foreground mb-1">{meeting.title}</p>}
          {getDuration() && <p className="text-xs text-muted-foreground">{t.duration || 'Duration'}: {getDuration()}</p>}
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-2">
          {/* Rejoin button */}
          {meeting.isStillActive && onRejoin && (
            <Button onClick={onRejoin} size="lg" className="w-full">
              {t.rejoin || 'Rejoin'}
            </Button>
          )}

          {/* Close/Return button */}
          <Button onClick={onReturn} variant="outline" size="lg" className="w-full">
            {t.close || 'Close'}
          </Button>
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
