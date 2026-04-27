"use client"

import { useState } from "react"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Hand,
  MessageSquare,
  Users,
  Settings,
  PhoneOff,
  MoreHorizontal,
  Smile,
  Grid3X3,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ControlsBarProps {
  onToggleChat: () => void
  onToggleParticipants: () => void
  isChatOpen: boolean
  isParticipantsOpen: boolean
}

export function ControlsBar({
  onToggleChat,
  onToggleParticipants,
  isChatOpen,
  isParticipantsOpen,
}: ControlsBarProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isHandRaised, setIsHandRaised] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      <div className="h-20 bg-card border-t border-border flex items-center justify-between px-4 md:px-6">
        {/* Meeting info */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">Weekly Team Standup</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">meet.flow/abc-defg-hij</span>
              <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground">
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main controls */}
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isMuted ? "destructive" : "secondary"}
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isMuted ? "Unmute" : "Mute"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={!isVideoOn ? "destructive" : "secondary"}
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isVideoOn ? "Turn off camera" : "Turn on camera"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isScreenSharing ? "default" : "secondary"}
                size="icon"
                className={cn("h-12 w-12 rounded-full", isScreenSharing && "bg-primary text-primary-foreground")}
                onClick={() => setIsScreenSharing(!isScreenSharing)}
              >
                <MonitorUp className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isScreenSharing ? "Stop sharing" : "Share screen"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isHandRaised ? "default" : "secondary"}
                size="icon"
                className={cn("h-12 w-12 rounded-full hidden sm:flex", isHandRaised && "bg-primary text-primary-foreground")}
                onClick={() => setIsHandRaised(!isHandRaised)}
              >
                <Hand className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isHandRaised ? "Lower hand" : "Raise hand"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-12 w-12 rounded-full hidden sm:flex"
              >
                <Smile className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reactions</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-12 w-12 rounded-full sm:hidden"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>More options</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="center" className="w-48">
              <DropdownMenuItem onClick={() => setIsHandRaised(!isHandRaised)}>
                <Hand className="w-4 h-4 mr-2" />
                {isHandRaised ? "Lower hand" : "Raise hand"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Smile className="w-4 h-4 mr-2" />
                Reactions
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Grid3X3 className="w-4 h-4 mr-2" />
                Change layout
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-8 bg-border mx-2 hidden sm:block" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="h-12 w-12 rounded-full"
              >
                <PhoneOff className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Leave call</TooltipContent>
          </Tooltip>
        </div>

        {/* Side panel toggles */}
        <div className="hidden md:flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isParticipantsOpen ? "default" : "ghost"}
                size="icon"
                className={cn("h-10 w-10", isParticipantsOpen && "bg-primary text-primary-foreground")}
                onClick={onToggleParticipants}
              >
                <Users className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Participants (6)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isChatOpen ? "default" : "ghost"}
                size="icon"
                className={cn("h-10 w-10", isChatOpen && "bg-primary text-primary-foreground")}
                onClick={onToggleChat}
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Chat</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Grid3X3 className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Change layout</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Settings className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
