"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useChat } from "@/hooks/useChat"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChatInterface } from "@/components/chat/ChatInterface"
import { formatDistanceToNow } from "date-fns"

interface Conversation {
  id: string
  participants: {
    id: string
    name: string
    avatar?: string
  }[]
  lastMessage: {
    text: string
    timestamp: string
    read: boolean
  }
  propertyId?: string
  propertyTitle?: string
}

export default function MessagesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { getConversations, isLoading: chatLoading } = useChat();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsClient(true);
    
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      const fetchConversations = async () => {
        const userConversations = await getConversations(user.id);
        setConversations(userConversations);
        
        // If property ID is in URL params, find or create that conversation
        const propertyId = searchParams.get('property');
        if (propertyId) {
          const existingConversation = userConversations.find(c => c.propertyId === propertyId);
          if (existingConversation) {
            setSelectedConversation(existingConversation.id);
          } else {
            // In a real app, you would create a new conversation here
            // For now, just select the first conversation if it exists
            if (userConversations.length > 0) {
              setSelectedConversation(userConversations[0].id);
            }
          }
        } else if (userConversations.length > 0) {
          setSelectedConversation(userConversations[0].id);
        }
      };
      
      fetchConversations();
    }
  }, [user, authLoading, router, getConversations, searchParams]);

  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = conversation.participants.find(p => p.id !== user?.id);
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           conversation.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (authLoading || chatLoading || !isClient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Messages</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto p-0">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <p className="text-muted-foreground">No conversations found</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredConversations.map(conversation => {
                  const otherParticipant = conversation.participants.find(p => p.id !== user.id);
                  const initials = otherParticipant?.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase();
                  
                  return (
                    <div 
                      key={conversation.id}
                      className={`cursor-pointer p-4 hover:bg-muted/50 ${
                        selectedConversation === conversation.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={otherParticipant?.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{otherParticipant?.name}</h4>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                          {conversation.propertyTitle && (
                            <p className="text-xs text-muted-foreground">
                              Re: {conversation.propertyTitle}
                            </p>
                          )}
                          <p className="mt-1 truncate text-sm text-muted-foreground">
                            {conversation.lastMessage.text}
                          </p>
                          {!conversation.lastMessage.read && (
                            <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          {selectedConversation ? (
            <ChatInterface 
              conversationId={selectedConversation} 
              userId={user.id}
            />
          ) : (
            <div className="flex h-[600px] flex-col items-center justify-center p-6 text-center">
              <h3 className="mb-2 text-xl font-semibold">No conversation selected</h3>
              <p className="text-muted-foreground">
                Select a\
