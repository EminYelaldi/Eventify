import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../../../firebaseConfig';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import styles from '../styles/event-page.style';
import { Ionicons } from '@expo/vector-icons';

const TICKETMASTER_API_KEY = 'XSl4KfXZLzzTHF9jfGJlxfLif2lCA8Im';

const EventsScreen = () => {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState({ latitude: 39.92077, longitude: 32.85411 });
  const hasFetchedLocation = useRef(false);

  const categories = [
    { label: 'Tümü', keys: null },
    { label: 'Müzik', keys: ['Music'] },
    { label: 'Spor', keys: ['Sports'] },
    { label: 'Sanat', keys: ['Arts & Theatre', 'Art'] },
    { label: 'Teknoloji', keys: ['Technology', 'Tech'] },
  ];

  useEffect(() => {
    const fetchUserLocation = async () => {
      if (hasFetchedLocation.current) return;
      hasFetchedLocation.current = true;

      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.error('Kullanıcı oturumu bulunamadı.');
          return;
        }

        // Önce Firebase'den kullanıcının mevcut konum bilgisini kontrol et
        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists() && userDoc.data().location) {
          // Kullanıcının kayıtlı konumu varsa onu kullan
          setUserLocation(userDoc.data().location);
          return;
        }

        // Kayıtlı konum yoksa, kullanıcıya sor
        const userResponse = await new Promise((resolve) => {
          Alert.alert(
            'Konum İzni',
            'Size yakın etkinlikleri gösterebilmemiz için konum bilginize ihtiyacımız var. Konum bilginizi paylaşmak ister misiniz?',
            [
              {
                text: 'Hayır',
                onPress: () => resolve(false),
                style: 'cancel',
              },
              {
                text: 'Evet',
                onPress: () => resolve(true),
              },
            ],
            { cancelable: false }
          );
        });

        if (!userResponse) {
          Alert.alert(
            'Bilgi',
            'Konum izni vermediğiniz için varsayılan konumu kullanacağız. İstediğiniz zaman ayarlardan konum izni verebilirsiniz.'
          );
          const defaultLocation = { latitude: 39.92077, longitude: 32.85411 };
          await updateDoc(userDocRef, {
            location: defaultLocation,
            lastLocationUpdate: new Date().toISOString()
          });
          setUserLocation(defaultLocation);
          return;
        }

        const { status } = await requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await getCurrentPositionAsync({});
          const userLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          // Kullanıcının konumunu Firebase'e kaydet
          await updateDoc(userDocRef, {
            location: userLocation,
            lastLocationUpdate: new Date().toISOString()
          });

          setUserLocation(userLocation);
          Alert.alert(
            'Başarılı',
            'Konum bilginiz başarıyla kaydedildi. Artık size yakın etkinlikleri görebilirsiniz.'
          );
        } else {
          console.error('Konum izni reddedildi.');
          Alert.alert(
            'Konum İzni Gerekli',
            'Yakınınızdaki etkinlikleri görebilmek için konum izni vermeniz gerekmektedir. Lütfen ayarlardan konum iznini etkinleştirin.'
          );
        }
      } catch (error) {
        console.error('Kullanıcı konumunu alma hatası:', error.message);
        Alert.alert(
          'Hata',
          'Konum bilgisi alınırken bir hata oluştu. Lütfen tekrar deneyin.'
        );
      }
    };

    fetchUserLocation();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        const response = await axios.get('https://app.ticketmaster.com/discovery/v2/events.json', {
          params: {
            apikey: TICKETMASTER_API_KEY,
            keyword: '',
            latlong: `${userLocation.latitude},${userLocation.longitude}`,
            radius: 50,
            size: 20,
          },
        });

        const eventData =
          response.data._embedded?.events.map((event) => ({
            id: event.id,
            title: event.name,
            category: event.classifications[0]?.segment?.name || 'Diğer',
            date: event.dates.start.localDate,
            time: event.dates.start.localTime || 'Belirtilmemiş',
            location: event._embedded?.venues[0]?.address?.line1 || 'Bilinmiyor',
            image: event.images?.[0]?.url || null,
            coordinates: event._embedded?.venues[0]?.location
              ? {
                  latitude: parseFloat(event._embedded.venues[0].location.latitude),
                  longitude: parseFloat(event._embedded.venues[0]?.location.longitude),
                }
              : null,
          })) || [];

        setEvents(eventData);
        setFilteredEvents(eventData);
      } catch (error) {
        console.error('Ticketmaster API Hatası:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userLocation]);

  useEffect(() => {
    let updatedEvents = events;

    if (searchQuery) {
      updatedEvents = updatedEvents.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'Tümü') {
      const categoryKeys = categories.find((cat) => cat.label === selectedCategory)?.keys || [];
      updatedEvents = updatedEvents.filter((event) => categoryKeys.includes(event.category));
    }

    setFilteredEvents(updatedEvents);
  }, [searchQuery, selectedCategory, events]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Etkinlikler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Etkinlik ara..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>

        <View style={styles.categoryContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.label}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.label && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(category.label)}
              >
                <Text 
                  style={[
                    styles.categoryText,
                    selectedCategory === category.label && styles.selectedCategoryText,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.eventCard}>
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={styles.eventImage}
                  resizeMode="cover"
                />
              )}
              <Text style={styles.eventTitle}>{item.title}</Text>
              
              <View style={styles.eventInfoContainer}>
                <Ionicons name="calendar" size={16} style={styles.eventInfoIcon} />
                <Text style={styles.eventInfoText}>{item.date}</Text>
              </View>
              
              <View style={styles.eventInfoContainer}>
                <Ionicons name="time" size={16} style={styles.eventInfoIcon} />
                <Text style={styles.eventInfoText}>{item.time}</Text>
              </View>
              
              <View style={styles.eventInfoContainer}>
                <Ionicons name="pricetag" size={16} style={styles.eventInfoIcon} />
                <Text style={styles.eventInfoText}>{item.category}</Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.mapButton}
                  onPress={() =>
                    router.push({
                      pathname: '/src/screens/maps-page',
                      params: { event: JSON.stringify(item) },
                    })
                  }
                >
                  <Text style={styles.buttonText}>Haritada Göster</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.detailButton}
                  onPress={() =>
                    router.push({
                      pathname: '/src/screens/event-detail',
                      params: { event: JSON.stringify(item) },
                    })
                  }
                >
                  <Text style={styles.buttonText}>Etkinlik Detayı</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Etkinlik bulunamadı.</Text>
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default EventsScreen;