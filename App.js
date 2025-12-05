// App.js
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';

import HomeScreen from './screens/HomeScreen';
import CreateScreen from './screens/CreateScreen';
import RecipesScreen from './screens/RecipesScreen';
import ProfileScreen from './screens/ProfileScreen';
import RecipeDetailsScreen from './screens/RecipeDetailsScreen';
import InscriptionScreen from './screens/InscriptionScreen';
import ConnectionScreen from './screens/ConnectionScreen';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [recipes, setRecipes] = useState([]);

  const addRecipe = (newRecipe) => {
    setRecipes([...recipes, newRecipe]);
  };

  const TabNavigator = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Recipes') iconName = 'hamburger';
          else if (route.name === 'Create') iconName = 'plus';
          else if (route.name === 'Profile') iconName = 'user-alt';

          return <FontAwesome5 name={iconName} size={20} color={color} solid />;
        },
        tabBarActiveTintColor: '#C43A32',
        tabBarInactiveTintColor: '#403131',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Recipes">
        {(props) => (
          <RecipesScreen
            {...props}
            recipes={recipes}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Create">
        {(props) => (
          <CreateScreen {...props} recipes={recipes} setRecipes={setRecipes} />
        )}
      </Tab.Screen>

      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} recipes={recipes} />}
      </Tab.Screen>

    </Tab.Navigator>
  );

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
            <Stack.Screen name="Inscription" component={InscriptionScreen} />
            <Stack.Screen name="Connection" component={ConnectionScreen} />
            <Stack.Screen name="RecipeDetails">
              {(props) => (
                <RecipeDetailsScreen
                  {...props}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
