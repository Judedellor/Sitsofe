import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/auth/ResetPasswordScreen';
import { EmailVerificationScreen } from '../screens/auth/EmailVerificationScreen';
import { RoleSelectionScreen } from '../screens/auth/RoleSelectionScreen';
import { TenantLoginScreen } from '../screens/auth/TenantLoginScreen';

// Dashboard Screens
import { HomeScreen } from '../screens/dashboard/HomeScreen';
import { RenterDashboard } from '../screens/dashboard/RenterDashboard';
import { OwnerDashboard } from '../screens/dashboard/OwnerDashboard';
import { AdminDashboard } from '../screens/dashboard/AdminDashboard';

// Property Screens
import { PropertiesScreen } from '../screens/property/PropertiesScreen';
import { PropertyDetailsScreen } from '../screens/property/PropertyDetailsScreen';
import { PropertyAdditionScreen } from '../screens/property/PropertyAdditionScreen';
import { PropertyMapScreen } from '../screens/property/PropertyMapScreen';
import { PropertyAnalyticsScreen } from '../screens/property/PropertyAnalyticsScreen';
import { VirtualTourScreen } from '../screens/property/VirtualTourScreen';
import { PropertyInspectionScreen } from '../screens/property/PropertyInspectionScreen';
import { SimplePropertyInspectionScreen } from '../screens/property/SimplePropertyInspectionScreen';

// Tenant Screens
import { TenantsScreen } from '../screens/tenant/TenantsScreen';
import { TenantDetailScreen } from '../screens/tenant/TenantDetailScreen';
import { AddTenantScreen } from '../screens/tenant/AddTenantScreen';
import { TenantPortalScreen } from '../screens/tenant/TenantPortalScreen';
import { TenantScreeningDashboard } from '../screens/tenant/TenantScreeningDashboard';
import { ApplicantDetailsScreen } from '../screens/tenant/ApplicantDetailsScreen';
import { TenantApplicationScreen } from '../screens/tenant/TenantApplicationScreen';

// Maintenance Screens
import { MaintenanceScreen } from '../screens/maintenance/MaintenanceScreen';
import { MaintenanceDetailScreen } from '../screens/maintenance/MaintenanceDetailScreen';
import { AddMaintenanceRequestScreen } from '../screens/maintenance/AddMaintenanceRequestScreen';
import { WorkOrderScreen } from '../screens/maintenance/WorkOrderScreen';
import { WorkOrderDetailScreen } from '../screens/maintenance/WorkOrderDetailScreen';
import { CreateWorkOrderScreen } from '../screens/maintenance/CreateWorkOrderScreen';
import { PredictiveMaintenanceScreen } from '../screens/maintenance/PredictiveMaintenanceScreen';

// Financial Screens
import { PaymentsScreen } from '../screens/financial/PaymentsScreen';
import { PaymentDetailScreen } from '../screens/financial/PaymentDetailScreen';
import { AddPaymentScreen } from '../screens/financial/AddPaymentScreen';
import { PaymentMethodsScreen } from '../screens/financial/PaymentMethodsScreen';
import { AddPaymentMethodScreen } from '../screens/financial/AddPaymentMethodScreen';
import { ExpenseTrackingScreen } from '../screens/financial/ExpenseTrackingScreen';
import { AddExpenseScreen } from '../screens/financial/AddExpenseScreen';
import { ExpenseDetailScreen } from '../screens/financial/ExpenseDetailScreen';
import { FinancialDashboardScreen } from '../screens/financial/FinancialDashboardScreen';

// Document Screens
import { DocumentsScreen } from '../screens/document/DocumentsScreen';
import { DocumentDetailScreen } from '../screens/document/DocumentDetailScreen';

// Report Screens
import { ReportsScreen } from '../screens/report/ReportsScreen';
import { ReportBuilderScreen } from '../screens/report/ReportBuilderScreen';
import { ReportViewerScreen } from '../screens/report/ReportViewerScreen';
import { AdvancedReportingDashboard } from '../screens/report/AdvancedReportingDashboard';
import { DataVisualizationScreen } from '../screens/report/DataVisualizationScreen';

