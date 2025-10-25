import { Button, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, TextInput } from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Home Screen</Text>
            <TextInput style={styles.input} placeholder='Username'></TextInput>
            <TextInput style={styles.input} placeholder='Email'></TextInput>
            <TextInput style={styles.input} placeholder='Password'></TextInput>
            <TouchableOpacity style={styles.btn} activeOpacity={0.8}>
                <Button
                    style={styles.btnText}
                    title="Go to App"
                    color='white'
                    onPress={() => navigation.navigate('TabNavigator')}
                />
            </TouchableOpacity>
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
    input: {
        width: '80%',
        marginTop: 25,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        fontSize: 16,
    },
    btn: {
        alignItems: 'center',
        width: '30%',
        backgroundColor: '#F28080',
        borderRadius: 10,
        marginTop: 20,
    }
});