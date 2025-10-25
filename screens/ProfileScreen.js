import { Button, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';

export default function ProfileScreen({ navigation }) {
 return (
   <View style={styles.container}>
     <Text>Profile Screen</Text>
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