// Settings Screens
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { UserProfileScreen } from '../screens/settings/UserProfileScreen';
import { NotificationsScreen } from '../screens/settings/NotificationsScreen';
import { ChangePasswordScreen } from '../screens/settings/ChangePasswordScreen';
import { BiometricSetupScreen } from '../screens/settings/BiometricSetupScreen';
import { CustomizationScreen } from '../screens/settings/CustomizationScreen';

// Messaging Screens
import { MessagesScreen } from '../screens/messaging/MessagesScreen';
import { ChatScreen } from '../screens/messaging/ChatScreen';
import { CallScreen } from '../screens/messaging/CallScreen';

// Calendar Screens
import { CalendarScreen } from '../screens/calendar/CalendarScreen';
import { ComplianceCalendarScreen } from '../screens/compliance/ComplianceCalendarScreen';

// Smart Building Screens
import { SmartBuildingDashboardScreen } from '../screens/smart-building/SmartBuildingDashboardScreen';
import { SmartDeviceDetailScreen } from '../screens/smart-building/SmartDeviceDetailScreen';
import { AddSmartDeviceScreen } from '../screens/smart-building/AddSmartDeviceScreen';
import { TenantSmartHomeScreen } from '../screens/smart-building/TenantSmartHomeScreen';
import { SmartBuildingAlertsScreen } from '../screens/smart-building/SmartBuildingAlertsScreen';
import { EnergyManagementScreen } from '../screens/smart-building/EnergyManagementScreen';
import { AccessControlScreen } from '../screens/smart-building/AccessControlScreen';

// Compliance Screens
import { ComplianceDashboardScreen } from '../screens/compliance/ComplianceDashboardScreen';
import { ComplianceDetailScreen } from '../screens/compliance/ComplianceDetailScreen';
import { RegulatoryUpdatesScreen } from '../screens/compliance/RegulatoryUpdatesScreen';
import { ScreeningComplianceDashboard } from '../screens/compliance/ScreeningComplianceDashboard';

// Analytics Screens
import { PerformanceBenchmarkingScreen } from '../screens/analytics/PerformanceBenchmarkingScreen';
import { PredictiveAnalyticsScreen } from '../screens/analytics/PredictiveAnalyticsScreen';
import { InvestmentAnalysisScreen } from '../screens/analytics/InvestmentAnalysisScreen';

// Help & Support Screens
import { HelpCenterScreen } from '../screens/support/HelpCenterScreen';
import { ContactSupportScreen } from '../screens/support/ContactSupportScreen';
import { AboutScreen } from '../screens/support/AboutScreen';
import { LegalPrivacyScreen } from '../screens/support/LegalPrivacyScreen';

// Accessibility Testing Screens
import { AccessibilityTestingScreen } from '../screens/accessibility/AccessibilityTestingScreen';
import { ScreenReaderDemoScreen } from '../screens/accessibility/ScreenReaderDemoScreen';

