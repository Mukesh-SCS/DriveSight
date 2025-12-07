import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const features = [
    {
      id: 1,
      title: 'Study Mode',
      description: 'Learn traffic signs and rules by state',
      color: '#007AFF',
    },
    {
      id: 2,
      title: 'Scan Signs',
      description: 'Use AI to identify signs from photos',
      color: '#34C759',
    },
    {
      id: 3,
      title: 'Mock Tests',
      description: 'Practice with timed DMV-style tests',
      color: '#FF9500',
    },
    {
      id: 4,
      title: 'Performance',
      description: 'Track your progress and weak areas',
      color: '#FF3B30',
    },
  ];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>DriveSight</Text>
        <Text style={styles.subtitle}>AI-Powered Traffic Sign Recognition</Text>
      </View>

      <View style={styles.content}>
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={[styles.card, { borderLeftColor: feature.color }]}
            onPress={() => {
              if (feature.id === 1) navigation.navigate('Study');
              else if (feature.id === 2) navigation.navigate('Scan');
              else if (feature.id === 3) navigation.navigate('Test');
            }}
          >
            <Text style={styles.cardTitle}>{feature.title}</Text>
            <Text style={styles.cardDescription}>{feature.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
  },
});
