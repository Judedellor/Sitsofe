"use client"

import { useState, useEffect, useRef } from "react"
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Alert,
  StatusBar,
  Switch,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

// Mock data for conversations
const MOCK_CONVERSATIONS = [
  {
    id: "1",
    name: "John Smith",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    lastMessage: "When will the plumber arrive?",
    timestamp: "10:30 AM",
    unread: 2,
    userType: "tenant",
    propertyName: "Sunset Apartments",
    unitNumber: "101",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    lastMessage: "I've fixed the kitchen sink issue",
    timestamp: "Yesterday",
    unread: 0,
    userType: "maintenance",
    propertyName: "Oakwood Heights",
    unitNumber: null,
  },
  {
    id: "3",
    name: "Michael Wong",
    avatar: "https://randomuser.me/api/portraits/men/17.jpg",
    lastMessage: "Lease renewal documents sent",
    timestamp: "Wed",
    unread: 1,
    userType: "tenant",
    propertyName: "Parkview Residences",
    unitNumber: "304",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    lastMessage: "I'll be out of town next week",
    timestamp: "Tue",
    unread: 0,
    userType: "tenant",
    propertyName: "Sunset Apartments",
    unitNumber: "205",
  },
  {
    id: "5",
    name: "Robert Chen",
    avatar: "https://randomuser.me/api/portraits/men/51.jpg",
    lastMessage: "New invoice for April rent",
    timestamp: "Mon",
    unread: 0,
    userType: "tenant",
    propertyName: "Oakwood Heights",
    unitNumber: "110",
  },
  {
    id: "6",
    name: "Maintenance Team",
    avatar: null,
    lastMessage: "Updates on building repairs",
    timestamp: "Apr 2",
    unread: 0,
    userType: "group",
    propertyName: "All Properties",
    unitNumber: null,
  },
]

// Mock data for messages in a conversation
const MOCK_MESSAGES = {
  1: [
    {
      id: "m1",
      text: "Hello, I wanted to ask about the plumbing issue in my bathroom.",
      sender: "them",
      timestamp: "10:00 AM",
    },
    {
      id: "m2",
      text: "Hi John, I'll have a plumber scheduled to visit your unit. What time works for you tomorrow?",
      sender: "me",
      timestamp: "10:15 AM",
    },
    {
      id: "m3",
      text: "Morning would be best, around 9-11am if possible.",
      sender: "them",
      timestamp: "10:20 AM",
    },
    {
      id: "m4",
      text: "Perfect, I've scheduled the plumber for 10am tomorrow. They'll call when they arrive.",
      sender: "me",
      timestamp: "10:25 AM",
    },
    {
      id: "m5",
      text: "When will the plumber arrive?",
      sender: "them",
      timestamp: "10:30 AM",
    },
    {
      id: "m6",
      text: "",
      sender: "them",
      timestamp: "10:31 AM",
      attachment: {
        id: "a1",
        type: "image",
        url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        thumbnail:
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
        name: "Bathroom_Leak.jpg",
        size: "2.4 MB",
      },
    },
  ],
}

// Mock message templates
const MESSAGE_TEMPLATES = [
  {
    id: "t1",
    title: "Maintenance Visit",
    text: "I've scheduled a maintenance visit for tomorrow between 9am-12pm. Please confirm if this time works for you.",
  },
  {
    id: "t2",
    title: "Rent Reminder",
    text: "This is a friendly reminder that your rent payment of $X is due on DATE. Please let me know if you have any questions.",
  },
  {
    id: "t3",
    title: "Inspection Notice",
    text: "We will be conducting a routine property inspection on DATE at TIME. Your presence is not required but appreciated.",
  },
  {
    id: "t4",
    title: "Maintenance Complete",
    text: "The maintenance work in your unit has been completed. Please let us know if you have any feedback or if further attention is needed.",
  },
  {
    id: "t5",
    title: "Welcome",
    text: "Welcome to your new home! Please don't hesitate to reach out if you need any assistance during your move-in process.",
  },
]

// Mock data for attachments in a conversation
const MOCK_ATTACHMENTS = {
  1: [
    {
      id: "a1",
      type: "image",
      url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      thumbnail:
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      name: "Bathroom_Leak.jpg",
      size: "2.4 MB",
      sender: "them",
      timestamp: "10:05 AM",
    },
  ],
}

// Conversation list item component
const ConversationItem = ({ conversation, onPress }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const getGroupIcon = () => {
    if (conversation.userType === "group") {
      return "people"
    } else if (conversation.userType === "tenant") {
      return "home"
    } else if (conversation.userType === "maintenance") {
      return "construct"
    } else {
      return "people"
    }
  }

  const getIconColor = () => {
    if (conversation.userType === "group") {
      return "#8E8E93"
    } else if (conversation.userType === "tenant") {
      return "#4CD964"
    } else if (conversation.userType === "maintenance") {
      return "#007AFF"
    } else {
      return "#8E8E93"
    }
  }

  return (
    <TouchableOpacity style={styles.conversationItem} onPress={() => onPress(conversation)}>
      <View style={styles.avatarContainer}>
        {conversation.avatar ? (
          <Image source={{ uri: conversation.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.defaultAvatar, { backgroundColor: getIconColor() }]}>
            {conversation.userType === "group" ? (
              <Ionicons name={getGroupIcon()} size={24} color="#FFFFFF" />
            ) : (
              <Text style={styles.avatarText}>{getInitials(conversation.name)}</Text>
            )}
          </View>
        )}
        {conversation.userType === "tenant" && (
          <View style={styles.userTypeBadge}>
            <Ionicons name="home-outline" size={12} color="#fff" />
          </View>
        )}
        {conversation.userType === "maintenance" && (
          <View style={[styles.userTypeBadge, { backgroundColor: "#F57C00" }]}>
            <Ionicons name="construct-outline" size={12} color="#fff" />
          </View>
        )}
        {conversation.userType === "group" && (
          <View style={[styles.userTypeBadge, { backgroundColor: "#7B1FA2" }]}>
            <Ionicons name="people-outline" size={12} color="#fff" />
          </View>
        )}
      </View>
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName} numberOfLines={1}>
            {conversation.name}
          </Text>
          <Text style={styles.conversationTime}>{conversation.timestamp}</Text>
        </View>
        <View style={styles.conversationMiddle}>
          <Text style={styles.conversationLastMessage} numberOfLines={1}>
            {conversation.lastMessage}
          </Text>
          {conversation.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{conversation.unread}</Text>
            </View>
          )}
        </View>
        <Text style={styles.propertyInfo} numberOfLines={1}>
          {conversation.propertyName}
          {conversation.unitNumber ? ` • Unit ${conversation.unitNumber}` : ""}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

