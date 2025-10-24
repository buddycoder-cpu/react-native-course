import { Alert, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import animalsData from '../constants/AnimalData';

const AnimalList = () => {
  const handlePress = (item) => {
    const message = `You clicked on "${item.name}"`;
    Platform.OS === 'web'
      ? window.alert(message)
      : Alert.alert('Item Clicked', message);
  };
  const AnimalCard = ({ item, onPress}) => (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={styles.card}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={animalsData}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({item}) => (
            <AnimalCard item={item} onPress={() => handlePress(item)} />
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AnimalList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
  },
  textContainer: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});