import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import styles from './styles/front-page.style';

const FrontPage = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/src/screens/sign-up'); // Get Started için hedef rota
  };

  const handleLogin = () => {
    router.push('/src/screens/login'); // Login için hedef rota
  };

  return (

    <View style={styles.overlay}>
      <Text style={styles.title}>HOŞGELDİNİZ</Text>
      <Image
        source={require('../assets/photos/location3.png')} // Arka plan resmi
        style={styles.image}
        resizeMode="contain"

      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedText}>Kayıt Ol</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};

export default FrontPage;