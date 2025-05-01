import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import HomeScreen from './HomeScreen';
import AddPillScreen from './AddPillScreen';       // 👈 add this
import ScheduleScreen from './ScheduleScreen';     // 👈 add this

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Add Pill" component={AddPillScreen} />       
        <Stack.Screen name="Schedule" component={ScheduleScreen} />     
      </Stack.Navigator>
    </NavigationContainer>
  );
}
