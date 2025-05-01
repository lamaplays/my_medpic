import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import styles from './style'; // assuming style.js is in the same folder
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.0.107:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Login successful:', data);
        navigation.navigate('Home'); // optional
      } else {
        Alert.alert('Login Failed', data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    }
  };

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Login</Text>

    <TextInput
      style={styles.input}
      placeholder="email"
      value={email}
      onChangeText={setEmail}
      autoCapitalize="none"
    />


  <View
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    height: 48,
  }}
>
  <TextInput
    style={{
      flex: 1,
      fontSize: 16,
      color: '#000',
      paddingVertical: 0,
    }}
    placeholder="Password"
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!showPassword}
  />
  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
    <Ionicons
      name={showPassword ? 'eye-off' : 'eye'}
      size={22}
      color="#999"
    />
  </TouchableOpacity>
</View>


     

    <TouchableOpacity style={styles.button} onPress={handleLogin}>
      <Text style={styles.buttonText}>Log In</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
    <Text style={styles.link}>Don't have an account? Sign up</Text>
    </TouchableOpacity>
    </View> 
  );
};

export default LoginScreen;