// AttachmentView component
const AttachmentView = ({ attachment, isSentByMe }) => {
  if (attachment.type === "image") {
    return (
      <View style={[styles.attachmentContainer, isSentByMe ? styles.sentAttachment : styles.receivedAttachment]}>
        <Image source={{ uri: attachment.url }} style={styles.attachmentImage} resizeMode="cover" />
        <View style={styles.attachmentInfo}>
          <Text style={styles.attachmentName}>{attachment.name}</Text>
          <Text style={styles.attachmentSize}>{attachment.size}</Text>
        </View>
      </View>
    )
  } else if (attachment.type === "document") {
    return (
      <View style={[styles.attachmentContainer, isSentByMe ? styles.sentAttachment : styles.receivedAttachment]}>
        <View style={styles.documentIcon}>
          <Ionicons name="document-text" size={30} color="#007AFF" />
        </View>
        <View style={styles.attachmentInfo}>
          <Text style={styles.attachmentName}>{attachment.name}</Text>
          <Text style={styles.attachmentSize}>{attachment.size}</Text>
        </View>
      </View>
    )
  }
  return null
}

// Message bubble component
const MessageBubble = ({ message }) => {
  const isSentByMe = message.sender === "me"

  // Function to render message status indicator
  const renderMessageStatus = () => {
    if (!isSentByMe) return null

    // Get status from message or default to 'sent'
    const status = message.status || "sent"

    switch (status) {
      case "sent":
        return (
          <View style={styles.statusIndicator}>
            <Ionicons name="checkmark" size={14} color="#8E8E93" />
          </View>
        )
      case "delivered":
        return (
          <View style={styles.statusIndicator}>
            <Ionicons name="checkmark-done" size={14} color="#8E8E93" />
          </View>
        )
      case "read":
        return (
          <View style={styles.statusIndicator}>
            <Ionicons name="checkmark-done" size={14} color="#007AFF" />
          </View>
        )
      default:
        return (
          <View style={styles.statusIndicator}>
            <Ionicons name="time-outline" size={14} color="#8E8E93" />
          </View>
        )
    }
  }

  // Render encryption indicator
  const renderEncryptionIndicator = () => {
    return (
      <View style={styles.encryptionIndicator}>
        <Ionicons name="lock-closed" size={12} color={isSentByMe ? "#8E8E93" : "#8E8E93"} />
      </View>
    )
  }

  // Render timed deletion indicator
  const renderTimedDeletionIndicator = () => {
    if (!message.expiresAt) return null

    return (
      <View style={styles.timedDeletionIndicator}>
        <Ionicons name="timer-outline" size={12} color={isSentByMe ? "#8E8E93" : "#8E8E93"} />
      </View>
    )
  }

  return (
    <View style={[styles.messageBubbleContainer, isSentByMe ? styles.sentMessage : styles.receivedMessage]}>
      {message.attachment ? (
        <AttachmentView attachment={message.attachment} isSentByMe={isSentByMe} />
      ) : (
        <View style={[styles.messageBubble, isSentByMe ? styles.sentBubble : styles.receivedBubble]}>
          {message.isMasked ? (
            <TouchableOpacity style={styles.maskedMessageContent}>
              <Text
                style={[styles.maskedMessageText, isSentByMe ? styles.sentMessageText : styles.receivedMessageText]}
              >
                ••••• Tap to view sensitive content •••••
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.messageText, isSentByMe ? styles.sentMessageText : styles.receivedMessageText]}>
              {message.text}
            </Text>
          )}
        </View>
      )}
      <View style={styles.messageFooter}>
        <Text style={[styles.messageTime, isSentByMe ? styles.sentMessageTime : styles.receivedMessageTime]}>
          {message.timestamp}
        </Text>
        {renderEncryptionIndicator()}
        {renderTimedDeletionIndicator()}
        {renderMessageStatus()}
      </View>
    </View>
  )
}

// TemplateItem component
const TemplateItem = ({ template, onPress }) => {
  return (
    <TouchableOpacity style={styles.templateItem} onPress={() => onPress(template.text)}>
      <Text style={styles.templateTitle}>{template.title}</Text>
      <Text style={styles.templatePreview} numberOfLines={1}>
        {template.text}
      </Text>
    </TouchableOpacity>
  )
}

// AttachmentOptionsModal component
const AttachmentOptionsModal = ({ visible, onClose, onSelectOption }) => {
  const options = [
    { icon: "camera", label: "Camera", color: "#4CD964", id: "camera" },
    { icon: "image", label: "Photo Library", color: "#007AFF", id: "photos" },
    { icon: "document-text", label: "Document", color: "#FF9500", id: "document" },
    { icon: "location", label: "Location", color: "#FF2D55", id: "location" },
  ]

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Attachments</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          <View style={styles.optionsGrid}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionItem}
                onPress={() => {
                  onSelectOption(option.id)
                  onClose()
                }}
              >
                <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
                  <Ionicons name={option.icon} size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.optionLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

