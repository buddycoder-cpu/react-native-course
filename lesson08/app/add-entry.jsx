import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveEntry } from '../utils/storage';

export default function AddEntryScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (imageUri || note) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to close?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const requestPermissions = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const libraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const locationStatus = await Location.requestForegroundPermissionsAsync();

    return {
      camera: cameraStatus.status === 'granted',
      library: libraryStatus.status === 'granted',
      location: locationStatus.status === 'granted',
    };
  };

  const takePhoto = async () => {
    const permissions = await requestPermissions();
    
    if (!permissions.camera) {
      Alert.alert('Permission Required', 'Camera permission is needed to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      await captureLocation();
    }
  };

  const pickImage = async () => {
    const permissions = await requestPermissions();
    
    if (!permissions.library) {
      Alert.alert('Permission Required', 'Photo library permission is needed');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      await captureLocation();
    }
  };

  const captureLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [address] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      const addressString = [
        address.street,
        address.city,
        address.region,
      ].filter(Boolean).join(', ');

      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        address: addressString,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Could not get location. Entry will be saved without location.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!imageUri) {
      Alert.alert('No Image', 'Please capture or select an image first');
      return;
    }

    setLoading(true);

    const entry = {
      id: Date.now().toString(),
      imageUri,
      location,
      timestamp: Date.now(),
      note: note.trim(),
    };

    const success = await saveEntry(entry);
    setLoading(false);

    if (success) {
      Alert.alert('Success', 'Entry saved!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', 'Could not save entry. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Custom Header with Close Button */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Entry</Text>
        <View style={styles.closeButton} />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {!imageUri ? (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>No image selected</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={takePhoto}>
                  <Text style={styles.buttonText}>📷 Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                  <Text style={styles.buttonText}>🖼️ Pick Image</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <TouchableOpacity
                style={styles.changeButton}
                onPress={() => {
                  Alert.alert(
                    'Change Image',
                    'Choose an option',
                    [
                      { text: 'Take Photo', onPress: takePhoto },
                      { text: 'Pick Image', onPress: pickImage },
                      { text: 'Cancel', style: 'cancel' },
                    ]
                  );
                }}
              >
                <Text style={styles.changeButtonText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          )}

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Getting location...</Text>
            </View>
          )}

          {location && (
            <View style={styles.locationCard}>
              <Text style={styles.locationTitle}>📍 Location</Text>
              <Text style={styles.locationText}>{location.address}</Text>
              <Text style={styles.coordinates}>
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </Text>
            </View>
          )}

          <View style={styles.noteSection}>
            <Text style={styles.noteLabel}>Add a note (optional)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="What's the story behind this moment?"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, !imageUri && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!imageUri || loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Entry'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  imagePlaceholder: {
    height: 300,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  changeButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  changeButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  locationCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  coordinates: {
    fontSize: 12,
    color: '#999',
  },
  noteSection: {
    marginBottom: 20,
  },
  noteLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  noteInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});