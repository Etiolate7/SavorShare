import { Button, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';

export default function RecipesScreen({ navigation }) {
 return (
   <View style={styles.container}>
     <Text>Recipes Screen</Text>
   </View>
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