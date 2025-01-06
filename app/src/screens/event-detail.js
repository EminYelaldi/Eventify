import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import * as Calendar from 'expo-calendar';
import { Ionicons } from '@expo/vector-icons';
import { auth, firestore } from '../../firebaseConfig';
import { doc, updateDoc, arrayUnion, getDoc, setDoc, onSnapshot, writeBatch } from 'firebase/firestore';
import styles from './styles/event-detail.style';
import StarRating from '../components/StarRating';

const EventDetailScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const event = JSON.parse(params.event || '{}');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (!event.id) return;

    const eventDocRef = doc(firestore, 'events', event.id);


    const unsubscribe = onSnapshot(eventDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const eventData = docSnapshot.data();
        const eventComments = eventData.comments || [];
        
        // Yorumları tarihe göre sıralama (en yeni en üstte)
        const sortedComments = [...eventComments].sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        setComments(sortedComments);

        const validRatings = eventComments.filter(comment => 
          comment.rating !== undefined && 
          comment.rating !== null && 
          !isNaN(comment.rating)
        );
        
        if (validRatings.length > 0) {
          const total = validRatings.reduce((sum, comment) => sum + Number(comment.rating), 0);
          const average = (total / validRatings.length).toFixed(1);
          setAverageRating(parseFloat(average));
        } else {
          setAverageRating(0);
        }
      }
    });

    return () => unsubscribe();
  }, [event.id]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          Alert.alert('Hata', 'Lütfen giriş yapın.');
          return;
        }

        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserName(userDoc.data().name || 'Anonim');
        }
      } catch (error) {
        console.error('Kullanıcı adı alınırken hata oluştu:', error.message);
      }
    };

    fetchUserName();
  }, []);

  const handleAddToFavorites = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('Hata', 'Lütfen giriş yapın.');
        return;
      }

      const userDocRef = doc(firestore, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        favoriteEvents: arrayUnion({
          id: event.id,
          title: event.title,
          date: event.date,
          location: event.location,
        }),
      });

      Alert.alert('Başarılı', 'Etkinlik favorilere eklendi!');
    } catch (error) {
      Alert.alert('Hata', `Favorilere ekleme başarısız: ${error.message}`);
    }
  };

  const addReminderToCalendar = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Hata', 'Takvim izni reddedildi.');
        return;
      }

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find((cal) => cal.isPrimary) || calendars[0];

      if (!defaultCalendar) {
        Alert.alert('Hata', 'Varsayılan takvim bulunamadı.');
        return;
      }

      await Calendar.createEventAsync(defaultCalendar.id, {
        title: event.title,
        startDate: new Date(event.date + 'T' + event.time),
        endDate: new Date(new Date(event.date + 'T' + event.time).getTime() + 2 * 60 * 60 * 1000),
        timeZone: 'GMT+3',
        location: event.location || 'Belirtilmedi',
        notes: 'Etkinlik detayları: ' + event.category,
      });

      Alert.alert('Başarılı', 'Etkinlik takvime eklendi!');
    } catch (error) {
      Alert.alert('Hata', `Hatırlatıcı eklenirken hata oluştu: ${error.message}`);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Alert.alert('Hata', 'Yorum boş olamaz.');
      return;
    }

    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('Hata', 'Lütfen giriş yapın.');
        return;
      }

      const timestamp = new Date().toISOString();
      const commentData = {
        comment: newComment,
        rating: Number(rating),
        timestamp: timestamp,
        userId: currentUser.uid,
        userName: userName,
      };

      const eventDocRef = doc(firestore, 'events', event.id);
      const userDocRef = doc(firestore, 'users', currentUser.uid);

      // Firestore Snapshot ile etkinliği kontrol et
      const eventDocSnapshot = await getDoc(eventDocRef);

      if (!eventDocSnapshot.exists()) {
        // Etkinlik yoksa oluştur
        await setDoc(eventDocRef, {
          comments: [commentData], // İlk yorumu dizi olarak ekle
        });
      } else {
        // Etkinlik varsa mevcut yorumları al ve yeni yorumu ekle
        const currentComments = eventDocSnapshot.data().comments || [];
        await updateDoc(eventDocRef, {
          comments: [...currentComments, commentData]
        });
      }

      // Kullanıcı dokümanını güncelle
      await updateDoc(userDocRef, {
        comments: arrayUnion({
          ...commentData,
          eventId: event.id,
          eventTitle: event.title || 'Bilinmeyen Etkinlik',
        }),
      });

      setNewComment('');
      setRating(5);
      Alert.alert('Başarılı', 'Yorum eklendi!');
    } catch (error) {
      console.error('Yorum ekleme hatası:', error);
      Alert.alert('Hata', `Yorum eklenirken hata oluştu: ${error.message}`);
    }
  };


  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={110}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          ><View style = {styles.fixedSection}>
            <Text style={styles.header}>{event.title}</Text>
            {event.image && <Image source={{ uri: event.image }} style={styles.eventImage} />}
            </View>
            {/* Etkinlik Bilgileri */}
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <Ionicons name="calendar-outline" size={24} color="#E9B741" />
                <Text style={styles.infoText}>{event.date}</Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={24} color="#E9B741" />
                <Text style={styles.infoText}>{event.time}</Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={24} color="#E9B741" />
                <Text style={styles.infoText}>{event.location}</Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="pricetag-outline" size={24} color="#E9B741" />
                <Text style={styles.infoText}>{event.category}</Text>
              </View>
              <View style={styles.buttonContainer}>
                {/* Hatırlatıcı Ekle Butonu */}
                <TouchableOpacity style={styles.reminderButton} onPress={addReminderToCalendar}>
                  <Text style={styles.reminderButtonText}>Hatırlatıcı Ekle</Text>
                </TouchableOpacity>

                {/* Favorilere Ekle Butonu */}
                <TouchableOpacity style={styles.favoriteButton} onPress={handleAddToFavorites}>
                  <Text style={styles.favoriteButtonText}>Favorilere Ekle</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Ortalama puan gösterimi için */}
            <View style={styles.averageRatingContainer}>
              <Text style={styles.averageRatingText}>{averageRating}</Text>
              <Text style={styles.averageRatingLabel}>/ 5.0 Ortalama Puan</Text>
            </View>

            {/* Yorum ekleme bölümü için */}
            <View style={styles.commentInputContainer}>
              <View style={styles.ratingInputContainer}>
                <StarRating
                  rating={rating}
                  onRatingChange={setRating}
                  size={24}
                />
              </View>
              <TextInput
                style={styles.commentInput}
                placeholder="Düşüncelerinizi paylaşın..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
                numberOfLines={4}
              />
              <TouchableOpacity style={styles.commentButton} onPress={handleAddComment}>
                <Text style={styles.commentButtonText}>Yorum Ekle</Text>
              </TouchableOpacity>
            </View>

            {/* Yorum kartları için */}
            <View style={styles.commentsSection}>
              <Text style={styles.commentsTitle}>Kullanıcı Yorumları</Text>
              {comments.length > 0 ? (
                comments.map((item, index) => (
                  <View key={index.toString()} style={styles.commentCard}>
                    <Text style={styles.commentUserName}>{item.userName}</Text>
                    <View style={styles.ratingContainer}>
                      <StarRating
                        rating={Number(item.rating)}
                        size={16}
                        disabled={true}
                      />
                    </View>
                    <Text style={styles.commentText}>{item.comment}</Text>
                    <Text style={styles.commentTimestamp}>
                      {new Date(item.timestamp).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Henüz yorum yapılmamış. İlk yorumu siz yapın!</Text>
              )}
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EventDetailScreen;
