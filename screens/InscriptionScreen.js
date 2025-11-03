import { Button, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, TextInput } from 'react-native';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { login } from '../reducers/user';
import RecipesScreen from './RecipesScreen';

export default function InscriptionScreen({ navigation }) {

    const dispatch = useDispatch();

    const [inscriptionUsername, setInscriptionUsername] = useState('');
    const [inscriptionPassword, setInscriptionPassword] = useState('');
    const [inscriptionPasswordVerif, setInscriptionPasswordVerif] = useState('');
    const [inscriptionEmail, setInscriptionEmail] = useState('');
    const [error, setError] = useState('');

    const Next = () => {
        fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/users/inscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: inscriptionUsername, email: inscriptionEmail, password: inscriptionPassword, passwordverif: inscriptionPasswordVerif }),
        }).then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.result) {
                    dispatch(login({
                        token: data.token,
                        username: data.username,
                        email: data.email,
                        profile_picture: data.profile_picture,
                    }));
                    setError('');
                    navigation.navigate('TabNavigator')
                } else {
                    console.log(data.error)
                    setError(data.error)
                }

            });

        console.log('button pressed');
        console.log(inscriptionEmail, inscriptionPasswordVerif, inscriptionPassword, inscriptionUsername)
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.icon} activeOpacity={0.8} onPress={() => navigation.navigate('Home')}>
                <FontAwesome name="arrow-left" size={25} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Inscription</Text>
            <Text style={styles.error}>{error}</Text>
            <TextInput style={styles.input} onChangeText={(value) => setInscriptionUsername(value)} value={inscriptionUsername} placeholder='Username'></TextInput>
            <TextInput style={styles.input} onChangeText={(value) => setInscriptionEmail(value)} value={inscriptionEmail} keyboardType="email-address" placeholder='Email'></TextInput>
            <TextInput style={styles.input} secureTextEntry={true} onChangeText={(value) => setInscriptionPassword(value)} value={inscriptionPassword} placeholder='Password'></TextInput>
            <TextInput style={styles.input} secureTextEntry={true} textContentType="oneTimeCode" autoComplete="off" autoCorrect={false} spellCheck={false} onChangeText={(value) => setInscriptionPasswordVerif(value)} value={inscriptionPasswordVerif} placeholder='Confirmation Password'></TextInput>
            <TouchableOpacity style={styles.btn} activeOpacity={0.8}>
                <Button
                    style={styles.btnText}
                    title="Go to App"
                    color='white'
                    onPress={() => Next()}
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
    icon: {
        position: 'absolute',
        top: 70,
        left: 30,
    },
});