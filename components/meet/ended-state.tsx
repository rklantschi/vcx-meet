'use client'

import { useState } from 'react'
import { Star, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { Meeting, TenantBranding, MeetingEndReason, FeedbackSubmission, TranslationStrings } from '@/types/meet'

interface EndedStateProps {
  endedReason: MeetingEndReason
  meeting: Meeting
  tenantBranding: TenantBranding
  onRejoin?: () => void
  onSubmitFeedback: (feedback: FeedbackSubmission) => void
  onReturn: () => void
  t: TranslationStrings
}

export function EndedState({
  endedReason,
  meeting,
  tenantBranding,
  onRejoin,
  onSubmitFeedback,
  onReturn,
  t,
}: EndedStateProps) {
  const [showFeedback, setShowFeedback] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submittingFeedback, setSubmittingFeedback] = useState(false)

  const handleSubmitFeedback = async () => {
    setSubmittingFeedback(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      onSubmitFeedback({ rating, comment })
      setShowFeedback(false)
    } finally {
      setSubmittingFeedback(false)
    }
  }

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
    <div className="h-screen flex flex-col items-center justify-center bg-background p-4 gap-8">
      {/* Logo */}
      {tenantBranding.logoUrl && (
        <div className="absolute top-6 left-6">
          <img src={tenantBranding.logoUrl} alt="Tenant logo" className="h-8" />
        </div>
      )}

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

        {/* Rejoin button */}
        {meeting.isStillActive && onRejoin && (
          <Button onClick={onRejoin} size="lg" className="w-full">
            {t.rejoin || 'Rejoin'}
          </Button>
        )}

        {/* Feedback form */}
        {!showFeedback ? (
          <Button
            onClick={() => setShowFeedback(true)}
            variant="outline"
            className="w-full"
          >
            {t.leave_feedback || 'Leave feedback'}
          </Button>
        ) : (
          <div className="w-full space-y-4 pt-4 border-t">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">{t.rating || 'How was your experience?'}</p>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-2xl transition-colors"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t.comment_placeholder || 'Share your feedback (optional)'}
                className="min-h-24 text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmitFeedback}
                disabled={submittingFeedback}
                className="flex-1"
              >
                {t.submit || 'Submit'}
              </Button>
              <Button
                onClick={() => setShowFeedback(false)}
                variant="outline"
                className="flex-1"
              >
                {t.skip || 'Skip'}
              </Button>
            </div>
          </div>
        )}

        {/* Return button */}
        <Button onClick={onReturn} variant="ghost" className="w-full">
          {t.return_to_dashboard || 'Return to dashboard'}
        </Button>
      </div>
    </div>
  )
}
