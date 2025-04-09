"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from "../constants/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import Card from "../components/ui/Card"
import DateTimePicker from "@react-native-community/datetimepicker"

// Report field types
type FieldType = "property" | "date" | "metric" | "comparison" | "visualization" | "filter"

// Field definition
interface ReportField {
  id: string
  type: FieldType
  label: string
  required: boolean
  options?: string[]
  selected?: string | string[] | Date | null
  multiple?: boolean
}

// Sample properties
const properties = [
  { id: "prop1", name: "Modern Luxury Apartment" },
  { id: "prop2", name: "Cozy Studio Loft" },
  { id: "prop3", name: "Downtown Penthouse" },
  { id: "prop4", name: "Suburban Family Home" },
  { id: "prop5", name: "Beachfront Villa" },
]

// Sample metrics
const metrics = [
  { id: "metric1", name: "Revenue" },
  { id: "metric2", name: "Expenses" },
  { id: "metric3", name: "Occupancy Rate" },
  { id: "metric4", name: "Maintenance Costs" },
  { id: "metric5", name: "Tenant Satisfaction" },
  { id: "metric6", name: "ROI" },
  { id: "metric7", name: "Cash Flow" },
  { id: "metric8", name: "Property Value" },
]

// Sample visualizations
const visualizations = [
  { id: "viz1", name: "Line Chart" },
  { id: "viz2", name: "Bar Chart" },
  { id: "viz3", name: "Pie Chart" },
  { id: "viz4", name: "Table" },
  { id: "viz5", name: "KPI Cards" },
  { id: "viz6", name: "Heat Map" },
]

// Sample report templates
const reportTemplates = {
  "fin-1": {
    name: "Monthly Revenue Summary",
    description: "Overview of revenue streams with month-over-month comparison",
    fields: [
      {
        id: "properties",
        type: "property",
        label: "Properties",
        required: true,
        multiple: true,
        selected: ["prop1", "prop2"],
      },
      {
        id: "dateRange",
        type: "date",
        label: "Date Range",
        required: true,
        selected: new Date(),
      },
      {
        id: "metrics",
        type: "metric",
        label: "Metrics",
        required: true,
        multiple: true,
        selected: ["metric1", "metric7"],
      },
      {
        id: "comparison",
        type: "comparison",
        label: "Comparison",
        required: false,
        options: ["Previous Month", "Previous Year", "Budget", "None"],
        selected: "Previous Month",
      },
      {
        id: "visualization",
        type: "visualization",
        label: "Visualizations",
        required: true,
        multiple: true,
        selected: ["viz1", "viz4"],
      },
    ],
  },
  // Add more templates as needed
}

const ReportBuilderScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { reportId } = route.params || { reportId: "new" }

  // State
  const [reportName, setReportName] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [fields, setFields] = useState<ReportField[]>([])
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduleFrequency, setScheduleFrequency] = useState("monthly")
  const [recipients, setRecipients] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [currentDateField, setCurrentDateField] = useState("")

  // Load template if editing existing report
  useEffect(() => {
    if (reportId !== "new" && reportTemplates[reportId]) {
      const template = reportTemplates[reportId]
      setReportName(template.name)
      setReportDescription(template.description)
      setFields(template.fields)
    } else {
      // Default fields for new report
      setFields([
        {
          id: "properties",
          type: "property",
          label: "Properties",
          required: true,
          multiple: true,
          selected: [],
        },
        {
          id: "dateRange",
          type: "date",
          label: "Date Range",
          required: true,
          selected: null,
        },
        {
          id: "metrics",
          type: "metric",
          label: "Metrics",
          required: true,
          multiple: true,
          selected: [],
        },
      ])
    }
  }, [reportId])

  // Handle field selection
  const handleFieldSelection = (fieldId: string, value: string | string[] | Date) => {
    setFields(
      fields.map((field) => {
        if (field.id === fieldId) {
          if (field.multiple && Array.isArray(field.selected) && typeof value === "string") {
            // Toggle selection for multi-select fields
            const selected = field.selected.includes(value)
              ? field.selected.filter((item) => item !== value)
              : [...field.selected, value]
            return { ...field, selected }
          } else {
            // Single selection
            return { ...field, selected: value }
          }
        }
        return field
      }),
    )
  }

  // Handle date selection
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      handleFieldSelection(currentDateField, selectedDate)
    }
  }

  // Add a new field
  const addField = (type: FieldType) => {
    const newField: ReportField = {
      id: `field-${Date.now()}`,
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      required: false,
      selected: type === "property" || type === "metric" || type === "visualization" ? [] : null,
      multiple: type === "property" || type === "metric" || type === "visualization",
    }

    if (type === "comparison") {
      newField.options = ["Previous Month", "Previous Year", "Budget", "None"]
      newField.selected = "None"
    }

    setFields([...fields, newField])
  }

  // Remove a field
  const removeField = (fieldId: string) => {
    setFields(fields.filter((field) => field.id !== fieldId))
  }

  // Generate report
  const generateReport = () => {
    // Validate required fields
    const missingRequired = fields.filter((field) => field.required && !field.selected)
    if (missingRequired.length > 0 || !reportName) {
      alert("Please fill in all required fields and provide a report name.")
      return
    }

    // In a real app, this would send the report configuration to the backend
    console.log("Generating report:", {
      name: reportName,
      description: reportDescription,
      fields,
      scheduled: isScheduled,
      scheduleFrequency: isScheduled ? scheduleFrequency : null,
      recipients: isScheduled ? recipients.split(",").map((email) => email.trim()) : null,
    })

    // Navigate to the report viewer
    navigation.navigate("ReportViewer", { reportData: { name: reportName, fields } })
  }

  // Render field based on type
  const renderField = (field: ReportField) => {
    switch (field.type) {
      case "property":
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label} {field.required && <Text style={styles.requiredMark}>*</Text>}
            </Text>
            <View style={styles.optionsContainer}>
              {properties.map((property) => (
                <TouchableOpacity
                  key={property.id}
                  style={[
                    styles.optionButton,
                    Array.isArray(field.selected) && field.selected.includes(property.id) && styles.selectedOption,
                  ]}
                  onPress={() => handleFieldSelection(field.id, property.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      Array.isArray(field.selected) &&
                        field.selected.includes(property.id) &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {property.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )

      case "date":
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label} {field.required && <Text style={styles.requiredMark}>*</Text>}
            </Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => {
                setCurrentDateField(field.id)
                setShowDatePicker(true)
              }}
            >
              <Text style={styles.dateButtonText}>
                {field.selected ? new Date(field.selected).toLocaleDateString() : "Select date"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            {showDatePicker && currentDateField === field.id && (
              <DateTimePicker
                value={field.selected ? new Date(field.selected) : new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
        )

      case "metric":
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label} {field.required && <Text style={styles.requiredMark}>*</Text>}
            </Text>
            <View style={styles.optionsContainer}>
              {metrics.map((metric) => (
                <TouchableOpacity
                  key={metric.id}
                  style={[
                    styles.optionButton,
                    Array.isArray(field.selected) && field.selected.includes(metric.id) && styles.selectedOption,
                  ]}
                  onPress={() => handleFieldSelection(field.id, metric.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      Array.isArray(field.selected) && field.selected.includes(metric.id) && styles.selectedOptionText,
                    ]}
                  >
                    {metric.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )

      case "comparison":
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label} {field.required && <Text style={styles.requiredMark}>*</Text>}
            </Text>
            <View style={styles.optionsContainer}>
              {field.options?.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.optionButton, field.selected === option && styles.selectedOption]}
                  onPress={() => handleFieldSelection(field.id, option)}
                >
                  <Text style={[styles.optionText, field.selected === option && styles.selectedOptionText]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )

      case "visualization":
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label} {field.required && <Text style={styles.requiredMark}>*</Text>}
            </Text>
            <View style={styles.optionsContainer}>
              {visualizations.map((viz) => (
                <TouchableOpacity
                  key={viz.id}
                  style={[
                    styles.optionButton,
                    Array.isArray(field.selected) && field.selected.includes(viz.id) && styles.selectedOption,
                  ]}
                  onPress={() => handleFieldSelection(field.id, viz.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      Array.isArray(field.selected) && field.selected.includes(viz.id) && styles.selectedOptionText,
                    ]}
                  >
                    {viz.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )

      case "filter":
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              {field.label} {field.required && <Text style={styles.requiredMark}>*</Text>}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter filter criteria"
              value={(field.selected as string) || ""}
              onChangeText={(text) => handleFieldSelection(field.id, text)}
            />
          </View>
        )

      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{reportId !== "new" ? "Edit Report" : "Create Report"}</Text>
        <TouchableOpacity style={styles.generateButton} onPress={generateReport}>
          <Text style={styles.generateButtonText}>Generate</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Card title="Report Details" elevated>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              Report Name <Text style={styles.requiredMark}>*</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter report name"
              value={reportName}
              onChangeText={setReportName}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Enter report description"
              value={reportDescription}
              onChangeText={setReportDescription}
              multiline
              numberOfLines={3}
            />
          </View>
        </Card>

        <Card title="Report Configuration" elevated>
          {fields.map((field) => (
            <View key={field.id} style={styles.fieldWrapper}>
              {renderField(field)}
              {!field.required && (
                <TouchableOpacity style={styles.removeButton} onPress={() => removeField(field.id)}>
                  <Ionicons name="close-circle" size={20} color={COLORS.error} />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <View style={styles.addFieldContainer}>
            <Text style={styles.addFieldLabel}>Add Field:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.addFieldButtons}>
              <TouchableOpacity style={styles.addFieldButton} onPress={() => addField("property")}>
                <Text style={styles.addFieldButtonText}>Property</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addFieldButton} onPress={() => addField("date")}>
                <Text style={styles.addFieldButtonText}>Date</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addFieldButton} onPress={() => addField("metric")}>
                <Text style={styles.addFieldButtonText}>Metric</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addFieldButton} onPress={() => addField("comparison")}>
                <Text style={styles.addFieldButtonText}>Comparison</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addFieldButton} onPress={() => addField("visualization")}>
                <Text style={styles.addFieldButtonText}>Visualization</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addFieldButton} onPress={() => addField("filter")}>
                <Text style={styles.addFieldButtonText}>Filter</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Card>

        <Card title="Schedule & Distribution" elevated>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Schedule Report</Text>
            <Switch
              value={isScheduled}
              onValueChange={setIsScheduled}
              trackColor={{ false: COLORS.lightGray, true: COLORS.primaryLight }}
              thumbColor={isScheduled ? COLORS.primary : COLORS.gray}
            />
          </View>

          {isScheduled && (
            <>
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Frequency</Text>
                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={[styles.optionButton, scheduleFrequency === "daily" && styles.selectedOption]}
                    onPress={() => setScheduleFrequency("daily")}
                  >
                    <Text style={[styles.optionText, scheduleFrequency === "daily" && styles.selectedOptionText]}>
                      Daily
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.optionButton, scheduleFrequency === "weekly" && styles.selectedOption]}
                    onPress={() => setScheduleFrequency("weekly")}
                  >
                    <Text style={[styles.optionText, scheduleFrequency === "weekly" && styles.selectedOptionText]}>
                      Weekly
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.optionButton, scheduleFrequency === "monthly" && styles.selectedOption]}
                    onPress={() => setScheduleFrequency("monthly")}
                  >
                    <Text style={[styles.optionText, scheduleFrequency === "monthly" && styles.selectedOptionText]}>
                      Monthly
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.optionButton, scheduleFrequency === "quarterly" && styles.selectedOption]}
                    onPress={() => setScheduleFrequency("quarterly")}
                  >
                    <Text style={[styles.optionText, scheduleFrequency === "quarterly" && styles.selectedOptionText]}>
                      Quarterly
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Recipients (comma separated)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter email addresses"
                  value={recipients}
                  onChangeText={setRecipients}
                />
              </View>
            </>
          )}
        </Card>
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
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.darkGray,
  },
  generateButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  generateButtonText: {
    color: COLORS.white,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  requiredMark: {
    color: COLORS.error,
  },
  textInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionButton: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.darkGray,
  },
  selectedOptionText: {
    color: COLORS.white,
  },
  dateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 6,
    padding: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: COLORS.darkGray,
  },
  removeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 4,
  },
  addFieldContainer: {
    marginTop: 16,
  },
  addFieldLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  addFieldButtons: {
    flexDirection: "row",
  },
  addFieldButton: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  addFieldButtonText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.darkGray,
  },
})

export default ReportBuilderScreen

