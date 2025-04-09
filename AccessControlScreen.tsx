"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, TextInput, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useNavigation, useRoute } from "@react-navigation/native"

// Types for access control
interface AccessUser {
  id: string
  name: string
  role: "tenant" | "staff" | "vendor" | "guest" | "owner"
  unitId?: string
  unitName?: string
  accessLevel: "full" | "limited" | "scheduled"
  status: "active" | "inactive" | "pending"
  lastAccess?: string
  photo?: string
}

interface AccessLog {
  id: string
  userId: string
  userName: string
  userRole: string
  accessPoint: string
  timestamp: string
  status: "granted" | "denied"
  reason?: string
}

interface TempAccess {
  id: string
  name: string
  email: string
  phone: string
  accessType: "vendor" | "guest"
  unitId?: string
  unitName?: string
  startDate: string
  endDate: string
  notes?: string
  status: "pending" | "active" | "expired"
}

interface AccessPoint {
  id: string
  name: string
  type: "door" | "gate" | "elevator" | "amenity"
  location: string
  status: "online" | "offline" | "maintenance"
  lastActivity?: string
  restrictedAccess: boolean
}

// Mock data for access users
const mockAccessUsers: AccessUser[] = [
  {
    id: "user1",
    name: "John Doe",
    role: "tenant",
    unitId: "unit101",
    unitName: "Unit 101",
    accessLevel: "full",
    status: "active",
    lastAccess: "2023-04-15T14:30:00Z",
    photo: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "user2",
    name: "Jane Smith",
    role: "tenant",
    unitId: "unit102",
    unitName: "Unit 102",
    accessLevel: "full",
    status: "active",
    lastAccess: "2023-04-15T12:15:00Z",
    photo: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "user3",
    name: "Mike Johnson",
    role: "staff",
    accessLevel: "full",
    status: "active",
    lastAccess: "2023-04-15T10:45:00Z",
    photo: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: "user4",
    name: "Sarah Williams",
    role: "vendor",
    accessLevel: "scheduled",
    status: "active",
    lastAccess: "2023-04-14T16:20:00Z",
    photo: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    id: "user5",
    name: "Robert Brown",
    role: "guest",
    unitId: "unit103",
    unitName: "Unit 103",
    accessLevel: "limited",
    status: "pending",
    photo: "https://randomuser.me/api/portraits/men/5.jpg",
  },
]

// Mock data for access logs
const mockAccessLogs: AccessLog[] = [
  {
    id: "log1",
    userId: "user1",
    userName: "John Doe",
    userRole: "tenant",
    accessPoint: "Main Entrance",
    timestamp: "2023-04-15T14:30:00Z",
    status: "granted",
  },
  {
    id: "log2",
    userId: "user2",
    userName: "Jane Smith",
    userRole: "tenant",
    accessPoint: "Unit 102",
    timestamp: "2023-04-15T12:15:00Z",
    status: "granted",
  },
  {
    id: "log3",
    userId: "user3",
    userName: "Mike Johnson",
    userRole: "staff",
    accessPoint: "Maintenance Room",
    timestamp: "2023-04-15T10:45:00Z",
    status: "granted",
  },
  {
    id: "log4",
    userId: "unknown",
    userName: "Unknown",
    userRole: "unknown",
    accessPoint: "Side Entrance",
    timestamp: "2023-04-15T08:20:00Z",
    status: "denied",
    reason: "Invalid credentials",
  },
  {
    id: "log5",
    userId: "user4",
    userName: "Sarah Williams",
    userRole: "vendor",
    accessPoint: "Main Entrance",
    timestamp: "2023-04-14T16:20:00Z",
    status: "granted",
  },
]

// Mock data for temporary access
const mockTempAccess: TempAccess[] = [
  {
    id: "temp1",
    name: "David Clark",
    email: "david.clark@example.com",
    phone: "555-123-4567",
    accessType: "vendor",
    startDate: "2023-04-16T09:00:00Z",
    endDate: "2023-04-16T17:00:00Z",
    notes: "Plumbing repair in Unit 104",
    status: "pending",
  },
  {
    id: "temp2",
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    phone: "555-987-6543",
    accessType: "guest",
    unitId: "unit101",
    unitName: "Unit 101",
    startDate: "2023-04-17T12:00:00Z",
    endDate: "2023-04-19T12:00:00Z",
    notes: "Visiting tenant John Doe",
    status: "active",
  },
  {
    id: "temp3",
    name: "Mark Wilson",
    email: "mark.wilson@example.com",
    phone: "555-456-7890",
    accessType: "vendor",
    startDate: "2023-04-15T10:00:00Z",
    endDate: "2023-04-15T15:00:00Z",
    notes: "HVAC maintenance",
    status: "expired",
  },
]

