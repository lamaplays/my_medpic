import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const response = await fetch('http://192.168.0.102:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", data.message, [
          { text: "Go to Login", onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert("Signup Failed", data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        placeholder="email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignup} />
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Already have an account? Login</Text>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  title: {
    fontSize: 24, marginBottom: 20,
  },
  input: {
    width: '100%', borderWidth: 1, borderColor: '#ccc', padding: 10,
    marginBottom: 10, borderRadius: 5,
  },
  link: {
    marginTop: 15, color: 'blue',
  }
});
