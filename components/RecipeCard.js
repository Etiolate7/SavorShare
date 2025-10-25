import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RecipeCard({ recipe }) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{recipe.title}</Text>
            <Text>Servings: {recipe.servings}</Text>
            <Text>Time: {recipe.time} mins</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
    },
});