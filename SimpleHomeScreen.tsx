"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Button } from "react-native"

const SimpleHomeScreen = () => {
  const [count, setCount] = useState(0)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Property Management System</Text>
      <Text style={styles.subtitle}>Home Screen</Text>

      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>Counter: {count}</Text>
        <Button title="Increment" onPress={() => setCount(count + 1)} />
      </View>

      <Text style={styles.message}>This is a simplified Home Screen for testing navigation.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 30,
  },
  counterContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  counterText: {
    fontSize: 18,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    backgroundColor: "#e3f2fd",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
    maxWidth: 500,
  },
})

export default SimpleHomeScreen

