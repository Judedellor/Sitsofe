import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import { ErrorBoundary } from "./services/ErrorHandlingService"
import OfflineNotice from "./components/OfflineNotice"
import { AuthProvider } from "./context/AuthContext"
import AppNavigator from './navigation/AppNavigator'

const App = () => {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <OfflineNotice />
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  )
}

export default App
