"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  Dimensions,
} from "react-native"
import { Camera, CameraType, FlashMode, type CameraPictureOptions, type CameraRecordingOptions } from "expo-camera"
import * as MediaLibrary from "expo-media-library"
import * as ImagePicker from "expo-image-picker"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "../constants/colors"

const WINDOW_HEIGHT = Dimensions.get("window").height
const CAPTURE_SIZE = Math.floor(WINDOW_HEIGHT * 0.08)

type CameraComponentProps = {
  onCapture: (uri: string) => void
  onClose: () => void
  allowGallery?: boolean
  allowVideo?: boolean
  maxDuration?: number
}

const CameraComponent: React.FC<CameraComponentProps> = ({
  onCapture,
  onClose,
  allowGallery = true,
  allowVideo = false,
  maxDuration = 60,
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [cameraType, setCameraType] = useState(CameraType.back)
  const [flash, setFlash] = useState(FlashMode.off)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const cameraRef = useRef<Camera>(null)

  useEffect(() => {
    // Request camera and media library permissions
    const getPermissions = async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync()
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync()

      setHasPermission(cameraStatus === "granted" && mediaStatus === "granted")

      if (cameraStatus !== "granted" || mediaStatus !== "granted") {
        Alert.alert("Permission Required", "Camera and media library access are required to use this feature.", [
          { text: "OK", onPress: onClose },
        ])
      }
    }

    getPermissions()
  }, [onClose])

  const onCameraReady = () => {
    setIsCameraReady(true)
  }

  const switchCameraType = () => {
    setCameraType(cameraType === CameraType.back ? CameraType.front : CameraType.back)
  }

  const toggleFlash = () => {
    setFlash(flash === FlashMode.off ? FlashMode.on : FlashMode.off)
  }

  const takePicture = async () => {
    if (!cameraRef.current || !isCameraReady) return

    try {
      setIsProcessing(true)
      const options: CameraPictureOptions = {
        quality: 0.85,
        base64: false,
        skipProcessing: false,
      }

      const photo = await cameraRef.current.takePictureAsync(options)
      setCapturedImage(photo.uri)

      // Save to media library
      await MediaLibrary.saveToLibraryAsync(photo.uri)
    } catch (error) {
      console.error("Error taking picture:", error)
      Alert.alert("Error", "Failed to take picture. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const startRecording = async () => {
    if (!cameraRef.current || !isCameraReady) return

    try {
      setIsProcessing(true)
      setIsRecording(true)

      const options: CameraRecordingOptions = {
        maxDuration,
        quality: Camera.Constants.VideoQuality["720p"],
        mute: false,
      }

      cameraRef.current.recordAsync(options).then(async (video) => {
        setIsRecording(false)
        setCapturedImage(video.uri)

        // Save to media library
        await MediaLibrary.saveToLibraryAsync(video.uri)
      })
    } catch (error) {
      console.error("Error recording video:", error)
      setIsRecording(false)
      Alert.alert("Error", "Failed to record video. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording()
      setIsRecording(false)
    }
  }

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: allowVideo ? ImagePicker.MediaTypeOptions.All : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCapturedImage(result.assets[0].uri)
      }
    } catch (error) {
      console.error("Error picking from gallery:", error)
      Alert.alert("Error", "Failed to pick from gallery. Please try again.")
    }
  }

  const handleCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage)
      onClose()
    }
  }

  const retakePicture = () => {
    setCapturedImage(null)
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.text}>Requesting camera permissions...</Text>
      </View>
    )
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {capturedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.preview} />

          <View style={styles.previewActions}>
            <TouchableOpacity style={styles.previewButton} onPress={retakePicture}>
              <Ionicons name="refresh" size={24} color={COLORS.white} />
              <Text style={styles.previewButtonText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.previewButton, styles.useButton]} onPress={handleCapture}>
              <Ionicons name="checkmark" size={24} color={COLORS.white} />
              <Text style={styles.previewButtonText}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={cameraType}
            flashMode={flash}
            onCameraReady={onCameraReady}
            ratio="4:3"
          />

          <View style={styles.controlsContainer}>
            <View style={styles.controlsRow}>
              <TouchableOpacity style={styles.controlButton} onPress={onClose}>
                <Ionicons name="close" size={28} color={COLORS.white} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
                <Ionicons name={flash === FlashMode.on ? "flash" : "flash-off"} size={28} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.captureContainer}>
              {allowGallery && (
                <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery}>
                  <Ionicons name="images" size={28} color={COLORS.white} />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.captureButton}
                onPress={allowVideo ? (isRecording ? stopRecording : startRecording) : takePicture}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="large" color={COLORS.white} />
                ) : (
                  <View style={[styles.captureInner, isRecording && styles.recordingButton]} />
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.flipButton} onPress={switchCameraType}>
                <Ionicons name="camera-reverse" size={28} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    paddingHorizontal: 20,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  controlButton: {
    padding: 10,
  },
  captureContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  captureButton: {
    width: CAPTURE_SIZE,
    height: CAPTURE_SIZE,
    borderRadius: CAPTURE_SIZE / 2,
    borderWidth: 4,
    borderColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: CAPTURE_SIZE - 20,
    height: CAPTURE_SIZE - 20,
    borderRadius: (CAPTURE_SIZE - 20) / 2,
    backgroundColor: COLORS.white,
  },
  recordingButton: {
    backgroundColor: COLORS.error,
    width: CAPTURE_SIZE - 40,
    height: CAPTURE_SIZE - 40,
    borderRadius: 8,
  },
  galleryButton: {
    padding: 10,
  },
  flipButton: {
    padding: 10,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    margin: 20,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
  },
  preview: {
    flex: 1,
    resizeMode: "cover",
  },
  previewActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.darkGray,
  },
  useButton: {
    backgroundColor: COLORS.primary,
  },
  previewButtonText: {
    color: COLORS.white,
    marginLeft: 8,
    fontSize: 16,
  },
})

export default CameraComponent

