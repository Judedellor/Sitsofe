"use client"

import React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import DateTimePicker from "@react-native-community/datetimepicker"
import * as ImagePicker from "expo-image-picker"
import { DateTimePickerEvent } from "@react-native-community/datetimepicker"

// Define route params type
type RootStackParamList = {
  TenantApplication: {
    propertyId: string;
    propertyName: string;
  };
  Main: undefined;
  TenantPortal: undefined;
  MaintenanceList: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TenantApplication'>;
type RouteProps = RouteProp<RootStackParamList, 'TenantApplication'>;

const TenantApplicationScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { propertyId, propertyName } = route.params;

  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  // Personal Information (Step 1)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState(new Date(1990, 0, 1))
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [ssn, setSsn] = useState("")
  const [driverLicense, setDriverLicense] = useState("")
  const [idPhoto, setIdPhoto] = useState<string | null>(null)

  // Residence History (Step 2)
  const [currentAddress, setCurrentAddress] = useState("")
  const [currentCity, setCurrentCity] = useState("")
  const [currentState, setCurrentState] = useState("")
  const [currentZip, setCurrentZip] = useState("")
  const [currentMoveInDate, setCurrentMoveInDate] = useState(new Date(2020, 0, 1))
  const [showCurrentMoveInPicker, setShowCurrentMoveInPicker] = useState(false)
  const [currentRent, setCurrentRent] = useState("")
  const [currentLandlordName, setCurrentLandlordName] = useState("")
  const [currentLandlordPhone, setCurrentLandlordPhone] = useState("")
  const [reasonForMoving, setReasonForMoving] = useState("")

  // Employment & Income (Step 3)
  const [employer, setEmployer] = useState("")
  const [position, setPosition] = useState("")
  const [employmentLength, setEmploymentLength] = useState("")
  const [monthlyIncome, setMonthlyIncome] = useState("")
  const [supervisorName, setSupervisorName] = useState("")
  const [supervisorPhone, setSupervisorPhone] = useState("")
  const [additionalIncome, setAdditionalIncome] = useState("")
  const [additionalIncomeSource, setAdditionalIncomeSource] = useState("")

  // Additional Information (Step 4)
  const [hasVehicle, setHasVehicle] = useState(false)
  const [vehicleMake, setVehicleMake] = useState("")
  const [vehicleModel, setVehicleModel] = useState("")
  const [vehicleYear, setVehicleYear] = useState("")
  const [vehicleLicense, setVehicleLicense] = useState("")
  const [hasPets, setHasPets] = useState(false)
  const [petType, setPetType] = useState("")
  const [petBreed, setPetBreed] = useState("")
  const [petWeight, setPetWeight] = useState("")
  const [hasBeenEvicted, setHasBeenEvicted] = useState(false)
  const [evictionDetails, setEvictionDetails] = useState("")
  const [hasFelony, setHasFelony] = useState(false)
  const [felonyDetails, setFelonyDetails] = useState("")
  const [emergencyContactName, setEmergencyContactName] = useState("")
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("")
  const [emergencyContactRelation, setEmergencyContactRelation] = useState("")
  const [agreeToBackgroundCheck, setAgreeToBackgroundCheck] = useState(false)

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Handle date change
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === "ios");
    setDateOfBirth(currentDate);
  };

  // Handle current move-in date change
  const onCurrentMoveInDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || currentMoveInDate;
    setShowCurrentMoveInPicker(Platform.OS === "ios");
    setCurrentMoveInDate(currentDate);
  };

  // Pick ID photo
  const pickIdPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Required", "Please grant camera roll permissions to upload your ID.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setIdPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  // Validate current step
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Personal Information
        if (!firstName.trim()) {
          Alert.alert("Missing Information", "Please enter your first name.")
          return false
        }
        if (!lastName.trim()) {
          Alert.alert("Missing Information", "Please enter your last name.")
          return false
        }
        if (!email.trim() || !email.includes("@")) {
          Alert.alert("Invalid Email", "Please enter a valid email address.")
          return false
        }
        if (!phone.trim() || phone.length < 10) {
          Alert.alert("Invalid Phone", "Please enter a valid phone number.")
          return false
        }
        if (!ssn.trim() || ssn.length < 4) {
          Alert.alert("Missing Information", "Please enter at least the last 4 digits of your SSN.")
          return false
        }
        return true

      case 2: // Residence History
        if (!currentAddress.trim()) {
          Alert.alert("Missing Information", "Please enter your current address.")
          return false
        }
        if (!currentCity.trim()) {
          Alert.alert("Missing Information", "Please enter your current city.")
          return false
        }
        if (!currentState.trim()) {
          Alert.alert("Missing Information", "Please enter your current state.")
          return false
        }
        if (!currentZip.trim()) {
          Alert.alert("Missing Information", "Please enter your current ZIP code.")
          return false
        }
        if (!currentRent.trim()) {
          Alert.alert("Missing Information", "Please enter your current rent amount.")
          return false
        }
        return true

      case 3: // Employment & Income
        if (!employer.trim()) {
          Alert.alert("Missing Information", "Please enter your employer name.")
          return false
        }
        if (!position.trim()) {
          Alert.alert("Missing Information", "Please enter your position.")
          return false
        }
        if (!monthlyIncome.trim()) {
          Alert.alert("Missing Information", "Please enter your monthly income.")
          return false
        }
        return true

      case 4: // Additional Information
        if (hasVehicle && (!vehicleMake.trim() || !vehicleModel.trim())) {
          Alert.alert("Missing Information", "Please enter your vehicle details.")
          return false
        }
        if (hasPets && (!petType.trim() || !petBreed.trim())) {
          Alert.alert("Missing Information", "Please enter your pet details.")
          return false
        }
        if (hasBeenEvicted && !evictionDetails.trim()) {
          Alert.alert("Missing Information", "Please provide details about your eviction history.")
          return false
        }
        if (hasFelony && !felonyDetails.trim()) {
          Alert.alert("Missing Information", "Please provide details about your felony history.")
          return false
        }
        if (!emergencyContactName.trim() || !emergencyContactPhone.trim()) {
          Alert.alert("Missing Information", "Please provide emergency contact information.")
          return false
        }
        if (!agreeToBackgroundCheck) {
          Alert.alert("Agreement Required", "You must agree to a background check to submit your application.")
          return false
        }
        return true

      default:
        return true
    }
  }

  // Go to next step
  const goToNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }

  // Go to previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsLoading(true)

      // In a real app, you would submit the form data to your API
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      Alert.alert(
        "Application Submitted",
        "Your rental application has been submitted successfully. We will review your application and contact you soon.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Main"),
          },
        ],
      )
    } catch (error) {
      console.error("Error submitting application:", error)
      Alert.alert("Error", "Failed to submit application. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Render step indicator
  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.stepDot,
            currentStep === index + 1 && styles.activeStepDot,
            currentStep > index + 1 && styles.completedStepDot,
          ]}
        >
          {currentStep > index + 1 && <Ionicons name="checkmark" size={12} color={COLORS.white} />}
        </View>
      ))}
    </View>
  )

  // Render step title
  const renderStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Personal Information"
      case 2:
        return "Residence History"
      case 3:
        return "Employment & Income"
      case 4:
        return "Additional Information"
      default:
        return ""
    }
  }

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date of Birth *</Text>
              <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.dateText}>{formatDate(dateOfBirth)}</Text>
                <Ionicons name="calendar-outline" size={20} color="#9E9E9E" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Social Security Number (Last 4 digits) *</Text>
              <TextInput
                style={styles.input}
                value={ssn}
                onChangeText={setSsn}
                placeholder="Enter last 4 digits of SSN"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Driver's License Number</Text>
              <TextInput
                style={styles.input}
                value={driverLicense}
                onChangeText={setDriverLicense}
                placeholder="Enter your driver's license number"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ID Photo (Driver's License or State ID)</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={pickIdPhoto}>
                <Ionicons name="camera-outline" size={20} color={COLORS.primary} />
                <Text style={styles.uploadButtonText}>{idPhoto ? "Change Photo" : "Upload Photo"}</Text>
              </TouchableOpacity>
              {idPhoto && (
                <View style={styles.photoPreview}>
                  <Image source={{ uri: idPhoto }} style={styles.idPhoto} />
                  <TouchableOpacity style={styles.removePhotoButton} onPress={() => setIdPhoto(null)}>
                    <Ionicons name="close-circle" size={24} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )

      case 2:
        return (
          <View style={styles.stepContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Street Address *</Text>
              <TextInput
                style={styles.input}
                value={currentAddress}
                onChangeText={setCurrentAddress}
                placeholder="Enter your current street address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>City *</Text>
              <TextInput
                style={styles.input}
                value={currentCity}
                onChangeText={setCurrentCity}
                placeholder="Enter your city"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>State *</Text>
                <TextInput
                  style={styles.input}
                  value={currentState}
                  onChangeText={setCurrentState}
                  placeholder="State"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>ZIP Code *</Text>
                <TextInput
                  style={styles.input}
                  value={currentZip}
                  onChangeText={setCurrentZip}
                  placeholder="ZIP Code"
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Move-in Date *</Text>
              <TouchableOpacity style={styles.dateInput} onPress={() => setShowCurrentMoveInPicker(true)}>
                <Text style={styles.dateText}>{formatDate(currentMoveInDate)}</Text>
                <Ionicons name="calendar-outline" size={20} color="#9E9E9E" />
              </TouchableOpacity>
              {showCurrentMoveInPicker && (
                <DateTimePicker
                  value={currentMoveInDate}
                  mode="date"
                  display="default"
                  onChange={onCurrentMoveInDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Monthly Rent *</Text>
              <TextInput
                style={styles.input}
                value={currentRent}
                onChangeText={setCurrentRent}
                placeholder="Enter your current monthly rent"
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Landlord Name</Text>
              <TextInput
                style={styles.input}
                value={currentLandlordName}
                onChangeText={setCurrentLandlordName}
                placeholder="Enter your current landlord's name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Landlord Phone</Text>
              <TextInput
                style={styles.input}
                value={currentLandlordPhone}
                onChangeText={setCurrentLandlordPhone}
                placeholder="Enter your current landlord's phone"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Reason for Moving</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={reasonForMoving}
                onChangeText={setReasonForMoving}
                placeholder="Why are you moving from your current residence?"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        )

      case 3:
        return (
          <View style={styles.stepContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Employer *</Text>
              <TextInput
                style={styles.input}
                value={employer}
                onChangeText={setEmployer}
                placeholder="Enter your employer's name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Position/Title *</Text>
              <TextInput
                style={styles.input}
                value={position}
                onChangeText={setPosition}
                placeholder="Enter your position or title"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Length of Employment</Text>
              <TextInput
                style={styles.input}
                value={employmentLength}
                onChangeText={setEmploymentLength}
                placeholder="How long have you been employed here?"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Monthly Income *</Text>
              <TextInput
                style={styles.input}
                value={monthlyIncome}
                onChangeText={setMonthlyIncome}
                placeholder="Enter your monthly income"
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Supervisor Name</Text>
              <TextInput
                style={styles.input}
                value={supervisorName}
                onChangeText={setSupervisorName}
                placeholder="Enter your supervisor's name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Supervisor Phone</Text>
              <TextInput
                style={styles.input}
                value={supervisorPhone}
                onChangeText={setSupervisorPhone}
                placeholder="Enter your supervisor's phone"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Additional Monthly Income (if any)</Text>
              <TextInput
                style={styles.input}
                value={additionalIncome}
                onChangeText={setAdditionalIncome}
                placeholder="Enter additional monthly income"
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Source of Additional Income</Text>
              <TextInput
                style={styles.input}
                value={additionalIncomeSource}
                onChangeText={setAdditionalIncomeSource}
                placeholder="Enter source of additional income"
              />
            </View>
          </View>
        )

      case 4:
        return (
          <View style={styles.stepContent}>
            <View style={styles.switchGroup}>
              <Text style={styles.switchLabel}>Do you have a vehicle?</Text>
              <Switch
                value={hasVehicle}
                onValueChange={setHasVehicle}
                trackColor={{ false: "#E0E0E0", true: "#007AFF" }}
                thumbColor={hasVehicle ? "#007AFF" : "#9E9E9E"}
              />
            </View>

            {hasVehicle && (
              <>
                <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.inputLabel}>Make</Text>
                    <TextInput
                      style={styles.input}
                      value={vehicleMake}
                      onChangeText={setVehicleMake}
                      placeholder="Vehicle make"
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Model</Text>
                    <TextInput
                      style={styles.input}
                      value={vehicleModel}
                      onChangeText={setVehicleModel}
                      placeholder="Vehicle model"
                    />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.inputLabel}>Year</Text>
                    <TextInput
                      style={styles.input}
                      value={vehicleYear}
                      onChangeText={setVehicleYear}
                      placeholder="Year"
                      keyboardType="number-pad"
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>License Plate</Text>
                    <TextInput
                      style={styles.input}
                      value={vehicleLicense}
                      onChangeText={setVehicleLicense}
                      placeholder="License plate"
                    />
                  </View>
                </View>
              </>
            )}

            <View style={styles.switchGroup}>
              <Text style={styles.switchLabel}>Do you have pets?</Text>
              <Switch
                value={hasPets}
                onValueChange={setHasPets}
                trackColor={{ false: "#E0E0E0", true: "#007AFF" }}
                thumbColor={hasPets ? "#007AFF" : "#9E9E9E"}
              />
            </View>

            {hasPets && (
              <>
                <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.inputLabel}>Pet Type</Text>
                    <TextInput
                      style={styles.input}
                      value={petType}
                      onChangeText={setPetType}
                      placeholder="Type of pet"
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Breed</Text>
                    <TextInput
                      style={styles.input}
                      value={petBreed}
                      onChangeText={setPetBreed}
                      placeholder="Pet breed"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Weight (lbs)</Text>
                  <TextInput
                    style={styles.input}
                    value={petWeight}
                    onChangeText={setPetWeight}
                    placeholder="Pet weight in pounds"
                    keyboardType="number-pad"
                  />
                </View>
              </>
            )}

            <View style={styles.switchGroup}>
              <Text style={styles.switchLabel}>Have you ever been evicted?</Text>
              <Switch
                value={hasBeenEvicted}
                onValueChange={setHasBeenEvicted}
                trackColor={{ false: "#E0E0E0", true: "#007AFF" }}
                thumbColor={hasBeenEvicted ? "#007AFF" : "#9E9E9E"}
              />
            </View>

            {hasBeenEvicted && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Please explain</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={evictionDetails}
                  onChangeText={setEvictionDetails}
                  placeholder="Provide details about your eviction"
                  multiline
                  numberOfLines={4}
                />
              </View>
            )}

            <View style={styles.switchGroup}>
              <Text style={styles.switchLabel}>Have you ever been convicted of a felony?</Text>
              <Switch
                value={hasFelony}
                onValueChange={setHasFelony}
                trackColor={{ false: "#E0E0E0", true: "#007AFF" }}
                thumbColor={hasFelony ? "#007AFF" : "#9E9E9E"}
              />
            </View>

            {hasFelony && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Please explain</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={felonyDetails}
                  onChangeText={setFelonyDetails}
                  placeholder="Provide details about your felony conviction"
                  multiline
                  numberOfLines={4}
                />
              </View>
            )}

            <View style={styles.sectionTitle}>
              <Text style={styles.sectionTitleText}>Emergency Contact</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name *</Text>
              <TextInput
                style={styles.input}
                value={emergencyContactName}
                onChangeText={setEmergencyContactName}
                placeholder="Emergency contact name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone *</Text>
              <TextInput
                style={styles.input}
                value={emergencyContactPhone}
                onChangeText={setEmergencyContactPhone}
                placeholder="Emergency contact phone"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Relationship</Text>
              <TextInput
                style={styles.input}
                value={emergencyContactRelation}
                onChangeText={setEmergencyContactRelation}
                placeholder="Relationship to you"
              />
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setAgreeToBackgroundCheck(!agreeToBackgroundCheck)}
              >
                <View style={[styles.checkboxInner, agreeToBackgroundCheck && styles.checkboxChecked]}>
                  {agreeToBackgroundCheck && <Ionicons name="checkmark" size={16} color={COLORS.white} />}
                </View>
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                I authorize the verification of the information provided on this form as well as a credit and background
                check. I understand that any false information may result in rejection of my application.
              </Text>
            </View>
          </View>
        )

      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBackButton} onPress={() => navigation.goBack()} disabled={isLoading}>
            <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rental Application</Text>
        </View>

        <View style={styles.propertyInfo}>
          <Text style={styles.propertyName}>{propertyName || "Property Application"}</Text>
          {renderStepIndicator()}
          <Text style={styles.stepTitle}>{renderStepTitle()}</Text>
        </View>

        <ScrollView style={styles.content}>{renderStepContent()}</ScrollView>

        <View style={styles.footer}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={[styles.footerButton, styles.backButton]}
              onPress={goToPreviousStep}
              disabled={isLoading}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.footerButton,
              styles.nextButton,
              isLoading && styles.disabledButton,
              currentStep === 1 && styles.fullWidthButton,
            ]}
            onPress={goToNextStep}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.nextButtonText}>{currentStep < totalSteps ? "Next" : "Submit Application"}</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerBackButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  propertyInfo: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  activeStepDot: {
    backgroundColor: COLORS.primary,
  },
  completedStepDot: {
    backgroundColor: COLORS.success,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.darkGray,
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  stepContent: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  row: {
    flexDirection: "row",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    backgroundColor: "#E6F2FF",
  },
  uploadButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
    marginLeft: 8,
  },
  photoPreview: {
    marginTop: 12,
    position: "relative",
    alignSelf: "center",
  },
  idPhoto: {
    width: 200,
    height: 120,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  switchGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: COLORS.darkGray,
    flex: 1,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 16,
    marginBottom: 24,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.darkGray,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  footerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: COLORS.background,
    marginRight: 8,
  },
  backButtonText: {
    color: COLORS.darkGray,
    fontSize: 16,
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: COLORS.primary,
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.7,
  },
  fullWidthButton: {
    flex: 1,
  },
})

export default TenantApplicationScreen

