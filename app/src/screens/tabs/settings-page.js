import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert, SafeAreaView, SectionList } from 'react-native';
import { auth, firestore } from '../../../firebaseConfig';
import { doc, getDoc, updateDoc, arrayRemove, onSnapshot, writeBatch } from 'firebase/firestore';
import { useRouter,useFocusEffect } from 'expo-router';
import { AirbnbRating } from 'react-native-ratings';
import Ionicons from '@expo/vector-icons/Ionicons';
import { signOut } from 'firebase/auth';

const StarRating = ({ 
  rating = 0, 
  size = 20, 
  disabled = true 
}) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.starContainer}>
      {stars.map((star) => (
        <View key={star}>
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={size}
            color="#E9B741"
            style={styles.star}
          />
        </View>
      ))}
    </View>
  );
};

const SettingsScreen = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [upcomingNotifications, setUpcomingNotifications] = useState(false);
  const [newEventNotifications, setNewEventNotifications] = useState(false);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [comments, setComments] = useState([]);

  // Kullanıcı verilerini dinleyen useEffect
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          Alert.alert('Hata', 'Kullanıcı oturumu bulunamadı.');
          router.push('/src/screens/login');
          return;
        }

        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const docSnapshot = await getDoc(userDocRef);
        
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setUserData({
            name: userData.name || '',
            surname: userData.surname || '',
            phone: userData.phone || '',
            email: userData.email || currentUser.email,
          });
          setFavoriteEvents(userData.favoriteEvents || []);
          setComments(userData.comments || []);
        }
      } catch (error) {
        console.error("Kullanıcı verileri alınırken hata:", error);
        Alert.alert('Hata', 'Veriler yüklenirken bir hata oluştu.');
      }
    };

    fetchUserData();
  }, []);
  const handleRemoveFavorite = async (event) => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('Hata', 'Kullanıcı oturumu bulunamadı.');
        return;
      }

      const userDocRef = doc(firestore, 'users', currentUser.uid);

      // Firestore'dan favoriyi kaldır
      await updateDoc(userDocRef, {
        favoriteEvents: arrayRemove(event),
      });

      // Favori etkinliği anlık olarak state'den çıkar
      setFavoriteEvents((prevEvents) => prevEvents.filter((e) => e.id !== event.id));

      Alert.alert('Başarılı', 'Etkinlik favorilerden kaldırıldı.');
    } catch (error) {
      Alert.alert('Hata', `Favori etkinlik kaldırılırken hata oluştu: ${error.message}`);
    }
  };
  // Çıkış yapma fonksiyonu
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/src/screens/login');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
      Alert.alert('Hata', 'Çıkış yapılırken bir sorun oluştu.');
    }
  };

  // Yorum silme fonksiyonunu güncelleyelim
  const handleRemoveComment = async (commentToDelete) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Hata', 'Kullanıcı oturumu bulunamadı.');
        return;
      }

      Alert.alert(
        'Yorumu Sil',
        'Bu yorumu silmek istediğinizden emin misiniz?',
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Sil',
            style: 'destructive',
            onPress: async () => {
              try {
                // Event dokümanını güncelle
                const eventDocRef = doc(firestore, 'events', commentToDelete.eventId);
                const eventDoc = await getDoc(eventDocRef);
                
                if (eventDoc.exists()) {
                  const eventData = eventDoc.data();
                  const updatedEventComments = eventData.comments.filter(comment => 
                    comment.timestamp !== commentToDelete.timestamp || 
                    comment.userId !== currentUser.uid
                  );
                  
                  await updateDoc(eventDocRef, {
                    comments: updatedEventComments
                  });

                  // User dokümanını güncelle
                  const userDocRef = doc(firestore, 'users', currentUser.uid);
                  const userDoc = await getDoc(userDocRef);
                  
                  if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const updatedUserComments = userData.comments.filter(comment => 
                      comment.timestamp !== commentToDelete.timestamp
                    );
                    
                    await updateDoc(userDocRef, {
                      comments: updatedUserComments
                    });
                  }

                  setComments(prevComments => 
                    prevComments.filter(comment => 
                      comment.timestamp !== commentToDelete.timestamp
                    )
                  );

                  Alert.alert('Başarılı', 'Yorum başarıyla silindi.');
                }
              } catch (error) {
                console.error('Yorum silinirken hata:', error);
                Alert.alert('Hata', 'Yorum silinirken bir hata oluştu: ' + error.message);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Yorum silme işlemi başarısız:', error);
      Alert.alert('Hata', 'Yorum silinirken bir hata oluştu.');
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Bildirim Ayarları Bölümü - Sabit */}
      <View style={styles.fixedSection}>
        <Text style={styles.sectionTitle}>Bildirim Ayarları</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            <Ionicons name="notifications-outline" size={24} color="#789DBC" />
            <Text style={styles.settingItemText}>Bildirimleri Etkinleştir</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#E9B741' }}
            thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            <Ionicons name="calendar-outline" size={24} color="#789DBC" />
            <Text style={styles.settingItemText}>Etkinlik Hatırlatmaları</Text>
          </View>
          <Switch
            value={upcomingNotifications}
            onValueChange={setUpcomingNotifications}
            trackColor={{ false: '#767577', true: '#E9B741' }}
            thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingItemLeft}>
            <Ionicons name="newspaper-outline" size={24} color="#789DBC" />
            <Text style={styles.settingItemText}>Yeni Etkinlik Bildirimleri</Text>
          </View>
          <Switch
            value={newEventNotifications}
            onValueChange={setNewEventNotifications}
            trackColor={{ false: '#767577', true: '#E9B741' }}
            thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Favori Etkinlikler ve Yorumlar için SectionList */}
      <SectionList
        sections={[
          {
            title: 'Favori Etkinlikler',
            data: favoriteEvents,
            renderItem: ({ item }) => (
              <View style={styles.eventCard}>
                <View style={styles.eventContent}>
                  <View style={styles.eventHeader}>
                    <View style={styles.titleContainer}>
                      <Ionicons name="musical-notes-outline" size={24} color="#789DBC" />
                      <Text style={styles.eventTitle} numberOfLines={2}>
                        {item.title}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveFavorite(item)}
                    >
                      <Ionicons name="heart-dislike-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.eventDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons name="calendar-outline" size={18} color="#789DBC" />
                      <Text style={styles.detailText}>
                        {new Date(item.date).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={18} color="#789DBC" />
                      <Text style={styles.detailText}>
                        {new Date(item.date).toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="location-outline" size={18} color="#789DBC" />
                      <Text style={styles.detailText} numberOfLines={2}>
                        {item.location}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )
          },
          {
            title: 'Yorumlarım',
            data: comments,
            renderItem: ({ item }) => (
              <View style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <View style={styles.eventTitleContainer}>
                    <Ionicons name="calendar-outline" size={20} color="#789DBC" />
                    <Text style={styles.commentEventTitle}>
                      {item.eventTitle || 'Etkinlik adı yok'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeCommentButton}
                    onPress={() => handleRemoveComment(item)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>

                <View style={styles.commentContent}>
                  <View style={styles.ratingDateContainer}>
                    <View style={styles.ratingContainer}>
                      <StarRating rating={item.rating} size={16} />
                    </View>
                    <Text style={styles.commentDate}>
                      {new Date(item.timestamp).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>

                  <Text style={styles.commentText}>{item.comment}</Text>
                </View>
              </View>
            )
          }
        ]}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
        stickySectionHeadersEnabled={true}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz içerik bulunmamaktadır.</Text>
        }
        ListFooterComponent={
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
          </TouchableOpacity>
        }
        contentContainerStyle={styles.contentContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  fixedSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  sectionHeader: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1E24',
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  eventContent: {
    gap: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
    marginRight: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1E24',
    flex: 1,
    lineHeight: 24,
  },
  removeButton: {
    backgroundColor: '#E9B741',
    padding: 8,
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDetails: {
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 15,
    color: '#666',
    flex: 1,
  },
  commentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  eventTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  commentEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1E24',
    marginLeft: 8,
    flex: 1,
  },
  removeCommentButton: {
    backgroundColor: '#E9B741',
    padding: 8,
    borderRadius: 8,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentContent: {
    gap: 12,
  },
  ratingDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  star: {
    marginHorizontal: 1,
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: '#789DBC',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SettingsScreen;
