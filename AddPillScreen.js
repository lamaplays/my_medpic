import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import styles from './style';

const AddPillScreen = () => {
  const [pillData, setPillData] = useState({
    name: '',
    amount: '',
    duration: '',
    time: '',
    repeat: '',
  });

  const handleChange = (key, value) => {
    setPillData({ ...pillData, [key]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://192.168.0.106:5000/api/pills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // include auth token if your backend uses it
        },
        body: JSON.stringify(pillData),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Pill added to schedule.');
        setPillData({ name: '', amount: '', duration: '', time: '', repeat: '' });
      } else {
        Alert.alert('Error', data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add pill.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Medication</Text>

      {['name', 'amount', 'duration', 'time', 'repeat'].map((field) => (
        <TextInput
          key={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={pillData[field]}
          onChangeText={(value) => handleChange(field, value)}
          style={styles.input}
          keyboardType={field === 'amount' || field === 'duration' ? 'numeric' : 'default'}
        />
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Add to Schedule</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddPillScreen;
