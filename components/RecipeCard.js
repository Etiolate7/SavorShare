import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RecipeCard({ recipe }) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.details}>Servings: {recipe.servings}</Text>
            <Text style={styles.details}>Time: {recipe.time} mins</Text>
            <Text style={styles.details}>Type: {recipe.dishType}</Text>
            <Text style={styles.details}>Cuisine: {recipe.nationality}</Text>
            
            {recipe.ingredients && recipe.ingredients.length > 0 && (
                <View style={styles.ingredientsSection}>
                    <Text style={styles.subtitle}>Ingredients:</Text>
                    {recipe.ingredients.map((ingredient, index) => (
                        <Text key={index} style={styles.ingredient}>
                            • {ingredient}
                        </Text>
                    ))}
                </View>
            )}
            
            {recipe.instructions && (
                <View style={styles.instructionsSection}>
                    <Text style={styles.subtitle}>Instructions:</Text>
                    <Text style={styles.instructions}>{recipe.instructions}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        margin: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    details: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
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
});