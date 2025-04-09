"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { COLORS } from "../constants/colors"
import { Calendar } from "react-native-calendars"

// Mock compliance calendar data
const calendarData = {
  "2024-04-15": {
    marked: true,
    dotColor: COLORS.warning,
    items: [
      {
        id: "1",
        title: "Annual Fire Inspection",
        property: "Modern Luxury Apartment",
        category: "Fire Safety",
        status: "upcoming",
        daysRemaining: 7,
      },
    ],
  },
  "2024-04-20": {
    marked: true,
    dotColor: COLORS.warning,
    items: [
      {
        id: "2",
        title: "Elevator Certification Renewal",
        property: "Downtown Penthouse",
        category: "Building Safety",
        status: "upcoming",
        daysRemaining: 12,
      },
    ],
  },
  "2024-04-25": {
    marked: true,
    dotColor: COLORS.warning,
    items: [
      {
        id: "3",
        title: "HVAC System Inspection",
        property: "Cozy Studio Loft",
        category: "Environmental",
        status: "upcoming",
        daysRemaining: 17,
      },
    ],
  },
  "2024-04-30": {
    marked: true,
    dotColor: COLORS.warning,
    items: [
      {
        id: "4",
        title: "Property Tax Filing",
        property: "All Properties",
        category: "Licensing",
        status: "upcoming",
        daysRemaining: 22,
      },
    ],
  },
  "2024-05-05": {
    marked: true,
    dotColor: COLORS.warning,
    items: [
      {
        id: "5",
        title: "Pest Control Inspection",
        property: "Suburban Family Home",
        category: "Health & Sanitation",
        status: "upcoming",
        daysRemaining: 27,
      },
    ],
  },
  "2024-03-30": {
    marked: true,
    dotColor: COLORS.error,
    items: [
      {
        id: "6",
        title: "ADA Compliance Audit",
        property: "Modern Luxury Apartment",
        category: "Accessibility",
        status: "overdue",
        daysOverdue: 8,
      },
    ],
  },
  "2024-04-01": {
    marked: true,
    dotColor: COLORS.error,
    items: [
      {
        id: "7",
        title: "Structural Inspection",
        property: "Beachfront Villa",
        category: "Building Safety",
        status: "overdue",
        daysOverdue: 6,
      },
    ],
  },
  "2024-04-05": {
    marked: true,
    dotColor: COLORS.success,
    items: [
      {
        id: "8",
        title: "Fire Extinguisher Inspection",
        property: "Modern Luxury Apartment",
        category: "Fire Safety",
        status: "completed",
      },
    ],
  },
  "2024-04-03": {
    marked: true,
    dotColor: COLORS.success,
    items: [
      {
        id: "9",
        title: "Building Permit Renewal",
        property: "Downtown Penthouse",
        category: "Licensing",
        status: "completed",
      },
    ],
  },
}

const ComplianceCalendarScreen = () => {
  const navigation = useNavigation()
  const [selectedDate, setSelectedDate] = useState("")
  const [events, setEvents] = useState([])

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return COLORS.success
      case "upcoming":
        return COLORS.warning
      case "overdue":
        return COLORS.error
      default:
        return COLORS.gray
    }
  }

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString)
    setEvents(calendarData[date.dateString]?.items || [])
  }

  // Get current date
  const getCurrentDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0] // Format as YYYY-MM-DD
  }

  // Initialize with today's date
  useEffect(() => {
    const today = getCurrentDate()
    setSelectedDate(today)
    setEvents(calendarData[today]?.items || [])
  }, [])

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Compliance Calendar</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddComplianceItem" as never)}>
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          markedDates={calendarData}
          onDayPress={handleDateSelect}
          markingType={"dot"}
          theme={{
            selectedDayBackgroundColor: COLORS.primary,
            todayTextColor: COLORS.primary,
            arrowColor: COLORS.primary,
          }}
        />
      </View>

      <View style={styles.eventsContainer}>
        <Text style={styles.dateHeader}>{selectedDate ? formatDate(selectedDate) : "No date selected"}</Text>

        {events.length === 0 ? (
          <View style={styles.noEventsContainer}>
            <Ionicons name="calendar-outline" size={48} color={COLORS.lightGray} />
            <Text style={styles.noEventsText}>No compliance items for this date</Text>
          </View>
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.eventItem, { borderLeftColor: getStatusColor(item.status) }]}
                onPress={() => navigation.navigate("ComplianceDetail" as never, { itemId: item.id })}
              >
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <View style={[styles.eventStatus, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.eventStatusText}>
                      {item.status === "overdue"
                        ? `${item.daysOverdue} days overdue`
                        : item.status === "upcoming"
                          ? `${item.daysRemaining} days left`
                          : "Completed"}
                    </Text>
                  </View>
                </View>
                <Text style={styles.eventProperty}>{item.property}</Text>
                <Text style={styles.eventCategory}>{item.category}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.eventsList}
          />
        )}
      </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarContainer: {
    backgroundColor: COLORS.white,
    paddingBottom: 10,
  },
  eventsContainer: {
    flex: 1,
    padding: 16,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noEventsText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray,
  },
  eventsList: {
    paddingBottom: 16,
  },
  eventItem: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
    flex: 1,
  },
  eventStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  eventStatusText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: "bold",
  },
  eventProperty: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  eventCategory: {
    fontSize: 12,
    color: COLORS.gray,
  },
})

export default ComplianceCalendarScreen

