import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import styles from './style';

const ScheduleScreen = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedule = async () => {
    try {
      const response = await fetch('http://192.168.0.106:5000/api/schedule', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers here if required
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSchedule(data);
      } else {
        Alert.alert('Error', data.message || 'Failed to load schedule.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not fetch schedule.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Medication Schedule</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : schedule.length === 0 ? (
        <Text style={{ color: '#666' }}>No pills scheduled yet.</Text>
      ) : (
        schedule.map((pill, index) => (
          <View key={index} style={{ marginBottom: 16, padding: 12, backgroundColor: '#fff', borderRadius: 8, borderColor: '#ddd', borderWidth: 1 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{pill.name}</Text>
            <Text>Amount: {pill.amount}</Text>
            <Text>Duration: {pill.duration} days</Text>
            <Text>Time: {pill.time}</Text>
            <Text>Repeat: {pill.repeat}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default ScheduleScreen;
