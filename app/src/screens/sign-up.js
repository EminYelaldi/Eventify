import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

import styles from './styles/sign-up.style';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    if (!name || !surname || !phone || !email || !password || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun!');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi girin!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor!');
      return;
    }

    try {
      // Firebase Authentication ile kullanıcı kaydı
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore'a kullanıcı verilerini kaydet
      const userDocRef = doc(firestore, 'users', user.uid); // Kullanıcının UID'si ile bellek referansı oluşturuluyor
      await setDoc(userDocRef, {
        name, // Ad
        surname, // Soyad
        phone, // Telefon
        email, // E-posta
        password, // Şifre
        createdAt: new Date().toISOString(), // Oluşturulma zamanı
      });

      Alert.alert('Başarılı', 'Kayıt başarılı!', [
        { text: 'Tamam', onPress: () => router.push('/src/screens/login') },
      ]);
    } catch (error) {
      Alert.alert('Hata', `Kayıt başarısız: ${error.message}`);
    }
  };

  const handleGoBack = () => {
    router.push('/src/screens/login'); // Giriş ekranına geri dönüş
  };
  const formatPhoneNumber = (text) => {
    const cleaned = text.replace(/\D/g, ''); // Rakam dışındaki karakterleri temizle
    let formattedNumber = '';
    if (cleaned.length > 0) {
      formattedNumber = '(' + cleaned.slice(0, 3);
    }
    if (cleaned.length >= 4) {
      formattedNumber += ') ' + cleaned.slice(3, 6);
    }
    if (cleaned.length >= 7) {
      formattedNumber += ' ' + cleaned.slice(6, 8);
    }
    if (cleaned.length >= 9) {
      formattedNumber += ' ' + cleaned.slice(8, 10);
    }
    return formattedNumber;
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
            {/* Başlık */}
            <Text style={[styles.title, { fontFamily: 'BebasNeue' }]}>KAYIT</Text>

            {/* Kayıt Alanları */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Adınız"
                autoComplete="off"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Soyadınız"
                autoComplete="off"
                placeholderTextColor="#aaa"
                value={surname}
                onChangeText={setSurname}
              />
              <TextInput
                style={styles.input}
                placeholder="Telefon Numaranız"
                placeholderTextColor="#aaa"
                value={phone}
                onChangeText={(text) => setPhone(formatPhoneNumber(text))}
                keyboardType="phone-pad" // Telefon klavyesini aç
                maxLength={15} // Format uzunluğu
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Şifre"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                autoComplete="off"
                textContentType="oneTimeCode"
                autoCapitalize="none"
                keyboardType="default"
              />
              <TextInput
                style={styles.input}
                placeholder="Şifre Doğrulama"
                placeholderTextColor="#aaa"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
                autoComplete="off"
                textContentType="oneTimeCode"
                autoCapitalize="none"
                keyboardType="default"
              />
            </View>

            {/* Kayıt Ol Butonu */}
            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <Text style={styles.signUpButtonText}>Kayıt Ol</Text>
            </TouchableOpacity>

            {/* Geri Dönüş Butonu */}
            <TouchableOpacity onPress={handleGoBack} style={styles.backContainer}>
              <Text style={styles.accountText}>Zaten bir hesabınız var mı?</Text>
              <Text style={styles.goBackText}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpPage;