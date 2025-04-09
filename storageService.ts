import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export const storageService = {
  uploadFile: async (fileUri: string, folder: string, fileName: string) => {
    try {
      // Convert file to base64
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Get file extension
      const fileExt = fileUri.split('.').pop();
      const path = `${folder}/${fileName}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(path, decode(base64), {
          contentType: Platform.select({
            ios: 'application/octet-stream',
            android: 'application/octet-stream',
          }),
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  deleteFile: async (fileUrl: string) => {
    try {
      const path = fileUrl.split('/').pop();
      if (!path) throw new Error('Invalid file URL');

      const { error } = await supabase.storage
        .from('documents')
        .remove([path]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  listFiles: async (folder: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .list(folder);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  },
};

// Helper function to decode base64
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
} 