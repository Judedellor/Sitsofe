"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { COLORS } from "../constants/colors"
import Calendar from "../components/Calendar"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import { useCalendarEvents, useCreateCalendarEvent } from "../hooks/useApi"
import type { CalendarEvent } from "../data/mockData"

const CalendarScreen = () => {
  const navigation = useNavigation()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddEventModal, setShowAddEventModal] = useState(false)

  // Fetch calendar events
  const { data: calendarEvents, loading, error, refetch } = useCalendarEvents()
  const { mutate: createEvent, loading: isCreating } = useCreateCalendarEvent()

  // Filter events for the selected date
  const eventsForSelectedDate =
    calendarEvents?.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      )
    }) || []

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Handle adding a new event
  const handleAddEvent = () => {
    // In a real app, this would open a modal or navigate to an add event screen
    Alert.alert("Add Event", "This would open a form to add a new event on " + formatDate(selectedDate), [
      {
        text: "OK",
        onPress: () => {
          // Sample event creation for demonstration
          const newEvent: Partial<CalendarEvent> = {
            title: "Sample Event",
            description: "This is a sample event",
            date: selectedDate.toISOString(),
            type: "reminder",
          }

          createEvent(newEvent)
            .then(() => {
              Alert.alert("Success", "Event created successfully")
              refetch()
            })
            .catch((err) => {
              Alert.alert("Error", "Failed to create event")
            })
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ])
  }

  // Handle event press
  const handleEventPress = (event: CalendarEvent) => {
    // Navigate to the appropriate detail screen based on the event type
    switch (event.type) {
      case "payment":
        // Check if there's a related payment ID and navigate to payment detail
        if (event.relatedId) {
          // @ts-ignore - Navigation typing will be fixed with proper navigation types
          navigation.navigate("PaymentDetail", { paymentId: event.relatedId })
        }
        break
      case "maintenance":
        // Check if there's a related maintenance request ID and navigate to maintenance detail
        if (event.relatedId) {
          // @ts-ignore - Navigation typing will be fixed with proper navigation types
          navigation.navigate("MaintenanceDetail", { requestId: event.relatedId })
        }
        break
      case "lease":
        // Check if there's a related tenant ID and navigate to tenant detail
        if (event.relatedId) {
          // @ts-ignore - Navigation typing will be fixed with proper navigation types
          navigation.navigate("TenantDetail", { tenantId: event.relatedId })
        }
        break
      default:
        // Show event details in an alert for other types
        Alert.alert(event.title, event.description || "No description available")
        break
    }
  }

  // Get color for event type
  const getEventTypeColor = (type: string): string => {
    switch (type) {
      case "payment":
        return COLORS.primary
      case "maintenance":
        return COLORS.warning
      case "lease":
        return COLORS.success
      case "reminder":
        return COLORS.info
      default:
        return COLORS.secondary
    }
  }

  // Event type label
  const getEventTypeLabel = (type: string): string => {
    switch (type) {
      case "payment":
        return "Payment"
      case "maintenance":
        return "Maintenance"
      case "lease":
        return "Lease"
      case "reminder":
        return "Reminder"
      default:
        return "Other"
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <Button title="Add Event" onPress={handleAddEvent} type="primary" size="small" />
      </View>

      <Calendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        // @ts-ignore - Component expects different date format, transform would be needed
        events={calendarEvents || []}
      />

      <View style={styles.selectedDateContainer}>
        <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
      </View>

      <View style={styles.eventsContainer}>
        <Text style={styles.sectionTitle}>Events</Text>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : error ? (
          <Text style={styles.errorText}>Error loading events. Please try again.</Text>
        ) : eventsForSelectedDate.length === 0 ? (
          <Text style={styles.noEventsText}>No events for this date</Text>
        ) : (
          eventsForSelectedDate.map((event) => (
            <TouchableOpacity key={event.id} onPress={() => handleEventPress(event)} style={styles.eventItem}>
              <Card style={{ width: "100%" }}>
                <View style={styles.eventContent}>
                  <View style={[styles.eventTypeIndicator, { backgroundColor: getEventTypeColor(event.type) }]} />
                  <View style={styles.eventDetails}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <View style={styles.eventMeta}>
                      <Text style={styles.eventTypeText}>{getEventTypeLabel(event.type)}</Text>
                      {event.startTime && (
                        <Text style={styles.eventTimeText}>
                          {event.startTime}
                          {event.endTime ? ` - ${event.endTime}` : ""}
                        </Text>
                      )}
                    </View>
                    {event.description && (
                      <Text style={styles.eventDescription}>
                        {event.description.length > 100
                          ? `${event.description.substring(0, 100)}...`
                          : event.description}
                      </Text>
                    )}
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  selectedDateContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
  },
  eventsContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: COLORS.darkGray,
  },
  noEventsText: {
    textAlign: "center",
    color: COLORS.gray,
    marginTop: 20,
  },
  eventItem: {
    marginBottom: 12,
  },
  eventContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  eventTypeIndicator: {
    width: 8,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  eventMeta: {
    flexDirection: "row",
    marginBottom: 4,
  },
  eventTypeText: {
    fontSize: 12,
    color: COLORS.gray,
    marginRight: 8,
  },
  eventTimeText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  eventDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  errorText: {
    color: COLORS.error,
    textAlign: "center",
    marginTop: 20,
  },
})

export default CalendarScreen

