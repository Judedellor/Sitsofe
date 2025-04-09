import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Switch, 
  TouchableOpacity,
  Platform,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  verifyAppColorContrast, 
  screenReaderTestingDocumentation,
  generateScreenReaderTestingChecklist
} from '../../utils/accessibility';
import { BackButton } from '../../components/ui/BackButton';
import { AccessibleTouchable } from '../../components/ui/AccessibleTouchable';

const screenReaderTestingInstructions = {
  ios: [
    {
      title: "Enabling VoiceOver",
      steps: [
        "Go to Settings > Accessibility > VoiceOver.",
        "Turn VoiceOver on."
      ]
    },
    {
      title: "Basic VoiceOver Gestures",
      steps: [
        "Single-tap: Select an item.",
        "Double-tap: Activate the selected item.",
        "Swipe right: Move to the next item.",
        "Swipe left: Move to the previous item.",
        "Three-finger swipe: Scroll the screen."
      ]
    }
  ],
  android: [
    {
      title: "Enabling TalkBack",
      steps: [
        "Go to Settings > Accessibility > TalkBack.",
        "Turn TalkBack on."
      ]
    },
    {
      title: "Basic TalkBack Gestures",
      steps: [
        "Single-tap: Select an item.",
        "Double-tap: Activate the selected item.",
        "Swipe right: Move to the next item.",
        "Swipe left: Move to the previous item.",
        "Two-finger swipe: Scroll the screen."
      ]
    }
  ]
};

/**
 * Screen for testing and documenting accessibility features
 */
