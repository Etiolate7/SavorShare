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
            
            <Text style={styles.sectionTitle}>Ingredients:</Text>
            {recipe.ingredients?.map((ing, index) => (
                <Text key={index.toString()} style={styles.ingredientText}>
                    - {ing.quantity} {ing.unit} {ing.name}
                </Text>
            ))}

            <Text style={styles.sectionTitle}>Instructions:</Text>
            {recipe.instructions?.map((step, index) => (
                <Text key={index.toString()} style={styles.instructionStep}>
                    {index + 1}. {step}
                </Text>
            ))}
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