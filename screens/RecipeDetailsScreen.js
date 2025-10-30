import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';


export default function RecipeDetailsScreen({ route, navigation, likedRecipes, setLikedRecipes }) {

    const { recipe } = route.params;

    const isLiked = likedRecipes?.includes(recipe.id);


    const toggleLike = () => {
        if (!likedRecipes || !setLikedRecipes) return;
        if (isLiked) {
            setLikedRecipes(likedRecipes.filter(id => id !== recipe.id));
        } else {
            setLikedRecipes([...likedRecipes, recipe.id]);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
            >
                <TouchableOpacity style={styles.chevron} onPress={() => navigation.navigate('Recipes')}>
                    <FontAwesome5 name={'arrow-left'} size={25} color={'#C43A32'} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.bookmark} onPress={toggleLike}>
                    <FontAwesome name={isLiked ? 'bookmark' : 'bookmark-o'} size={24} color={isLiked ? '#C43A32' : '#C43A32'} />
                </TouchableOpacity>
                {recipe.image ? (
                    <Image style={styles.image} source={{ uri: recipe.image }} />
                ) : (
                    <View style={styles.placeholder}>
                        <Feather name="camera-off" size={32} color="#999" />
                        <Text style={styles.placeholderText}>No Image</Text>
                    </View>
                )}
                <View style={styles.content}>
                    <Text style={styles.title}>{recipe.title}</Text>
                    <View style={styles.icons}>
                        <Text style={styles.details}><FontAwesome5 name={'users'} size={20} color={'#C43A32'} /> {recipe.servings}</Text>
                        <Text style={styles.details}><FontAwesome5 name={'clock'} size={20} color={'#C43A32'} /> {recipe.time} mins</Text>
                    </View>
                    <View style={styles.icons}>
                        <Text style={styles.detailsText}>{recipe.dishType}</Text>
                        <Text style={styles.detailsTextNationality}>{recipe.nationality}</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Ingredients:</Text>
                    <View style={styles.ingredientsContainer}>
                        {recipe.ingredients?.map((ing, index) => (
                            <View key={index.toString()} style={styles.ingredientItem}>
                                <Text style={styles.ingredientText}>
                                    • {ing.quantity} {ing.unit} {ing.name}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Instructions:</Text>
                    <View style={styles.instructionsContainer}>
                        {recipe.instructions?.map((step, index) => (
                            <View key={index.toString()} style={styles.instructionStep}>
                                <Text style={styles.stepNumber}>{index + 1}</Text>
                                <Text style={styles.stepText}>{step}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFA5A1',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 250,
        height: 250,
        borderRadius: 250 / 2,
        position: 'absolute',
        top: 60,
        zIndex: 99,
    },
    placeholder: {
        width: 250,
        height: 250,
        borderRadius: 250 / 2,
        position: 'absolute',
        top: 60,
        zIndex: 99,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
    },
    placeholderText: {
        marginTop: 5,
        color: '#999',
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        width: '100%',
        minHeight: '75%',
        marginTop: 250,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        paddingTop: 100,
        paddingBottom: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#2d3436',
        marginBottom: 10,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2d3436',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    item: {
        fontSize: 16,
        color: '#2d3436',
        marginBottom: 6,
    },
    chevron: {
        position: 'absolute',
        top: 55,
        left: 25,
        zIndex: 100,
    },
    bookmark: {
        position: 'absolute',
        top: 55,
        right: 30,
        zIndex: 100,
    },
    icons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 10,
    },
    details: {
        fontSize: 16,
        color: '#666',
        marginLeft: 5,
        marginRight: 5,
    },
    detailsText: {
        fontSize: 16,
        color: '#fff',
        backgroundColor: '#000',
        borderRadius: 7,
        padding: 5,
        marginLeft: 5,
        marginRight: 5,
    },
    detailsTextNationality: {
        fontSize: 16,
        color: '#fff',
        backgroundColor: '#000',
        borderRadius: 7,
        padding: 5,
        marginLeft: 5,
        marginRight: 5,
    },
    ingredientsContainer: {
        marginHorizontal: 20,
        marginBottom: 10,
    },
    ingredientItem: {
        backgroundColor: '#F5F5F5',
        padding: 12,
        marginVertical: 4,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#C43A32',
    },
    ingredientText: {
        fontSize: 16,
        color: '#2d3436',
        fontWeight: '500',
    },
    instructionsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 30,
    },
    instructionStep: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        padding: 16,
        marginVertical: 8,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    stepNumber: {
        backgroundColor: '#C43A32',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        width: 30,
        height: 30,
        borderRadius: 15,
        textAlign: 'center',
        lineHeight: 30,
        marginRight: 12,
    },
    stepText: {
        fontSize: 16,
        color: '#2d3436',
        lineHeight: 22,
        flex: 1,
    },
});