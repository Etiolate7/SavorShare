import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import { useState } from 'react';

export default function CreateScreen({ navigation, recipes, setRecipes }) {

    const [title, setTitle] = useState('');
    const [servings, setServings] = useState('');
    const [time, setTime] = useState('');

    function saveRecipe() {
        const newRecipe = {
            id: Date.now().toString(),
            title,
            servings,
            time,
        };

        setRecipes([...recipes, newRecipe]);
        navigation.goBack();
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <TextInput
                    placeholder="Recipe title"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Servings"
                    value={servings}
                    onChangeText={setServings}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <TextInput
                    placeholder="Time (mins)"
                    value={time}
                    onChangeText={setTime}
                    keyboardType="numeric"
                    style={styles.input}
                />

                <View style={{ marginTop: 20 }}>
                    <Button title="Save Recipe" onPress={saveRecipe} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        width: '80%',
        marginTop: 25,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        fontSize: 16,
    },
});