'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import type { TranslationStrings } from '@/types/meet'

interface EndCallConfirmationProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  t: TranslationStrings
}

export function EndCallConfirmation({
  isOpen,
  onConfirm,
  onCancel,
  t,
}: EndCallConfirmationProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.end_call_for_all || 'End call for everyone?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.end_call_confirmation || 'This will disconnect all participants from the call. This action cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {t.cancel || 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            {t.end_call || 'End call'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