// TemplatesModal component
const TemplatesModal = ({ visible, onClose, onSelectTemplate }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Message Templates</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={MESSAGE_TEMPLATES}
            renderItem={({ item }) => (
              <TemplateItem
                template={item}
                onPress={(text) => {
                  onSelectTemplate(text)
                  onClose()
                }}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.templatesList}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

// Call interface component
const CallInterface = ({
  isVisible,
  onClose,
  conversation,
  callType = "audio",
  onToggleVideo,
  onToggleMute,
  onToggleSpeaker,
  onToggleRecord,
  onToggleScreenShare,
}) => {
  const [callStatus, setCallStatus] = useState("connecting") // connecting, connected, ended
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === "video")
  const [isRecording, setIsRecording] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    // Simulate connecting and then connected after a delay
    const connectTimeout = setTimeout(() => {
      setCallStatus("connected")

      // Start call timer
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }, 2000)

    return () => {
      clearTimeout(connectTimeout)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleToggleMute = () => {
    setIsMuted(!isMuted)
    if (onToggleMute) onToggleMute(!isMuted)
  }

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn)
    if (onToggleSpeaker) onToggleSpeaker(!isSpeakerOn)
  }

  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)
    if (onToggleVideo) onToggleVideo(!isVideoEnabled)
  }

  const handleToggleRecord = () => {
    setIsRecording(!isRecording)
    if (onToggleRecord) onToggleRecord(!isRecording)
  }

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)
    if (onToggleScreenShare) onToggleScreenShare(!isScreenSharing)
  }

  const handleEndCall = () => {
    setCallStatus("ended")

    // Simulate call ending
    setTimeout(() => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      onClose()
    }, 500)
  }

  if (!isVisible) return null

  return (
    <View style={styles.callContainer}>
      <StatusBar barStyle="light-content" />

      {/* Video container */}
      {isVideoEnabled && (
        <View style={styles.videoContainer}>
          {/* Simulated remote video */}
          <Image
            source={{
              uri: conversation.avatar || "https://randomuser.me/api/portraits/women/44.jpg",
            }}
            style={styles.remoteVideo}
            resizeMode="cover"
          />

          {/* Simulated local video (picture-in-picture) */}
          <View style={styles.localVideoContainer}>
            {isScreenSharing ? (
              <View style={styles.screenSharePreview}>
                <Ionicons name="desktop-outline" size={24} color="#FFFFFF" />
                <Text style={styles.screenShareText}>Sharing screen</Text>
              </View>
            ) : (
              <Image
                source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
                style={styles.localVideo}
                resizeMode="cover"
              />
            )}
          </View>

          {/* Recording indicator */}
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <Ionicons name="ellipse" size={12} color="#FF3B30" />
              <Text style={styles.recordingText}>REC</Text>
            </View>
          )}
        </View>
      )}

      {/* Audio call UI */}
      {!isVideoEnabled && (
        <View style={styles.audioCallContainer}>
          {conversation.avatar ? (
            <Image source={{ uri: conversation.avatar }} style={styles.callerAvatar} resizeMode="cover" />
          ) : (
            <View style={styles.callerAvatarPlaceholder}>
              <Text style={styles.callerInitials}>{conversation.name.charAt(0)}</Text>
            </View>
          )}
          <Text style={styles.callerName}>{conversation.name}</Text>
          <Text style={styles.propertyUnit}>
            {conversation.propertyName}
            {conversation.unitNumber ? ` • Unit ${conversation.unitNumber}` : ""}
          </Text>

          {/* Call status and duration */}
          <Text style={styles.callStatusText}>
            {callStatus === "connecting" ? "Connecting..." : formatDuration(callDuration)}
          </Text>

          {/* Recording indicator for audio calls */}
          {isRecording && (
            <View style={styles.audioRecordingIndicator}>
              <Ionicons name="ellipse" size={12} color="#FF3B30" />
              <Text style={styles.recordingText}>Recording</Text>
            </View>
          )}
        </View>
      )}

      {/* Call controls */}
      <View style={styles.callControls}>
        <TouchableOpacity
          style={[styles.callControlButton, isMuted && styles.activeControl]}
          onPress={handleToggleMute}
        >
          <Ionicons name={isMuted ? "mic-off" : "mic"} size={24} color="#FFFFFF" />
          <Text style={styles.controlLabel}>Mute</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.callControlButton, isSpeakerOn && styles.activeControl]}
          onPress={handleToggleSpeaker}
        >
          <Ionicons name={isSpeakerOn ? "volume-high" : "volume-medium"} size={24} color="#FFFFFF" />
          <Text style={styles.controlLabel}>Speaker</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.callControlButton, isVideoEnabled && styles.activeControl]}
          onPress={handleToggleVideo}
        >
          <Ionicons name={isVideoEnabled ? "videocam" : "videocam-outline"} size={24} color="#FFFFFF" />
          <Text style={styles.controlLabel}>Video</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.callControlButton, isRecording && styles.recordingControl]}
          onPress={handleToggleRecord}
        >
          <Ionicons name={isRecording ? "radio-button-on" : "radio-button-off"} size={24} color="#FFFFFF" />
          <Text style={styles.controlLabel}>Record</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.callControlButton, isScreenSharing && styles.activeControl]}
          onPress={handleToggleScreenShare}
        >
          <Ionicons name={isScreenSharing ? "desktop" : "desktop-outline"} size={24} color="#FFFFFF" />
          <Text style={styles.controlLabel}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* End call button */}
      <View style={styles.endCallButtonContainer}>
        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <Ionicons name="call" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

