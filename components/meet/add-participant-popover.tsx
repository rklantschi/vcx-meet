'use client'

import { useState } from 'react'
import { Search, Copy, MessageCircle, Mail, Phone, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { InternalUser } from '@/types/meet'

interface AddParticipantPopoverProps {
  internalUsers: InternalUser[]
  meetingLinkUrl: string
  onAddInternalParticipant: (userId: string) => void
  onGenerateGuestLink: (params: { sendVia: 'whatsapp' | 'sms' | 'email' | 'copy' }) => void
}

export function AddParticipantPopover({
  internalUsers,
  meetingLinkUrl,
  onAddInternalParticipant,
  onGenerateGuestLink,
}: AddParticipantPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)

  const filteredUsers = (internalUsers || []).filter((user) =>
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddUser = (userId: string) => {
    onAddInternalParticipant(userId)
    setIsOpen(false)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingLinkUrl)
    setCopied(true)
    onGenerateGuestLink({ sendVia: 'copy' })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          Add participant
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <Tabs defaultValue="internal" className="w-full">
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="internal" className="flex-1">
              Teammates
            </TabsTrigger>
            <TabsTrigger value="link" className="flex-1">
              Guest link
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Internal users */}
          <TabsContent value="internal" className="m-0">
            <div className="p-4 space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search teammates"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8"
                />
              </div>

              {/* User list */}
              <div className="max-h-64 overflow-y-auto space-y-1">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleAddUser(user.id)}
                      className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-slate-100 transition-colors text-left"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} alt={user.displayName} />
                        <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.displayName}</p>
                        {user.role && (
                          <p className="text-xs text-muted-foreground truncate">
                            {user.team ? `${user.role} • ${user.team}` : user.role}
                          </p>
                        )}
                      </div>
                      {user.isOnline && (
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      )}
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No teammates found
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Guest link */}
          <TabsContent value="link" className="m-0">
            <div className="p-4 space-y-4">
              {/* Link display */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Meeting link
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={meetingLinkUrl}
                    className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 font-mono truncate"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyLink}
                    className="px-2 h-8"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Share buttons */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Share via
                </p>
                <div className="grid gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start text-xs"
                    onClick={() => {
                      onGenerateGuestLink({ sendVia: 'whatsapp' })
                      setIsOpen(false)
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start text-xs"
                    onClick={() => {
                      onGenerateGuestLink({ sendVia: 'sms' })
                      setIsOpen(false)
                    }}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    SMS
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start text-xs"
                    onClick={() => {
                      onGenerateGuestLink({ sendVia: 'email' })
                      setIsOpen(false)
                    }}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
