"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { GROUP_MESSAGES } from "./GroupMessagesData"

// Message bubble component for group chats
const GroupMessageBubble = ({ message, isCurrentUser }) => {
  const isAnnouncement = message.isAnnouncement
  const isAdmin = message.sender.includes("admin")

  return (
    <View
      style={[
        styles.messageBubbleContainer,
        isCurrentUser ? styles.sentMessage : styles.receivedMessage,
        isAnnouncement ? styles.announcementContainer : null,
      ]}
    >
      <View style={styles.senderInfo}>
        {!isCurrentUser && (
          <Text style={[styles.senderName, isAdmin ? styles.adminName : null]}>
            {message.senderName}
            {isAnnouncement && <Text style={styles.announcementTag}> • Announcement</Text>}
          </Text>
        )}
      </View>

      <View
        style={[
          styles.messageBubble,
          isCurrentUser ? styles.sentBubble : styles.receivedBubble,
          isAnnouncement ? styles.announcementBubble : null,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isCurrentUser ? styles.sentMessageText : styles.receivedMessageText,
            isAnnouncement ? styles.announcementText : null,
          ]}
        >
          {message.text}
        </Text>
      </View>

      <Text style={[styles.messageTime, isCurrentUser ? styles.sentMessageTime : styles.receivedMessageTime]}>
        {message.timestamp}
      </Text>
    </View>
  )
}

// Forward message modal
const ForwardMessageModal = ({ visible, onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock recipients that could be forwarded to
  const recipients = [
    { id: "r1", name: "All Tenants", type: "group", property: "Sunset Apartments" },
    { id: "r2", name: "Building A Residents", type: "group", property: "Oakwood Heights" },
    { id: "r3", name: "Maintenance Team", type: "group", property: "All Properties" },
    { id: "r4", name: "John Smith", type: "individual", property: "Sunset Apartments - Unit 101" },
    { id: "r5", name: "Sarah Johnson", type: "individual", property: "Maintenance Staff" },
  ]

  const filteredRecipients = recipients.filter(
    (recipient) =>
      recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipient.property.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Forward Message</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={18} color="#8E8E93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search recipients..."
              placeholderTextColor="#8E8E93"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== "" && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle-filled" size={18} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredRecipients}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.recipientItem}
                onPress={() => {
                  onSelect(item)
                  onClose()
                }}
              >
                <View style={styles.recipientIcon}>
                  <Ionicons name={item.type === "group" ? "people" : "person"} size={24} color="#007AFF" />
                </View>
                <View style={styles.recipientInfo}>
                  <Text style={styles.recipientName}>{item.name}</Text>
                  <Text style={styles.recipientDetail}>{item.property}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyList}>
                <Text style={styles.emptyText}>No recipients found</Text>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  )
}