// Mock data for access points
const mockAccessPoints: AccessPoint[] = [
  {
    id: "ap1",
    name: "Main Entrance",
    type: "door",
    location: "Front of Building",
    status: "online",
    lastActivity: "2023-04-15T14:30:00Z",
    restrictedAccess: false,
  },
  {
    id: "ap2",
    name: "Side Entrance",
    type: "door",
    location: "East Side",
    status: "online",
    lastActivity: "2023-04-15T08:20:00Z",
    restrictedAccess: true,
  },
  {
    id: "ap3",
    name: "Parking Gate",
    type: "gate",
    location: "Parking Lot",
    status: "online",
    lastActivity: "2023-04-15T13:10:00Z",
    restrictedAccess: false,
  },
  {
    id: "ap4",
    name: "Elevator",
    type: "elevator",
    location: "Main Lobby",
    status: "online",
    lastActivity: "2023-04-15T14:25:00Z",
    restrictedAccess: false,
  },
  {
    id: "ap5",
    name: "Pool Area",
    type: "amenity",
    location: "Backyard",
    status: "online",
    lastActivity: "2023-04-15T11:45:00Z",
    restrictedAccess: true,
  },
  {
    id: "ap6",
    name: "Maintenance Room",
    type: "door",
    location: "Basement",
    status: "online",
    lastActivity: "2023-04-15T10:45:00Z",
    restrictedAccess: true,
  },
]

const AccessControlScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { propertyId } = route.params as { propertyId: string }

  const [activeTab, setActiveTab] = useState<"users" | "logs" | "temp" | "points">("users")
  const [users, setUsers] = useState<AccessUser[]>(mockAccessUsers)
  const [logs, setLogs] = useState<AccessLog[]>(mockAccessLogs)
  const [tempAccess, setTempAccess] = useState<TempAccess[]>(mockTempAccess)
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>(mockAccessPoints)
  const [showAddTempAccess, setShowAddTempAccess] = useState(false)
  const [searchText, setSearchText] = useState("")

  // New temporary access form state
  const [newTempAccess, setNewTempAccess] = useState<Omit<TempAccess, "id" | "status">>({
    name: "",
    email: "",
    phone: "",
    accessType: "guest",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    notes: "",
  })

  // Date picker state
  const [showStartDatePicker, setShowStartDatePicker] = useState(false)
  const [showEndDatePicker, setShowEndDatePicker] = useState(false)

  // Filter data based on search text
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.role.toLowerCase().includes(searchText.toLowerCase()) ||
      (user.unitName && user.unitName.toLowerCase().includes(searchText.toLowerCase())),
  )

  const filteredLogs = logs.filter(
    (log) =>
      log.userName.toLowerCase().includes(searchText.toLowerCase()) ||
      log.accessPoint.toLowerCase().includes(searchText.toLowerCase()) ||
      log.userRole.toLowerCase().includes(searchText.toLowerCase()),
  )

  const filteredTempAccess = tempAccess.filter(
    (access) =>
      access.name.toLowerCase().includes(searchText.toLowerCase()) ||
      access.accessType.toLowerCase().includes(searchText.toLowerCase()) ||
      (access.unitName && access.unitName.toLowerCase().includes(searchText.toLowerCase())) ||
      (access.notes && access.notes.toLowerCase().includes(searchText.toLowerCase())),
  )

  const filteredAccessPoints = accessPoints.filter(
    (point) =>
      point.name.toLowerCase().includes(searchText.toLowerCase()) ||
      point.type.toLowerCase().includes(searchText.toLowerCase()) ||
      point.location.toLowerCase().includes(searchText.toLowerCase()),
  )

  // Handle user status toggle
  const handleUserStatusToggle = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user,
      ),
    )
  }

  // Handle access point restriction toggle
  const handleAccessPointRestrictionToggle = (pointId: string) => {
    setAccessPoints(
      accessPoints.map((point) =>
        point.id === pointId
          ? {
              ...point,
              restrictedAccess: !point.restrictedAccess,
            }
          : point,
      ),
    )
  }

  // Handle adding temporary access
  const handleAddTempAccess = () => {
    // Validate form
    if (!newTempAccess.name || !newTempAccess.email || !newTempAccess.phone) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    // Create new temporary access
    const newAccess: TempAccess = {
      id: `temp${tempAccess.length + 1}`,
      ...newTempAccess,
      status: "pending",
    }

    setTempAccess([newAccess, ...tempAccess])
    setShowAddTempAccess(false)

    // Reset form
    setNewTempAccess({
      name: "",
      email: "",
      phone: "",
      accessType: "guest",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      notes: "",
    })

    Alert.alert("Success", "Temporary access request created")
  }

  // Handle date changes
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false)
    if (selectedDate) {
      setNewTempAccess({
        ...newTempAccess,
        startDate: selectedDate.toISOString(),
      })
    }
  }

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false)
    if (selectedDate) {
      setNewTempAccess({
        ...newTempAccess,
        endDate: selectedDate.toISOString(),
      })
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Format date and time
  const formatDateTime = (dateString: string) => {
    return `${formatDate(dateString)} ${formatTime(dateString)}`
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "granted":
        return COLORS.success
      case "inactive":
      case "denied":
      case "expired":
        return COLORS.error
      case "pending":
        return COLORS.warning
      default:
        return COLORS.gray
    }
  }

  // Get access point icon
  const getAccessPointIcon = (type: string) => {
    switch (type) {
      case "door":
        return "door-open-outline"
      case "gate":
        return "git-network-outline"
      case "elevator":
        return "arrow-up-outline"
      case "amenity":
        return "fitness-outline"
      default:
        return "lock-closed-outline"
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Access Control</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Search..." value={searchText} onChangeText={setSearchText} />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "users" && styles.activeTab]}
          onPress={() => setActiveTab("users")}
        >
          <Text style={[styles.tabText, activeTab === "users" && styles.activeTabText]}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "logs" && styles.activeTab]}
          onPress={() => setActiveTab("logs")}
        >
          <Text style={[styles.tabText, activeTab === "logs" && styles.activeTabText]}>Access Logs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "temp" && styles.activeTab]}
          onPress={() => setActiveTab("temp")}
        >
          <Text style={[styles.tabText, activeTab === "temp" && styles.activeTabText]}>Temp Access</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "points" && styles.activeTab]}
          onPress={() => setActiveTab("points")}
        >
          <Text style={[styles.tabText, activeTab === "points" && styles.activeTabText]}>Access Points</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Users Tab */}
        {activeTab === "users" && (
          <Card title="Access Users" elevated>
            {filteredUsers.map((user) => (
              <View key={user.id} style={styles.userItem}>
                <Image source={{ uri: user.photo }} style={styles.userPhoto} />

                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <View style={styles.userMeta}>
                    <View style={styles.roleBadge}>
                      <Text style={styles.roleText}>{user.role}</Text>
                    </View>
                    {user.unitName && <Text style={styles.unitText}>{user.unitName}</Text>}
                  </View>
                  {user.lastAccess && (
                    <Text style={styles.lastAccessText}>Last access: {formatDateTime(user.lastAccess)}</Text>
                  )}
                </View>

                <View style={styles.userControls}>
                  <Text style={styles.accessLevelText}>{user.accessLevel}</Text>
                  <Switch
                    value={user.status === "active"}
                    onValueChange={() => handleUserStatusToggle(user.id)}
                    trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
                    thumbColor={user.status === "active" ? COLORS.primary : COLORS.white}
                  />
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* Access Logs Tab */}
        {activeTab === "logs" && (
          <Card title="Access Logs" elevated>
            {filteredLogs.map((log) => (
              <View key={log.id} style={styles.logItem}>
                <View style={[styles.logStatusIndicator, { backgroundColor: getStatusColor(log.status) }]} />

                <View style={styles.logInfo}>
                  <Text style={styles.logTitle}>
                    {log.userName} • {log.accessPoint}
                  </Text>
                  <Text style={styles.logMeta}>
                    {log.userRole} • {formatDateTime(log.timestamp)}
                  </Text>
                  {log.reason && <Text style={styles.logReason}>{log.reason}</Text>}
                </View>

                <View style={[styles.logStatusBadge, { backgroundColor: getStatusColor(log.status) }]}>
                  <Text style={styles.logStatusText}>{log.status}</Text>
                </View>
              </View>
            ))}
          </Card>
        )}

        {/* Temporary Access Tab */}
        {activeTab === "temp" && (
          <>
            <View style={styles.tempAccessHeader}>
              <Text style={styles.tempAccessTitle}>Temporary Access</Text>
              <Button
                title="Add New"
                type="primary"
                size="small"
                onPress={() => setShowAddTempAccess(true)}
                icon={<Ionicons name="add" size={16} color={COLORS.white} style={styles.buttonIcon} />}
              />
            </View>

            {showAddTempAccess ? (
              <Card title="Add Temporary Access" elevated>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Name *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={newTempAccess.name}
                    onChangeText={(text) => setNewTempAccess({ ...newTempAccess, name: text })}
                    placeholder="Enter name"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Email *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={newTempAccess.email}
                    onChangeText={(text) => setNewTempAccess({ ...newTempAccess, email: text })}
                    placeholder="Enter email"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Phone *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={newTempAccess.phone}
                    onChangeText={(text) => setNewTempAccess({ ...newTempAccess, phone: text })}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Access Type</Text>
                  <View style={styles.accessTypeContainer}>
                    <TouchableOpacity
                      style={[styles.accessTypeButton, newTempAccess.accessType === "guest" && styles.activeAccessType]}
                      onPress={() => setNewTempAccess({ ...newTempAccess, accessType: "guest" })}
                    >
                      <Text
                        style={[
                          styles.accessTypeText,
                          newTempAccess.accessType === "guest" && styles.activeAccessTypeText,
                        ]}
                      >
                        Guest
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.accessTypeButton,
                        newTempAccess.accessType === "vendor" && styles.activeAccessType,
                      ]}
                      onPress={() => setNewTempAccess({ ...newTempAccess, accessType: "vendor" })}
                    >
                      <Text
                        style={[
                          styles.accessTypeText,
                          newTempAccess.accessType === "vendor" && styles.activeAccessTypeText,
                        ]}
                      >
                        Vendor
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Unit (Optional)</Text>
                  <TextInput
                    style={styles.formInput}
                    value={newTempAccess.unitName || ""}
                    onChangeText={(text) => setNewTempAccess({ ...newTempAccess, unitName: text })}
                    placeholder="Enter unit number"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Start Date & Time</Text>
                  <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartDatePicker(true)}>
                    <Text>{formatDateTime(newTempAccess.startDate)}</Text>
                    <Ionicons name="calendar-outline" size={20} color={COLORS.gray} />
                  </TouchableOpacity>
                  {showStartDatePicker && (
                    <DateTimePicker
                      value={new Date(newTempAccess.startDate)}
                      mode="datetime"
                      display="default"
                      onChange={handleStartDateChange}
                    />
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>End Date & Time</Text>
                  <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndDatePicker(true)}>
                    <Text>{formatDateTime(newTempAccess.endDate)}</Text>
                    <Ionicons name="calendar-outline" size={20} color={COLORS.gray} />
                  </TouchableOpacity>
                  {showEndDatePicker && (
                    <DateTimePicker
                      value={new Date(newTempAccess.endDate)}
                      mode="datetime"
                      display="default"
                      onChange={handleEndDateChange}
                    />
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Notes (Optional)</Text>
                  <TextInput
                    style={[styles.formInput, styles.textArea]}
                    value={newTempAccess.notes || ""}
                    onChangeText={(text) => setNewTempAccess({ ...newTempAccess, notes: text })}
                    placeholder="Enter additional notes"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.formButtons}>
                  <Button
                    title="Cancel"
                    type="outline"
                    onPress={() => setShowAddTempAccess(false)}
                    style={styles.formButton}
                  />
                  <Button
                    title="Create Access"
                    type="primary"
                    onPress={handleAddTempAccess}
                    style={styles.formButton}
                  />
                </View>
              </Card>
            ) : (
              <Card elevated>
                {filteredTempAccess.map((access) => (
                  <View key={access.id} style={styles.tempAccessItem}>
                    <View style={styles.tempAccessInfo}>
                      <Text style={styles.tempAccessName}>{access.name}</Text>
                      <View style={styles.tempAccessMeta}>
                        <View
                          style={[
                            styles.tempAccessTypeBadge,
                            {
                              backgroundColor: access.accessType === "guest" ? COLORS.info : COLORS.warning,
                            },
                          ]}
                        >
                          <Text style={styles.tempAccessTypeText}>{access.accessType}</Text>
                        </View>
                        {access.unitName && <Text style={styles.tempAccessUnit}>{access.unitName}</Text>}
                      </View>
                      <Text style={styles.tempAccessDates}>
                        {formatDate(access.startDate)} - {formatDate(access.endDate)}
                      </Text>
                      {access.notes && <Text style={styles.tempAccessNotes}>{access.notes}</Text>}
                    </View>

                    <View style={styles.tempAccessControls}>
                      <View style={[styles.tempAccessStatusBadge, { backgroundColor: getStatusColor(access.status) }]}>
                        <Text style={styles.tempAccessStatusText}>{access.status}</Text>
                      </View>

                      {access.status === "pending" && (
                        <View style={styles.tempAccessActions}>
                          <TouchableOpacity
                            style={styles.tempAccessAction}
                            onPress={() => {
                              setTempAccess(
                                tempAccess.map((item) =>
                                  item.id === access.id ? { ...item, status: "active" } : item,
                                ),
                              )
                            }}
                          >
                            <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.success} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.tempAccessAction}
                            onPress={() => {
                              setTempAccess(tempAccess.filter((item) => item.id !== access.id))
                            }}
                          >
                            <Ionicons name="close-circle-outline" size={24} color={COLORS.error} />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </Card>
            )}
          </>
        )}

        {/* Access Points Tab */}
        {activeTab === "points" && (
          <Card title="Access Points" elevated>
            {filteredAccessPoints.map((point) => (
              <View key={point.id} style={styles.accessPointItem}>
                <View
                  style={[
                    styles.accessPointIconContainer,
                    {
                      backgroundColor: point.status === "online" ? COLORS.primaryLight : COLORS.lightGray,
                    },
                  ]}
                >
                  <Ionicons
                    name={getAccessPointIcon(point.type)}
                    size={24}
                    color={point.status === "online" ? COLORS.primary : COLORS.gray}
                  />
                  <View
                    style={[
                      styles.statusIndicator,
                      {
                        backgroundColor:
                          point.status === "online"
                            ? COLORS.success
                            : point.status === "maintenance"
                              ? COLORS.warning
                              : COLORS.error,
                      },
                    ]}
                  />
                </View>

                <View style={styles.accessPointInfo}>
                  <Text style={styles.accessPointName}>{point.name}</Text>
                  <Text style={styles.accessPointLocation}>{point.location}</Text>
                  {point.lastActivity && (
                    <Text style={styles.accessPointActivity}>Last activity: {formatDateTime(point.lastActivity)}</Text>
                  )}
                </View>

                <View style={styles.accessPointControls}>
                  <Text style={styles.restrictedText}>{point.restrictedAccess ? "Restricted" : "Open"}</Text>
                  <Switch
                    value={point.restrictedAccess}
                    onValueChange={() => handleAccessPointRestrictionToggle(point.id)}
                    trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
                    thumbColor={point.restrictedAccess ? COLORS.primary : COLORS.white}
                  />
                </View>
              </View>
            ))}
          </Card>
        )}

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  userPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  roleBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  roleText: {
    fontSize: 10,
    fontWeight: "500",
    color: COLORS.primary,
  },
  unitText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  lastAccessText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  userControls: {
    alignItems: "flex-end",
  },
  accessLevelText: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginBottom: 4,
    textTransform: "capitalize",
  },
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  logStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  logInfo: {
    flex: 1,
  },
  logTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  logMeta: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 2,
  },
  logReason: {
    fontSize: 12,
    color: COLORS.error,
  },
  logStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  logStatusText: {
    fontSize: 10,
    fontWeight: "500",
    color: COLORS.white,
    textTransform: "capitalize",
  },
  tempAccessHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tempAccessTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  buttonIcon: {
    marginRight: 4,
  },
  tempAccessItem: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  tempAccessInfo: {
    flex: 1,
  },
  tempAccessName: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  tempAccessMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  tempAccessTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  tempAccessTypeText: {
    fontSize: 10,
    fontWeight: "500",
    color: COLORS.white,
    textTransform: "capitalize",
  },
  tempAccessUnit: {
    fontSize: 12,
    color: COLORS.gray,
  },
  tempAccessDates: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  tempAccessNotes: {
    fontSize: 12,
    color: COLORS.darkGray,
    fontStyle: "italic",
  },
  tempAccessControls: {
    alignItems: "flex-end",
  },
  tempAccessStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 8,
  },
  tempAccessStatusText: {
    fontSize: 10,
    fontWeight: "500",
    color: COLORS.white,
    textTransform: "capitalize",
  },
  tempAccessActions: {
    flexDirection: "row",
  },
  tempAccessAction: {
    marginLeft: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  accessTypeContainer: {
    flexDirection: "row",
  },
  accessTypeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  activeAccessType: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  accessTypeText: {
    color: COLORS.darkGray,
  },
  activeAccessTypeText: {
    color: COLORS.white,
    fontWeight: "500",
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  formButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  accessPointItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  accessPointIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  accessPointInfo: {
    flex: 1,
  },
  accessPointName: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 2,
  },
  accessPointLocation: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 2,
  },
  accessPointActivity: {
    fontSize: 12,
    color: COLORS.gray,
  },
  accessPointControls: {
    alignItems: "flex-end",
  },
  restrictedText: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  spacer: {
    height: 40,
  },
})

export default AccessControlScreen

