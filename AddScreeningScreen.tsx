import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

// Define types
type RootStackParamList = {
  AddScreening: {
    propertyId: string;
  };
  ScreeningDetails: {
    screeningId: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddScreening'>;
type RouteProps = RouteProp<RootStackParamList, 'AddScreening'>;

interface ScreeningFormData {
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  status: "pending" | "approved" | "rejected" | "in_progress";
  creditScore?: number;
  income?: number;
  employment?: {
    employer: string;
    position: string;
    length: string;
  };
  references?: {
    name: string;
    phone: string;
    relationship: string;
  }[];
  notes?: string;
}

const AddScreeningScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { propertyId } = route.params;
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ScreeningFormData>({
    tenantName: "",
    propertyName: "Sunset Villa", // This would come from the property details
    unitNumber: "",
    status: "pending",
  });

  const [employment, setEmployment] = useState({
    employer: "",
    position: "",
    length: "",
  });

  const [references, setReferences] = useState([
    { name: "", phone: "", relationship: "" },
  ]);

  const [notes, setNotes] = useState("");

  const handleInputChange = (field: keyof ScreeningFormData, value: string | number | undefined) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleEmploymentChange = (field: keyof typeof employment, value: string) => {
    setEmployment({
      ...employment,
      [field]: value,
    });
  };

  const handleReferenceChange = (index: number, field: keyof typeof references[0], value: string) => {
    const updatedReferences = [...references];
    updatedReferences[index] = {
      ...updatedReferences[index],
      [field]: value,
    };
    setReferences(updatedReferences);
  };

  const addReference = () => {
    setReferences([...references, { name: "", phone: "", relationship: "" }]);
  };

  const removeReference = (index: number) => {
    const updatedReferences = [...references];
    updatedReferences.splice(index, 1);
    setReferences(updatedReferences);
  };

  const validateForm = (): boolean => {
    if (!formData.tenantName.trim()) {
      Alert.alert("Error", "Please enter the tenant's name");
      return false;
    }

    if (!formData.unitNumber.trim()) {
      Alert.alert("Error", "Please enter the unit number");
      return false;
    }

    if (formData.creditScore !== undefined && (formData.creditScore < 300 || formData.creditScore > 850)) {
      Alert.alert("Error", "Credit score must be between 300 and 850");
      return false;
    }

    if (formData.income !== undefined && formData.income <= 0) {
      Alert.alert("Error", "Income must be greater than 0");
      return false;
    }

    // Check if at least one reference is filled out
    const hasValidReference = references.some(
      (ref) => ref.name.trim() && ref.phone.trim() && ref.relationship.trim()
    );

    if (!hasValidReference) {
      Alert.alert("Error", "Please add at least one reference with complete information");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);

      // Prepare the complete screening data
      const screeningData: ScreeningFormData = {
        ...formData,
        employment: employment.employer.trim() ? employment : undefined,
        references: references.filter(
          (ref) => ref.name.trim() && ref.phone.trim() && ref.relationship.trim()
        ),
        notes: notes.trim() ? notes : undefined,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful response
      const newScreeningId = "screening-" + Date.now();

      Alert.alert(
        "Success",
        "Screening has been added successfully",
        [
          {
            text: "View Details",
            onPress: () => navigation.navigate("ScreeningDetails", { screeningId: newScreeningId }),
          },
          {
            text: "Add Another",
            onPress: () => {
              // Reset form
              setFormData({
                tenantName: "",
                propertyName: "Sunset Villa",
                unitNumber: "",
                status: "pending",
              });
              setEmployment({ employer: "", position: "", length: "" });
              setReferences([{ name: "", phone: "", relationship: "" }]);
              setNotes("");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error adding screening:", error);
      Alert.alert("Error", "Failed to add screening. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Screening</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tenant Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tenant Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.tenantName}
              onChangeText={(value) => handleInputChange("tenantName", value)}
              placeholder="Enter tenant's full name"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Property</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.propertyName}
              editable={false}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Unit Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.unitNumber}
              onChangeText={(value) => handleInputChange("unitNumber", value)}
              placeholder="Enter unit number"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Status</Text>
            <View style={styles.statusContainer}>
              {["pending", "in_progress", "approved", "rejected"].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusButton,
                    formData.status === status && styles.activeStatusButton,
                  ]}
                  onPress={() => handleInputChange("status", status as ScreeningFormData["status"])}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      formData.status === status && styles.activeStatusButtonText,
                    ]}
                  >
                    {status === "in_progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Credit Score</Text>
            <TextInput
              style={styles.input}
              value={formData.creditScore?.toString() || ""}
              onChangeText={(value) => {
                const numValue = value ? parseInt(value, 10) : undefined;
                handleInputChange("creditScore", numValue);
              }}
              placeholder="Enter credit score (300-850)"
              keyboardType="number-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Monthly Income</Text>
            <TextInput
              style={styles.input}
              value={formData.income?.toString() || ""}
              onChangeText={(value) => {
                const numValue = value ? parseInt(value, 10) : undefined;
                handleInputChange("income", numValue);
              }}
              placeholder="Enter monthly income"
              keyboardType="number-pad"
            />
          </View>
          
          <View style={styles.sectionSubtitle}>
            <Text style={styles.sectionSubtitleText}>Employment</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Employer</Text>
            <TextInput
              style={styles.input}
              value={employment.employer}
              onChangeText={(value) => handleEmploymentChange("employer", value)}
              placeholder="Enter employer name"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Position</Text>
            <TextInput
              style={styles.input}
              value={employment.position}
              onChangeText={(value) => handleEmploymentChange("position", value)}
              placeholder="Enter position/title"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Length of Employment</Text>
            <TextInput
              style={styles.input}
              value={employment.length}
              onChangeText={(value) => handleEmploymentChange("length", value)}
              placeholder="e.g., 2 years, 6 months"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>References</Text>
          
          {references.map((reference, index) => (
            <View key={index} style={styles.referenceCard}>
              <View style={styles.referenceHeader}>
                <Text style={styles.referenceTitle}>Reference {index + 1}</Text>
                {references.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeReferenceButton}
                    onPress={() => removeReference(index)}
                  >
                    <Ionicons name="close-circle" size={20} color={COLORS.error} />
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={reference.name}
                  onChangeText={(value) => handleReferenceChange(index, "name", value)}
                  placeholder="Enter reference name"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={reference.phone}
                  onChangeText={(value) => handleReferenceChange(index, "phone", value)}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Relationship</Text>
                <TextInput
                  style={styles.input}
                  value={reference.relationship}
                  onChangeText={(value) => handleReferenceChange(index, "relationship", value)}
                  placeholder="e.g., Former Landlord, Employer"
                />
              </View>
            </View>
          ))}
          
          <TouchableOpacity style={styles.addReferenceButton} onPress={addReference}>
            <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
            <Text style={styles.addReferenceText}>Add Another Reference</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          
          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional notes about the screening..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
        
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.submitButtonText}>Add Screening</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
    marginBottom: 16,
  },
  sectionSubtitle: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionSubtitleText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.darkGray,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.gray[700],
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: COLORS.gray[100],
    color: COLORS.gray[500],
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  statusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  statusButton: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: COLORS.gray[100],
    borderRadius: 8,
    padding: 12,
    margin: 4,
    alignItems: "center",
  },
  activeStatusButton: {
    backgroundColor: COLORS.primary,
  },
  statusButtonText: {
    fontSize: 14,
    color: COLORS.gray[700],
  },
  activeStatusButtonText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  referenceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  referenceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  referenceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.darkGray,
  },
  removeReferenceButton: {
    padding: 4,
  },
  addReferenceButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    borderStyle: "dashed",
  },
  addReferenceText: {
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: 8,
  },
  submitContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default AddScreeningScreen; 