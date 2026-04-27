"use client"

import { useState } from "react"
import { Mic, MicOff, Pin, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Participant {
  id: string
  name: string
  avatar: string
  isMuted: boolean
  isVideoOn: boolean
  isSpeaking: boolean
  isPinned?: boolean
}

const participants: Participant[] = [
  {
    id: "1",
    name: "You",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    isMuted: false,
    isVideoOn: true,
    isSpeaking: false,
  },
  {
    id: "2",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    isMuted: false,
    isVideoOn: true,
    isSpeaking: true,
  },
  {
    id: "3",
    name: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    isMuted: true,
    isVideoOn: true,
    isSpeaking: false,
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    isMuted: false,
    isVideoOn: false,
    isSpeaking: false,
  },
  {
    id: "5",
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    isMuted: true,
    isVideoOn: true,
    isSpeaking: false,
  },
  {
    id: "6",
    name: "Lisa Thompson",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    isMuted: false,
    isVideoOn: true,
    isSpeaking: false,
  },
]

function VideoTile({ participant }: { participant: Participant }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        "relative aspect-video rounded-xl overflow-hidden bg-secondary transition-all duration-200",
        participant.isSpeaking && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {participant.isVideoOn ? (
        <img
          src={participant.avatar}
          alt={participant.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-secondary">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <span className="text-2xl font-semibold text-foreground">
              {participant.name.split(" ").map((n) => n[0]).join("")}
            </span>
          </div>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Participant info */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white drop-shadow-md">
            {participant.name}
          </span>
          {participant.isMuted ? (
            <MicOff className="w-4 h-4 text-destructive" />
          ) : (
            <Mic className="w-4 h-4 text-white" />
          )}
        </div>
      </div>

      {/* Hover actions */}
      {isHovered && (
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white border-0"
          >
            <Pin className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white border-0"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Pin to main view</DropdownMenuItem>
              <DropdownMenuItem>Spotlight</DropdownMenuItem>
              <DropdownMenuItem>Message privately</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Remove from call</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Speaking indicator */}
      {participant.isSpeaking && (
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
            <div className="flex gap-0.5">
              <span className="w-1 h-3 bg-primary-foreground rounded-full animate-pulse" />
              <span className="w-1 h-2 bg-primary-foreground rounded-full animate-pulse delay-75" />
              <span className="w-1 h-3 bg-primary-foreground rounded-full animate-pulse delay-150" />
            </div>
            Speaking
          </div>
        </div>
      )}
    </div>
  )
}

export function VideoGrid() {
  const gridCols =
    participants.length <= 1
      ? "grid-cols-1"
      : participants.length <= 2
      ? "grid-cols-1 md:grid-cols-2"
      : participants.length <= 4
      ? "grid-cols-1 md:grid-cols-2"
      : participants.length <= 6
      ? "grid-cols-2 md:grid-cols-3"
      : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"

  return (
    <div className={cn("grid gap-3 p-4 h-full auto-rows-fr", gridCols)}>
      {participants.map((participant) => (
        <VideoTile key={participant.id} participant={participant} />
      ))}
    </div>
  )
}
