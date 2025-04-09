"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const ContactSupportScreen = ({ navigation }) => {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [priority, setPriority] = useState("normal")

  const handleSubmit = () => {
    if (!subject || !message) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }
    // TODO: Implement support ticket submission
    Alert.alert("Success", "Your message has been sent to support")
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Support</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Priority Level</Text>
          <View style={styles.priorityButtons}>
            <TouchableOpacity
              style={[styles.priorityButton, priority === "low" && styles.priorityButtonActive]}
              onPress={() => setPriority("low")}
            >
              <Text style={[styles.priorityButtonText, priority === "low" && styles.priorityButtonTextActive]}>
                Low
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.priorityButton, priority === "normal" && styles.priorityButtonActive]}
              onPress={() => setPriority("normal")}
            >
              <Text style={[styles.priorityButtonText, priority === "normal" && styles.priorityButtonTextActive]}>
                Normal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.priorityButton, priority === "high" && styles.priorityButtonActive]}
              onPress={() => setPriority("high")}
            >
              <Text style={[styles.priorityButtonText, priority === "high" && styles.priorityButtonTextActive]}>
                High
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subject</Text>
          <TextInput style={styles.input} placeholder="Enter subject" value={subject} onChangeText={setSubject} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Message</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Describe your issue"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  content: {
    padding: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  messageInput: {
    height: 100,
  },
  priorityButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  priorityButtonActive: {
    backgroundColor: "#007bff",
  },
  priorityButtonText: {
    fontSize: 14,
  },
  priorityButtonTextActive: {
    color: "#fff",
  },
  submitButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