// Video Chat Options Modal
const VideoChatOptionsModal = ({ visible, onClose, onStartCall, conversation }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.callOptionsContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Call Options</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.callOptionItem}
            onPress={() => {
              onStartCall("audio")
              onClose()
            }}
          >
            <View style={[styles.callOptionIcon, { backgroundColor: "#007AFF" }]}>
              <Ionicons name="call" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.callOptionContent}>
              <Text style={styles.callOptionTitle}>Voice Call</Text>
              <Text style={styles.callOptionDescription}>Start an audio call with {conversation?.name}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.callOptionItem}
            onPress={() => {
              onStartCall("video")
              onClose()
            }}
          >
            <View style={[styles.callOptionIcon, { backgroundColor: "#4CD964" }]}>
              <Ionicons name="videocam" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.callOptionContent}>
              <Text style={styles.callOptionTitle}>Video Call</Text>
              <Text style={styles.callOptionDescription}>
                Start a video call for property tour or visual inspection
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.callOptionItem}
            onPress={() => {
              // Start video call with screen sharing enabled
              onStartCall("video", true)
              onClose()
            }}
          >
            <View style={[styles.callOptionIcon, { backgroundColor: "#FF9500" }]}>
              <Ionicons name="desktop" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.callOptionContent}>
              <Text style={styles.callOptionTitle}>Screen Share Call</Text>
              <Text style={styles.callOptionDescription}>
                Share your screen to explain documents or show property details
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.callOptionItem}
            onPress={() => {
              // Start video call with recording enabled
              onStartCall("video", false, true)
              onClose()
            }}
          >
            <View style={[styles.callOptionIcon, { backgroundColor: "#FF3B30" }]}>
              <Ionicons name="recording" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.callOptionContent}>
              <Text style={styles.callOptionTitle}>Recorded Video Call</Text>
              <Text style={styles.callOptionDescription}>Start a recorded video call for documentation purposes</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

