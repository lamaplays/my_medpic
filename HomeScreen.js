import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from './style';

const HomeScreen = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [medicationInfo, setMedicationInfo] = useState([]);

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
      const response = await fetch('http://192.168.0.107:5000/api/upload', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = await response.json();
      console.log('API response:', data); // ✅ DEBUG

      if (response.ok) {
        setExtractedText(data.ocr_text || '');
        setMedicationInfo(data.medication_info || []);
        Alert.alert('Success', 'Text extracted successfully.');
      } else {
        Alert.alert('Upload Failed', data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload image.');
    }
  };
    const [expandedCards, setExpandedCards] = useState({});
const toggleExpanded = (index) => {
  setExpandedCards((prev) => ({
    ...prev,
    [index]: !prev[index],
  }));
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Take a picture of your medication</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {image && <Image source={{ uri: image.uri }} style={styles.previewImage} />}

        <TouchableOpacity style={styles.button} onPress={() => pickImage(true)}>
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => pickImage(false)}>
          <Text style={styles.buttonText}>Upload from Phone</Text>
        </TouchableOpacity>

        {extractedText ? (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
              Extracted Text:
            </Text>
            <Text style={{ marginBottom: 20 }}>{extractedText}</Text>

            {medicationInfo && medicationInfo.length > 0 ? (
              <View>
                <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
                  Medication Results:
                </Text>
                {medicationInfo.map((drug, index) => (
  <View
    key={`med-${index}`}
    style={{
      padding: 12,
      marginBottom: 15,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
    }}
  >
    {drug.drug_name && (
      <Text style={{ fontWeight: 'bold' }}>📌 Name: {drug.drug_name}</Text>
    )}
    {drug.generic_name && <Text>💊 Generic: {drug.generic_name}</Text>}
    {drug.medical_condition && <Text>🩺 Condition: {drug.medical_condition}</Text>}
    {drug.drug_classes && <Text>🧪 Drug Class: {drug.drug_classes}</Text>}
    {drug.pregnancy_category && <Text>🚼 Pregnancy Category: {drug.pregnancy_category}</Text>}
    {drug.rx_otc && <Text>💊 Rx/OTC: {drug.rx_otc}</Text>}
    {drug.relevance_score !== undefined && (
      <Text>📈 Relevance Score: {drug.relevance_score}</Text>
    )}

    {/* Side effects with toggle */}
    {drug.side_effects && (
      <Text>
        Side Effects:{' '}
        {expandedCards[index] || drug.side_effects.length <= 100
          ? drug.side_effects
          : `${drug.side_effects.slice(0, 100)}... `}
        {drug.side_effects.length > 100 && (
          <Text
            onPress={() => toggleExpanded(index)}
            style={{ color: 'blue', fontWeight: 'bold' }}
          >
            {expandedCards[index] ? ' See less' : ' See more'}
          </Text>
        )}
      </Text>
    )}

    <Text style={{ color: drug.SFDA_approved === 'Yes' ? 'green' : 'red' }}>
      SFDA Approved: {drug.SFDA_approved}
    </Text>

    {drug.drug_link && (
      <Text style={{ color: 'blue' }}>🔗 Link: {drug.drug_link}</Text>
    )}
  </View>
))}


              </View>
            ) : (
              <Text style={{ marginTop: 10, color: '#999' }}>
                No matching medication found for: {extractedText}
              </Text>
            )}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
