import { Button, StyleSheet, FlatList, Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import RecipeCard from '../components/RecipeCard';

export default function RecipesScreen({ navigation, recipes }) {
    return (
        <View style={styles.container}>
            <FlatList
                data={recipes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <RecipeCard recipe={item} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No recipes yet. Add one!</Text>
                    </View>
                }
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
    },
    flatListContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    emptyText: {
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});