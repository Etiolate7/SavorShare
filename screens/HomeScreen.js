import { Button, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';

export default function HomeScreen({ navigation }) {
 return (
   <View style={styles.container}>
     <Text>Home Screen</Text>
     <Button
       title="Go to App"
       onPress={() => navigation.navigate('TabNavigator')}
     />
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