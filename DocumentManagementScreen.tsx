import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const DocumentManagementScreen = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/documents');
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
        Alert.alert('Error', 'Failed to load documents. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleUploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (result.type === 'success') {
        setIsUploading(true);
        const fileUri = result.uri;
        const fileName = result.name;
        const fileType = result.mimeType;

        const formData = new FormData();
        formData.append('file', {
          uri: fileUri,
          name: fileName,
          type: fileType,
        });

        const response = await api.post('/documents/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setDocuments([...documents, response.data]);
        Alert.alert('Success', 'Document uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadDocument = async (document) => {
    try {
      const fileUri = `${FileSystem.documentDirectory}${document.name}`;
      const downloadResumable = FileSystem.createDownloadResumable(
        document.url,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          console.log(`Download progress: ${progress * 100}%`);
        }
      );

      const { uri } = await downloadResumable.downloadAsync();
      Alert.alert('Success', `Document downloaded to ${uri}`);
    } catch (error) {
      console.error('Error downloading document:', error);
      Alert.alert('Error', 'Failed to download document. Please try again.');
    }
  };

  const handleShareDocument = async (document) => {
    try {
      const result = await Share.share({
        title: document.name,
        message: `Check out this document: ${document.name}`,
        url: document.url,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared with ${result.activityType}`);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing document:', error);
      Alert.alert('Error', 'Failed to share document. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading documents...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Document Management</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadDocument} disabled={isUploading}>
          {isUploading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons name="cloud-upload-outline" size={24} color="#ffffff" />
          )}
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        {documents.map((document) => (
          <View key={document.id} style={styles.documentItem}>
            <Text style={styles.documentName}>{document.name}</Text>
            <View style={styles.documentActions}>
              <TouchableOpacity onPress={() => handleDownloadDocument(document)}>
                <Ionicons name="download-outline" size={24} color="#0000ff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleShareDocument(document)}>
                <Ionicons name="share-outline" size={24} color="#0000ff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  uploadButton: {
    padding: 8,
    backgroundColor: '#0000ff',
    borderRadius: 4,
  },
  content: {
    padding: 16,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  documentName: {
    fontSize: 16,
  },
  documentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default DocumentManagementScreen;
