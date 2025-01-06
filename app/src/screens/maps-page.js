import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import styles from './styles/maps-page.style';

const TICKETMASTER_API_KEY = 'XSl4KfXZLzzTHF9jfGJlxfLif2lCA8Im';

const DEFAULT_REGION = {
  latitude: 39.92077,
  longitude: 32.85411,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
};

const MapScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [initialRegionSet, setInitialRegionSet] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (params?.event) {
      try {
        const parsedEvent = JSON.parse(params.event);
        setSelectedEvent(parsedEvent);
      } catch (error) {
        console.error('Etkinlik Parametre Hatası:', error.message);
      }
    }
  }, [params?.event]);

  useEffect(() => {
    if (selectedEvent) {
      if (mapRef.current && !initialRegionSet) {
        mapRef.current.animateToRegion(
          {
            latitude: selectedEvent.coordinates.latitude,
            longitude: selectedEvent.coordinates.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
        setInitialRegionSet(true);
      }

      const fetchNearbyEvents = async () => {
        try {
          const response = await axios.get(
            'https://app.ticketmaster.com/discovery/v2/events.json',
            {
              params: {
                apikey: TICKETMASTER_API_KEY,
                latlong: `${selectedEvent.coordinates.latitude},${selectedEvent.coordinates.longitude}`,
                radius: 50,
                size: 10,
              },
            }
          );

          const nearby = response.data._embedded?.events.map((event) => ({
            id: event.id,
            title: event.name,
            coordinates: event._embedded?.venues[0]?.location
              ? {
                  latitude: parseFloat(event._embedded.venues[0].location.latitude),
                  longitude: parseFloat(event._embedded.venues[0].location.longitude),
                }
              : null,
          })) || [];

          setNearbyEvents(nearby.filter(e => e.id !== selectedEvent.id));
        } catch (error) {
          console.error('Yakındaki Etkinlikleri Alma Hatası:', error.message);
        }
      };

      fetchNearbyEvents();
    }
  }, [selectedEvent]);

  const openGoogleMaps = (destination) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;
    Linking.openURL(url).catch((err) => {
      Alert.alert('Hata', 'Google Maps açılamadı.');
      console.error('Google Maps Hatası:', err);
    });
  };

  return (
    <View style={styles.container}>

          <Text style={[styles.header, { fontFamily: 'BebasNeue' }]}>ETKİNLİK HARİTASI</Text>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={
          selectedEvent
            ? {
                latitude: selectedEvent.coordinates.latitude,
                longitude: selectedEvent.coordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : DEFAULT_REGION
        }
      >
        {selectedEvent && (
          <Marker
            coordinate={selectedEvent.coordinates}
            title={selectedEvent.title}
            pinColor="#E9B741"
          />
        )}

        {nearbyEvents.map((event) => (
          event.coordinates && (
            <Marker
              key={event.id}
              coordinate={event.coordinates}
              title={event.title}
              pinColor="#E5E5E5"
            />
          )
        ))}
      </MapView>

      {selectedEvent && (
        <View style={styles.eventDetails}>
          <Text style={styles.eventTitle}>{selectedEvent.title}</Text>
          <TouchableOpacity
            style={styles.navigationButton}
            onPress={() => openGoogleMaps(selectedEvent.coordinates)}
          >
            <Text style={styles.navigationText}>Yol Tarifi Al</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sabit Başlık ve Kaydırılabilir Liste */}
      <Text style={styles.nearbyHeader}>Yakındaki Etkinlikler</Text>
      <FlatList
        data={nearbyEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.nearbyEventCard}>
            <Text style={styles.nearbyEventTitle}>{item.title}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
};



export default MapScreen;