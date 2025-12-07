import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MockTestScreen() {
  const insets = useSafeAreaInsets();
  const [activeTest, setActiveTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const tests = [
    { id: 1, name: 'California Full Test', duration: 30, questions: 50 },
    { id: 2, name: 'Warning Signs Quiz', duration: 10, questions: 20 },
    { id: 3, name: 'Road Rules Test', duration: 15, questions: 30 },
  ];

  const mockQuestions = [
    {
      id: 1,
      question: 'What does this sign mean?',
      options: ['Stop', 'Yield', 'Speed Limit', 'No Entry'],
      correct: 0,
    },
    {
      id: 2,
      question: 'What action should you take?',
      options: ['Slow down', 'Stop completely', 'Continue', 'Honk'],
      correct: 1,
    },
  ];

  if (activeTest === null) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Mock Tests</Text>
          <Text style={styles.subtitle}>Practice for your DMV test</Text>
        </View>

        <FlatList
          data={tests}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.testCard}
              onPress={() => setActiveTest(item.id)}
            >
              <View>
                <Text style={styles.testName}>{item.name}</Text>
                <Text style={styles.testMeta}>
                  {item.questions} questions • {item.duration} minutes
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  const question = mockQuestions[currentQuestion];

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.testHeader}>
        <TouchableOpacity onPress={() => setActiveTest(null)}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.progress}>
          Question {currentQuestion + 1} of {mockQuestions.length}
        </Text>
        <Text style={styles.score}>Score: {score}</Text>
      </View>

      <View style={styles.testContent}>
        <Text style={styles.question}>{question.question}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => {
                if (index === question.correct) {
                  setScore(score + 1);
                }
                if (currentQuestion < mockQuestions.length - 1) {
                  setCurrentQuestion(currentQuestion + 1);
                } else {
                  setActiveTest(null);
                }
              }}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  testCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  testMeta: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
  arrow: {
    fontSize: 20,
    color: '#007AFF',
  },
  testHeader: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  progress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  score: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
  },
  testContent: {
    padding: 20,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
});
