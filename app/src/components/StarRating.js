import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StarRating = ({ 
  rating = 0, 
  size = 20, 
  onRatingChange = null,
  disabled = false 
}) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.starContainer}>
      {stars.map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => !disabled && onRatingChange && onRatingChange(star)}
          disabled={disabled}
        >
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={size}
            color="#E9B741"
            style={styles.star}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    marginHorizontal: 2,
  },
});

export default StarRating;