import { Button, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, TextInput } from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
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
        backgroundColor: 'white',
        borderRadius: 12,
        fontSize: 16,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    btn: {
        alignItems: 'center',
        width: '30%',
        backgroundColor: '#ef5800',
        borderRadius: 10,
        marginTop: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#2d3436',
        marginBottom: 15,
    },
});