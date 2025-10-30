import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';

export default function RecipeCard({ recipe, onPress, likedRecipes, setLikedRecipes }) {

    const isLiked = likedRecipes?.includes(recipe.id);

    console.log('Recipe:', recipe.id, 'isLiked:', isLiked);

    const toggleLike = () => {
        if (!likedRecipes || !setLikedRecipes) return;
        if (isLiked) {
            setLikedRecipes(likedRecipes.filter(id => id !== recipe.id));
        } else {
            setLikedRecipes([...likedRecipes, recipe.id]);
        }
    };

    return (
        <Pressable style={styles.container} onPress={onPress}>
            {recipe.image ? (
                <Image style={styles.image} source={{ uri: recipe.image }} />
            ) : (
                <View style={styles.placeholder}>
                    <Feather name="camera-off" size={26} color="#999" />
                    <Text style={styles.placeholderText}>No Image</Text>
                </View>
            )}
            <TouchableOpacity onPress={toggleLike} style={styles.bookmark}>
            <FontAwesome name={isLiked ? 'bookmark' : 'bookmark-o'} size={22} color={isLiked ? '#C43A32' : '#C43A32'} key={isLiked ? 'liked' : 'unliked'} />
            </TouchableOpacity>
            <View style={styles.card}>
                <Text style={styles.title}>{recipe.title}</Text>
                <View style={styles.icons}>
                    <Text style={styles.details}><FontAwesome5 name={'users'} size={20} color={'#C43A32'} /> {recipe.servings}</Text>
                    <Text style={styles.details}><FontAwesome5 name={'clock'} size={20} color={'#C43A32'} /> {recipe.time} mins</Text>
                </View>
                <View style={styles.icons}>
                    <Text style={styles.detailsText}>{recipe.dishType}</Text>
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
        backgroundColor: '#f9f9f9',
        padding: 15,
        margin: 10,
        paddingTop: '80',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    details: {
        fontSize: 16,
        color: '#666',
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
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
        position: 'absolute',
        zIndex: 99,
        top: -20,
        left: 125,
    },
    placeholderText: {
        marginTop: 5,
        color: '#999',
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
        color: '#fff',
        marginBottom: 4,
        backgroundColor: '#000',
        borderRadius: 7,
        padding: 5,
        marginLeft: 5,
        marginRight: 5,
    },
    detailsTextNationality: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 4,
        backgroundColor: '#000',
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