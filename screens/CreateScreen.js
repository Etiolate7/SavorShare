import { Button, StyleSheet, Text, TextInput, Modal, View, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Image } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

export default function CreateScreen({ navigation, recipes, setRecipes }) {
    const [title, setTitle] = useState('');
    const [servings, setServings] = useState('');
    const [time, setTime] = useState('');
    const [ingredients, setIngredients] = useState([
        { quantity: '', unit: '', name: '' }
    ]);
    const [instructions, setInstructions] = useState(['']);
    const [nationality, setNationality] = useState('Other');
    const [dishType, setDishType] = useState('Main');

    const [errorTitle, setErrorTitle] = useState('');
    const [errorIngredients, setErrorIngredients] = useState('');
    const [errorInstructions, setErrorInstructions] = useState('');

    const [likedRecipes, setLikedRecipes] = useState([]);

    const [image, setImage] = useState(null);

const unitOptions = [
        { label: 'kg (kilograms)', value: 'kg' },
        { label: 'g (grams)', value: 'g' },
        { label: 'mg (milligrams)', value: 'mg' },
        { label: 'L (liters)', value: 'L' },
        { label: 'cl (centiliters)', value: 'cl' },
        { label: 'ml (milliliters)', value: 'ml' },
    ];

    const [showUnitPicker, setShowUnitPicker] = useState(false);
    const [currentIngredientIndex, setCurrentIngredientIndex] = useState(0);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    function saveRecipe() {

        setErrorTitle('');
        setErrorIngredients('');
        setErrorInstructions('');

        if (!title.trim()) {
            setErrorTitle('Recipe title is required');
            setTimeout(() => {
                setErrorTitle('');
            }, 3000);
            return;
        }

        const filteredIngredients = ingredients.filter(ing => ing.name.trim() !== '');
        if (filteredIngredients.length === 0) {
            setErrorIngredients('At least one ingredient is required');
            setTimeout(() => {
                setErrorIngredients('');
            }, 3000);
            return;
        }

        const filteredInstructions = instructions.filter(step => step.trim() !== '');
        if (filteredInstructions.length === 0) {
            setErrorInstructions('At least one instruction step is required');
            setTimeout(() => {
                setErrorInstructions('');
            }, 3000);
            return;
        }

        const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
        const newRecipe = {
            id: Date.now().toString(),
            title: formattedTitle,
            servings,
            time,
            ingredients: filteredIngredients,
            instructions: filteredInstructions,
            nationality,
            dishType,
            image: image,
        };

        const currentRecipes = recipes || [];
        setRecipes([...currentRecipes, newRecipe]);
        navigation.goBack();
    }

    const updateIngredient = (index, field, value) => {
        const updated = [...ingredients];
        updated[index][field] = value;
        setIngredients(updated);

        if (field === 'name' && value.trim() !== '') {
            setErrorIngredients('');
        }
    };

    const addIngredientField = () => {
        setIngredients([...ingredients, { quantity: '', unit: '', name: '' }]);
        setErrorIngredients('');
    };

    const updateInstruction = (text, index) => {
        const newSteps = [...instructions];
        newSteps[index] = text;
        setInstructions(newSteps);

        if (text.trim() !== '') {
            setErrorInstructions('');
        }
    };

    const addInstructionField = () => {
        setInstructions([...instructions, '']);
        setErrorInstructions('');
    };


    const dishOptions = ['Main', 'Appetizer', 'Dessert', 'Side', 'Breakfast', 'Beverage'];

    const nationalityOptions = ['Asian', 'North American', 'South American', 'African', 'Middle Eastern', 'European', 'Oceanian', 'Other'];

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} nestedScrollEnabled={true}>
                <View style={styles.container}>
                    <Text style={styles.title}>Create Your Recipe</Text>

                    <TextInput
                        placeholder="Recipe title"
                        value={title}
                        onChangeText={(text) => {
                            setTitle(text);
                            if (text.trim() !== '') {
                                setErrorTitle('');
                            }
                        }}
                        style={[styles.input, errorTitle ? styles.inputError : null]}
                    />
                    {errorTitle ? <Text style={styles.errorText}>{errorTitle}</Text> : null}

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

                    <Text style={styles.sectionTitle}>Recipe Image</Text>
                    <View style={styles.imageContainer}>
                        {image && (
                            <Image source={{ uri: image }} style={styles.imagePreview} />
                        )}
                        <View style={styles.imageButtons}>
                            <TouchableOpacity onPress={takePhoto} style={styles.imageButton}>
                                <FontAwesome5 style={styles.icon} name="camera" size={20} color="grey" solid />
                                <Text style={styles.imageButtonText}>Take Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
                                <FontAwesome5 style={styles.icon} name="image" size={20} color="grey" solid />
                                <Text style={styles.imageButtonText}>Choose from Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Ingredients</Text>
                    {ingredients.map((item, index) => (
                        <View key={index.toString()} style={styles.ingredientRow}>
                            <TextInput
                                placeholder="Qty"
                                value={item.quantity}
                                onChangeText={(text) => updateIngredient(index, 'quantity', text)}
                                style={[styles.input, styles.qtyInput]}
                                keyboardType="numeric"
                            />

                            <TouchableOpacity
                                style={styles.pickerContainer}
                                onPress={() => {
                                    setCurrentIngredientIndex(index);
                                    setShowUnitPicker(true);
                                }}
                            >
                                <View style={styles.row}>
                                <Text style={styles.pickerText}>
                                    {item.unit || 'Unit'}
                                </Text>
                                <FontAwesome5 style={styles.chevron} name="chevron-down" size={12} color={'#C7C7C7'}/>
                                </View>
                            </TouchableOpacity>

                            <TextInput
                                placeholder="Ingredient"
                                value={item.name}
                                onChangeText={(text) => updateIngredient(index, 'name', text)}
                                style={[styles.input, styles.nameInput]}
                            />
                        </View>
                    ))}
                    {errorIngredients ? <Text style={styles.errorText}>{errorIngredients}</Text> : null}
                    <TouchableOpacity onPress={addIngredientField} style={styles.addButton}>
                        <Text style={styles.addButtonText}>+ Add Ingredient</Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Instructions</Text>
                    {instructions.map((step, index) => (
                        <TextInput
                            key={index.toString()}
                            placeholder={`Step ${index + 1}`}
                            value={step}
                            onChangeText={(text) => updateInstruction(text, index)}
                            multiline
                            style={[styles.input, styles.instructionInput]}
                        />
                    ))}
                    {errorInstructions ? <Text style={styles.errorText}>{errorInstructions}</Text> : null}
                    <TouchableOpacity onPress={addInstructionField} style={styles.addButton}>
                        <Text style={styles.addButtonText}>＋ Add Step</Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Nationality</Text>
                    <View style={styles.optionsContainer}>
                        {nationalityOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                onPress={() => setNationality(option)}
                                style={[
                                    styles.optionButton,
                                    nationality === option && styles.optionButtonSelected,
                                ]}
                            >
                                <Text style={[
                                    styles.optionText,
                                    nationality === option && styles.optionTextSelected,
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

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

                    <TouchableOpacity style={styles.saveButton} onPress={saveRecipe} likedRecipes={likedRecipes}
                        setLikedRecipes={setLikedRecipes}>
                        <Text style={styles.saveButtonText}>Save Recipe</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Modal
                visible={showUnitPicker}
                transparent={true}
                animationType="slide"
            >
                <TouchableWithoutFeedback onPress={() => setShowUnitPicker(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Unit</Text>
                                {unitOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={styles.modalOption}
                                        onPress={() => {
                                            updateIngredient(currentIngredientIndex, 'unit', option.value);
                                            setShowUnitPicker(false);
                                        }}
                                    >
                                        <Text style={styles.modalOptionText}>{option.label}</Text>
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity
                                    style={styles.modalClose}
                                    onPress={() => setShowUnitPicker(false)}
                                >
                                    <Text style={styles.modalCloseText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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
    inputError: {
        borderColor: '#ff6b6b',
        borderWidth: 2,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 10,
        marginLeft: 5,
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
        backgroundColor: '#ef5800',
        borderColor: '#ef5800',
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
        backgroundColor: '#ef5800',
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
    qtyInput: {
        width: '20%',
    },
    nameInput: {
        width: '55%',
    },
    ingredientRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    imageContainer: {
        marginBottom: 15,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 10,
    },
    imageButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    imageButton: {
        backgroundColor: '#e9ecef',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        width: '48%',
    },
    imageButtonText: {
        color: '#636e72',
        fontSize: 14,
        fontWeight: '500',
    },
    icon: {
        padding: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.11)',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '50%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 15,
    },
    modalOption: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalOptionText: {
        fontSize: 16,
    },
    modalClose: {
        padding: 15,
        margin: 10,
        backgroundColor: '#e9ecef',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#636e72',
    },
    pickerContainer: {
        width: '20%',
        height: '77%',
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    pickerText: {
        textAlign: 'center',
        fontSize: 17,
        color: '#C7C7C7',
    },
    chevron: {
        textAlign: 'center',
        alignItems: 'center',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'space-between',
        paddingTop: 13,
    }
});