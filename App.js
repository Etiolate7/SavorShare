import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';

import HomeScreen from './screens/HomeScreen';
import CreateScreen from './screens/CreateScreen';
import RecipesScreen from './screens/RecipesScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  const [recipes, setRecipes] = useState([]);

const TabNavigator = () => {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = '';

            if (route.name === 'Recipes') {
              iconName = 'hamburger';
            } else if (route.name === 'Create') {
              iconName = 'plus';
            } else if (route.name === 'Profile') {
              iconName = 'user-alt';
            }

            return <FontAwesome5 name={iconName} size={20} color={color} />;
          },
          tabBarActiveTintColor: '#F03737',
          tabBarInactiveTintColor: '#574040',
          headerShown: false,
        })}
      >

        <Tab.Screen name="Recipes">
          {(props) => <RecipesScreen {...props} recipes={recipes} />}
        </Tab.Screen>
        <Tab.Screen name="Create">
          {(props) => <CreateScreen {...props} recipes={recipes} setRecipes={setRecipes} />}
        </Tab.Screen>
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
  );
}

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