// Chat interface component
const ChatInterface = ({ conversation, onBack }) => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showCallOptions, setShowCallOptions] = useState(false)
  const [activeCall, setActiveCall] = useState(null)
  const [showSecurityOptions, setShowSecurityOptions] = useState(false)

  // Security states
  const [messageSensitive, setMessageSensitive] = useState(false)
  const [messageExpiration, setMessageExpiration] = useState(null)

  useEffect(() => {
    // Simulate loading messages
    setTimeout(() => {
      if (MOCK_MESSAGES[conversation.id]) {
        // Add status to messages and security features
        const messagesWithStatus = MOCK_MESSAGES[conversation.id].map((msg) => {
          if (msg.sender === "me") {
            return {
              ...msg,
              status: Math.random() > 0.7 ? "read" : Math.random() > 0.3 ? "delivered" : "sent",
              // Add random security properties for demo
              expiresAt: Math.random() > 0.7 ? new Date(Date.now() + 86400000) : null, // 24h expiration
              isMasked: Math.random() > 0.8, // Some messages masked
            }
          }
          return msg
        })
        setMessages(messagesWithStatus)
      }
      setLoading(false)
    }, 500)

    // Simulate other user typing
    const typingInterval = setInterval(() => {
      setIsTyping((prev) => !prev)
    }, 5000)

    // Simulate message expiration
    const expirationInterval = setInterval(() => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => !msg.expiresAt || new Date(msg.expiresAt) > new Date()),
      )
    }, 10000)

    return () => {
      clearInterval(typingInterval)
      clearInterval(expirationInterval)
    }
  }, [conversation.id])

  const sendMessage = () => {
    if (message.trim() === "") return

    // Create a new message with "sending" status and security features
    const newMessage = {
      id: `m${Date.now()}`,
      text: message,
      sender: "me",
      timestamp: "Just now",
      status: "sending",
      isMasked: messageSensitive,
      expiresAt: messageExpiration,
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Reset security options
    setMessageSensitive(false)
    setMessageExpiration(null)

    // Simulate message being sent and delivered
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "sent" } : msg)),
      )

      // Simulate message being delivered
      setTimeout(() => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)),
        )

        // Simulate recipient reading the message
        setTimeout(() => {
          setMessages((prevMessages) =>
            prevMessages.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "read" } : msg)),
          )

          // Simulate typing response
          setIsTyping(true)

          // Simulate response after typing
          setTimeout(() => {
            setIsTyping(false)

            const responseMessage = {
              id: `m${Date.now()}`,
              text: "Thanks for your message! I'll look into this.",
              sender: "them",
              timestamp: "Just now",
            }

            setMessages((prevMessages) => [...prevMessages, responseMessage])
          }, 3000)
        }, 2000)
      }, 1500)
    }, 1000)
  }

  const handleAttachmentSelect = (type) => {
    // Simulate adding a document attachment
    const attachment = {
      id: `a${Date.now()}`,
      type: type === "document" ? "document" : "image",
      url:
        type === "document"
          ? null
          : "https://images.unsplash.com/photo-1600607687644-c7531e14eb19?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      thumbnail:
        type === "document"
          ? null
          : "https://images.unsplash.com/photo-1600607687644-c7531e14eb19?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      name: type === "document" ? "Lease_Agreement.pdf" : "Property_Photo.jpg",
      size: type === "document" ? "1.2 MB" : "3.5 MB",
    }

    const newMessage = {
      id: `m${Date.now()}`,
      text: "",
      sender: "me",
      timestamp: "Just now",
      attachment: attachment,
      isMasked: messageSensitive,
      expiresAt: messageExpiration,
    }

    setMessages([...messages, newMessage])

    // Reset security options
    setMessageSensitive(false)
    setMessageExpiration(null)
  }

  const handleTemplateSelect = (templateText) => {
    setMessage(templateText)
  }

  const handleStartCall = (callType, enableScreenShare = false, enableRecording = false) => {
    setActiveCall({
      type: callType,
      enableScreenShare,
      enableRecording,
    })
  }

  const handleEndCall = () => {
    setActiveCall(null)
  }

  const toggleMessageSensitive = () => {
    setMessageSensitive(!messageSensitive)
  }

  const setMessageExpirationTime = (hours) => {
    if (hours === 0) {
      setMessageExpiration(null)
    } else {
      const expirationDate = new Date()
      expirationDate.setHours(expirationDate.getHours() + hours)
      setMessageExpiration(expirationDate)
    }
    setShowSecurityOptions(false)
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <SafeAreaView style={styles.chatContainer}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#007AFF" />
            <Text style={styles.backText}>Messages</Text>
          </TouchableOpacity>
          <View style={styles.chatHeaderContent}>
            {conversation.avatar ? (
              <Image source={{ uri: conversation.avatar }} style={styles.chatAvatar} />
            ) : (
              <View style={[styles.chatAvatar, styles.defaultAvatar]}>
                <Text style={styles.avatarText}>{conversation.name.charAt(0)}</Text>
              </View>
            )}
            <View>
              <Text style={styles.chatName}>{conversation.name}</Text>
              <Text style={styles.chatSubtitle}>
                {conversation.propertyName}
                {conversation.unitNumber ? ` • Unit ${conversation.unitNumber}` : ""}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.chatAction} onPress={() => setShowCallOptions(true)}>
            <Ionicons name="call-outline" size={22} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <>
            <FlatList
              data={messages}
              renderItem={({ item }) => <MessageBubble message={item} />}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              inverted={false}
            />

            {isTyping && (
              <View style={styles.typingIndicatorContainer}>
                <View style={styles.typingBubble}>
                  <View style={styles.typingDot} />
                  <View style={[styles.typingDot, styles.typingDotMiddle]} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            )}
          </>
        )}

        <View style={styles.messageInputContainer}>
          <TouchableOpacity style={styles.attachButton} onPress={() => setShowAttachmentOptions(true)}>
            <Ionicons name="add-circle" size={30} color="#007AFF" />
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            {/* Security indicators */}
            {(messageSensitive || messageExpiration) && (
              <View style={styles.securityIndicators}>
                {messageSensitive && (
                  <View style={styles.securityTag}>
                    <Ionicons name="eye-off-outline" size={12} color="#FFFFFF" />
                    <Text style={styles.securityTagText}>Masked</Text>
                  </View>
                )}

                {messageExpiration && (
                  <View style={styles.securityTag}>
                    <Ionicons name="timer-outline" size={12} color="#FFFFFF" />
                    <Text style={styles.securityTagText}>Disappearing</Text>
                  </View>
                )}
              </View>
            )}

            <TextInput
              style={styles.messageInput}
              placeholder="Message"
              placeholderTextColor="#8E8E93"
              value={message}
              onChangeText={setMessage}
              multiline
            />
          </View>

          {message.trim() === "" ? (
            <>
              <TouchableOpacity style={styles.templateButton} onPress={() => setShowTemplates(true)}>
                <Ionicons name="text" size={28} color="#007AFF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.securityButton} onPress={() => setShowSecurityOptions(true)}>
                <Ionicons
                  name={messageSensitive || messageExpiration ? "lock-closed" : "lock-open"}
                  size={24}
                  color={messageSensitive || messageExpiration ? "#4CD964" : "#8E8E93"}
                />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <View style={styles.sendButtonInner}>
                <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          )}
        </View>

        <AttachmentOptionsModal
          visible={showAttachmentOptions}
          onClose={() => setShowAttachmentOptions(false)}
          onSelectOption={handleAttachmentSelect}
        />

        <TemplatesModal
          visible={showTemplates}
          onClose={() => setShowTemplates(false)}
          onSelectTemplate={handleTemplateSelect}
        />

        <VideoChatOptionsModal
          visible={showCallOptions}
          onClose={() => setShowCallOptions(false)}
          onStartCall={handleStartCall}
          conversation={conversation}
        />

        {/* Security options modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showSecurityOptions}
          onRequestClose={() => setShowSecurityOptions(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSecurityOptions(false)}>
            <View style={styles.securityOptionsContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Message Security</Text>
                <TouchableOpacity onPress={() => setShowSecurityOptions(false)}>
                  <Ionicons name="close" size={24} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.securityOption} onPress={toggleMessageSensitive}>
                <View style={styles.securityOptionContent}>
                  <Ionicons name="eye-off-outline" size={24} color="#FF2D55" style={styles.securityOptionIcon} />
                  <View>
                    <Text style={styles.securityOptionTitle}>Mark as Sensitive</Text>
                    <Text style={styles.securityOptionDescription}>Content will be masked until tapped</Text>
                  </View>
                </View>
                <View style={styles.securityOptionIndicator}>
                  {messageSensitive && <Ionicons name="checkmark" size={24} color="#4CD964" />}
                </View>
              </TouchableOpacity>

              <View style={styles.securityOptionTitle}>
                <Text style={styles.expirationTitle}>Message Expiration</Text>
              </View>

              <TouchableOpacity style={styles.securityOption} onPress={() => setMessageExpirationTime(0)}>
                <Text style={styles.expirationOption}>Never expire</Text>
                <View style={styles.securityOptionIndicator}>
                  {!messageExpiration && <Ionicons name="checkmark" size={24} color="#4CD964" />}
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.securityOption} onPress={() => setMessageExpirationTime(1)}>
                <Text style={styles.expirationOption}>1 hour</Text>
                <View style={styles.securityOptionIndicator}>
                  {messageExpiration && new Date(messageExpiration).getHours() === new Date().getHours() + 1 && (
                    <Ionicons name="checkmark" size={24} color="#4CD964" />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.securityOption} onPress={() => setMessageExpirationTime(24)}>
                <Text style={styles.expirationOption}>24 hours</Text>
                <View style={styles.securityOptionIndicator}>
                  {messageExpiration && new Date(messageExpiration).getHours() === new Date().getHours() + 24 && (
                    <Ionicons name="checkmark" size={24} color="#4CD964" />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.securityOption} onPress={() => setMessageExpirationTime(168)}>
                <Text style={styles.expirationOption}>7 days</Text>
                <View style={styles.securityOptionIndicator}>
                  {messageExpiration && new Date(messageExpiration).getHours() === new Date().getHours() + 168 && (
                    <Ionicons name="checkmark" size={24} color="#4CD964" />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {activeCall && (
          <CallInterface
            isVisible={true}
            onClose={handleEndCall}
            conversation={conversation}
            callType={activeCall.type}
            initialScreenShare={activeCall.enableScreenShare}
            initialRecording={activeCall.enableRecording}
          />
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

// New Conversation Modal
const NewConversationModal = ({ visible, onClose, onStartConversation }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContacts, setSelectedContacts] = useState([])

  // Sample tenant and staff data
  const contacts = [
    { id: "user1", name: "John Smith", property: "Sunset Apartments", unit: "101", type: "tenant" },
    { id: "user2", name: "Sarah Johnson", property: "Oakwood Heights", unit: "205", type: "tenant" },
    { id: "user3", name: "Michael Brown", property: "Sunset Apartments", unit: "302", type: "tenant" },
    { id: "user4", name: "Jessica Davis", property: "Oakwood Heights", unit: "108", type: "tenant" },
    { id: "staff1", name: "Robert Wilson", property: "All Properties", role: "Maintenance", type: "staff" },
    { id: "staff2", name: "Emily Thompson", property: "Sunset Apartments", role: "Property Manager", type: "staff" },
  ]

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.unit && contact.unit.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (contact.role && contact.role.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const toggleContact = (contact) => {
    if (selectedContacts.some((c) => c.id === contact.id)) {
      setSelectedContacts(selectedContacts.filter((c) => c.id !== contact.id))
    } else {
      setSelectedContacts([...selectedContacts, contact])
    }
  }

  const startConversation = () => {
    if (selectedContacts.length === 0) {
      Alert.alert("No Contacts Selected", "Please select at least one contact to start a conversation.")
      return
    }

    onStartConversation(selectedContacts)
    setSelectedContacts([])
    setSearchQuery("")
    onClose()
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Message</Text>
            <TouchableOpacity onPress={startConversation} disabled={selectedContacts.length === 0}>
              <Text style={[styles.modalDone, selectedContacts.length === 0 && styles.modalDoneDisabled]}>Next</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#8E8E93" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, property, or unit"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#8E8E93"
            />
          </View>

          {selectedContacts.length > 0 && (
            <View style={styles.selectedContactsContainer}>
              <FlatList
                data={selectedContacts}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.selectedContact} onPress={() => toggleContact(item)}>
                    <Text style={styles.selectedContactName}>{item.name}</Text>
                    <Ionicons name="close-circle" size={18} color="#FFFFFF" style={styles.selectedContactRemove} />
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.contactItem,
                  selectedContacts.some((c) => c.id === item.id) && styles.contactItemSelected,
                ]}
                onPress={() => toggleContact(item)}
              >
                <View style={styles.contactAvatar}>
                  <Text style={styles.contactInitials}>
                    {item.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </Text>
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{item.name}</Text>
                  <Text style={styles.contactDetail}>
                    {item.type === "tenant"
                      ? `${item.property} • Unit ${item.unit}`
                      : `${item.role} • ${item.property}`}
                  </Text>
                </View>
                {selectedContacts.some((c) => c.id === item.id) && (
                  <View style={styles.contactCheckmark}>
                    <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                  </View>
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.contactsList}
          />
        </View>
      </View>
    </Modal>
  )
}

// SecuritySettingsModal component
const SecuritySettingsModal = ({ visible, onClose }) => {
  const [encryptionEnabled, setEncryptionEnabled] = useState(true)
  const [autoDeleteMessages, setAutoDeleteMessages] = useState(false)
  const [deletionTimeframe, setDeletionTimeframe] = useState("24h")
  const [maskSensitiveInfo, setMaskSensitiveInfo] = useState(true)
  const [requireAuthForOlderMessages, setRequireAuthForOlderMessages] = useState(true)

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.securityModalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Security Settings</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <View style={styles.securitySettingItem}>
            <View style={styles.securitySettingContent}>
              <View style={styles.securitySettingIcon}>
                <Ionicons name="lock-closed" size={24} color="#007AFF" />
              </View>
              <View>
                <Text style={styles.securitySettingTitle}>End-to-End Encryption</Text>
                <Text style={styles.securitySettingDescription}>
                  All messages are encrypted and cannot be read by anyone else
                </Text>
              </View>
            </View>
            <Switch
              value={encryptionEnabled}
              onValueChange={setEncryptionEnabled}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={encryptionEnabled ? "#007AFF" : "#f4f3f4"}
            />
          </View>

          <View style={styles.securitySettingItem}>
            <View style={styles.securitySettingContent}>
              <View style={styles.securitySettingIcon}>
                <Ionicons name="timer-outline" size={24} color="#FF9500" />
              </View>
              <View>
                <Text style={styles.securitySettingTitle}>Auto-Delete Messages</Text>
                <Text style={styles.securitySettingDescription}>Automatically delete messages after a set period</Text>
              </View>
            </View>
            <Switch
              value={autoDeleteMessages}
              onValueChange={setAutoDeleteMessages}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={autoDeleteMessages ? "#007AFF" : "#f4f3f4"}
            />
          </View>

          {autoDeleteMessages && (
            <View style={styles.timeframeSelector}>
              <TouchableOpacity
                style={[styles.timeframeOption, deletionTimeframe === "24h" && styles.timeframeOptionSelected]}
                onPress={() => setDeletionTimeframe("24h")}
              >
                <Text style={[styles.timeframeText, deletionTimeframe === "24h" && styles.timeframeTextSelected]}>
                  24h
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.timeframeOption, deletionTimeframe === "7d" && styles.timeframeOptionSelected]}
                onPress={() => setDeletionTimeframe("7d")}
              >
                <Text style={[styles.timeframeText, deletionTimeframe === "7d" && styles.timeframeTextSelected]}>
                  7d
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.timeframeOption, deletionTimeframe === "30d" && styles.timeframeOptionSelected]}
                onPress={() => setDeletionTimeframe("30d")}
              >
                <Text style={[styles.timeframeText, deletionTimeframe === "30d" && styles.timeframeTextSelected]}>
                  30d
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.timeframeOption, deletionTimeframe === "custom" && styles.timeframeOptionSelected]}
                onPress={() => setDeletionTimeframe("custom")}
              >
                <Text style={[styles.timeframeText, deletionTimeframe === "custom" && styles.timeframeTextSelected]}>
                  Custom
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.securitySettingItem}>
            <View style={styles.securitySettingContent}>
              <View style={styles.securitySettingIcon}>
                <Ionicons name="eye-off-outline" size={24} color="#FF2D55" />
              </View>
              <View>
                <Text style={styles.securitySettingTitle}>Mask Sensitive Information</Text>
                <Text style={styles.securitySettingDescription}>Hide sensitive information until tapped</Text>
              </View>
            </View>
            <Switch
              value={maskSensitiveInfo}
              onValueChange={setMaskSensitiveInfo}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={maskSensitiveInfo ? "#007AFF" : "#f4f3f4"}
            />
          </View>

          <View style={styles.securitySettingItem}>
            <View style={styles.securitySettingContent}>
              <View style={styles.securitySettingIcon}>
                <Ionicons name="finger-print-outline" size={24} color="#4CD964" />
              </View>
              <View>
                <Text style={styles.securitySettingTitle}>Authentication for Older Messages</Text>
                <Text style={styles.securitySettingDescription}>
                  Require biometric auth to access messages older than 30 days
                </Text>
              </View>
            </View>
            <Switch
              value={requireAuthForOlderMessages}
              onValueChange={setRequireAuthForOlderMessages}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={requireAuthForOlderMessages ? "#007AFF" : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity style={styles.saveSecuritySettings} onPress={onClose}>
            <Text style={styles.saveSecuritySettingsText}>Save Settings</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

// Settings/actions modal
const MessagingOptionsModal = ({ visible, onClose, onNavigateToAutomatedNotifications }) => {
  const [showSecuritySettings, setShowSecuritySettings] = useState(false)

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.optionsOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              onClose()
              onNavigateToAutomatedNotifications()
            }}
          >
            <Ionicons name="notifications-outline" size={24} color="#007AFF" />
            <Text style={styles.optionText}>Automated Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="people-outline" size={24} color="#007AFF" />
            <Text style={styles.optionText}>Create Group</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              setShowSecuritySettings(true)
            }}
          >
            <Ionicons name="shield-checkmark-outline" size={24} color="#007AFF" />
            <Text style={styles.optionText}>Security Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <Ionicons name="settings-outline" size={24} color="#007AFF" />
            <Text style={styles.optionText}>Messaging Settings</Text>
          </TouchableOpacity>
        </View>

        <SecuritySettingsModal visible={showSecuritySettings} onClose={() => setShowSecuritySettings(false)} />
      </TouchableOpacity>
    </Modal>
  )
}

// Main MessagesScreen component
const MessagesScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const [showOptionsModal, setShowOptionsModal] = useState(false)

  useEffect(() => {
    // Simulate loading conversations
    setTimeout(() => {
      setConversations(MOCK_CONVERSATIONS)
      setLoading(false)
    }, 800)
  }, [])

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.propertyName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleConversationPress = (conversation) => {
    setSelectedConversation(conversation)
  }

  const handleBackPress = () => {
    setSelectedConversation(null)
  }

  const handleStartConversation = (selectedContacts) => {
    // Logic to create a new conversation
    Alert.alert("New Conversation", `Started conversation with ${selectedContacts.map((c) => c.name).join(", ")}`)
  }

  const navigateToAutomatedNotifications = () => {
    navigation.navigate("AutomatedNotifications")
  }

  if (selectedConversation) {
    return <ChatInterface conversation={selectedConversation} onBack={handleBackPress} />
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={styles.submenu}>
            <TouchableOpacity style={[styles.submenuItem, styles.submenuItemActive]}>
              <Text style={[styles.submenuItemText, styles.submenuItemTextActive]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submenuItem}>
              <Text style={styles.submenuItemText}>Tenants</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submenuItem}>
              <Text style={styles.submenuItemText}>Maintenance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submenuItem}>
              <Text style={styles.submenuItemText}>Groups</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowOptionsModal(true)}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#007AFF" style={styles.headerButtonIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowNewMessageModal(true)}>
            <Ionicons name="create-outline" size={24} color="#007AFF" style={styles.headerButtonIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== "" && (
          <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearSearch}>
            <Ionicons name="close-circle" size={20} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : filteredConversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles" size={64} color="#E5E5EA" />
          <Text style={styles.emptyTitle}>No Messages</Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery ? "Try a different search term" : "Start a conversation by tapping the compose button"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          renderItem={({ item }) => <ConversationItem conversation={item} onPress={handleConversationPress} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.conversationsList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      <NewConversationModal
        visible={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        onStartConversation={handleStartConversation}
      />

      <MessagingOptionsModal
        visible={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        onNavigateToAutomatedNotifications={navigateToAutomatedNotifications}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000",
    marginRight: 24,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F6F6F6",
    justifyContent: "center",
    alignItems: "center",
  },
  headerButtonIcon: {
    width: 24,
    height: 24,
  },
  submenu: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    padding: 4,
    marginLeft: 16,
  },
  submenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  submenuItemActive: {
    backgroundColor: "#007AFF",
  },
  submenuItemText: {
    fontSize: 15,
    color: "#8E8E93",
  },
  submenuItemTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flex: 1,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: "#000000",
    padding: 0,
  },
  clearSearch: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "semibold",
    color: "#3C3C43",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 8,
  },
  conversationsList: {
    paddingBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginLeft: 76,
  },
  conversationItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  defaultAvatar: {
    backgroundColor: "#D1D1D6",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  userTypeBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  conversationContent: {
    flex: 1,
    justifyContent: "center",
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
  },
  conversationTime: {
    fontSize: 14,
    color: "#8E8E93",
    marginLeft: 8,
  },
  conversationMiddle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  conversationLastMessage: {
    fontSize: 15,
    color: "#8E8E93",
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
  },
  propertyInfo: {
    fontSize: 13,
    color: "#8E8E93",
  },

  // Chat interface styles
  chatContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F6F6F6", // Light gray iOS header
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  backText: {
    fontSize: 17,
    color: "#007AFF",
    marginLeft: -4,
  },
  chatHeaderContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  chatAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  chatName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
  },
  chatSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
  },
  chatAction: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  messagesList: {
    padding: 16,
    paddingBottom: 30,
  },
  messageBubbleContainer: {
    maxWidth: "70%",
    marginBottom: 16,
  },
  sentMessage: {
    alignSelf: "flex-end",
  },
  receivedMessage: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 4,
  },
  sentBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 5,
  },
  receivedBubble: {
    backgroundColor: "#E5E5EA",
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  sentMessageText: {
    color: "#FFFFFF",
  },
  receivedMessageText: {
    color: "#000000",
  },
  messageTime: {
    fontSize: 11,
    marginTop: 2,
    alignSelf: "flex-end",
  },
  sentMessageTime: {
    color: "#8E8E93",
    marginRight: 8,
  },
  receivedMessageTime: {
    color: "#8E8E93",
    marginLeft: 8,
  },
  messageInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6", // Light gray like iOS
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  attachButton: {
    padding: 5,
  },
  messageInput: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: 100,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  sendButton: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonInner: {
    backgroundColor: "#007AFF",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  // Attachment styles
  attachmentContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 4,
    width: 200,
  },
  sentAttachment: {
    backgroundColor: "#007AFF",
  },
  receivedAttachment: {
    backgroundColor: "#E5E5EA",
  },
  attachmentImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  attachmentInfo: {
    padding: 8,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  attachmentSize: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  documentIcon: {
    width: 200,
    height: 100,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
  },
  optionItem: {
    width: "25%",
    alignItems: "center",
    marginBottom: 20,
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 14,
    color: "#000000",
  },

  // Template styles
  templatesList: {
    padding: 16,
  },
  templateItem: {
    backgroundColor: "#F6F6F6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  templatePreview: {
    fontSize: 14,
    color: "#8E8E93",
  },
  templateButton: {
    padding: 5,
  },
  // New Conversation Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  modalCancel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
  },
  modalDone: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modalDoneDisabled: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8E8E93",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 8,
  },
  selectedContactsContainer: {
    marginBottom: 16,
  },
  selectedContact: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 12,
  },
  selectedContactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginRight: 8,
  },
  selectedContactRemove: {
    marginLeft: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  contactInitials: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  contactDetail: {
    fontSize: 14,
    color: "#8E8E93",
  },
  contactCheckmark: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  optionsContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: "70%",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  // Message status and typing indicators
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 2,
  },
  statusIndicator: {
    marginLeft: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  encryptionIndicator: {
    marginLeft: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  timedDeletionIndicator: {
    marginLeft: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  maskedMessageContent: {
    padding: 2,
  },
  maskedMessageText: {
    fontStyle: "italic",
    opacity: 0.8,
  },
  typingIndicatorContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  typingBubble: {
    backgroundColor: "#E5E5EA",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    width: 60,
    justifyContent: "center",
    borderBottomLeftRadius: 5,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#8E8E93",
    marginHorizontal: 2,
    opacity: 0.8,
    animationDuration: "1s",
    animationName: "bounce",
    animationIterationCount: "infinite",
  },
  typingDotMiddle: {
    animationDelay: "0.2s",
  },
  // Call related styles
  callContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
    zIndex: 1000,
  },
  videoContainer: {
    flex: 1,
    position: "relative",
  },
  remoteVideo: {
    width: "100%",
    height: "100%",
  },
  localVideoContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 100,
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  localVideo: {
    width: "100%",
    height: "100%",
  },
  screenSharePreview: {
    width: "100%",
    height: "100%",
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  screenShareText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 5,
  },
  audioCallContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
  },
  callerAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  callerAvatarPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  callerInitials: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  callerName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  propertyUnit: {
    fontSize: 18,
    color: "#CCCCCC",
    marginBottom: 30,
  },
  callStatusText: {
    fontSize: 20,
    color: "#CCCCCC",
    marginBottom: 40,
  },
  callControls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  callControlButton: {
    alignItems: "center",
    padding: 10,
  },
  activeControl: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
  },
  recordingControl: {
    backgroundColor: "rgba(255, 0, 0, 0.2)",
    borderRadius: 10,
  },
  controlLabel: {
    color: "#FFFFFF",
    marginTop: 5,
    fontSize: 12,
  },
  endCallButtonContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  endCallButton: {
    backgroundColor: "#FF3B30",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "135deg" }],
  },
  recordingIndicator: {
    position: "absolute",
    top: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  recordingText: {
    color: "#FFFFFF",
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
  audioRecordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 59, 48, 0.2)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginBottom: 20,
  },
  callOptionsContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  callOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  callOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  callOptionContent: {
    flex: 1,
  },
  callOptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  callOptionDescription: {
    fontSize: 14,
    color: "#8E8E93",
  },
  securityModalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: "80%",
  },
  securitySettingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  securitySettingContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  securitySettingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  securitySettingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  securitySettingDescription: {
    fontSize: 13,
    color: "#8E8E93",
    maxWidth: "90%",
  },
  timeframeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F6F6F6",
  },
  timeframeOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  timeframeOptionSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  timeframeText: {
    fontSize: 14,
    color: "#000000",
  },
  timeframeTextSelected: {
    color: "#FFFFFF",
  },
  saveSecuritySettings: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveSecuritySettingsText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  securityOptionsContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: "80%",
  },
  securityOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  securityOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  securityOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  securityOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  securityOptionDescription: {
    fontSize: 13,
    color: "#8E8E93",
    maxWidth: "90%",
  },
  securityOptionIndicator: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  expirationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  expirationOption: {
    fontSize: 14,
    color: "#8E8E93",
  },
  securityTag: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#FF2D55",
    borderRadius: 12,
    marginBottom: 4,
  },
  securityTagText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 8,
  },
  securityIndicators: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 2,
  },
  securityTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF2D55",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
  },
  securityTagText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 4,
  },
  securityButton: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  securityOptionsContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  securityOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  securityOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  securityOptionIcon: {
    marginRight: 12,
  },
  securityOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  securityOptionDescription: {
    fontSize: 14,
    color: "#8E8E93",
  },
  securityOptionIndicator: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  expirationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  expirationOption: {
    fontSize: 16,
    color: "#000000",
  },
})

export default MessagesScreen

