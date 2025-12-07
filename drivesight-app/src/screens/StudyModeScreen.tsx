import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StudyModeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedState, setSelectedState] = useState(null);

  const states = [
    { id: 'CA', name: 'California' },
    { id: 'NY', name: 'New York' },
    { id: 'TX', name: 'Texas' },
    { id: 'FL', name: 'Florida' },
  ];

  const signCategories = [
    { id: 1, name: 'Warning Signs', count: 45 },
    { id: 2, name: 'Regulatory Signs', count: 38 },
    { id: 3, name: 'Guide Signs', count: 25 },
    { id: 4, name: 'Temporary Signs', count: 12 },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Study Mode</Text>
        <Text style={styles.subtitle}>Select a state to begin</Text>
      </View>

      {!selectedState ? (
        <FlatList
          data={states}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.stateCard}
              onPress={() => setSelectedState(item.id)}
            >
              <Text style={styles.stateCardTitle}>{item.name}</Text>
              <Text style={styles.stateCardSubtitle}>→</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.categoriesContainer}>
          <TouchableOpacity onPress={() => setSelectedState(null)}>
            <Text style={styles.backButton}>← Back to States</Text>
          </TouchableOpacity>

          <FlatList
            data={signCategories}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.categoriesContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() =>
                  navigation.navigate('SignExplanation', { categoryId: item.id })
                }
              >
                <Text style={styles.categoryTitle}>{item.name}</Text>
                <Text style={styles.categoryCount}>{item.count} signs</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  stateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stateCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  stateCardSubtitle: {
    fontSize: 24,
    color: '#007AFF',
  },
  categoriesContainer: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 16,
    fontWeight: '500',
  },
  categoriesContent: {
    paddingBottom: 20,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: '#666666',
  },
});
