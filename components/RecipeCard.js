import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';

export default function RecipeCard({ recipe, onPress }) {
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
            <FontAwesome5 style={styles.heart} name="bookmark" size={20} color="#ef5800" solid />
            <View style={styles.card}>
                <Text style={styles.title}>{recipe.title}</Text>
                <View style={styles.icons}>
                    <Text style={styles.details}><FontAwesome5 name={'users'} size={20} color={'#ef5800'} /> {recipe.servings}</Text>
                    <Text style={styles.details}><FontAwesome5 name={'clock'} size={20} color={'#ef5800'} /> {recipe.time} mins</Text>
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
        backgroundColor: '#f8f9fa',
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
        backgroundColor: '#4DB85E',
        borderRadius: 7,
        padding: 5,
        marginLeft: 5,
        marginRight: 5,
    },
    detailsTextNationality: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 4,
        backgroundColor: '#A52B98',
        borderRadius: 7,
        padding: 5,
        marginLeft: 5,
        marginRight: 5,
    },
    heart: {
        position: 'absolute',
        right: 55,
        top: 30,
        zIndex: 99,
    },
});