import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import LearningScreen from './src/screens/LearningScreen';

const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'black',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});

const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

export default function App() {
  const optionsHeader = ({ navigation }) => ({
    title: "",
    headerLeft: () => (
      <CustomButton
        onPress={() => navigation.navigate('Home')}
        title="Home"
      />
    ),
    headerRight: () => (
      <>
        <CustomButton
          onPress={() => navigation.navigate('Hiragana')}
          title="Hiragana"
        />
        <CustomButton
          onPress={() => navigation.navigate('Katakana')}
          title="Katakana"
        />
      </>
    ),
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={optionsHeader} />
        <Stack.Screen name="Hiragana" options={optionsHeader}>
          {(props) => <LearningScreen {...props} letterType="h" />}
        </Stack.Screen>
        <Stack.Screen name="Katakana" options={optionsHeader}>
          {(props) => <LearningScreen {...props} letterType="k" />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>

  );
}
