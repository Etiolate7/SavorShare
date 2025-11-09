import { Button, StyleSheet, Text, TextInput, Modal, View, TouchableOpacity, TouchableWithoutFeedback, ScrollView, Image, Alert } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function CreateScreen({ navigation, route, recipes, setRecipes }) {
    const user = useSelector((state) => state.user.value);

    const { recipe: existingRecipe, isEditing } = route?.params || {};

    const [title, setTitle] = useState('');
    const [servings, setServings] = useState('');
    const [time, setTime] = useState('');
    const [ingredients, setIngredients] = useState([{ quantity: '', unit: '', name: '' }]);
    const [instructions, setInstructions] = useState(['']);
    const [nationality, setNationality] = useState('Other');
    const [dishType, setDishType] = useState('Main');
    const [image, setImage] = useState(null);

    const [errorTitle, setErrorTitle] = useState('');
    const [errorIngredients, setErrorIngredients] = useState('');
    const [errorInstructions, setErrorInstructions] = useState('');

    const [showUnitPicker, setShowUnitPicker] = useState(false);
    const [currentIngredientIndex, setCurrentIngredientIndex] = useState(0);

    const [likedRecipes, setLikedRecipes] = useState([]);

    useEffect(() => {
        if (isEditing && existingRecipe) {
            setTitle(existingRecipe.name || existingRecipe.title || '');
            setServings(existingRecipe.serving_size?.toString() || '');
            setTime(existingRecipe.time?.toString() || '');
            setImage(existingRecipe.picture || existingRecipe.image || null);
            setNationality(existingRecipe.nationality || 'Other');
            setDishType(existingRecipe.type_of_dish || existingRecipe.dishType || 'Main');
            setIngredients(existingRecipe.ingredients?.length ? existingRecipe.ingredients : [{ quantity: '', unit: '', name: '' }]);
            setInstructions(existingRecipe.instructions?.length ? existingRecipe.instructions : ['']);
        } else {
            setTitle('');
            setServings('');
            setTime('');
            setIngredients([{ quantity: '', unit: '', name: '' }]);
            setInstructions(['']);
            setNationality('Other');
            setDishType('Main');
            setImage(null);
            setErrorTitle('');
            setErrorIngredients('');
            setErrorInstructions('');
        }
    }, [isEditing, existingRecipe]);

    const unitOptions = [
        { label: 'kg (kilograms)', value: 'kg' },
        { label: 'g (grams)', value: 'g' },
        { label: 'mg (milligrams)', value: 'mg' },
        { label: 'L (liters)', value: 'L' },
        { label: 'cl (centiliters)', value: 'cl' },
        { label: 'ml (milliliters)', value: 'ml' },
        { label: 'clove', value: 'clove' },
        { label: 'to taste', value: 'to taste' },
    ];

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) setImage(result.assets[0].uri);
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
        if (!result.canceled) setImage(result.assets[0].uri);
    };

    function saveRecipe() {
        setErrorTitle('');
        setErrorIngredients('');
        setErrorInstructions('');

        if (!title.trim()) {
            setErrorTitle('Recipe title is required');
            setTimeout(() => setErrorTitle(''), 3000);
            return;
        }

        const filteredIngredients = ingredients.filter(ing => ing.name.trim() !== '');
        if (filteredIngredients.length === 0) {
            setErrorIngredients('At least one ingredient is required');
            setTimeout(() => setErrorIngredients(''), 3000);
            return;
        }

        const filteredInstructions = instructions.filter(step => step.trim() !== '');
        if (filteredInstructions.length === 0) {
            setErrorInstructions('At least one instruction step is required');
            setTimeout(() => setErrorInstructions(''), 3000);
            return;
        }

        const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

        const recipeData = {
            name: formattedTitle,
            serving_size: servings,
            time,
            picture: image,
            type_of_dish: dishType,
            nationality,
            ingredients: filteredIngredients,
            instructions: filteredInstructions,
        };

        if (isEditing && existingRecipe?._id) {
            updateRecipe(recipeData);
        } else {
            createRecipe(recipeData);
        }
    }

    const createRecipe = (recipeData) => {
        fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/recipes/add/${user.token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipeData),
        })
            .then(res => res.json())
            .then(result => {
                if (result.result) {
                    const newRecipe = {
                        id: Date.now().toString(),
                        title: recipeData.name,
                        servings,
                        time,
                        ingredients: recipeData.ingredients,
                        instructions: recipeData.instructions,
                        nationality,
                        dishType,
                        image,
                    };
                    const currentRecipes = recipes || [];
                    setRecipes([...currentRecipes, newRecipe]);
                    Alert.alert('Success', 'Recipe added successfully!');
                    navigation.goBack();
                } else {
                    Alert.alert('Error', result.message || 'Failed to add recipe');
                }
            })
            .catch(err => {
                console.error('Recipe save error:', err);
                Alert.alert('Error', 'Something went wrong. Please try again.');
            });
    };

    const updateRecipe = (recipeData) => {
        fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/recipes/modify/${user.token}/${existingRecipe._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipeData),
        })
            .then(res => res.json())
            .then(result => {
                if (result.result) {
                    Alert.alert('Success', 'Recipe updated successfully!');
                    navigation.setParams({ isEditing: false, recipe: null });
                    navigation.goBack();
                } else {
                    Alert.alert('Error', result.message || 'Failed to update recipe');
                }
            })
            .catch(err => {
                console.error('Update recipe error:', err);
                Alert.alert('Error', 'Something went wrong. Please try again.');
            });
    };

    const updateIngredient = (index, field, value) => {
        const updated = [...ingredients];
        updated[index][field] = value;
        setIngredients(updated);
        if (field === 'name' && value.trim() !== '') setErrorIngredients('');
    };

    const addIngredientField = () => {
        setIngredients([...ingredients, { quantity: '', unit: '', name: '' }]);
        setErrorIngredients('');
    };

    const updateInstruction = (text, index) => {
        const updated = [...instructions];
        updated[index] = text;
        setInstructions(updated);
        if (text.trim() !== '') setErrorInstructions('');
    };

    const addInstructionField = () => {
        setInstructions([...instructions, '']);
        setErrorInstructions('');
    };

    const dishOptions = ['Main', 'Appetizer', 'Dessert', 'Side', 'Breakfast', 'Beverage'];
    const nationalityOptions = ['Asian', 'North American', 'South American', 'African', 'Middle Eastern', 'European', 'Oceanian', 'Other'];

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.scrollContainer} nestedScrollEnabled={true}>
                <View style={styles.container}>
                    <Text style={styles.title}>{isEditing ? 'Edit Recipe' : 'Create Your Recipe'}</Text>

                    <TextInput
                        placeholder="Recipe title"
                        value={title}
                        onChangeText={(t) => { setTitle(t); if (t.trim()) setErrorTitle(''); }}
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
                        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
                        <View style={styles.imageButtons}>
                            <TouchableOpacity onPress={takePhoto} style={styles.imageButton}>
                                <FontAwesome5 style={styles.icon} name="camera" size={20} color="#fff" solid />
                                <Text style={styles.imageButtonText}>Take Photo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
                                <FontAwesome5 style={styles.icon} name="image" size={20} color="#fff" solid />
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
                                onChangeText={(t) => updateIngredient(index, 'quantity', t)}
                                style={[styles.input, styles.qtyInput]}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity
                                style={styles.pickerContainer}
                                onPress={() => { setCurrentIngredientIndex(index); setShowUnitPicker(true); }}
                            >
                                <View style={styles.row}>
                                    <Text style={styles.pickerText}>{item.unit || 'Unit'}</Text>
                                    <FontAwesome5 style={styles.chevron} name="chevron-down" size={12} color={'#C7C7C7'} />
                                </View>
                            </TouchableOpacity>
                            <TextInput
                                placeholder="Ingredient"
                                value={item.name}
                                onChangeText={(t) => updateIngredient(index, 'name', t)}
                                style={[styles.input, styles.nameInput]}
                            />
                        </View>
                    ))}
                    {errorIngredients ? <Text style={styles.errorText}>{errorIngredients}</Text> : null}
                    <TouchableOpacity onPress={addIngredientField} style={styles.addButton}>
                        <Text style={styles.addButtonText}>+ Add Ingredient</Text>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Instructions</Text>
                    {instructions.map((step, i) => (
                        <TextInput
                            key={i.toString()}
                            placeholder={`Step ${i + 1}`}
                            value={step}
                            onChangeText={(t) => updateInstruction(t, i)}
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
                        {nationalityOptions.map((opt) => (
                            <TouchableOpacity
                                key={opt}
                                onPress={() => setNationality(opt)}
                                style={[styles.optionButton, nationality === opt && styles.optionButtonSelected]}
                            >
                                <Text style={[styles.optionText, nationality === opt && styles.optionTextSelected]}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Type of Dish</Text>
                    <View style={styles.optionsContainer}>
                        {dishOptions.map((opt) => (
                            <TouchableOpacity
                                key={opt}
                                onPress={() => setDishType(opt)}
                                style={[styles.optionButton, dishType === opt && styles.optionButtonSelected]}
                            >
                                <Text style={[styles.optionText, dishType === opt && styles.optionTextSelected]}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={saveRecipe}>
                        <Text style={styles.saveButtonText}>{isEditing ? 'Update Recipe' : 'Save Recipe'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal visible={showUnitPicker} transparent animationType="slide">
                <TouchableWithoutFeedback onPress={() => setShowUnitPicker(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Select Unit</Text>
                                {unitOptions.map((opt) => (
                                    <TouchableOpacity
                                        key={opt.value}
                                        style={styles.modalOption}
                                        onPress={() => {
                                            updateIngredient(currentIngredientIndex, 'unit', opt.value);
                                            setShowUnitPicker(false);
                                        }}
                                    >
                                        <Text style={styles.modalOptionText}>{opt.label}</Text>
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity style={styles.modalClose} onPress={() => setShowUnitPicker(false)}>
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
        borderColor: '#ddd',
    },
    inputError: {
        borderColor: '#C43A32',
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
        backgroundColor: '#C43A32',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
    },
    addButtonText: {
        color: '#fff',
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
        borderColor: '#4E8255',
    },
    optionButtonSelected: {
        backgroundColor: '#4E8255',
        borderColor: '#4E8255',
    },
    optionText: {
        textAlign: 'center',
        color: '#4E8255',
        fontWeight: '500',
    },
    optionTextSelected: {
        color: 'white',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#C43A32',
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
        backgroundColor: '#C43A32',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        width: '48%',
    },
    imageButtonText: {
        color: '#fff',
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
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        padding: 20,
        maxHeight: '65%',
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
        paddingLeft: 7,
        paddingRight: 7,
    }
});