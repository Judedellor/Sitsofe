import { Platform } from 'react-native';

/**
 * Screen reader testing instructions for developers
 */
export const screenReaderTestingInstructions = {
  ios: [
    {
      title: 'Enable VoiceOver',
      steps: [
        'Go to Settings > Accessibility > VoiceOver',
        'Toggle VoiceOver on',
        'Use three-finger swipe to navigate between screens',
        'Tap once to select an item, double-tap to activate it',
        'Use three-finger swipe up to read from the top of the screen',
      ],
    },
    {
      title: 'Test Navigation Flow',
      steps: [
        'Verify all screens can be navigated using VoiceOver',
        'Ensure all interactive elements are announced correctly',
        'Check that images have appropriate alt text',
        'Verify form fields have proper labels',
        'Test error messages are announced',
      ],
    },
  ],
  android: [
    {
      title: 'Enable TalkBack',
      steps: [
        'Go to Settings > Accessibility > TalkBack',
        'Toggle TalkBack on',
        'Swipe right or left to navigate between elements',
        'Double-tap to activate the selected item',
        'Swipe up then right to access global context menu',
      ],
    },
    {
      title: 'Test Navigation Flow',
      steps: [
        'Verify all screens can be navigated using TalkBack',
        'Ensure all interactive elements are announced correctly',
        'Check that images have appropriate alt text',
        'Verify form fields have proper labels',
        'Test error messages are announced',
      ],
    },
  ],
};

/**
 * Generates a screen reader testing checklist for a specific screen
 * 
 * @param screenName - Name of the screen to test
 * @returns Testing checklist specific to the screen
 */
export const generateScreenReaderTestingChecklist = (screenName: string) => {
  return {
    screenName,
    platform: Platform.OS,
    testingSteps: [
      {
        element: 'Screen Title',
        expectedAnnouncement: `${screenName}, heading`,
        pass: null,
        notes: '',
      },
      {
        element: 'Navigation Elements',
        expectedAnnouncement: 'Back button, button',
        pass: null,
        notes: '',
      },
      {
        element: 'Interactive Elements',
        expectedAnnouncement: 'Varies by element',
        pass: null,
        notes: 'Test all buttons, toggles, and other controls',
      },
      {
        element: 'Form Fields',
        expectedAnnouncement: 'Field label, text field',
        pass: null,
        notes: 'Test all input fields with their labels',
      },
      {
        element: 'Error Messages',
        expectedAnnouncement: 'Error message content',
        pass: null,
        notes: 'Trigger validation errors to test announcements',
      },
      {
        element: 'Dynamic Content',
        expectedAnnouncement: 'Updated content should be announced',
        pass: null,
        notes: 'Test content that changes based on user interaction',
      },
    ],
    instructions: Platform.OS === 'ios' 
      ? screenReaderTestingInstructions.ios 
      : screenReaderTestingInstructions.android,
  };
};

/**
 * Documents the screen reader testing process
 */
export const screenReaderTestingDocumentation = {
  title: 'Screen Reader Testing Documentation',
  introduction: `
    This document outlines the process for testing the property management application 
    with screen readers to ensure accessibility for users with visual impairments.
    
    Screen reader testing should be performed on both iOS (VoiceOver) and Android (TalkBack)
    platforms to ensure cross-platform accessibility.
  `,
  testingFrequency: `
    Screen reader testing should be performed:
    - After implementing new screens or features
    - After significant UI changes
    - Before each major release
    - Quarterly for comprehensive accessibility audits
  `,
  testingProcess: [
    {
      step: 'Preparation',
      description: 'Enable the appropriate screen reader for your device (VoiceOver for iOS, TalkBack for Android)',
    },
    {
      step: 'Navigation Testing',
      description: 'Navigate through the entire app using only the screen reader to verify all screens are accessible',
    },
    {
      step: 'Element Testing',
      description: 'Test each interactive element to ensure it is properly announced and can be activated',
    },
    {
      step: 'Content Testing',
      description: 'Verify that all content is properly announced, including images, headings, and dynamic content',
    },
    {
      step: 'Form Testing',
      description: 'Complete forms using only the screen reader to verify all fields are properly labeled and errors are announced',
    },
    {
      step: 'Documentation',
      description: 'Document any issues found and create tickets for fixes',
    },
  ],
  commonIssues: [
    'Missing accessibility labels on images or icons',
    'Interactive elements without proper roles',
    'Form fields without associated labels',
    'Dynamic content changes not announced',
    'Complex gestures not accessible via screen reader',
    'Focus order not matching visual order',
    'Timeout dialogs not giving enough time for screen reader users',
  ],
  testingChecklist: 'Use the generateScreenReaderTestingChecklist function to create a checklist for each screen',
};
