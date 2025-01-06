import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const FavoritePage = () => {
  const favoriteEvents = [
    { id: '1', title: 'Konser Etkinliği' },
    { id: '2', title: 'Spor Etkinliği' },
    { id: '3', title: 'Sanat Galerisi' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favori Etkinlikler</Text>
      <FlatList
        data={favoriteEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f4f4' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: { padding: 16, backgroundColor: '#fff', borderRadius: 8, marginBottom: 8 },
  cardText: { fontSize: 16, fontWeight: 'bold' },
});

export default FavoritePage;