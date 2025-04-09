import * as Location from "expo-location"
import { Alert } from "react-native"

export type Coordinates = {
  latitude: number
  longitude: number
  altitude?: number | null
  accuracy?: number | null
  altitudeAccuracy?: number | null
  heading?: number | null
  speed?: number | null
}

export type LocationAddress = {
  street?: string | null
  city?: string | null
  region?: string | null
  country?: string | null
  postalCode?: string | null
  name?: string | null
  district?: string | null
  subregion?: string | null
  isoCountryCode?: string | null
  timezone?: string | null
}

export class LocationService {
  // Request location permissions
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      return status === "granted"
    } catch (error) {
      console.error("Error requesting location permissions:", error)
      return false
    }
  }

  // Get current location
  static async getCurrentLocation(
    options: Location.LocationOptions = { accuracy: Location.Accuracy.High },
  ): Promise<Coordinates | null> {
    try {
      const hasPermission = await this.requestPermissions()

      if (!hasPermission) {
        Alert.alert("Location Permission Required", "Please enable location services to use this feature.", [
          { text: "OK" },
        ])
        return null
      }

      const location = await Location.getCurrentPositionAsync(options)

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude,
        accuracy: location.coords.accuracy,
        altitudeAccuracy: location.coords.altitudeAccuracy,
        heading: location.coords.heading,
        speed: location.coords.speed,
      }
    } catch (error) {
      console.error("Error getting current location:", error)
      Alert.alert("Error", "Failed to get your current location. Please try again.")
      return null
    }
  }

  // Get address from coordinates
  static async getAddressFromCoordinates(
    coordinates: Pick<Coordinates, "latitude" | "longitude">,
  ): Promise<LocationAddress | null> {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      })

      if (results.length > 0) {
        return results[0]
      }

      return null
    } catch (error) {
      console.error("Error getting address from coordinates:", error)
      return null
    }
  }

  // Get coordinates from address
  static async getCoordinatesFromAddress(address: string): Promise<Coordinates | null> {
    try {
      const results = await Location.geocodeAsync(address)

      if (results.length > 0) {
        return {
          latitude: results[0].latitude,
          longitude: results[0].longitude,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        }
      }

      return null
    } catch (error) {
      console.error("Error getting coordinates from address:", error)
      return null
    }
  }

  // Calculate distance between two coordinates (in kilometers)
  static calculateDistance(
    coords1: Pick<Coordinates, "latitude" | "longitude">,
    coords2: Pick<Coordinates, "latitude" | "longitude">,
  ): number {
    const R = 6371 // Earth's radius in km
    const dLat = this.deg2rad(coords2.latitude - coords1.latitude)
    const dLon = this.deg2rad(coords2.longitude - coords1.longitude)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(coords1.latitude)) *
        Math.cos(this.deg2rad(coords2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    return distance
  }

  // Convert degrees to radians
  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
  }

  // Get formatted address string
  static formatAddress(address: LocationAddress): string {
    const parts = []

    if (address.street) parts.push(address.street)
    if (address.city) parts.push(address.city)
    if (address.region) parts.push(address.region)
    if (address.postalCode) parts.push(address.postalCode)
    if (address.country) parts.push(address.country)

    return parts.join(", ")
  }

  // Watch position changes
  static watchPosition(
    callback: (location: Coordinates) => void,
    errorCallback?: (error: any) => void,
    options: Location.LocationOptions = { accuracy: Location.Accuracy.Balanced },
  ): Location.LocationSubscription {
    let subscription: Location.LocationSubscription | null = null;
    
    Location.watchPositionAsync(options, (location: Location.LocationObject) => {
      callback({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude,
        accuracy: location.coords.accuracy,
        altitudeAccuracy: location.coords.altitudeAccuracy,
        heading: location.coords.heading,
        speed: location.coords.speed,
      })
    }).catch((error: Error) => {
      console.error("Error watching position:", error)
      if (errorCallback) errorCallback(error)
    });
    
    // Create a subscription object with a remove method
    subscription = {
      remove: () => {
        // Implementation would depend on the actual API
        // This is a placeholder that would need to be updated
        console.log("Stopping location updates");
      }
    };
    
    return subscription;
  }

  // Stop watching position
  static stopWatchingPosition(subscription: Location.LocationSubscription) {
    subscription.remove()
  }
}

