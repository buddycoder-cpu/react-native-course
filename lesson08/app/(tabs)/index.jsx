import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { deleteEntry, getEntries } from '../../utils/storage';

export default function HomeScreen() {
  const [entries, setEntries] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  const loadEntries = async () => {
    const data = await getEntries();
    setEntries(data);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this memory?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteEntry(id);
            loadEntries();
          },
        },
      ]
    );
  };

  const renderEntry = ({ item }) => (
    <TouchableOpacity
      style={styles.entryCard}
      onLongPress={() => handleDelete(item.id)}
    >
      <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
      <View style={styles.entryInfo}>
        <Text style={styles.date}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
        {item.location?.address && (
          <Text style={styles.location} numberOfLines={1}>
            📍 {item.location.address}
          </Text>
        )}
        {item.note && (
          <Text style={styles.note} numberOfLines={2}>
            {item.note}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Photo Journal</Text>
        <Link href="/add-entry" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No entries yet</Text>
          <Text style={styles.emptySubtext}>
            Tap + Add to capture your first memory
          </Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          renderItem={renderEntry}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    padding: 10,
  },
  entryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
  entryInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  note: {
    fontSize: 14,
    color: '#333',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: '#999',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#ccc',
  },
});