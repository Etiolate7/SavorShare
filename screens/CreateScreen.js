import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateScreen({ navigation, recipes, setRecipes }) {
    const [title, setTitle] = useState('');
    const [servings, setServings] = useState('');
    const [time, setTime] = useState('');
    const [ingredients, setIngredients] = useState(['']);
    const [instructions, setInstructions] = useState('');
    const [nationality, setNationality] = useState('');
    const [dishType, setDishType] = useState('Main');

    function saveRecipe() {
        const filteredIngredients = ingredients.filter((ing) => ing.trim() !== '');
        const newRecipe = {
            id: Date.now().toString(),
            title,
            servings,
            time,
            ingredients: filteredIngredients,
            instructions,
            nationality,
            dishType,
        };

        const currentRecipes = recipes || [];
        setRecipes([...currentRecipes, newRecipe]);
        navigation.goBack();
    }

    const updateIngredient = (text, index) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = text;
        setIngredients(newIngredients);
    };

    const addIngredientField = () => {
        setIngredients([...ingredients, '']);
    };

    const dishOptions = ['Main', 'Appetizer', 'Dessert', 'Side', 'Breakfast', 'Beverage'];

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <Text style={styles.title}>Create Your Recipe</Text>
                    
                    <TextInput
                        placeholder="Recipe title"
                        value={title}
                        onChangeText={setTitle}
                        style={styles.input}
                    />
                    <View style={styles.row}>
                        <TextInput
                            placeholder="Servings"
                            value={servings}
                            onChangeText={setServings}
                            keyboardType="numeric"
                            style={[styles.input, styles.halfInput]}
                        />
                        <TextInput
                            placeholder="Time (mins)"
                            value={time}
                            onChangeText={setTime}
                            keyboardType="numeric"
                            style={[styles.input, styles.halfInput]}
                        />
                    </View>

                    <Text style={styles.sectionTitle}>Ingredients</Text>
                    {ingredients.map((ingredient, index) => (
                        <TextInput
                            key={index.toString()}
                            placeholder={`Ingredient #${index + 1}`}
                            value={ingredient}
                            onChangeText={(text) => updateIngredient(text, index)}
                            style={styles.input}
                        />
                    ))}
                    <TouchableOpacity onPress={addIngredientField} style={styles.addButton}>
                        <Text style={styles.addButtonText}>+ Add Ingredient</Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Instructions</Text>
                    <TextInput
                        placeholder="Write step-by-step instructions..."
                        value={instructions}
                        onChangeText={setInstructions}
                        multiline
                        style={[styles.input, styles.textArea]}
                    />

                    <Text style={styles.sectionTitle}>Nationality</Text>
                    <TextInput
                        placeholder="e.g., Italian, French, Japanese"
                        value={nationality}
                        onChangeText={setNationality}
                        style={styles.input}
                    />

                    <Text style={styles.sectionTitle}>Type of Dish</Text>
                    <View style={styles.optionsContainer}>
                        {dishOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                onPress={() => setDishType(option)}
                                style={[
                                    styles.optionButton,
                                    dishType === option && styles.optionButtonSelected,
                                ]}
                            >
                                <Text style={[
                                    styles.optionText,
                                    dishType === option && styles.optionTextSelected,
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={saveRecipe}>
                        <Text style={styles.saveButtonText}>Save Recipe</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingVertical: 20,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2d3436',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 12,
        fontSize: 16,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    halfInput: {
        width: '48%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontWeight: '600',
        fontSize: 18,
        color: '#2d3436',
        marginTop: 20,
        marginBottom: 10,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    addButton: {
        backgroundColor: '#e9ecef',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
    },
    addButtonText: {
        color: '#636e72',
        fontSize: 16,
        fontWeight: '500',
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    optionButton: {
        width: '48%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    optionButtonSelected: {
        backgroundColor: '#00b894',
        borderColor: '#00b894',
    },
    optionText: {
        textAlign: 'center',
        color: '#636e72',
        fontWeight: '500',
    },
    optionTextSelected: {
        color: 'white',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#00b894',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});