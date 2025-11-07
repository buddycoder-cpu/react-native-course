import AsyncStorage from '@react-native-async-storage/async-storage';
const STORAGE_KEY = '@photo_journal_entries';
export const saveEntry = async (entry) => {
    try {
        const existing = await getEntries();
        const updated = [entry, ...existing];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return true;
    } catch (error) {
        console.error('Error saving entry:', error);
        return false;
    }
};
export const getEntries = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading entries:', error);
        return [];
    }
};
export const deleteEntry = async (id) => {
    try {
        const existing = await getEntries();
        const updated = existing.filter(entry => entry.id !== id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return true;
    } catch (error) {
        console.error('Error deleting entry:', error);
        return false;
    }
};

export const updateEntry = async (updatedEntry) => {
  try {
    const existing = await getEntries();
    const updated = existing.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error updating entry:', error);
    return false;
  }
};