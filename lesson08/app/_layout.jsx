import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
export default function RootLayout() {
  useEffect(() => {
    // Request notification permissions on app start
    requestNotificationPermissions();
    // Setup notification listeners
    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        response => {
          console.log('Notification tapped:'
            , response);
        }
      );
    return () => subscription.remove();
  }, []);
  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !==
      'granted') {
      await Notifications.requestPermissionsAsync();
    }
  };
  return (
    <Stack>
      <Stack.Screen
        name=
        "(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name=
        "add-entry"
        options={{
          presentation: 'modal',
          headerShown: false
        }}
      />
    </Stack>
  );
}