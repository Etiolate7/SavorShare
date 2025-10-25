import { Button, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';

export default function CreateScreen({ navigation }) {
 return (
   <View style={styles.container}>
     <Text>Create Screen</Text>
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