// Create Announcement modal
const CreateAnnouncementModal = ({ visible, onClose, onSend }) => {
  const [message, setMessage] = useState("")
  const [selectedProperties, setSelectedProperties] = useState([])
  const [urgency, setUrgency] = useState("normal")

  const propertyOptions = [
    { id: "p1", name: "All Properties" },
    { id: "p2", name: "Sunset Apartments" },
    { id: "p3", name: "Oakwood Heights" },
    { id: "p4", name: "Parkview Residences" },
  ]

  const urgencyOptions = [
    { id: "normal", name: "Normal", color: "#007AFF" },
    { id: "important", name: "Important", color: "#FF9500" },
    { id: "urgent", name: "Urgent", color: "#FF3B30" },
  ]

  const toggleProperty = (propertyId) => {
    if (propertyId === "p1") {
      // If "All Properties" is selected, select only it
      setSelectedProperties(["p1"])
    } else {
      // If selecting a specific property, remove "All Properties"
      const newSelection = selectedProperties.includes(propertyId)
        ? selectedProperties.filter((id) => id !== propertyId)
        : [...selectedProperties.filter((id) => id !== "p1"), propertyId]

      setSelectedProperties(newSelection)
    }
  }

  const handleSend = () => {
    if (message.trim() === "") {
      Alert.alert("Error", "Please enter an announcement message")
      return
    }

    if (selectedProperties.length === 0) {
      Alert.alert("Error", "Please select at least one property")
      return
    }

    onSend({
      message,
      properties: selectedProperties.map((id) => propertyOptions.find((p) => p.id === id).name),
      urgency,
    })

    // Reset form
    setMessage("")
    setSelectedProperties([])
    setUrgency("normal")
    onClose()
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, styles.announcementModalContainer]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Announcement</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.sectionTitle}>Message</Text>
            <TextInput
              style={styles.announcementInput}
              placeholder="Enter announcement text..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.sectionTitle}>Properties</Text>
            <View style={styles.propertiesContainer}>
              {propertyOptions.map((property) => (
                <TouchableOpacity
                  key={property.id}
                  style={[styles.propertyOption, selectedProperties.includes(property.id) && styles.selectedProperty]}
                  onPress={() => toggleProperty(property.id)}
                >
                  <Text
                    style={[
                      styles.propertyText,
                      selectedProperties.includes(property.id) && styles.selectedPropertyText,
                    ]}
                  >
                    {property.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Urgency</Text>
            <View style={styles.urgencyContainer}>
              {urgencyOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.urgencyOption, urgency === option.id && { borderColor: option.color }]}
                  onPress={() => setUrgency(option.id)}
                >
                  <View style={[styles.urgencyDot, { backgroundColor: option.color }]} />
                  <Text style={styles.urgencyText}>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.sendAnnouncementButton} onPress={handleSend}>
              <Text style={styles.sendAnnouncementText}>Send Announcement</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

// Main Group Chat Interface component
const GroupChatInterface = ({ conversation, onBack }) => {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForwardModal, setShowForwardModal] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [longPressedMessage, setLongPressedMessage] = useState(null)

  useEffect(() => {
    // Simulate loading messages
    setTimeout(() => {
      if (GROUP_MESSAGES[conversation.id]) {
        setMessages(GROUP_MESSAGES[conversation.id])
      }
      setLoading(false)
    }, 500)
  }, [conversation.id])

  const sendMessage = () => {
    if (message.trim() === "") return

    const newMessage = {
      id: `gm${Date.now()}`,
      text: message,
      sender: "current-user",
      senderName: "You",
      timestamp: "Just now",
      isAnnouncement: false,
    }

    setMessages([...messages, newMessage])
    setMessage("")
  }

  const handleForwardMessage = (selectedRecipient) => {
    Alert.alert("Message Forwarded", `Message forwarded to ${selectedRecipient.name}`, [{ text: "OK" }])
  }

  const handleLongPressMessage = (message) => {
    setLongPressedMessage(message)
    Alert.alert("Message Options", "What would you like to do?", [
      {
        text: "Forward",
        onPress: () => {
          setSelectedMessage(message)
          setShowForwardModal(true)
        },
      },
      {
        text: message.sender === "current-user" ? "Delete" : "Report",
        style: "destructive",
        onPress: () =>
          Alert.alert(
            message.sender === "current-user" ? "Delete Message" : "Report Message",
            message.sender === "current-user"
              ? "Are you sure you want to delete this message?"
              : "Report this message to administrators?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Confirm",
                style: "destructive",
                onPress: () =>
                  Alert.alert("Success", message.sender === "current-user" ? "Message deleted" : "Message reported"),
              },
            ],
          ),
      },
      { text: "Cancel", style: "cancel" },
    ])
  }

  const handleSendAnnouncement = (announcementData) => {
    const newAnnouncement = {
      id: `gm${Date.now()}`,
      text: announcementData.message,
      sender: "current-user-admin",
      senderName: "You (Admin)",
      timestamp: "Just now",
      isAnnouncement: true,
    }

    setMessages([...messages, newAnnouncement])

    Alert.alert("Announcement Sent", `Your announcement has been sent to ${announcementData.properties.join(", ")}`, [
      { text: "OK" },
    ])
  }

  const canSendAnnouncement = conversation.userType.includes("group")

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#007AFF" />
            <Text style={styles.backText}>Messages</Text>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.groupIconContainer}>
              <Ionicons
                name={
                  conversation.userType === "property-group"
                    ? "business"
                    : conversation.userType === "building-group"
                      ? "home"
                      : conversation.userType === "maintenance-group"
                        ? "construct"
                        : conversation.userType === "emergency-group"
                          ? "warning"
                          : "people"
                }
                size={20}
                color="#FFFFFF"
              />
            </View>

            <View>
              <Text style={styles.groupName}>{conversation.name}</Text>
              <Text style={styles.groupInfo}>
                {conversation.propertyName} • {conversation.members} members
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.headerAction}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={({ item }) => (
              <TouchableOpacity onLongPress={() => handleLongPressMessage(item)} activeOpacity={0.8}>
                <GroupMessageBubble
                  message={item}
                  isCurrentUser={item.sender === "current-user" || item.sender === "current-user-admin"}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
          />
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.inputButton}
            onPress={() => Alert.alert("Coming Soon", "This feature is under development")}
          >
            <Ionicons name="add-circle" size={30} color="#007AFF" />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            placeholder="Message"
            placeholderTextColor="#8E8E93"
            value={message}
            onChangeText={setMessage}
            multiline
          />

          {message.trim() === "" ? (
            canSendAnnouncement && (
              <TouchableOpacity style={styles.inputButton} onPress={() => setShowAnnouncementModal(true)}>
                <Ionicons name="megaphone" size={28} color="#007AFF" />
              </TouchableOpacity>
            )
          ) : (
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <View style={styles.sendButtonInner}>
                <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          )}
        </View>

        <ForwardMessageModal
          visible={showForwardModal}
          onClose={() => setShowForwardModal(false)}
          onSelect={handleForwardMessage}
        />

        <CreateAnnouncementModal
          visible={showAnnouncementModal}
          onClose={() => setShowAnnouncementModal(false)}
          onSend={handleSendAnnouncement}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F6F6F6",
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
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  groupIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  groupName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
  },
  groupInfo: {
    fontSize: 13,
    color: "#8E8E93",
  },
  headerAction: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messagesList: {
    padding: 16,
    paddingBottom: 30,
  },
  messageBubbleContainer: {
    maxWidth: "80%",
    marginBottom: 16,
  },
  sentMessage: {
    alignSelf: "flex-end",
  },
  receivedMessage: {
    alignSelf: "flex-start",
  },
  senderInfo: {
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  senderName: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "500",
  },
  adminName: {
    color: "#007AFF",
  },
  announcementTag: {
    color: "#FF9500",
    fontStyle: "italic",
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
  announcementContainer: {
    alignSelf: "stretch",
    maxWidth: "100%",
  },
  announcementBubble: {
    backgroundColor: "#FFF9C4",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD600",
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
  announcementText: {
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  inputButton: {
    padding: 5,
  },
  textInput: {
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
    maxHeight: "70%",
  },
  announcementModalContainer: {
    maxHeight: "90%",
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
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
  separator: {
    height: 1,
    backgroundColor: "#E5E5EA",
    marginLeft: 56,
  },
  recipientItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  recipientIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E9F6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
    marginBottom: 2,
  },
  recipientDetail: {
    fontSize: 14,
    color: "#8E8E93",
  },
  emptyList: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#8E8E93",
  },

  // Announcement modal styles
  modalContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
    marginTop: 16,
  },
  announcementInput: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    height: 120,
    textAlignVertical: "top",
  },
  propertiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  propertyOption: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  selectedProperty: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  propertyText: {
    fontSize: 14,
    color: "#000000",
  },
  selectedPropertyText: {
    color: "#FFFFFF",
  },
  urgencyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  urgencyOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  urgencyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  urgencyText: {
    fontSize: 14,
    color: "#000000",
  },
  sendAnnouncementButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  sendAnnouncementText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default GroupChatInterface

