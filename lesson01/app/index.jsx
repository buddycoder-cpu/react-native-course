import { Link } from 'expo-router'
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'

import cokeImg from '@/assets/images/coke.jpg'

const app = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={cokeImg}
        resizeMode='cover'
        style={styles.image}>
        <Text style={styles.text}>Mini Mart</Text>
        <Link href="/contact" style={{ marginHorizontal: 'auto' }} asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Contact Us</Text>
          </Pressable>
        </Link>
      </ImageBackground>
    </View>
  )
}

export default app

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  text: {
    color: 'white',
    fontSize: 42, 
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginBottom: 120,
  },
  link: {
    color: 'white',
    fontSize: 42, 
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  button: {
    height: 60,
    borderRadius: 20, 
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  buttonText: {
    color: 'white',
    fontSize: 16, 
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
}); 