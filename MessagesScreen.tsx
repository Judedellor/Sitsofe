"use client"

import { useState, useEffect } from "react"
import { Platform, StatusBar } from "react-native"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ActivityIndicator } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { toast } from "sonner-native"
import HamburgerMenu from "../../components/HamburgerMenu"

interface Conversation {
  id: string
  user: {
    id: string
    name: string
    avatar: string
    isOnline: boolean
    lastSeen?: string
  }
  lastMessage: {
    text: string
    timestamp: string
    isRead: boolean
    sender: "me" | "other"
  }
  unreadCount: number
  isStarred: boolean
  propertyId?: string
  propertyTitle?: string
}

const MessagesScreen = () => {
  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])

  useEffect(() => {
    loadConversations()
  }, [])

  // Filter & search effect
  useEffect(() => {
    filterConversations()
  }, [searchQuery, activeFilter]) // Removed unnecessary dependency: conversations

  const loadConversations = async () => {
    setIsLoading(true)

    // Simulating API call with a timeout
    setTimeout(() => {
      const mockConversations: Conversation[] = [
        {
          id: "1",
          user: {
            id: "u1",
            name: "Sarah Johnson",
            avatar: "https://api.a0.dev/assets/image?text=female%20professional%20headshot%20smiling&aspect=1:1",
            isOnline: true,
          },
          lastMessage: {
            text: "I'm interested in the apartment you listed. Is it still available?",
            timestamp: "10:23 AM",
            isRead: false,
            sender: "other",
          },
          unreadCount: 1,
          isStarred: false,
          propertyId: "1",
          propertyTitle: "Modern Luxury Apartment",
        },
        {
          id: "2",
          user: {
            id: "u2",
            name: "John Wilson",
            avatar: "https://api.a0.dev/assets/image?text=male%20professional%20headshot%20business%20suit&aspect=1:1",
            isOnline: false,
            lastSeen: "2 hours ago",
          },
          lastMessage: {
            text: "Great! The apartment is available from May 1st. When would you like to schedule a viewing?",
            timestamp: "Yesterday",
            isRead: true,
            sender: "me",
          },
          unreadCount: 0,
          isStarred: true,
          propertyId: "2",
          propertyTitle: "Downtown Penthouse",
        },
        {
          id: "3",
          user: {
            id: "u3",
            name: "Michael Chen",
            avatar: "https://api.a0.dev/assets/image?text=asian%20male%20professional%20headshot&aspect=1:1",
            isOnline: true,
          },
          lastMessage: {
            text: "Thanks for sending the additional photos. The view looks amazing!",
            timestamp: "2 days ago",
            isRead: true,
            sender: "other",
          },
          unreadCount: 0,
          isStarred: false,
          propertyId: "3",
          propertyTitle: "Beachfront Villa",
        },
        {
          id: "4",
          user: {
            id: "u4",
            name: "Emma Wilson",
            avatar: "https://api.a0.dev/assets/image?text=blonde%20woman%20headshot%20with%20glasses&aspect=1:1",
            isOnline: false,
            lastSeen: "5 hours ago",
          },
          lastMessage: {
            text: "I've just submitted my application for the apartment. Please let me know if you need any additional information.",
            timestamp: "3 days ago",
            isRead: true,
            sender: "other",
          },
          unreadCount: 0,
          isStarred: true,
          propertyId: "4",
          propertyTitle: "Cozy Studio Loft",
        },
        {
          id: "5",
          user: {
            id: "u5",
            name: "David Rodriguez",
            avatar: "https://api.a0.dev/assets/image?text=latino%20male%20professional%20headshot&aspect=1:1",
            isOnline: false,
            lastSeen: "1 day ago",
          },
          lastMessage: {
            text: "What utilities are included in the rent?",
            timestamp: "1 week ago",
            isRead: true,
            sender: "other",
          },
          unreadCount: 0,
          isStarred: false,
          propertyId: "5",
          propertyTitle: "Urban Apartment",
        },
      ]

      setConversations(mockConversations)
      setIsLoading(false)
    }, 1000)
  }

  const filterConversations = () => {
    let result = [...conversations]

    // Apply filter
    if (activeFilter === "unread") {
      result = result.filter((convo) => convo.unreadCount > 0)
    } else if (activeFilter === "starred") {
      result = result.filter((convo) => convo.isStarred)
    }

    // Apply search
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(
        (convo) =>
          convo.user.name.toLowerCase().includes(query) ||
          convo.lastMessage.text.toLowerCase().includes(query) ||
          (convo.propertyTitle && convo.propertyTitle.toLowerCase().includes(query)),
      )
    }

    setFilteredConversations(result)
  }

  const toggleStarred = (id: string) => {
    setConversations((prevConversations) =>
      prevConversations.map((convo) => (convo.id === id ? { ...convo, isStarred: !convo.isStarred } : convo)),
    )

    toast.success("Conversation updated")
  }

  const markAsRead = (id: string) => {
    setConversations((prevConversations) =>
      prevConversations.map((convo) =>
        convo.id === id ? { ...convo, unreadCount: 0, lastMessage: { ...convo.lastMessage, isRead: true } } : convo,
      ),
    )
  }

  const handleNavigateToChat = (conversation: Conversation) => {
    markAsRead(conversation.id)
    navigation.navigate("Chat", { conversation })
  }

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity style={styles.conversationCard} onPress={() => handleNavigateToChat(item)}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        {item.user.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.timestamp}>{item.lastMessage.timestamp}</Text>
        </View>

        {item.propertyTitle && (
          <View style={styles.propertyBadge}>
            <MaterialIcons name="home" size={12} color="#2196F3" />
            <Text style={styles.propertyName}>{item.propertyTitle}</Text>
          </View>
        )}

        <View style={styles.messageContainer}>
          {item.lastMessage.sender === "me" && <Text style={styles.messagePrefix}>You: </Text>}
          <Text style={[styles.messageText, !item.lastMessage.isRead && styles.unreadMessageText]} numberOfLines={1}>
            {item.lastMessage.text}
          </Text>

          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.starButton} onPress={() => toggleStarred(item.id)}>
        <MaterialIcons
          name={item.isStarred ? "star" : "star-border"}
          size={24}
          color={item.isStarred ? "#FFD700" : "#ccc"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="forum" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No conversations yet</Text>
      <Text style={styles.emptySubtitle}>Messages from property owners and renters will appear here</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <HamburgerMenu />
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity style={styles.newChatButton} onPress={() => navigation.navigate("NewMessage")}>
            <MaterialIcons name="edit" size={24} color="#2196F3" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery("")}>
              <MaterialIcons name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === "all" && styles.activeFilterChip]}
          onPress={() => setActiveFilter("all")}
        >
          <MaterialIcons name="forum" size={18} color={activeFilter === "all" ? "white" : "#666"} />
          <Text style={[styles.filterText, activeFilter === "all" && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, activeFilter === "unread" && styles.activeFilterChip]}
          onPress={() => setActiveFilter("unread")}
        >
          <MaterialIcons name="mark-email-unread" size={18} color={activeFilter === "unread" ? "white" : "#666"} />
          <Text style={[styles.filterText, activeFilter === "unread" && styles.activeFilterText]}>Unread</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, activeFilter === "starred" && styles.activeFilterChip]}
          onPress={() => setActiveFilter("starred")}
        >
          <MaterialIcons name="star" size={18} color={activeFilter === "starred" ? "white" : "#666"} />
          <Text style={[styles.filterText, activeFilter === "starred" && styles.activeFilterText]}>Starred</Text>
        </TouchableOpacity>
      </View>

      {/* Conversation List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 44 + 16 : StatusBar.currentHeight + 16 || 36,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    zIndex: 1,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  newChatButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
  filtersContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeFilterChip: {
    backgroundColor: "#2196F3",
  },
  filterText: {
    color: "#666",
    marginLeft: 6,
    fontSize: 14,
  },
  activeFilterText: {
    color: "white",
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
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
  conversationCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "white",
  },
  conversationContent: {
    flex: 1,
    marginRight: 8,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  propertyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f7ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  propertyName: {
    fontSize: 12,
    color: "#2196F3",
    marginLeft: 4,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  messagePrefix: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  messageText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  unreadMessageText: {
    color: "#333",
    fontWeight: "500",
  },
  unreadBadge: {
    backgroundColor: "#2196F3",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  unreadCount: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  starButton: {
    padding: 8,
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
})

export default MessagesScreen

