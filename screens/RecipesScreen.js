import { StyleSheet, FlatList, Text, View } from 'react-native';
import RecipeCard from '../components/RecipeCard';

export default function RecipesScreen({ navigation, recipes }) {
    const safeRecipes = recipes || [];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Recipes</Text>
                <Text style={styles.subtitle}>{safeRecipes.length} recipe{safeRecipes.length !== 1 ? 's' : ''}</Text>
            </View>
            <FlatList
                data={safeRecipes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <RecipeCard recipe={item} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No recipes yet</Text>
                    </View>
                }
                contentContainerStyle={styles.flatListContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#2d3436',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#636e72',
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
});