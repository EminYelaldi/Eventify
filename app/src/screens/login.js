import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  FacebookAuthProvider
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebaseConfig';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useAuthRequest as useFacebookAuthRequest } from 'expo-auth-session/providers/facebook';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as AuthSession from 'expo-auth-session';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles/login.style';

// Complete any pending web auth session
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const provider = new FacebookAuthProvider();

  // Google auth request
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    clientId: '436801953933-rk97n572mkspikvopit5dbfqqtpr7idm.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });

  // Facebook auth request
  const [facebookRequest, facebookResponse, facebookPromptAsync] = useFacebookAuthRequest({
    clientId: '1140521061014991',
    scopes: ['public_profile', 'email'],
    redirectUri: AuthSession.makeRedirectUri({
      useProxy: true, // Ensures the redirect URI works with Expo
    }),
  });

  // Handle Google auth response
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { id_token } = googleResponse.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      handleFirebaseLogin(credential);
    }
  }, [googleResponse]);

  // Handle Facebook auth response
  useEffect(() => {
    if (facebookResponse?.type === 'success') {
      const { access_token } = facebookResponse.authentication;
      const credential = provider.credential(access_token);
      handleFirebaseLogin(credential);
    }
  }, [facebookResponse]);

  const handleFirebaseLogin = async (credential) => {
    try {
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      // Save user data to Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName || '',
          email: user.email,
        });
      }

      Alert.alert('Success', 'Login successful!');
      router.push('/src/screens/tabs/event-page');
    } catch (error) {
      Alert.alert('Error', `Login failed: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Login successful!');
      router.push('/src/screens/tabs/event-page');
    } catch (error) {
      Alert.alert('Error', `Login failed: ${error.message}`);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleForgotPassword = () => {
    router.push('/src/screens/forgot-password');
  };

  const handleSignUp = () => {
    router.push('/src/screens/sign-up');
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
            <Image
              source={require('../assets/photos/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.title, { fontFamily: 'BebasNeue' }]}>Eventify</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.passwordInput}>
                <TextInput
                  style={[styles.input, { marginBottom: 0 }]}
                  placeholder="Şifre"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={isPasswordVisible ? 'eye' : 'eye-off'}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.linkContainer}>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.linkText}>Şifremi Unuttum</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Giriş Yap</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.authcontainer}>
              <TouchableOpacity
                style={styles.googleButton}
                disabled={!googleRequest}
                onPress={() => googlePromptAsync()}
              >
                <Image
                  source={require('../assets/photos/google-logo.png')}
                  style={styles.logoImage}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.facebookButton}
                disabled={!facebookRequest}
                onPress={() => facebookPromptAsync()}
              >
                <Image
                  source={require('../assets/photos/facebook-logo.png')}
                  style={styles.logoImage}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleSignUp} style={styles.backContainer}>
              <Text style={styles.accountText}>Hesabın yok mu?</Text>
              <Text style={styles.goBackText}>Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;