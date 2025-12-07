import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignExplanationScreen({ route }) {
  const insets = useSafeAreaInsets();
  const { sign } = route.params || {
    sign: {
      name: 'Stop Sign',
      category: 'Regulatory',
      mutcdCode: 'R1-1',
      explanation:
        'A stop sign indicates you must come to a complete stop and yield to other traffic.',
      penalties: 'Fines and points on driving record',
      stateVariations: [],
    },
  };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{sign.name}</Text>
        <Text style={styles.category}>{sign.category}</Text>
      </View>

      <View style={styles.content}>
        {sign.mutcdCode && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MUTCD Code</Text>
            <Text style={styles.sectionContent}>{sign.mutcdCode}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meaning</Text>
          <Text style={styles.sectionContent}>{sign.explanation}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Penalties</Text>
          <Text style={styles.sectionContent}>{sign.penalties}</Text>
        </View>

        {sign.stateVariations && sign.stateVariations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>State Variations</Text>
            {sign.stateVariations.map((variation, index) => (
              <Text key={index} style={styles.variationText}>
                • {variation}
              </Text>
            ))}
          </View>
        )}
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  category: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  variationText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
});
