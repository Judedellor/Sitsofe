"main": "expo-router/entry""main": "expo-router/entry"// app/index.js
import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to your AboutScreen or another screen
  return <Redirect href="/about" />;
}