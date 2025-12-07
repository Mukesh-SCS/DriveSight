import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { CameraIcon, GalleryIcon } from '@components/Icons';

export default function SignScanScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async (imageUri) => {
    setLoading(true);
    try {
      // TODO: Call AI API to identify sign
      // For now, navigate to mock result
      setTimeout(() => {
        navigation.navigate('ScanResult', {
          sign: {
            name: 'Stop Sign',
            category: 'Regulatory',
            explanation: 'Stop signs indicate a complete stop...',
            penalties: 'Running a stop sign is a traffic violation...',
          },
        });
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan a Sign</Text>
        <Text style={styles.subtitle}>Use your camera or upload a photo</Text>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Analyzing sign...</Text>
        </View>
      )}

      {selectedImage && !loading && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.preview} />
        </View>
      )}

      {!loading && !selectedImage && (
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
            <GalleryIcon size={40} color="#007AFF" />
            <Text style={styles.actionButtonText}>Pick from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.cameraButton]}>
            <CameraIcon size={40} color="#FFFFFF" />
            <Text style={[styles.actionButtonText, styles.cameraButtonText]}>
              Take a Photo
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedImage && !loading && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setSelectedImage(null)}
          >
            <Text style={styles.resetButtonText}>Try Another</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
  previewContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  preview: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  actionContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 30,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  cameraButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 12,
  },
  cameraButtonText: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  resetButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});
