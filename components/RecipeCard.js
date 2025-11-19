import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { toggleLikedRecipe } from '../reducers/user';

export default function RecipeCard({ recipe, onPress }) {
    const user = useSelector(state => state.user.value);
    const dispatch = useDispatch();

    // console.log('RecipeCard - Recipe ID:', recipe._id);
    // console.log('RecipeCard - User likedRecipes:', user.likedRecipes);
    // console.log('RecipeCard - Is recipe liked:', user.likedRecipes?.includes(recipe._id));
    // console.log(`RecipeCard rendered for: ${recipe.name} (${recipe._id})`);

    const isLiked = user.likedRecipes?.includes(recipe._id);

    const toggleLike = (event) => {
    event.stopPropagation();
    if (!user.token) return;

    const liked = isLiked ? 'unbookmark' : 'bookmark';

    dispatch(toggleLikedRecipe(recipe._id));

    fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/recipes/${liked}/${user.token}/${recipe._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => {
        if (!data.result) {
            dispatch(toggleLikedRecipe(recipe._id));
        }
    })
    .catch(err => {
        dispatch(toggleLikedRecipe(recipe._id));
    });
};

    return (
        <Pressable style={styles.container} onPress={onPress}>
            {recipe.image ? (
                <Image style={styles.image} source={{ uri: recipe.image }} />
            ) : (
                <View style={styles.placeholder}>
                    <Feather name="camera-off" size={26} color="#2d3436" />
                    <Text style={styles.placeholderText}>No Image</Text>
                </View>
            )}
            <TouchableOpacity onPress={toggleLike} style={styles.bookmark}>
                <FontAwesome name={isLiked ? 'bookmark' : 'bookmark-o'} size={22} color={isLiked ? '#5C7A52' : '#5C7A52'} key={isLiked ? 'liked' : 'unliked'} />
            </TouchableOpacity>
            <View style={styles.card}>
                <Text style={styles.title}>{recipe.name}</Text>
                <View style={styles.icons}>
                    <Text style={styles.details}><FontAwesome5 name={'users'} size={20} color={'#5C7A52'} /> {recipe.serving_size}</Text>
                    <Text style={styles.details}><FontAwesome5 name={'clock'} size={20} color={'#5C7A52'} /> {recipe.time} mins</Text>
                </View>
                <View style={styles.icons}>
                    <Text style={styles.detailsText}>{recipe.type_of_dish}</Text>
                    <Text style={styles.detailsTextNationality}>{recipe.nationality}</Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#FFFBF0',
        padding: 15,
        margin: 10,
        paddingTop: '80',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E8D9BC',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
    },
    title: {
        color: '#2d3436',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    details: {
        fontSize: 16,
        color: '#2d3436',
        marginBottom: 4,
        marginLeft: 5,
        marginRight: 5,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 5,
    },
    ingredient: {
        fontSize: 14,
        marginLeft: 10,
        marginBottom: 2,
    },
    instructions: {
        fontSize: 14,
        lineHeight: 20,
    },
    ingredientsSection: {
        marginTop: 10,
    },
    instructionsSection: {
        marginTop: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        position: 'absolute',
        zIndex: 99,
        top: -20,
        left: 125,
    },
    placeholder: {
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        backgroundColor: '#FFFBF0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E8D9BC',
        borderStyle: 'dashed',
        position: 'absolute',
        zIndex: 99,
        top: -20,
        left: 125,
    },
    placeholderText: {
        marginTop: 5,
        color: '#2d3436',
        fontSize: 16,
        fontWeight: '500',
    },
    icons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailsText: {
        fontSize: 16,
        color: '#FFFBF0',
        marginBottom: 4,
        backgroundColor: '#3B7843',
        borderRadius: 7,
        padding: 5,
        marginLeft: 5,
        marginRight: 5,
    },
    detailsTextNationality: {
        fontSize: 16,
        color: '#FFFBF0',
        marginBottom: 4,
        backgroundColor: '#3B7843',
        borderRadius: 7,
        padding: 5,
        marginLeft: 5,
        marginRight: 5,
    },
    bookmark: {
        position: 'absolute',
        right: 55,
        top: 30,
        zIndex: 99,
    },
});