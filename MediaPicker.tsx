"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import * as VideoThumbnails from "expo-video-thumbnails"
import { COLORS } from "../constants/colors"

export type MediaItem = {
  id: string
  uri: string
  type: "image" | "video"
  thumbnail?: string
  name?: string
  size?: number
  width?: number
  height?: number
  duration?: number
}

type MediaPickerProps = {
  media: MediaItem[]
  onMediaChange: (media: MediaItem[]) => void
  maxItems?: number
  allowVideo?: boolean
  title?: string
}

const MediaPicker: React.FC<MediaPickerProps> = ({
  media,
  onMediaChange,
  maxItems = 10,
  allowVideo = true,
  title = "Photos & Videos",
}) => {
  const [isLoading, setIsLoading] = useState(false)

  // Request permissions
  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (cameraStatus !== "granted" || libraryStatus !== "granted") {
        Alert.alert("Permissions Required", "Please grant camera and photo library permissions to use this feature.", [
          { text: "OK" },
        ])
        return false
      }
    }
    return true
  }

  // Generate thumbnail for video
  const generateThumbnail = async (videoUri: string): Promise<string> => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: 1000,
        quality: 0.5,
      })
      return uri
    } catch (e) {
      console.warn("Error generating thumbnail:", e)
      return videoUri
    }
  }

  // Pick image from library
  const pickImage = async () => {
    if (media.length >= maxItems) {
      Alert.alert("Limit Reached", `You can only add up to ${maxItems} media items.`)
      return
    }

    const hasPermissions = await requestPermissions()
    if (!hasPermissions) return

    try {
      setIsLoading(true)
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: allowVideo ? ImagePicker.MediaTypeOptions.All : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0]
        const isVideo = asset.uri.endsWith(".mp4") || asset.uri.endsWith(".mov") || asset.type === "video"

        const newMediaItem: MediaItem = {
          id: Date.now().toString(),
          uri: asset.uri,
          type: isVideo ? "video" : "image",
          name: asset.fileName || `media_${Date.now()}`,
          size: asset.fileSize,
          width: asset.width,
          height: asset.height,
        }

        if (isVideo) {
          newMediaItem.thumbnail = await generateThumbnail(asset.uri)
          newMediaItem.duration = asset.duration
        }

        onMediaChange([...media, newMediaItem])
      }
    } catch (error) {
      console.error("Error picking image:", error)
      Alert.alert("Error", "Failed to pick media. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Take photo with camera
  const takePhoto = async () => {
    if (media.length >= maxItems) {
      Alert.alert("Limit Reached", `You can only add up to ${maxItems} media items.`)
      return
    }

    const hasPermissions = await requestPermissions()
    if (!hasPermissions) return

    try {
      setIsLoading(true)
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: allowVideo ? ImagePicker.MediaTypeOptions.All : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0]
        const isVideo = asset.uri.endsWith(".mp4") || asset.uri.endsWith(".mov") || asset.type === "video"

        const newMediaItem: MediaItem = {
          id: Date.now().toString(),
          uri: asset.uri,
          type: isVideo ? "video" : "image",
          name: `camera_${Date.now()}`,
          size: asset.fileSize,
          width: asset.width,
          height: asset.height,
        }

        if (isVideo) {
          newMediaItem.thumbnail = await generateThumbnail(asset.uri)
          newMediaItem.duration = asset.duration
        }

        onMediaChange([...media, newMediaItem])
      }
    } catch (error) {
      console.error("Error taking photo:", error)
      Alert.alert("Error", "Failed to capture media. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Remove media item
  const removeMedia = (id: string) => {
    const updatedMedia = media.filter((item) => item.id !== id)
    onMediaChange(updatedMedia)
  }

  // Render media item
  const renderMediaItem = ({ item }: { item: MediaItem }) => (
    <View style={styles.mediaItem}>
      <Image
        source={{ uri: item.type === "video" ? item.thumbnail || item.uri : item.uri }}
        style={styles.mediaImage}
      />

      {item.type === "video" && (
        <View style={styles.videoIndicator}>
          <Ionicons name="play-circle" size={24} color={COLORS.white} />
        </View>
      )}

      <TouchableOpacity style={styles.removeButton} onPress={() => removeMedia(item.id)}>
        <Ionicons name="close-circle" size={24} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.mediaButtons}>
        <TouchableOpacity style={styles.mediaButton} onPress={pickImage} disabled={isLoading}>
          <Ionicons name="images-outline" size={24} color={COLORS.primary} />
          <Text style={styles.mediaButtonText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mediaButton} onPress={takePhoto} disabled={isLoading}>
          <Ionicons name="camera-outline" size={24} color={COLORS.primary} />
          <Text style={styles.mediaButtonText}>Camera</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Processing media...</Text>
        </View>
      )}

      {media.length > 0 ? (
        <FlatList
          data={media}
          renderItem={renderMediaItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.mediaList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={48} color={COLORS.lightGray} />
          <Text style={styles.emptyText}>No media added yet</Text>
        </View>
      )}

      <Text style={styles.helperText}>
        {media.length} / {maxItems} items added
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.darkGray,
    marginBottom: 12,
  },
  mediaButtons: {
    flexDirection: "row",
    marginBottom: 16,
  },
  mediaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  mediaButtonText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontWeight: "500",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 8,
    color: COLORS.gray,
  },
  mediaList: {
    paddingVertical: 8,
  },
  mediaItem: {
    width: "31%",
    aspectRatio: 1,
    margin: "1%",
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  mediaImage: {
    width: "100%",
    height: "100%",
  },
  videoIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    padding: 4,
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 32,
    marginVertical: 16,
  },
  emptyText: {
    marginTop: 8,
    color: COLORS.gray,
  },
  helperText: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 8,
  },
})

export default MediaPicker

