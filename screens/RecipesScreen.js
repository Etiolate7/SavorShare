import { StyleSheet, FlatList, Text, TextInput, View, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView, Switch, ActivityIndicator } from 'react-native';
import RecipeCard from '../components/RecipeCard';
import { useState, useEffect, useMemo } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function RecipesScreen({ navigation }) {
    const user = useSelector(state => state.user.value);
    const bookmarkedRecipes = useSelector((state) => state.user.value.bookmarkedRecipes);

    // console.log('User state:', user);
    // console.log('Liked recipes:', likedRecipes);

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookmarkOnly, setBookmarkOnly] = useState(false);
    const [byMeOnly, setByMeOnly] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDishType, setSelectedDishType] = useState('');
    const [selectedNationality, setSelectedNationality] = useState('');

    const dishTypes = ['Main', 'Appetizer', 'Dessert', 'Side', 'Breakfast', 'Beverage'];
    const nationalities = ['European', 'Asian', 'North American', 'South American', 'African', 'Oceanian', 'Middle Eastern', 'Other'];

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/recipes/all`)
                .then(res => res.json())
                .then(data => {
                    if (data.result) {
                        const transformed = data.recipes.map(recipe => ({
                            ...recipe,
                            image: recipe.picture || recipe.image,
                            name: recipe.title || recipe.name,
                            type_of_dish: recipe.dishType || recipe.type_of_dish,
                            serving_size: recipe.servings || recipe.serving_size,
                            time: recipe.time,
                        }));
                        setRecipes(transformed);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.log('Fetch error:', err);
                    setLoading(false);
                });
        }, [])
    );

    const safeRecipes = recipes || [];

    const filteredRecipes = useMemo(() => {
        return safeRecipes.filter(recipe => {
            const recipeName = recipe.title || '';
            const recipeDishType = recipe.type_of_dish || '';
            const recipeNationality = recipe.nationality || '';

            const matchesSearch =
                recipeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (recipe.ingredients &&
                    recipe.ingredients.some(i =>
                        (i.name || i).toString().toLowerCase().includes(searchQuery.toLowerCase())
                    ));

            const matchesDishType =
                !selectedDishType ||
                recipeDishType.toLowerCase() === selectedDishType.toLowerCase();

            const matchesNationality =
                !selectedNationality ||
                recipeNationality.toLowerCase() === selectedNationality.toLowerCase();

            const matchesBookmarked = !bookmarkOnly || bookmarkedRecipes.includes(recipe._id);

            const matchesByMe = !byMeOnly ||
                (user && recipe.creator && (
                    recipe.creator._id === user._id ||
                    recipe.creator._id?.toString() === user._id?.toString() ||
                    recipe.creator._id === user._id?.toString() ||
                    recipe.creator.username === user.username
                ));

            return matchesSearch && matchesDishType && matchesNationality && matchesBookmarked && matchesByMe;
        });
    }, [safeRecipes, searchQuery, selectedDishType, selectedNationality, bookmarkOnly, byMeOnly, bookmarkedRecipes, user]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Recipes</Text>
                    <Text style={styles.subtitle}>{safeRecipes.length} recipe{safeRecipes.length !== 1 ? 's' : ''}</Text>
                </View>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setModalVisible(true)}
                >
                    <FontAwesome name="filter" size={18} color="#fff" />
                    <Text style={styles.filterButtonText}>Filters</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#5C7A52" />
                </View>
            ) : (
                <FlatList
                    data={filteredRecipes}
                    keyExtractor={(item, index) => item._id || index.toString()}
                    renderItem={({ item }) => <RecipeCard
                        recipe={item}
                        onPress={() => navigation.navigate('RecipeDetails', {
                            recipe: item,
                        })}
                    />}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No recipes yet</Text>
                        </View>
                    }
                    contentContainerStyle={styles.flatListContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={styles.topPart}>
                                <Text style={styles.modalTitle}>Filter Recipes</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <FontAwesome5 name="times" size={20} color="#2d3436"></FontAwesome5>
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Search by name or ingredient"
                                    placeholderTextColor={"#ccc"}
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />

                                <Text style={styles.label}>Dish Type</Text>
                                <View style={styles.optionContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.optionButton,
                                            selectedDishType === '' && styles.optionButtonActive,
                                        ]}
                                        onPress={() => setSelectedDishType('')}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                selectedDishType === '' && styles.optionTextActive,
                                            ]}
                                        >
                                            All
                                        </Text>
                                    </TouchableOpacity>
                                    {dishTypes.map((type) => (
                                        <TouchableOpacity
                                            key={type}
                                            style={[
                                                styles.optionButton,
                                                selectedDishType === type && styles.optionButtonActive,
                                            ]}
                                            onPress={() => setSelectedDishType(type)}
                                        >
                                            <Text
                                                style={[
                                                    styles.optionText,
                                                    selectedDishType === type && styles.optionTextActive,
                                                ]}
                                            >
                                                {type}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <Text style={styles.label}>Nationality</Text>
                                <View style={styles.optionContainer}>
                                    <TouchableOpacity
                                        style={[
                                            styles.optionButton,
                                            selectedNationality === '' && styles.optionButtonActive,
                                        ]}
                                        onPress={() => setSelectedNationality('')}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                selectedNationality === '' && styles.optionTextActive,
                                            ]}
                                        >
                                            All
                                        </Text>
                                    </TouchableOpacity>
                                    {nationalities.map((nation) => (
                                        <TouchableOpacity
                                            key={nation}
                                            style={[
                                                styles.optionButton,
                                                selectedNationality === nation && styles.optionButtonActive,
                                            ]}
                                            onPress={() => setSelectedNationality(nation)}
                                        >
                                            <Text
                                                style={[
                                                    styles.optionText,
                                                    selectedNationality === nation && styles.optionTextActive,
                                                ]}
                                            >
                                                {nation}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <View style={styles.switchRow}>
                                    <Text style={styles.label}>Show only bookmarked recipes</Text>
                                    <Switch
                                        value={bookmarkOnly}
                                        onValueChange={setBookmarkOnly}
                                        thumbColor={bookmarkOnly ? '#C43A32' : '#fff'}
                                        trackColor={{ true: '#FFA5A1', false: '#ddd' }}
                                    />
                                </View>
                                <View style={styles.switchRow}>
                                    <Text style={styles.label}>Created by me !</Text>
                                    <Switch
                                        value={byMeOnly}
                                        onValueChange={setByMeOnly}
                                        thumbColor={byMeOnly ? '#C43A32' : '#fff'}
                                        trackColor={{ true: '#FFA5A1', false: '#ddd' }}
                                    />
                                </View>

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={styles.resetButton}
                                        onPress={() => {
                                            setSearchQuery('');
                                            setSelectedDishType('');
                                            setSelectedNationality('');
                                            setBookmarkOnly(false);
                                            setByMeOnly(false);
                                        }}
                                    >
                                        <Text style={styles.resetButtonText}>Reset</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.applyButton}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={styles.applyButtonText}>Apply Filters</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF7E5',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#FFF7E5',
        borderBottomWidth: 1,
        borderBottomColor: '#E8D9BC',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#2d3436',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#2d3436',
        fontWeight: '500',
    },
    flatListContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 20,
    },
    flatListEmpty: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: '#5C7A52',
    },
    filterButtonText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 6,
        fontSize: 14
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '85%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
        color: '#2d3436',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
        fontSize: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333'
    },
    optionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    optionButton: {
        borderWidth: 1,
        borderColor: '#C43A32',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 14,
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: '#fff',
    },
    optionButtonActive: {
        backgroundColor: '#C43A32',
        borderColor: '#C43A32',
    },
    optionText: {
        color: '#C43A32',
        fontWeight: '500',
    },
    optionTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    resetButton: {
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
    },
    applyButton: {
        backgroundColor: '#C43A32',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginLeft: 10,
    },
    resetButtonText: {
        textAlign: 'center',
        color: '#333',
        fontWeight: '600'
    },
    applyButtonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: '600'
    },
    topPart: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});