export const AccessibilityTestingScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contrast' | 'screenReader' | 'testing'>('contrast');
  const [wcagLevel, setWcagLevel] = useState<'AA' | 'AAA'>('AA');
  const [screenToTest, setScreenToTest] = useState('HomeScreen');
  const [contrastResults, setContrastResults] = useState(verifyAppColorContrast(wcagLevel));
  const [checklist, setChecklist] = useState(generateScreenReaderTestingChecklist(screenToTest));

  // Update contrast results when WCAG level changes
  const toggleWcagLevel = () => {
    const newLevel = wcagLevel === 'AA' ? 'AAA' : 'AA';
    setWcagLevel(newLevel);
    setContrastResults(verifyAppColorContrast(newLevel));
  };

  // Generate a new checklist when screen name changes
  const updateScreenToTest = (screenName: string) => {
    setScreenToTest(screenName);
    setChecklist(generateScreenReaderTestingChecklist(screenName));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton title="Accessibility Testing" />
        <Text style={styles.headerTitle}>Accessibility Testing</Text>
      </View>

      <View style={styles.tabContainer}>
        <AccessibleTouchable
          onPress={() => setActiveTab('contrast')}
          accessibilityLabel="Contrast Testing Tab"
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'contrast' }}
          style={[styles.tab, activeTab === 'contrast' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'contrast' && styles.activeTabText]}>
            Contrast
          </Text>
        </AccessibleTouchable>
        
        <AccessibleTouchable
          onPress={() => setActiveTab('screenReader')}
          accessibilityLabel="Screen Reader Documentation Tab"
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'screenReader' }}
          style={[styles.tab, activeTab === 'screenReader' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'screenReader' && styles.activeTabText]}>
            Documentation
          </Text>
        </AccessibleTouchable>
        
        <AccessibleTouchable
          onPress={() => setActiveTab('testing')}
          accessibilityLabel="Testing Checklist Tab"
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'testing' }}
          style={[styles.tab, activeTab === 'testing' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'testing' && styles.activeTabText]}>
            Testing
          </Text>
        </AccessibleTouchable>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'contrast' && (
          <View>
            <View style={styles.levelSelector}>
              <Text style={styles.levelLabel}>WCAG Level:</Text>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>AA</Text>
                <Switch
                  value={wcagLevel === 'AAA'}
                  onValueChange={toggleWcagLevel}
                  accessibilityLabel={`WCAG Level ${wcagLevel}`}
                  accessibilityHint="Toggle between AA and AAA compliance levels"
                />
                <Text style={styles.switchLabel}>AAA</Text>
              </View>
            </View>

            <View style={styles.resultsContainer}>
              <Text style={styles.sectionTitle}>Color Contrast Results</Text>
              
              {contrastResults.map((result, index) => (
                <View key={index} style={styles.resultCard}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultName}>{result.name}</Text>
                    <View 
                      style={[
                        styles.colorSample, 
                        { 
                          backgroundColor: result.background,
                          borderColor: result.background === '#FFFFFF' ? '#E0E0E0' : 'transparent'
                        }
                      ]}
                    >
                      <Text style={[styles.sampleText, { color: result.foreground }]}>
                        Text
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.resultDetails}>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Normal Text:</Text>
                      <View style={styles.resultValueContainer}>
                        <Text style={styles.resultValue}>
                          {result.normalText.ratio}:1
                        </Text>
                        {result.normalText.passes ? (
                          <Ionicons name="checkmark-circle" size={18} color="#34C759" />
                        ) : (
                          <Ionicons name="close-circle" size={18} color="#FF3B30" />
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.resultRow}>
                      <Text style={styles.resultLabel}>Large Text:</Text>
                      <View style={styles.resultValueContainer}>
                        <Text style={styles.resultValue}>
                          {result.largeText.ratio}:1
                        </Text>
                        {result.largeText.passes ? (
                          <Ionicons name="checkmark-circle" size={18} color="#34C759" />
                        ) : (
                          <Ionicons name="close-circle" size={18} color="#FF3B30" />
                        )}
                      </View>
                    </View>
                    
                    {!result.normalText.passes && (
                      <Text style={styles.recommendation}>
                        {result.normalText.recommendation}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'screenReader' && (
          <View style={styles.documentationContainer}>
            <Text style={styles.documentTitle}>{screenReaderTestingDocumentation.title}</Text>
            <Text style={styles.documentText}>{screenReaderTestingDocumentation.introduction}</Text>
            
            <Text style={styles.sectionTitle}>Testing Frequency</Text>
            <Text style={styles.documentText}>{screenReaderTestingDocumentation.testingFrequency}</Text>
            
            <Text style={styles.sectionTitle}>Testing Process</Text>
            {screenReaderTestingDocumentation.testingProcess.map((process, index) => (
              <View key={index} style={styles.processStep}>
                <Text style={styles.processTitle}>{index + 1}. {process.step}</Text>
                <Text style={styles.processDescription}>{process.description}</Text>
              </View>
            ))}
            
            <Text style={styles.sectionTitle}>Common Issues</Text>
            {screenReaderTestingDocumentation.commonIssues.map((issue, index) => (
              <View key={index} style={styles.issueItem}>
                <Ionicons name="alert-circle-outline" size={18} color="#FF9500" style={styles.issueIcon} />
                <Text style={styles.issueText}>{issue}</Text>
              </View>
            ))}
            
            <Text style={styles.sectionTitle}>
              {Platform.OS === 'ios' ? 'VoiceOver' : 'TalkBack'} Instructions
            </Text>
            {(Platform.OS === 'ios' 
              ? screenReaderTestingInstructions.ios 
              : screenReaderTestingInstructions.android
            ).map((section, index) => (
              <View key={index} style={styles.instructionSection}>
                <Text style={styles.instructionTitle}>{section.title}</Text>
                {section.steps.map((step, stepIndex) => (
                  <View key={stepIndex} style={styles.instructionStep}>
                    <Text style={styles.stepNumber}>{stepIndex + 1}.</Text>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {activeTab === 'testing' && (
          <View style={styles.checklistContainer}>
            <Text style={styles.sectionTitle}>Screen Reader Testing Checklist</Text>
            
            <View style={styles.screenSelector}>
              <Text style={styles.screenSelectorLabel}>Screen to Test:</Text>
              <TextInput
                style={styles.screenInput}
                value={screenToTest}
                onChangeText={updateScreenToTest}
                accessibilityLabel="Screen name input"
                accessibilityHint="Enter the name of the screen you want to test"
              />
            </View>
            
            <View style={styles.checklistHeader}>
              <Text style={styles.checklistTitle}>
                {checklist.screenName} - {Platform.OS === 'ios' ? 'VoiceOver' : 'TalkBack'} Testing
              </Text>
            </View>
            
            {checklist.testingSteps.map((step, index) => (
              <View key={index} style={styles.checklistItem}>
                <View style={styles.checklistItemHeader}>
                  <Text style={styles.elementName}>{step.element}</Text>
                  <View style={styles.passContainer}>
                    <AccessibleTouchable
                      onPress={() => {
                        const updatedChecklist = { ...checklist };
                        updatedChecklist.testingSteps[index].pass = true;
                        setChecklist(updatedChecklist);
                      }}
                      accessibilityLabel={`Mark ${step.element} as pass`}
                      accessibilityRole="button"
                      style={[
                        styles.passButton,
                        step.pass === true && styles.selectedPassButton
                      ]}
                    >
                      <Ionicons 
                        name={step.pass === true ? "checkmark-circle" : "checkmark-circle-outline"} 
                        size={20} 
                        color={step.pass === true ? "#FFFFFF" : "#34C759"} 
                      />
                      <Text style={[
                        styles.passButtonText,
                        step.pass === true && styles.selectedPassButtonText
                      ]}>Pass</Text>
                    </AccessibleTouchable>
                    
                    <AccessibleTouchable
                      onPress={() => {
                        const updatedChecklist = { ...checklist };
                        updatedChecklist.testingSteps[index].pass = false;
                        setChecklist(updatedChecklist);
                      }}
                      accessibilityLabel={`Mark ${step.element} as fail`}
                      accessibilityRole="button"
                      style={[
                        styles.failButton,
                        step.pass === false && styles.selectedFailButton
                      ]}
                    >
                      <Ionicons 
                        name={step.pass === false ? "close-circle" : "close-circle-outline"} 
                        size={20} 
                        color={step.pass === false ? "#FFFFFF" : "#FF3B30"} 
                      />
                      <Text style={[
                        styles.failButtonText,
                        step.pass === false && styles.selectedFailButtonText
                      ]}>Fail</Text>
                    </AccessibleTouchable>
                  </View>
                </View>
                
                <View style={styles.checklistItemDetails}>
                  <Text style={styles.expectedLabel}>Expected Announcement:</Text>
                  <Text style={styles.expectedText}>{step.expectedAnnouncement}</Text>
                  
                  <Text style={styles.notesLabel}>Notes:</Text>
                  <TextInput
                    style={styles.notesInput}
                    value={step.notes}
                    onChangeText={(text) => {
                      const updatedChecklist = { ...checklist };
                      updatedChecklist.testingSteps[index].notes = text;
                      setChecklist(updatedChecklist);
                    }}
                    multiline
                    placeholder="Add testing notes here..."
                    accessibilityLabel="Testing notes"
                    accessibilityHint="Enter any observations or issues found during testing"
                  />
                </View>
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.exportButton}
              accessibilityLabel="Export results"
              accessibilityHint="Export testing results to share with the team"
            >
              <Ionicons name="share-outline" size={20} color="#FFFFFF" />
              <Text style={styles.exportButtonText}>Export Results</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#007AFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  levelSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  levelLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 14,
    marginHorizontal: 8,
  },
  resultsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resultName: {
    fontSize: 16,
    fontWeight: '500',
  },
  colorSample: {
    width: 60,
    height: 30,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sampleText: {
    fontSize: 12,
    fontWeight: '500',
  },
  resultDetails: {
    padding: 12,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  resultValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  recommendation: {
    fontSize: 12,
    color: '#FF9500',
    marginTop: 8,
    fontStyle: 'italic',
  },
  documentationContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  documentTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  documentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333333',
    marginBottom: 16,
  },
  processStep: {
    marginBottom: 12,
  },
  processTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  processDescription: {
    fontSize: 14,
    color: '#666666',
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  issueIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  issueText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  instructionSection: {
    marginBottom: 16,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 8,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '500',
    width: 20,
  },
  stepText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  checklistContainer: {
    marginBottom: 20,
  },
  screenSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  screenSelectorLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  screenInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  checklistHeader: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  checklistItem: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    padding: 12,
  },
  checklistItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  elementName: {
    fontSize: 16,
    fontWeight: '500',
  },
  passContainer: {
    flexDirection: 'row',
  },
  passButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#34C759',
    marginRight: 8,
  },
  selectedPassButton: {
    backgroundColor: '#34C759',
  },
  passButtonText: {
    fontSize: 12,
    color: '#34C759',
    marginLeft: 4,
  },
  selectedPassButtonText: {
    color: '#FFFFFF',
  },
  failButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  selectedFailButton: {
    backgroundColor: '#FF3B30',
  },
  failButtonText: {
    fontSize: 12,
    color: '#FF3B30',
    marginLeft: 4,
  },
  selectedFailButtonText: {
    color: '#FFFFFF',
  },
  checklistItemDetails: {
    marginTop: 8,
  },
  expectedLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  expectedText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 8,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});
