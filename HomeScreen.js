import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from './style';

const HomeScreen = () => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera access is needed.');
      }
    })();
  }, []);

  const pickImage = async (fromCamera = false) => {
    let result;
    if (fromCamera) {
      result = await ImagePicker.launchCameraAsync({ quality: 0.5, base64: false });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({ quality: 0.5, base64: false });
    }

    if (!result.canceled) {
      const pickedImage = result.assets[0];
      setImage(pickedImage);
      uploadImage(pickedImage.uri);
    }
  };

  const uploadImage = async (uri) => {
    const localUri = uri;
    const filename = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename ?? '');
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append('file', {
      uri: localUri,
      name: filename,
      type,
    });

    try {
      const response = await fetch('http://192.168.0.110:5000/upload', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = await response.text();
      Alert.alert('Upload Complete', 'Image successfully sent to server.');
      console.log(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to upload image.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Take a picture of your medication</Text>

      {image && <Image source={{ uri: image.uri }} style={styles.previewImage} />}

      <TouchableOpacity style={styles.button} onPress={() => pickImage(true)}>
        <Text style={styles.buttonText}>Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => pickImage(false)}>
        <Text style={styles.buttonText}>Upload from Phone</Text>
      </TouchableOpacity>

      {/* Add additional tabs here later */}
    </View>
    
  );
};

export default HomeScreen;
