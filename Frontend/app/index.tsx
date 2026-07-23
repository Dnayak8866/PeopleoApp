// Routing is handled entirely by AppNavigator in _layout.tsx.
// This component renders null to avoid calling useAuth() outside a guaranteed
// AuthProvider context during early Expo Router render cycles.
export default function Index() {
  return null;
}
