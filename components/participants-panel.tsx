"use client"

import { Mic, MicOff, Video, VideoOff, X, MoreVertical, Crown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Participant {
  id: string
  name: string
  avatar: string
  isMuted: boolean
  isVideoOn: boolean
  isHost?: boolean
  isYou?: boolean
}

const participants: Participant[] = [
  {
    id: "1",
    name: "You",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    isMuted: false,
    isVideoOn: true,
    isHost: true,
    isYou: true,
  },
  {
    id: "2",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    isMuted: false,
    isVideoOn: true,
  },
  {
    id: "3",
    name: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    isMuted: true,
    isVideoOn: true,
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    isMuted: false,
    isVideoOn: false,
  },
  {
    id: "5",
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    isMuted: true,
    isVideoOn: true,
  },
  {
    id: "6",
    name: "Lisa Thompson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    isMuted: false,
    isVideoOn: true,
  },
]

interface ParticipantsPanelProps {
  onClose: () => void
}

export function ParticipantsPanel({ onClose }: ParticipantsPanelProps) {
  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <h2 className="font-semibold text-foreground">Participants ({participants.length})</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search participants..."
            className="pl-9 bg-secondary border-0"
          />
        </div>
      </div>

      {/* Host actions */}
      <div className="p-4 border-b border-border flex gap-2">
        <Button variant="secondary" size="sm" className="flex-1 text-xs">
          Mute All
        </Button>
        <Button variant="secondary" size="sm" className="flex-1 text-xs">
          Invite
        </Button>
      </div>

      {/* Participants list */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 group"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={participant.avatar} alt={participant.name} />
                <AvatarFallback>
                  {participant.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">
                    {participant.name}
                  </span>
                  {participant.isHost && (
                    <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                  )}
                  {participant.isYou && (
                    <span className="text-xs text-muted-foreground">(You)</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {participant.isMuted ? (
                  <MicOff className="w-4 h-4 text-destructive" />
                ) : (
                  <Mic className="w-4 h-4 text-muted-foreground" />
                )}
                {participant.isVideoOn ? (
                  <Video className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <VideoOff className="w-4 h-4 text-destructive" />
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Pin to spotlight</DropdownMenuItem>
                    <DropdownMenuItem>Send private message</DropdownMenuItem>
                    {!participant.isYou && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          {participant.isMuted ? "Ask to unmute" : "Mute"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Remove from call
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
