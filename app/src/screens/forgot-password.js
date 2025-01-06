import React, { useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useRouter } from 'expo-router';
import styles from './styles/forgot-password.style';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
  

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Hata', 'Lütfen bir e-posta adresi girin!');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi girin!');
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Başarılı',
        'Şifre sıfırlama e-postası gönderildi. Lütfen e-posta adresinizi kontrol edin.'
      );
    } catch (error) {
      Alert.alert('Hata', `Şifre sıfırlama başarısız: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogin = () => {
    router.push('/src/screens/login');
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.background}>
          <Text style={[styles.title, { fontFamily: 'BebasNeue' }]}>ŞİFREMİ UNUTTUM</Text>
          <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handlePasswordReset}
              disabled={isLoading}
            >
              <Text style={styles.resetButtonText}>
                {isLoading ? 'Sending...' : 'Email Doğrula'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogin} style={styles.backContainer}>
              <Text style={styles.accountText}>Geri Dön</Text>
              <Text style={styles.goBackText}>Giriş</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;