// Navigation Validator
import { NavigationValidator } from './NavigationValidator';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="TenantLogin" component={TenantLoginScreen} />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Properties') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'Tenants') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Maintenance') {
            iconName = focused ? 'construct' : 'construct-outline';
          } else if (route.name === 'More') {
            iconName = focused ? 'menu' : 'menu-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Properties" component={PropertiesScreen} />
      <Tab.Screen name="Tenants" component={TenantsScreen} />
      <Tab.Screen name="Maintenance" component={MaintenanceScreen} />
      <Tab.Screen name="More" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

// Root Navigator
const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <NavigationValidator />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            
            {/* Property Stack */}
            <Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
            <Stack.Screen name="AddProperty" component={PropertyAdditionScreen} />
            <Stack.Screen name="PropertyMap" component={PropertyMapScreen} />
            <Stack.Screen name="PropertyAnalytics" component={PropertyAnalyticsScreen} />
            <Stack.Screen name="VirtualTour" component={VirtualTourScreen} />
            <Stack.Screen name="PropertyInspection" component={PropertyInspectionScreen} />
            
            {/* Tenant Stack */}
            <Stack.Screen name="TenantDetails" component={TenantDetailScreen} />
            <Stack.Screen name="AddTenant" component={AddTenantScreen} />
            <Stack.Screen name="TenantPortal" component={TenantPortalScreen} />
            <Stack.Screen name="TenantScreening" component={TenantScreeningDashboard} />
            <Stack.Screen name="ApplicantDetails" component={ApplicantDetailsScreen} />
            <Stack.Screen name="TenantApplication" component={TenantApplicationScreen} />
            
            {/* Maintenance Stack */}
            <Stack.Screen name="MaintenanceDetails" component={MaintenanceDetailScreen} />
            <Stack.Screen name="AddMaintenanceRequest" component={AddMaintenanceRequestScreen} />
            <Stack.Screen name="WorkOrders" component={WorkOrderScreen} />
            <Stack.Screen name="WorkOrderDetails" component={WorkOrderDetailScreen} />
            <Stack.Screen name="CreateWorkOrder" component={CreateWorkOrderScreen} />
            <Stack.Screen name="PredictiveMaintenance" component={PredictiveMaintenanceScreen} />
            
            {/* Financial Stack */}
            <Stack.Screen name="PaymentDetails" component={PaymentDetailScreen} />
            <Stack.Screen name="AddPayment" component={AddPaymentScreen} />
            <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
            <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} />
            <Stack.Screen name="ExpenseTracking" component={ExpenseTrackingScreen} />
            <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
            <Stack.Screen name="ExpenseDetails" component={ExpenseDetailScreen} />
            <Stack.Screen name="FinancialDashboard" component={FinancialDashboardScreen} />
            
            {/* Document Stack */}
            <Stack.Screen name="Documents" component={DocumentsScreen} />
            <Stack.Screen name="DocumentDetails" component={DocumentDetailScreen} />
            
            {/* Report Stack */}
            <Stack.Screen name="Reports" component={ReportsScreen} />
            <Stack.Screen name="ReportBuilder" component={ReportBuilderScreen} />
            <Stack.Screen name="ReportViewer" component={ReportViewerScreen} />
            <Stack.Screen name="AdvancedReporting" component={AdvancedReportingDashboard} />
            <Stack.Screen name="DataVisualization" component={DataVisualizationScreen} />
            
            {/* Settings Stack */}
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="BiometricSetup" component={BiometricSetupScreen} />
            <Stack.Screen name="Customization" component={CustomizationScreen} />
            
            {/* Messaging Stack */}
            <Stack.Screen name="Messages" component={MessagesScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Call" component={CallScreen} />
            
            {/* Calendar Stack */}
            <Stack.Screen name="Calendar" component={CalendarScreen} />
            <Stack.Screen name="ComplianceCalendar" component={ComplianceCalendarScreen} />
            
            {/* Smart Building Stack */}
            <Stack.Screen name="SmartBuildingDashboard" component={SmartBuildingDashboardScreen} />
            <Stack.Screen name="SmartDeviceDetails" component={SmartDeviceDetailScreen} />
            <Stack.Screen name="AddSmartDevice" component={AddSmartDeviceScreen} />
            <Stack.Screen name="TenantSmartHome" component={TenantSmartHomeScreen} />
            <Stack.Screen name="SmartBuildingAlerts" component={SmartBuildingAlertsScreen} />
            <Stack.Screen name="EnergyManagement" component={EnergyManagementScreen} />
            <Stack.Screen name="AccessControl" component={AccessControlScreen} />
            
            {/* Compliance Stack */}
            <Stack.Screen name="ComplianceDashboard" component={ComplianceDashboardScreen} />
            <Stack.Screen name="ComplianceDetails" component={ComplianceDetailScreen} />
            <Stack.Screen name="RegulatoryUpdates" component={RegulatoryUpdatesScreen} />
            <Stack.Screen name="ScreeningCompliance" component={ScreeningComplianceDashboard} />
            
            {/* Analytics Stack */}
            <Stack.Screen name="PerformanceBenchmarking" component={PerformanceBenchmarkingScreen} />
            <Stack.Screen name="PredictiveAnalytics" component={PredictiveAnalyticsScreen} />
            <Stack.Screen name="InvestmentAnalysis" component={InvestmentAnalysisScreen} />
            
            {/* Help & Support Stack */}
            <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
            <Stack.Screen name="ContactSupport" component={ContactSupportScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="LegalPrivacy" component={LegalPrivacyScreen} />
            
            {/* Accessibility Testing Stack */}
            <Stack.Screen name="AccessibilityTesting" component={AccessibilityTestingScreen} />
            <Stack.Screen name="ScreenReaderDemo" component={ScreenReaderDemoScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
