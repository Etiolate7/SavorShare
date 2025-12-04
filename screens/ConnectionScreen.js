import { Button, StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { login } from '../reducers/user';
import { FontAwesome } from '@expo/vector-icons';
import RecipesScreen from './RecipesScreen';

export default function ConnectionScreen({ navigation }) {

    const dispatch = useDispatch();

    const [connectionUsername, setConnectionUsername] = useState('');
    const [connectionPassword, setConnectionPassword] = useState('');

    const [error, setError] = useState('');

    const Next = () => {
        fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/users/connection`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: connectionUsername, password: connectionPassword }),
        }).then(response => response.json())
            .then(data => {
                if (data.result) {
                    dispatch(login({
                        token: data.token,
                        username: data.username,
                        email: data.email,
                        profile_picture: data.profile_picture,
                        bio: data.bio,
                        bookmarkedRecipes: data.bookmarkedRecipes,
                    }));
                    setError('');
                    navigation.navigate('TabNavigator')
                } else {
                    console.log(data.error)
                    setError(data.error)
                }
            });
        console.log('button pressed');
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
            <TouchableOpacity style={styles.icon} activeOpacity={0.8} onPress={() => navigation.navigate('Home')}>
                <FontAwesome name="arrow-left" size={25} color="#4A453D" />
            </TouchableOpacity>
            <Text style={styles.title}>Connection</Text>
            <Text style={styles.error}>{error}</Text>
            <TextInput style={styles.input} keyboardType="email-address" onChangeText={(value) => setConnectionUsername(value)} value={connectionUsername} placeholder='Email/Username'></TextInput>
            <TextInput style={styles.input} secureTextEntry={true} onChangeText={(value) => setConnectionPassword(value)} value={connectionPassword} placeholder='Password'></TextInput>
            <TouchableOpacity style={styles.btn} activeOpacity={0.8}>
                <Button
                    style={styles.btnText}
                    title="Go to App"
                    color='white'
                    onPress={() => Next()}
                />
            </TouchableOpacity>
        </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF7E5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '80%',
        backgroundColor: '#FFFBF0',
        borderRadius: 12,
        fontSize: 16,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E8D9BC',
    },
    btn: {
        alignItems: 'center',
        width: '30%',
        backgroundColor: '#5C7A52',
        borderRadius: 10,
        marginTop: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#4A453D',
        marginBottom: 15,
    },
    icon: {
        position: 'absolute',
        top: 70,
        left: 30,
    },
});