"use client"

import { useState, useEffect } from "react"
import { Shield, Users, Clock, ChevronDown, Lock, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function MeetingHeader() {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <TooltipProvider delayDuration={0}>
      <header className="h-14 bg-card/50 backdrop-blur-sm border-b border-border flex items-center justify-between px-4">
        {/* Left side - Logo and meeting info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-foreground hidden sm:inline">MeetFlow</span>
          </div>

          <div className="h-6 w-px bg-border hidden sm:block" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 text-foreground hidden sm:flex">
                <span className="font-medium">Weekly Team Standup</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>
                <Info className="w-4 h-4 mr-2" />
                Meeting details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Lock className="w-4 h-4 mr-2" />
                Lock meeting
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center - Recording/Security indicator */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">End-to-end encrypted</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>This meeting is secure and encrypted</TooltipContent>
          </Tooltip>
        </div>

        {/* Right side - Time and participants */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-mono">{formatTime(elapsed)}</span>
          </div>

          <div className="h-6 w-px bg-border" />

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">6</span>
          </div>

          <div className="flex -space-x-2">
            {[
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face",
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
            ].map((avatar, i) => (
              <img
                key={i}
                src={avatar}
                alt=""
                className="w-7 h-7 rounded-full border-2 border-card object-cover"
              />
            ))}
            <div className="w-7 h-7 rounded-full border-2 border-card bg-secondary flex items-center justify-center text-xs font-medium text-muted-foreground">
              +3
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}
