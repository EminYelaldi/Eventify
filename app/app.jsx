import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import FrontPage from './src/screens/front-page';

const App = () => {

  return (
    <SafeAreaView style={styles.container}>
      <FrontPage />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  }
});

export default App;