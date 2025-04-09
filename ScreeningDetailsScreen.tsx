import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

// Define types
type RootStackParamList = {
  ScreeningDetails: {
    screeningId: string;
  };
  EditScreening: {
    screeningId: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ScreeningDetails'>;
type RouteProps = RouteProp<RootStackParamList, 'ScreeningDetails'>;

interface ScreeningDocument {
  id: string;
  type: "id" | "income" | "reference" | "other";
  name: string;
  url: string;
  uploadedAt: string;
}

interface ScreeningNote {
  id: string;
  text: string;
  createdAt: string;
  createdBy: string;
}

interface Screening {
  id: string;
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  status: "pending" | "approved" | "rejected" | "in_progress";
  submittedDate: string;
  completedDate?: string;
  score?: number;
  notes?: ScreeningNote[];
  documents?: ScreeningDocument[];
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
}

const ScreeningDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { screeningId } = route.params;
  const { user, hasPermission } = useAuth();

  const [screening, setScreening] = useState<Screening | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newNote, setNewNote] = useState("");

  // Load screening details
  useEffect(() => {
    loadScreeningDetails();
  }, [screeningId]);

  const loadScreeningDetails = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      const mockScreening: Screening = {
        id: screeningId,
        tenantName: "John Doe",
        propertyName: "Sunset Villa",
        unitNumber: "101",
        status: "approved",
        submittedDate: "2023-06-10T14:30:00Z",
        completedDate: "2023-06-12T09:15:00Z",
        score: 85,
        creditScore: 720,
        income: 6500,
        employment: {
          employer: "Tech Solutions Inc.",
          position: "Software Engineer",
          length: "3 years",
        },
        references: [
          {
            name: "Jane Smith",
            phone: "(555) 123-4567",
            relationship: "Former Landlord",
          },
          {
            name: "Robert Johnson",
            phone: "(555) 987-6543",
            relationship: "Current Employer",
          },
        ],
        notes: [
          {
            id: "1",
            text: "Good credit history, stable employment",
            createdAt: "2023-06-12T09:15:00Z",
            createdBy: "Property Manager",
          },
          {
            id: "2",
            text: "References checked and verified",
            createdAt: "2023-06-12T10:30:00Z",
            createdBy: "Property Manager",
          },
        ],
        documents: [
          {
            id: "1",
            type: "id",
            name: "Driver's License",
            url: "https://example.com/drivers-license.jpg",
            uploadedAt: "2023-06-10T14:30:00Z",
          },
          {
            id: "2",
            type: "income",
            name: "Pay Stub",
            url: "https://example.com/pay-stub.pdf",
            uploadedAt: "2023-06-10T14:35:00Z",
          },
          {
            id: "3",
            type: "reference",
            name: "Landlord Reference",
            url: "https://example.com/landlord-reference.pdf",
            uploadedAt: "2023-06-11T09:20:00Z",
          },
        ],
      };

      setScreening(mockScreening);
    } catch (error) {
      console.error("Error loading screening details:", error);
      Alert.alert("Error", "Failed to load screening details. Please try again.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadScreeningDetails();
  };

  const getStatusColor = (status: Screening["status"]) => {
    switch (status) {
      case "approved":
        return COLORS.success;
      case "rejected":
        return COLORS.error;
      case "in_progress":
        return COLORS.warning;
      case "pending":
      default:
        return COLORS.gray[500];
    }
  };

  const getStatusText = (status: Screening["status"]) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "in_progress":
        return "In Progress";
      case "pending":
      default:
        return "Pending";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const addNote = () => {
    if (!newNote.trim() || !screening || !user?.name) return;

    const newNoteObj: ScreeningNote = {
      id: Date.now().toString(),
      text: newNote.trim(),
      createdAt: new Date().toISOString(),
      createdBy: user.name,
    };

    setScreening({
      ...screening,
      notes: [...(screening.notes || []), newNoteObj],
    });

    setNewNote("");
  };

  const canEditScreening = hasPermission("manage_screenings");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Screening Details</Text>
        {canEditScreening && (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate("EditScreening", { screeningId })}
          >
            <Ionicons name="create-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading screening details...</Text>
        </View>
      ) : screening ? (
        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tenant Information</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(screening.status) }]}>
                <Text style={styles.statusText}>{getStatusText(screening.status)}</Text>
              </View>
            </View>
            
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>{screening.tenantName}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Property:</Text>
                <Text style={styles.infoValue}>
                  {screening.propertyName} {screening.unitNumber ? `#${screening.unitNumber}` : ""}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Submitted:</Text>
                <Text style={styles.infoValue}>{formatDate(screening.submittedDate)}</Text>
              </View>
              
              {screening.completedDate && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Completed:</Text>
                  <Text style={styles.infoValue}>{formatDate(screening.completedDate)}</Text>
                </View>
              )}
              
              {screening.score !== undefined && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Score:</Text>
                  <Text style={styles.infoValue}>{screening.score}/100</Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Financial Information</Text>
            
            <View style={styles.infoCard}>
              {screening.creditScore !== undefined && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Credit Score:</Text>
                  <Text style={styles.infoValue}>{screening.creditScore}</Text>
                </View>
              )}
              
              {screening.income !== undefined && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Monthly Income:</Text>
                  <Text style={styles.infoValue}>${screening.income.toLocaleString()}</Text>
                </View>
              )}
              
              {screening.employment && (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Employer:</Text>
                    <Text style={styles.infoValue}>{screening.employment.employer}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Position:</Text>
                    <Text style={styles.infoValue}>{screening.employment.position}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Length:</Text>
                    <Text style={styles.infoValue}>{screening.employment.length}</Text>
                  </View>
                </>
              )}
            </View>
          </View>
          
          {screening.references && screening.references.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>References</Text>
              
              {screening.references.map((reference, index) => (
                <View key={index} style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Name:</Text>
                    <Text style={styles.infoValue}>{reference.name}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Phone:</Text>
                    <Text style={styles.infoValue}>{reference.phone}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Relationship:</Text>
                    <Text style={styles.infoValue}>{reference.relationship}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
          
          {screening.documents && screening.documents.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Documents</Text>
              
              <View style={styles.documentsContainer}>
                {screening.documents.map((doc) => (
                  <TouchableOpacity key={doc.id} style={styles.documentCard}>
                    <View style={styles.documentIcon}>
                      <Ionicons 
                        name={
                          doc.type === "id" ? "card-outline" : 
                          doc.type === "income" ? "cash-outline" : 
                          doc.type === "reference" ? "people-outline" : "document-text-outline"
                        } 
                        size={24} 
                        color={COLORS.primary} 
                      />
                    </View>
                    <Text style={styles.documentName}>{doc.name}</Text>
                    <Text style={styles.documentDate}>{formatDate(doc.uploadedAt)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            
            {screening.notes && screening.notes.length > 0 ? (
              <View style={styles.notesContainer}>
                {screening.notes.map((note) => (
                  <View key={note.id} style={styles.noteCard}>
                    <Text style={styles.noteText}>{note.text}</Text>
                    <View style={styles.noteFooter}>
                      <Text style={styles.noteAuthor}>{note.createdBy}</Text>
                      <Text style={styles.noteDate}>{formatDate(note.createdAt)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>No notes yet</Text>
            )}
            
            <View style={styles.addNoteContainer}>
              <TextInput
                style={styles.noteInput}
                value={newNote}
                onChangeText={setNewNote}
                placeholder="Add a note..."
                multiline
              />
              <TouchableOpacity 
                style={[styles.addNoteButton, !newNote.trim() && styles.disabledButton]}
                onPress={addNote}
                disabled={!newNote.trim()}
              >
                <Ionicons name="send" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.gray[400]} />
          <Text style={styles.emptyText}>Screening not found</Text>
        </View>
      )}
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  editButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray[500],
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: "500",
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    width: 120,
    fontSize: 14,
    color: COLORS.gray[500],
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: COLORS.darkGray,
    fontWeight: "500",
  },
  documentsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  documentCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    margin: "1%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.gray[100],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  documentName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.darkGray,
    textAlign: "center",
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  notesContainer: {
    marginBottom: 16,
  },
  noteCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noteText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  noteFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noteAuthor: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  noteDate: {
    fontSize: 12,
    color: COLORS.gray[500],
  },
  addNoteContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  noteInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    minHeight: 80,
    textAlignVertical: "top",
  },
  addNoteButton: {
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: COLORS.gray[300],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray[500],
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 16,
  },
});

export default ScreeningDetailsScreen; 