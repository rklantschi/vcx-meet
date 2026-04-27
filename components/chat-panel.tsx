"use client"

import { useState } from "react"
import { Send, X, Smile, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  id: string
  sender: string
  avatar: string
  content: string
  timestamp: string
  isOwn?: boolean
}

const messages: Message[] = [
  {
    id: "1",
    sender: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    content: "Hey everyone! Ready for the standup?",
    timestamp: "10:00 AM",
  },
  {
    id: "2",
    sender: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    content: "Yes! Just finishing up my notes.",
    timestamp: "10:01 AM",
  },
  {
    id: "3",
    sender: "You",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    content: "Sounds good, I have some updates on the new feature.",
    timestamp: "10:02 AM",
    isOwn: true,
  },
  {
    id: "4",
    sender: "Emily Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    content: "Can someone share the design doc link again?",
    timestamp: "10:03 AM",
  },
  {
    id: "5",
    sender: "David Kim",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    content: "Here it is: docs.company.com/design-v2",
    timestamp: "10:03 AM",
  },
]

interface ChatPanelProps {
  onClose: () => void
}

export function ChatPanel({ onClose }: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState("")

  const handleSend = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("")
    }
  }

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <h2 className="font-semibold text-foreground">In-call Messages</h2>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isOwn ? "flex-row-reverse" : ""}`}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={message.avatar} alt={message.sender} />
                <AvatarFallback>
                  {message.sender.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className={`flex flex-col ${message.isOwn ? "items-end" : ""}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-foreground">
                    {message.isOwn ? "You" : message.sender}
                  </span>
                  <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                </div>
                <div
                  className={`rounded-2xl px-3 py-2 max-w-[200px] ${
                    message.isOwn
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-secondary text-secondary-foreground rounded-tl-sm"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 bg-secondary rounded-full px-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Smile className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Send a message..."
            className="flex-1 bg-transparent border-0 focus-visible:ring-0 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            size="icon"
            className="h-8 w-8 rounded-full bg-primary text-primary-foreground"
            onClick={handleSend}
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
