import { Button, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, TextInput } from 'react-native';

export default function HomeScreen({ navigation }) {

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.btn} activeOpacity={0.8}>
                <Button
                    style={styles.btnText}
                    title="Connection"
                    color='white'
                    onPress={() => navigation.navigate('Connection')}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} activeOpacity={0.8}>
                <Button
                    style={styles.btnText}
                    title="Inscription"
                    color='white'
                    onPress={() => navigation.navigate('Inscription')}
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
    btn: {
        alignItems: 'center',
        width: '30%',
        backgroundColor: '#C43A32',
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