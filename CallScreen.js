"use client"

import { useState, useEffect } from "react"
import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const CallScreen = ({ route, navigation }) => {
  const { contact, callType = "audio" } = route.params || {}
  const [callStatus, setCallStatus] = useState("connecting") // connecting, active, ended
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaker, setIsSpeaker] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === "video")
  const [isRecording, setIsRecording] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  // Mock timer for call duration
  useEffect(() => {
    // Simulate connecting
    const connectTimeout = setTimeout(() => {
      setCallStatus("active")
    }, 2000)

    // Set up timer for call duration
    let durationInterval
    if (callStatus === "active") {
      durationInterval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      clearTimeout(connectTimeout)
      if (durationInterval) clearInterval(durationInterval)
    }
  }, [callStatus])

  // Format duration as MM:SS
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleEndCall = () => {
    setCallStatus("ended")
    setTimeout(() => {
      navigation.goBack()
    }, 500)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    // In a real app, would trigger audio muting
  }

  const toggleSpeaker = () => {
    setIsSpeaker(!isSpeaker)
    // In a real app, would toggle speaker mode
  }

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)
    // In a real app, would toggle video
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real app, would start/stop call recording
  }

  const toggleScreenSharing = () => {
    setIsScreenSharing(!isScreenSharing)
    // In a real app, would trigger screen sharing
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Call information area */}
      <View style={styles.infoContainer}>
        {isVideoEnabled ? (
          <View style={styles.videoContainer}>
            {/* Remote video would be shown here */}
            <View style={styles.remoteVideo}>
              <Text style={styles.placeholderText}>
                {callStatus === "connecting" ? "Connecting video..." : "Remote Video"}
              </Text>
            </View>

            {/* Self video - small PiP */}
            <View style={styles.selfVideo}>
              <Text style={styles.placeholderText}>Self View</Text>
            </View>

            {isScreenSharing && (
              <View style={styles.screenSharingIndicator}>
                <Ionicons name="desktop-outline" size={20} color="#FFFFFF" />
                <Text style={styles.screenSharingText}>Screen Sharing</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.audioCallContainer}>
            {contact.avatar ? (
              <Image source={{ uri: contact.avatar }} style={styles.callerImage} />
            ) : (
              <View style={[styles.callerImage, styles.defaultAvatar]}>
                <Text style={styles.avatarText}>{contact.name.charAt(0)}</Text>
              </View>
            )}

            <Text style={styles.callerName}>{contact.name}</Text>
            <Text style={styles.propertyInfo}>
              {contact.propertyName}
              {contact.unitNumber ? ` • Unit ${contact.unitNumber}` : ""}
            </Text>

            <Text style={styles.callStatus}>
              {callStatus === "connecting"
                ? "Connecting..."
                : callStatus === "active"
                  ? formatDuration(callDuration)
                  : "Call ended"}
            </Text>
          </View>
        )}
      </View>

      {/* Call controls */}
      <View style={styles.controlsContainer}>
        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>Recording</Text>
          </View>
        )}

        <View style={styles.controlsRow}>
          <TouchableOpacity style={[styles.controlButton, isMuted && styles.activeControl]} onPress={toggleMute}>
            <Ionicons name={isMuted ? "mic-off" : "mic-outline"} size={26} color="#FFFFFF" />
            <Text style={styles.controlLabel}>Mute</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.controlButton, isSpeaker && styles.activeControl]} onPress={toggleSpeaker}>
            <Ionicons name={isSpeaker ? "volume-high" : "volume-medium-outline"} size={26} color="#FFFFFF" />
            <Text style={styles.controlLabel}>Speaker</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, isVideoEnabled && styles.activeControl]}
            onPress={toggleVideo}
          >
            <Ionicons name={isVideoEnabled ? "videocam" : "videocam-outline"} size={26} color="#FFFFFF" />
            <Text style={styles.controlLabel}>Video</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.controlButton, isRecording && styles.activeControl]}
            onPress={toggleRecording}
          >
            <Ionicons name={isRecording ? "radio-button-on" : "radio-button-off-outline"} size={26} color="#FFFFFF" />
            <Text style={styles.controlLabel}>Record</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, isScreenSharing && styles.activeControl]}
            onPress={toggleScreenSharing}
            disabled={!isVideoEnabled}
          >
            <Ionicons name="desktop-outline" size={26} color={isVideoEnabled ? "#FFFFFF" : "#999999"} />
            <Text style={[styles.controlLabel, !isVideoEnabled && styles.disabledText]}>Share</Text>
          </TouchableOpacity>

          <View style={styles.controlButton}>{/* Empty space for alignment */}</View>
        </View>

        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <Ionicons name="call" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  audioCallContainer: {
    alignItems: "center",
  },
  callerImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  defaultAvatar: {
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  callerName: {
    fontSize: 26,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  propertyInfo: {
    fontSize: 17,
    color: "#AAAAAA",
    marginBottom: 16,
  },
  callStatus: {
    fontSize: 15,
    color: "#AAAAAA",
  },
  videoContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  remoteVideo: {
    width: "100%",
    height: "100%",
    backgroundColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
  },
  selfVideo: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 120,
    height: 180,
    backgroundColor: "#505050",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000000",
  },
  placeholderText: {
    color: "#AAAAAA",
    fontSize: 16,
  },
  screenSharingIndicator: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  screenSharingText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 6,
  },
  controlsContainer: {
    padding: 16,
    backgroundColor: "#2C2C2E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  recordingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF3B30",
    marginRight: 8,
  },
  recordingText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3A3A3C",
    justifyContent: "center",
    alignItems: "center",
  },
  activeControl: {
    backgroundColor: "#007AFF",
  },
  controlLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 4,
  },
  disabledText: {
    color: "#999999",
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 8,
    transform: [{ rotate: "135deg" }],
  },
})

export default CallScreen

