import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const NOTIFICATION_SETTINGS_KEY = '@notification_settings';

export default function SettingsScreen() {
  const [enabled, setEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState({ hour: 20, minute: 0 });
  const [notificationId, setNotificationId] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (data) {
        const settings = JSON.parse(data);
        setEnabled(settings.enabled);
        setNotificationTime(settings.time);
        setNotificationId(settings.notificationId);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (settings) => {
    try {
      await AsyncStorage.setItem(
        NOTIFICATION_SETTINGS_KEY,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const scheduleDailyNotification = async (hour, minute) => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        Alert.alert('Permission Denied', 'Cannot schedule notifications');
        return null;
      }
    }

    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time for your daily photo! 📸",
        body: "Capture today's moment and add it to your journal",
        sound: true,
        data: { screen: 'AddEntry' },
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });

    return id;
  };

  const handleToggle = async (value) => {
    if (value) {
      const id = await scheduleDailyNotification(
        notificationTime.hour,
        notificationTime.minute
      );

      if (id) {
        setEnabled(true);
        setNotificationId(id);
        await saveSettings({
          enabled: true,
          time: notificationTime,
          notificationId: id,
        });
        Alert.alert('Enabled', 'Daily reminder set!');
      }
    } else {
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
      setEnabled(false);
      setNotificationId(null);
      await saveSettings({
        enabled: false,
        time: notificationTime,
        notificationId: null,
      });
      Alert.alert('Disabled', 'Daily reminder cancelled');
    }
  };

  const updateTime = async (hour, minute) => {
    setNotificationTime({ hour, minute });

    if (enabled) {
      const id = await scheduleDailyNotification(hour, minute);
      if (id) {
        setNotificationId(id);
        await saveSettings({
          enabled: true,
          time: { hour, minute },
          notificationId: id,
        });
        Alert.alert('Updated', `Reminder set for ${formatTime(hour, minute)}`);
      }
    } else {
      await saveSettings({
        enabled: false,
        time: { hour, minute },
        notificationId: null,
      });
    }
  };

  const changeTime = () => {
    Alert.alert(
      'Change Time',
      'Select notification time',
      [
        {
          text: 'Morning (9:00 AM)',
          onPress: () => updateTime(9, 0),
        },
        {
          text: 'Afternoon (2:00 PM)',
          onPress: () => updateTime(14, 0),
        },
        {
          text: 'Evening (8:00 PM)',
          onPress: () => updateTime(20, 0),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const formatTime = (hour, minute) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const testNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Notification 🔔",
        body: "This is how your daily reminder will look!",
      },
      trigger: { seconds: 2 },
    });
    Alert.alert('Scheduled', 'Test notification will appear in 2 seconds');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Reminder</Text>
        <Text style={styles.sectionDescription}>
          Get a daily notification to capture your moment
        </Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable Reminder</Text>
          <Switch value={enabled} onValueChange={handleToggle} />
        </View>

        <TouchableOpacity
          style={[styles.settingRow, !enabled && styles.disabled]}
          onPress={changeTime}
          disabled={!enabled}
        >
          <Text style={styles.settingLabel}>Notification Time</Text>
          <Text style={styles.settingValue}>
            {formatTime(notificationTime.hour, notificationTime.minute)}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Testing</Text>
        <TouchableOpacity style={styles.testButton} onPress={testNotification}>
          <Text style={styles.testButtonText}>Send Test Notification</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ About Notifications</Text>
        <Text style={styles.infoText}>
          Daily reminders help you build a consistent journaling habit. You'll
          receive one notification per day at your chosen time.
        </Text>
        <Text style={styles.infoText}>
          Make sure notifications are enabled in your device settings.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
    color: '#007AFF',
  },
  disabled: {
    opacity: 0.5,
  },
  testButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    margin: 20,
    padding: 15,
    backgroundColor: '#E8F4FD',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    lineHeight: 20,
  },
});