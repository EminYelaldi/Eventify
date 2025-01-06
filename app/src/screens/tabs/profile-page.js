import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
  SafeAreaView,
  Image
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { auth, firestore } from '../../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ProfileScreen = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Kullanıcı verilerini çek
  const fetchUserData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Hata', 'Kullanıcı oturumu bulunamadı.');
        router.push('/src/screens/login');
        return;
      }

      const userDocRef = doc(firestore, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          name: data.name || '',
          surname: data.surname || '',
          phone: data.phone || '',
          email: data.email || currentUser.email,
        });
      }
    } catch (error) {
      Alert.alert('Hata', 'Veriler yüklenirken bir sorun oluştu.');
    }
  };

  useFocusEffect(useCallback(() => {
    fetchUserData();
  }, []));

  const handleSave = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userDocRef = doc(firestore, 'users', currentUser.uid);
      await updateDoc(userDocRef, userData);

      setIsEditing(false);
      Alert.alert('Başarılı', 'Profil bilgileri güncellendi.');
    } catch (error) {
      Alert.alert('Hata', 'Profil bilgileri güncellenirken bir sorun oluştu.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profil Başlığı */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/photos/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.userName}>
            {userData.name} {userData.surname}
          </Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
        </View>

        {/* Profil Bilgileri */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoHeader}>
                <Ionicons name="person-outline" size={22} color="#789DBC" />
                <Text style={styles.infoLabel}>Ad</Text>
              </View>
              <TextInput
                style={[styles.infoInput, isEditing && styles.activeInput]}
                value={userData.name}
                onChangeText={(text) => setUserData(prev => ({ ...prev, name: text }))}
                editable={isEditing}
                placeholder="Adınız"
              />
            </View>

            <View style={styles.separator} />

            <View style={styles.infoItem}>
              <View style={styles.infoHeader}>
                <Ionicons name="person-outline" size={22} color="#789DBC" />
                <Text style={styles.infoLabel}>Soyad</Text>
              </View>
              <TextInput
                style={[styles.infoInput, isEditing && styles.activeInput]}
                value={userData.surname}
                onChangeText={(text) => setUserData(prev => ({ ...prev, surname: text }))}
                editable={isEditing}
                placeholder="Soyadınız"
              />
            </View>

            <View style={styles.separator} />

            <View style={styles.infoItem}>
              <View style={styles.infoHeader}>
                <Ionicons name="call-outline" size={22} color="#789DBC" />
                <Text style={styles.infoLabel}>Telefon</Text>
              </View>
              <TextInput
                style={[styles.infoInput, isEditing && styles.activeInput]}
                value={userData.phone}
                onChangeText={(text) => setUserData(prev => ({ ...prev, phone: text }))}
                editable={isEditing}
                placeholder="Telefon numaranız"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.separator} />

            <View style={styles.infoItem}>
              <View style={styles.infoHeader}>
                <Ionicons name="mail-outline" size={22} color="#789DBC" />
                <Text style={styles.infoLabel}>E-posta</Text>
              </View>
              <TextInput
                style={[styles.infoInput, isEditing && styles.activeInput]}
                value={userData.email}
                onChangeText={(text) => setUserData(prev => ({ ...prev, email: text }))}
                editable={isEditing}
                placeholder="E-posta adresiniz"
                keyboardType="email-address"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.actionButton,
              isEditing ? styles.saveButton : styles.editButton
            ]}
            onPress={isEditing ? handleSave : () => setIsEditing(true)}
          >
            <Ionicons
              name={isEditing ? "checkmark-outline" : "create-outline"}
              size={20}
              color="#fff"
            />
            <Text style={styles.buttonText}>
              {isEditing ? 'Kaydet' : 'Düzenle'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1D1E24',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  infoSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1E24',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  infoItem: {
    paddingVertical: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  infoInput: {
    fontSize: 16,
    color: '#1D1E24',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  activeInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9B741',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  editButton: {
    backgroundColor: '#E9B741',
  },
  saveButton: {
    backgroundColor: '#789DBC',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;