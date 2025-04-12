"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import { useAuth } from "../context/AuthContext"
import FormInput from "../components/ui/FormInput"
import Button from "../components/ui/Button"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

const UserProfileScreen = () => {
  const navigation = useNavigation()
  const { user, updateUser } = useAuth()

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [avatar, setAvatar] = useState(user?.avatar || "https://via.placeholder.com/150")
  const [preferences, setPreferences] = useState(user?.preferences || "")

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
      setEmail(user.email || "")
      setPhone(user.phone || "")
      setAvatar(user.avatar || "https://via.placeholder.com/150")
      setPreferences(user.preferences || "")
    }
  }, [user])

  const handleSave = async () => {
    if (!firstName || !lastName || !email) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    setIsLoading(true)

    try {
      await updateUser({
        firstName,
        lastName,
        email,
        phone,
        avatar,
        preferences,
        name: `${firstName} ${lastName}`,
      })

      setIsEditing(false)
      Alert.alert("Success", "Profile updated successfully")
    } catch (error) {
      Alert.alert("Error", "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeAvatar = () => {
    // In a real app, you would use image picker
    Alert.alert("Change Profile Picture", "How would you like to upload your photo?", [
      {
        text: "Take Photo",
        onPress: () => {
          // Would use camera in a real app
          Alert.alert("Camera", "This would open the camera in a real app")
        },
      },
      {
        text: "Choose from Gallery",
        onPress: () => {
          // Would use image picker in a real app
          Alert.alert("Gallery", "This would open the gallery in a real app")
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
          <Text style={styles.editButtonText}>{isEditing ? "Cancel" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            {isEditing && (
              <TouchableOpacity style={styles.changeAvatarButton} onPress={handleChangeAvatar}>
                <Ionicons name="camera" size={20} color={COLORS.white} />
              </TouchableOpacity>
            )}
          </View>

          {!isEditing ? (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || "User Name"}</Text>
              <Text style={styles.userRole}>{user?.role || "User"}</Text>
            </View>
          ) : null}
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <FormInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              required
            />

            <FormInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              required
            />

            <FormInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              required
            />

            <FormInput
              label="Phone"
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />

            <FormInput
              label="Preferences"
              value={preferences}
              onChangeText={setPreferences}
              placeholder="Enter your preferences"
            />

            <Button
              title={isLoading ? "Saving..." : "Save Changes"}
              onPress={handleSave}
              type="primary"
              style={styles.saveButton}
              disabled={isLoading}
              icon={isLoading ? <ActivityIndicator size="small" color={COLORS.white} /> : null}
            />
          </View>
        ) : (
          <View style={styles.profileDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{user?.email || "Not provided"}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{user?.phone || "Not provided"}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Preferences</Text>
              <Text style={styles.detailValue}>{user?.preferences || "Not provided"}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Role</Text>
              <Text style={styles.detailValue}>{user?.role || "User"}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Account ID</Text>
              <Text style={styles.detailValue}>{user?.id || "Unknown"}</Text>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("ChangePassword" as never)}
              >
                <Ionicons name="lock-closed" size={24} color={COLORS.primary} style={styles.actionIcon} />
                <Text style={styles.actionText}>Change Password</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("NotificationsScreen" as never)}
              >
                <Ionicons name="notifications" size={24} color={COLORS.primary} style={styles.actionIcon} />
                <Text style={styles.actionText}>Notification Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("HelpCenter" as never)}>
                <Ionicons name="help-circle" size={24} color={COLORS.primary} style={styles.actionIcon} />
                <Text style={styles.actionText}>Help & Support</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  editButton: {
    padding: 4,
  },
  editButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.gray[200],
  },
  changeAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  editForm: {
    padding: 16,
  },
  saveButton: {
    marginTop: 16,
  },
  profileDetails: {
    padding: 16,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.text,
  },
  actionsContainer: {
    marginTop: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  actionIcon: {
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    color: COLORS.text,
  },
})

export default UserProfileScreen
