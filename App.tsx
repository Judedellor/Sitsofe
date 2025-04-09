import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StatusBar } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import { colors } from './constants/colors';

// Import screens
import TestConnection from './screens/TestConnection';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from './screens/TermsOfServiceScreen';
import HelpSupportScreen from './screens/HelpSupportScreen';

// Define navigation types
export type RootStackParamList = {
  TestConnection: undefined;
  Login: undefined;
  Main: undefined;
  ChangePassword: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  HelpSupport: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.gray[200],
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const { user } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.white}
      />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {!user ? (
            <>
              <Stack.Screen name="TestConnection" component={TestConnection} />
              <Stack.Screen name="Login" component={LoginScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Main" component={MainTabs} />
              <Stack.Screen
                name="ChangePassword"
                component={ChangePasswordScreen}
                options={{
                  headerShown: true,
                  title: 'Change Password',
                }}
              />
              <Stack.Screen
                name="PrivacyPolicy"
                component={PrivacyPolicyScreen}
                options={{
                  headerShown: true,
                  title: 'Privacy Policy',
                }}
              />
              <Stack.Screen
                name="TermsOfService"
                component={TermsOfServiceScreen}
                options={{
                  headerShown: true,
                  title: 'Terms of Service',
                }}
              />
              <Stack.Screen
                name="HelpSupport"
                component={HelpSupportScreen}
                options={{
                  headerShown: true,
                  title: 'Help & Support',
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
