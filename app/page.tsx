"use client"

import { useState } from "react"
import { MeetingHeader } from "@/components/meeting-header"
import { VideoGrid } from "@/components/video-grid"
import { ControlsBar } from "@/components/controls-bar"
import { ChatPanel } from "@/components/chat-panel"
import { ParticipantsPanel } from "@/components/participants-panel"

export default function VideoConference() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false)

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
    if (!isChatOpen) setIsParticipantsOpen(false)
  }

  const toggleParticipants = () => {
    setIsParticipantsOpen(!isParticipantsOpen)
    if (!isParticipantsOpen) setIsChatOpen(false)
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <MeetingHeader />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video grid */}
        <div className="flex-1 overflow-hidden">
          <VideoGrid />
        </div>

        {/* Side panels */}
        {isChatOpen && <ChatPanel onClose={() => setIsChatOpen(false)} />}
        {isParticipantsOpen && <ParticipantsPanel onClose={() => setIsParticipantsOpen(false)} />}
      </div>

      {/* Controls bar */}
      <ControlsBar
        onToggleChat={toggleChat}
        onToggleParticipants={toggleParticipants}
        isChatOpen={isChatOpen}
        isParticipantsOpen={isParticipantsOpen}
      />
    </div>
  )
}
