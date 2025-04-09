"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Dimensions,
  Switch,
  ScrollView,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { toast } from "sonner-native"

const { width } = Dimensions.get("window")

interface User {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  lastSeen?: string
}

interface Message {
  id: string
  text: string
  timestamp: string
  sender: "me" | "other"
  status: "sending" | "sent" | "delivered" | "read"
  isImage?: boolean
  imageUrl?: string
  isVoice?: boolean
  voiceDuration?: string
  voiceUrl?: string
  isTemplate?: boolean
}

interface MessageTemplate {
  id: string
  text: string
  category: "inquiry" | "booking" | "payment" | "general"
}

interface ChatScreenParams {
  conversation: {
    id: string
    user: User
    propertyId?: string
    propertyTitle?: string
  }
}

const ChatScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { conversation } = route.params as ChatScreenParams // State
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [sendReadReceipts, setSendReadReceipts] = useState(true)
  const [showReadStatus, setShowReadStatus] = useState(true)
  const [callStatus, setCallStatus] = useState<"incoming" | "outgoing" | "ongoing" | "none">("none")

  // Animated values
  const attachmentOptionsHeight = useRef(new Animated.Value(0)).current
  const typingAnimation = useRef(new Animated.Value(0)).current
  const recordingAnimation = useRef(new Animated.Value(0)).current

  // Refs
  const listRef = useRef<FlatList>(null)
  const typingTimeout = useRef<NodeJS.Timeout | null>(null)
  const recordingTimer = useRef<NodeJS.Timeout | null>(null)
  const messageTemplates: MessageTemplate[] = [
    {
      id: "1",
      text: "Hi, I am interested in your property. Is it still available?",
      category: "inquiry",
    },
    {
      id: "2",
      text: "I would like to schedule a viewing. When would be a good time?",
      category: "inquiry",
    },
    {
      id: "3",
      text: "Thank you for the information. I would like to proceed with the booking.",
      category: "booking",
    },
    {
      id: "4",
      text: "I have submitted the payment. Please confirm when received.",
      category: "payment",
    },
    {
      id: "5",
      text: "Thanks for your message. I will get back to you as soon as possible.",
      category: "general",
    },
    {
      id: "6",
      text: "Could you provide more details about the amenities?",
      category: "inquiry",
    },
  ]

  useEffect(() => {
    // Load mock messages
    setTimeout(() => {
      const mockMessages: Message[] = [
        {
          id: "1",
          text: `Hi, I'm interested in your ${conversation.propertyTitle || "property"}. Is it still available?`,
          timestamp: "10:23 AM",
          sender: "me",
          status: "read",
        },
        {
          id: "2",
          text: "Yes, it is still available! Are you looking to move in soon?",
          timestamp: "10:25 AM",
          sender: "other",
          status: "read",
        },
        {
          id: "3",
          text: "Great! I am looking to move in next month. Could I schedule a viewing?",
          timestamp: "10:28 AM",
          sender: "me",
          status: "read",
        },
        {
          id: "4",
          text: "Of course! I have availability this weekend for showings. Would Saturday or Sunday work better for you?",
          timestamp: "10:30 AM",
          sender: "other",
          status: "read",
        },
        {
          id: "5",
          text: "Saturday would be perfect. How about around 2 PM?",
          timestamp: "10:32 AM",
          sender: "me",
          status: "read",
        },
        {
          id: "6",
          text: "Here are some additional photos of the property I took recently.",
          timestamp: "10:35 AM",
          sender: "other",
          status: "delivered",
        },
        {
          id: "7",
          isImage: true,
          imageUrl: `https://api.a0.dev/assets/image?text=${conversation.propertyTitle || "modern property"}%20living%20room&aspect=16:9`,
          timestamp: "10:35 AM",
          sender: "other",
          status: "delivered",
          text: "",
        },
        {
          id: "8",
          isImage: true,
          imageUrl: `https://api.a0.dev/assets/image?text=${conversation.propertyTitle || "modern property"}%20bedroom&aspect=16:9`,
          timestamp: "10:36 AM",
          sender: "other",
          status: "delivered",
          text: "",
        },
        {
          id: "9",
          text: "These look great! I'm even more excited to see it in person now.",
          timestamp: "10:40 AM",
          sender: "me",
          status: "delivered",
        },
        {
          id: "10",
          isVoice: true,
          voiceDuration: "0:28",
          voiceUrl: "voice-message-url",
          timestamp: "10:45 AM",
          sender: "other",
          status: "delivered",
          text: "",
        },
        {
          id: "11",
          text: "I have just shared a voice message explaining the neighborhood and nearby amenities.",
          timestamp: "10:46 AM",
          sender: "other",
          status: "delivered",
        },
      ]

      setMessages(mockMessages)
      setIsLoading(false)
    }, 1000)

    // Start "typing" indicator after 2 seconds
    const timer = setTimeout(() => {
      startTypingAnimation()
    }, 2000)

    return () => {
      clearTimeout(timer)
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current)
      }
    }
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages, isLoading])

  const startTypingAnimation = () => {
    setIsTyping(true)

    // Animated typing dots
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(typingAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Stop typing after 3 seconds and send a new message
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false)
      typingAnimation.setValue(0)

      // Add new message from other user
      const newMessage: Message = {
        id: Date.now().toString(),
        text: "Saturday at 2 PM works perfectly. I will send you the address details. Looking forward to meeting you!",
        timestamp: "10:42 AM",
        sender: "other",
        status: "sent",
      }

      setMessages((prevMessages) => [...prevMessages, newMessage])
    }, 3000)
  }

  const toggleAttachmentOptions = () => {
    setShowAttachmentOptions(!showAttachmentOptions)

    Animated.timing(attachmentOptionsHeight, {
      toValue: showAttachmentOptions ? 0 : 100,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }
  const startRecording = () => {
    setIsRecording(true)
    setRecordingDuration(0)

    // Start recording animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(recordingAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(recordingAnimation, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Start timer
    recordingTimer.current = setInterval(() => {
      setRecordingDuration((prev) => prev + 1)
    }, 1000)

    toast.success("Recording started")
  }

  const stopRecording = () => {
    if (recordingTimer.current) clearInterval(recordingTimer.current)
    setIsRecording(false)
    recordingAnimation.setValue(0)

    // Only send if recording was longer than 1 second
    if (recordingDuration > 1) {
      sendVoiceMessage()
    } else {
      toast.error("Recording too short")
    }
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const sendVoiceMessage = () => {
    // Create new voice message
    const newMessage: Message = {
      id: Date.now().toString(),
      text: "",
      isVoice: true,
      voiceDuration: formatDuration(recordingDuration),
      voiceUrl: "voice-message-url", // In a real app, this would be the URL to the uploaded voice file
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sender: "me",
      status: "sending",
    }

    // Add to messages
    setMessages((prevMessages) => [...prevMessages, newMessage])

    // Simulate sending process
    simulateSendingProcess(newMessage.id)
    toast.success("Voice message sent")
  }

  const initiateVideoCall = () => {
    setCallStatus("outgoing")
    setShowVideoCall(true)

    // Simulate call being answered after 2 seconds
    setTimeout(() => {
      setCallStatus("ongoing")
    }, 2000)
  }

  const endCall = () => {
    setShowVideoCall(false)
    setCallStatus("none")
    toast.success("Call ended")
  }

  const useMessageTemplate = (template: MessageTemplate) => {
    setInputText(template.text)
    setShowTemplates(false)
  }

  const simulateSendingProcess = (messageId: string) => {
    // Simulate sending process
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === messageId ? { ...msg, status: "sent" } : msg)),
      )

      // Then delivered
      setTimeout(() => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === messageId ? { ...msg, status: "delivered" } : msg)),
        )

        // Start typing response after a short delay
        setTimeout(() => {
          startTypingAnimation()
        }, 1500)
      }, 1000)
    }, 500)
  }

  const sendMessage = () => {
    if (!inputText.trim()) return

    // Create new message
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sender: "me",
      status: "sending",
    }

    // Add to messages
    setMessages((prevMessages) => [...prevMessages, newMessage])
    setInputText("") // Simulate sending process
    simulateSendingProcess(newMessage.id)

    // Hide attachment options if open
    if (showAttachmentOptions) {
      toggleAttachmentOptions()
    }
  }

  const sendImage = (type: "camera" | "gallery") => {
    // In a real app, this would open the camera or gallery
    // For now, we'll just simulate sending an image

    const imagePrompt =
      type === "camera"
        ? "recent%20photo%20of%20modern%20apartment%20interior"
        : "interior%20design%20of%20luxury%20apartment%20living%20room"

    // Create new image message
    const newMessage: Message = {
      id: Date.now().toString(),
      text: "",
      isImage: true,
      imageUrl: `https://api.a0.dev/assets/image?text=${imagePrompt}&aspect=4:3`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sender: "me",
      status: "sending",
    }

    // Add to messages
    setMessages((prevMessages) => [...prevMessages, newMessage])

    // Simulate sending process
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "sent" } : msg)),
      )

      // Then delivered
      setTimeout(() => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)),
        )
      }, 1000)
    }, 1500)

    // Hide attachment options
    toggleAttachmentOptions()

    toast.success(`${type === "camera" ? "Photo" : "Image"} sent successfully`)
  }
  const renderMessageStatus = (status: Message["status"]) => {
    if (!showReadStatus && status === "read") {
      return <MaterialIcons name="done-all" size={14} color="#999" />
    }

    switch (status) {
      case "sending":
        return <MaterialIcons name="access-time" size={14} color="#999" />
      case "sent":
        return <MaterialIcons name="check" size={14} color="#999" />
      case "delivered":
        return <MaterialIcons name="done-all" size={14} color="#999" />
      case "read":
        return <MaterialIcons name="done-all" size={14} color="#2196F3" />
      default:
        return null
    }
  }
  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.sender === "me"

    return (
      <View style={[styles.messageRow, isMyMessage ? styles.myMessageRow : styles.otherMessageRow]}>
        {!isMyMessage && <Image source={{ uri: conversation.user.avatar }} style={styles.messageAvatar} />}

        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
            item.isImage && styles.imageBubble,
            item.isVoice && styles.voiceBubble,
          ]}
        >
          {item.isImage ? (
            <Image source={{ uri: item.imageUrl }} style={styles.messageImage} resizeMode="cover" />
          ) : item.isVoice ? (
            <View style={styles.voiceMessageContainer}>
              <TouchableOpacity style={styles.playButton}>
                <MaterialIcons name="play-arrow" size={24} color={isMyMessage ? "#2196F3" : "#666"} />
              </TouchableOpacity>
              <View style={styles.voiceWaveform}>
                {Array.from({ length: 15 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.waveformBar,
                      {
                        height: 3 + Math.random() * 15,
                        backgroundColor: isMyMessage ? "#2196F3" : "#666",
                      },
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.voiceDuration}>{item.voiceDuration}</Text>
            </View>
          ) : (
            <Text style={[styles.messageText, isMyMessage && styles.myMessageText]}>{item.text}</Text>
          )}

          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>{item.timestamp}</Text>
            {isMyMessage && renderMessageStatus(item.status)}
          </View>
        </View>
      </View>
    )
  }

  const renderTypingIndicator = () => {
    if (!isTyping) return null

    return (
      <View style={styles.typingContainer}>
        <Image source={{ uri: conversation.user.avatar }} style={styles.typingAvatar} />
        <View style={styles.typingBubble}>
          <View style={styles.typingDots}>
            <Animated.View style={[styles.typingDot, { opacity: typingAnimation }]} />
            <Animated.View style={[styles.typingDot, { opacity: Animated.multiply(typingAnimation, 0.8) }]} />
            <Animated.View style={[styles.typingDot, { opacity: Animated.multiply(typingAnimation, 0.6) }]} />
          </View>
        </View>
      </View>
    )
  }

  const renderAttachmentOptions = () => {
    return (
      <Animated.View style={[styles.attachmentOptions, { height: attachmentOptionsHeight }]}>
        <TouchableOpacity style={styles.attachmentOption} onPress={() => sendImage("camera")}>
          <View style={[styles.attachmentIcon, { backgroundColor: "#4CAF50" }]}>
            <MaterialIcons name="camera-alt" size={24} color="white" />
          </View>
          <Text style={styles.attachmentText}>Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.attachmentOption} onPress={() => sendImage("gallery")}>
          <View style={[styles.attachmentIcon, { backgroundColor: "#FF9800" }]}>
            <MaterialIcons name="photo" size={24} color="white" />
          </View>
          <Text style={styles.attachmentText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.attachmentOption}>
          <View style={[styles.attachmentIcon, { backgroundColor: "#2196F3" }]}>
            <MaterialIcons name="location-on" size={24} color="white" />
          </View>
          <Text style={styles.attachmentText}>Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.attachmentOption}>
          <View style={[styles.attachmentIcon, { backgroundColor: "#9C27B0" }]}>
            <MaterialIcons name="insert-drive-file" size={24} color="white" />
          </View>
          <Text style={styles.attachmentText}>Document</Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      {/* Header */} {/* Video Call Modal */}
      {showVideoCall && (
        <View style={styles.videoCallContainer}>
          <LinearGradient colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.6)"]} style={styles.videoCallGradient} />

          <View style={styles.callHeader}>
            <Text style={styles.callStatus}>
              {callStatus === "incoming"
                ? "Incoming call..."
                : callStatus === "outgoing"
                  ? "Calling..."
                  : "Call in progress"}
            </Text>
            <Text style={styles.callDuration}>{callStatus === "ongoing" ? "00:27" : ""}</Text>
          </View>

          <View style={styles.remoteVideo}>
            <Image source={{ uri: conversation.user.avatar }} style={styles.remoteVideoImage} />
            <Text style={styles.remoteUserName}>{conversation.user.name}</Text>
          </View>

          <View style={styles.localVideo}>
            <View style={styles.localVideoPlaceholder}>
              <MaterialIcons name="person" size={24} color="white" />
            </View>
          </View>

          <View style={styles.callControls}>
            <TouchableOpacity style={[styles.callControlButton, styles.muteButton]}>
              <MaterialIcons name="mic-off" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.callControlButton, styles.endCallButton]} onPress={endCall}>
              <MaterialIcons name="call-end" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.callControlButton, styles.videoButton]}>
              <MaterialIcons name="videocam" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Settings Modal */}
      {showSettings && (
        <View style={styles.settingsModalContainer}>
          <View style={styles.settingsModal}>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>Chat Settings</Text>
              <TouchableOpacity style={styles.settingsCloseButton} onPress={() => setShowSettings(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.settingSection}>
              <Text style={styles.settingSectionTitle}>Privacy</Text>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <MaterialIcons name="visibility" size={22} color="#666" />
                  <Text style={styles.settingLabel}>Send read receipts</Text>
                </View>
                <Switch
                  value={sendReadReceipts}
                  onValueChange={setSendReadReceipts}
                  trackColor={{ false: "#d1d1d1", true: "#a6d4fa" }}
                  thumbColor={sendReadReceipts ? "#2196F3" : "#f4f3f4"}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <MaterialIcons name="done-all" size={22} color="#666" />
                  <Text style={styles.settingLabel}>Show read status with blue checkmarks</Text>
                </View>
                <Switch
                  value={showReadStatus}
                  onValueChange={setShowReadStatus}
                  trackColor={{ false: "#d1d1d1", true: "#a6d4fa" }}
                  thumbColor={showReadStatus ? "#2196F3" : "#f4f3f4"}
                />
              </View>
            </View>

            <View style={styles.settingSection}>
              <Text style={styles.settingSectionTitle}>Media</Text>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <MaterialIcons name="photo" size={22} color="#666" />
                  <Text style={styles.settingLabel}>Auto-download media</Text>
                </View>
                <Switch value={true} trackColor={{ false: "#d1d1d1", true: "#a6d4fa" }} thumbColor={"#2196F3"} />
              </View>
            </View>

            <TouchableOpacity style={styles.clearChatButton}>
              <MaterialIcons name="delete-sweep" size={22} color="#ff4444" />
              <Text style={styles.clearChatText}>Clear conversation</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.headerUserInfo}>
            <Image source={{ uri: conversation.user.avatar }} style={styles.headerAvatar} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerUserName}>{conversation.user.name}</Text>
              <Text style={styles.headerStatus}>
                {conversation.user.isOnline ? "Online" : conversation.user.lastSeen || "Offline"}
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerActionButton} onPress={initiateVideoCall}>
              <MaterialIcons name="videocam" size={24} color="#2196F3" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerActionButton} onPress={() => setShowSettings(true)}>
              <MaterialIcons name="more-vert" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {conversation.propertyTitle && (
          <TouchableOpacity
            style={styles.propertyInfoBanner}
            onPress={() => navigation.navigate("PropertyDetail", { propertyId: conversation.propertyId })}
          >
            <MaterialIcons name="home" size={16} color="#2196F3" />
            <Text style={styles.propertyInfoText}>
              Conversation about: <Text style={styles.propertyTitle}>{conversation.propertyTitle}</Text>
            </Text>
            <MaterialIcons name="chevron-right" size={16} color="#666" />
          </TouchableOpacity>
        )}
      </View>
      {/* Messages */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderTypingIndicator}
        />
      )}{" "}
      {/* Message Templates */}
      {showTemplates && (
        <View style={styles.templatesContainer}>
          <View style={styles.templatesHeader}>
            <Text style={styles.templatesTitle}>Quick Responses</Text>
            <TouchableOpacity onPress={() => setShowTemplates(false)}>
              <MaterialIcons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.templatesScrollContent}
          >
            {messageTemplates.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={styles.templateItem}
                onPress={() => useMessageTemplate(template)}
              >
                <Text style={styles.templateText} numberOfLines={2}>
                  {template.text}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      {/* Attachment Options */}
      {renderAttachmentOptions()}
      {/* Input Area */}
      <View style={styles.inputContainer}>
        {!isRecording ? (
          <>
            <TouchableOpacity style={styles.attachButton} onPress={toggleAttachmentOptions}>
              <MaterialIcons name={showAttachmentOptions ? "close" : "attach-file"} size={24} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.templatesButton} onPress={() => setShowTemplates(!showTemplates)}>
              <MaterialIcons name="format-quote" size={24} color="#666" />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
              multiline
            />

            {inputText.trim() ? (
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <MaterialIcons name="send" size={24} color="#2196F3" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.micButton} onPressIn={startRecording} onPressOut={stopRecording}>
                <MaterialIcons name="mic" size={24} color="#666" />
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={styles.recordingContainer}>
            <Animated.View style={[styles.recordingIndicator, { opacity: recordingAnimation }]} />
            <Text style={styles.recordingText}>Recording... {formatDuration(recordingDuration)}</Text>
            <TouchableOpacity
              style={styles.cancelRecordingButton}
              onPress={() => {
                if (recordingTimer.current) clearInterval(recordingTimer.current)
                setIsRecording(false)
                setRecordingDuration(0)
                recordingAnimation.setValue(0)
              }}
            >
              <MaterialIcons name="close" size={24} color="#ff4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  // Video Call Styles
  videoCallContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#333",
    zIndex: 1000,
    justifyContent: "space-between",
  },
  videoCallGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  callHeader: {
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  callStatus: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  callDuration: {
    color: "white",
    fontSize: 14,
    marginTop: 4,
  },
  remoteVideo: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  remoteVideoImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  remoteUserName: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  localVideo: {
    position: "absolute",
    top: 100,
    right: 20,
    width: 100,
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "white",
  },
  localVideoPlaceholder: {
    backgroundColor: "#666",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  callControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  callControlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  muteButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  endCallButton: {
    backgroundColor: "#ff4444",
  },
  videoButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  // Settings Modal Styles
  settingsModalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  settingsModal: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  settingsCloseButton: {
    padding: 4,
  },
  settingSection: {
    marginBottom: 20,
  },
  settingSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },
  clearChatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 10,
  },
  clearChatText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  // Message Templates Styles
  templatesContainer: {
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 12,
  },
  templatesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  templatesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  templatesScrollContent: {
    paddingRight: 20,
  },
  templateItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    marginRight: 12,
    width: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  templateText: {
    fontSize: 14,
    color: "#333",
  },

  // Voice Message Styles
  voiceBubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  voiceMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 200,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  voiceWaveform: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 30,
    justifyContent: "space-between",
  },
  waveformBar: {
    width: 3,
    borderRadius: 1.5,
  },
  voiceDuration: {
    fontSize: 12,
    color: "#999",
    marginLeft: 8,
  },
  recordingContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ff4444",
    marginRight: 12,
  },
  recordingText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  cancelRecordingButton: {
    padding: 4,
  },
  templatesButton: {
    padding: 8,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingTop: Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0,
    zIndex: 1,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    marginRight: 12,
  },
  headerUserInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerUserName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  headerStatus: {
    fontSize: 12,
    color: "#666",
  },
  headerActions: {
    flexDirection: "row",
  },
  headerActionButton: {
    padding: 8,
    marginLeft: 8,
  },
  propertyInfoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f7ff",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  propertyInfoText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    marginRight: 8,
  },
  propertyTitle: {
    color: "#333",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#666",
    fontSize: 16,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 16,
    maxWidth: "80%",
  },
  myMessageRow: {
    alignSelf: "flex-end",
  },
  otherMessageRow: {
    alignSelf: "flex-start",
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    alignSelf: "flex-end",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: "100%",
  },
  myMessageBubble: {
    backgroundColor: "#e3f2fd",
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: "white",
    borderBottomLeftRadius: 4,
  },
  imageBubble: {
    padding: 4,
    overflow: "hidden",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  myMessageText: {
    color: "#333",
  },
  messageImage: {
    width: width * 0.6,
    height: width * 0.45,
    borderRadius: 16,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
    color: "#999",
    marginRight: 4,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  typingAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  typingBubble: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
  },
  typingDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 16,
    width: 40,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#999",
    marginHorizontal: 2,
  },
  attachmentOptions: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    overflow: "hidden",
  },
  attachmentOption: {
    alignItems: "center",
    marginRight: 24,
  },
  attachmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  attachmentText: {
    fontSize: 12,
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
  },
  sendButton: {
    padding: 8,
  },
  micButton: {
    padding: 8,
  },
})

export default ChatScreen

