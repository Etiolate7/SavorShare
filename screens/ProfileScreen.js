import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Switch } from 'react-native';
import { FontAwesome5, FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation, recipes, likedRecipes }) {

    const [editing, setEditing] = useState(false);
    const [userData, setUserData] = useState({
        username: 'Hello',
        email: 'email@exemple.fr',
        bio: 'Je cuisine beaucoup',
        profilePicture: null,
    });
    const [editData, setEditData] = useState(userData);
    const userRecipes = recipes || [];
    const likedRecipesList = recipes?.filter(recipe => likedRecipes?.includes(recipe.id)) || [];
    const [activeTab, setActiveTab] = useState('myRecipes');
    const [isChangePasswordModal, setIsChangePasswordModal] = useState(false);

    const userStats = {
        recipesCreated: recipes?.length || 0,
        totalLikes: recipes?.reduce((total, recipe) => total + (recipe.likes || 0), 0) || 0,
        recipesBookmarked: likedRecipes?.length || 0,
        cookingTime: '35 mins',
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            userData.profilePicture(result.assets[0].uri);
        }
    };

    const handleSaveProfile = () => {
        setUserData(editData);
        setEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
    };

    const handleChangePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }
        Alert.alert('Success', 'Password changed successfully!');
        setIsChangePasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>

                <View style={styles.userCard}>
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            {userData.profilePicture ? (
                                <Image source={{ uri: userData.profilePicture }} style={styles.avatar} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <FontAwesome5 name="user" size={40} color="#999" />
                                </View>
                            )}
                            <TouchableOpacity onPress={pickImage} style={styles.cameraButton}>
                                <FontAwesome5 name="camera" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.userInfo}>
                            {editing ? (
                                <TextInput
                                    style={styles.editInput}
                                    value={editData.username}
                                    onChangeText={(text) => setEditData({ ...editData, username: text })}
                                    placeholder="Username"
                                />
                            ) : (
                                <Text style={styles.username}>{userData.username}</Text>
                            )}
                            <Text style={styles.email}>{userData.email}</Text>
                            {editing ? (
                                <TextInput
                                    style={[styles.editInput, styles.bioInput]}
                                    value={editData.bio}
                                    onChangeText={(text) => setEditData({ ...editData, bio: text })}
                                    placeholder="Bio"
                                    multiline
                                />
                            ) : (
                                <Text style={styles.bio}>{userData.bio}</Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.actionButtons}>
                        {editing ? (
                            <View style={styles.editActions}>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setEditing(false)}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                                    <Text style={styles.saveButtonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
                                <FontAwesome5 name="edit" size={16} color="#fff" />
                                <Text style={styles.editButtonText}>Edit Profile</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={styles.statsCard}>
                    <Text style={styles.sectionTitle}>Cooking Stats</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: '#FF6B6B' }]}>
                                <FontAwesome5 name="utensils" size={20} color="#fff" />
                            </View>
                            <Text style={styles.statNumber}>{userStats.recipesCreated}</Text>
                            <Text style={styles.statLabel}>Recipes Created</Text>
                        </View>
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: '#45B7D1' }]}>
                                <FontAwesome name="bookmark" size={20} color="#fff" />
                            </View>
                            <Text style={styles.statNumber}>{userStats.recipesBookmarked}</Text>
                            <Text style={styles.statLabel}>Bookmarked</Text>
                        </View>
                    </View>
                </View>


                <View style={styles.settingsCard}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.settingIcon, { backgroundColor: '#667EEA' }]}>
                                <MaterialIcons name="email" size={20} color="#fff" />
                            </View>
                            <Text style={styles.settingText}>Email: {userData.email}</Text>
                        </View>
                        <FontAwesome5 name="chevron-right" size={16} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => setIsChangePasswordModal(true)}
                    >
                        <View style={styles.settingLeft}>
                            <View style={[styles.settingIcon, { backgroundColor: '#F093FB' }]}>
                                <FontAwesome5 name="lock" size={16} color="#fff" />
                            </View>
                            <Text style={styles.settingText}>Change Password</Text>
                        </View>
                        <FontAwesome5 name="chevron-right" size={16} color="#999" />
                    </TouchableOpacity>
                </View>

                <View style={styles.recipesSection}>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'myRecipes' && styles.activeTab]}
                            onPress={() => setActiveTab('myRecipes')}
                        >
                            <Text style={[styles.tabText, activeTab === 'myRecipes' && styles.activeTabText]}>
                                My Recipes ({userRecipes.length})
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'likedRecipes' && styles.activeTab]}
                            onPress={() => setActiveTab('likedRecipes')}
                        >
                            <Text style={[styles.tabText, activeTab === 'likedRecipes' && styles.activeTabText]}>
                                Bookmarks ({likedRecipesList.length})
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.recipesList}>
                        {activeTab === 'myRecipes' ? (
                            userRecipes.length > 0 ? (
                                userRecipes.map(renderRecipeItem)
                            ) : (
                                <View style={styles.emptyState}>
                                    <FontAwesome5 name="utensils" size={50} color="#ddd" />
                                    <Text style={styles.emptyStateText}>No recipes created yet</Text>
                                    <Text style={styles.emptyStateSubtext}>Start creating your first recipe!</Text>
                                </View>
                            )
                        ) : (
                            likedRecipesList.length > 0 ? (
                                likedRecipesList.map(renderRecipeItem)
                            ) : (
                                <View style={styles.emptyState}>
                                    <FontAwesome name="bookmark" size={50} color="#ddd" />
                                    <Text style={styles.emptyStateText}>No bookmarks yet</Text>
                                    <Text style={styles.emptyStateSubtext}>Start bookmarking recipes you like!</Text>
                                </View>
                            )
                        )}
                    </View>
                </View>

                <TouchableOpacity>
                    <View style={styles.logout}>
                        <FontAwesome5 name="sign-out-alt" size={20} color="red" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
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
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#2d3436',
    },
    userCard: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 20,
        borderRadius: 16,
    },
    avatarSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e9ecef',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#ef5800',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    userInfo: {
        flex: 1,
    },
    username: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2d3436',
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: '#636e72',
        marginBottom: 8,
    },
    bio: {
        fontSize: 14,
        color: '#636e72',
        lineHeight: 20,
    },
    editInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        fontSize: 16,
    },
    bioInput: {
        height: 60,
        textAlignVertical: 'top',
    },
    actionButtons: {
        marginTop: 8,
    },
    editButton: {
        flexDirection: 'row',
        backgroundColor: '#ef5800',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    editActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cancelButtonText: {
        color: '#636e72',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#ef5800',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        marginLeft: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    statsCard: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 20,
        borderRadius: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2d3436',
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statItem: {
        width: '48%',
        alignItems: 'center',
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
    },
    statIcon: {
        width: 45,
        height: 45,
        borderRadius: 45 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2d3436',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#636e72',
        textAlign: 'center',
    },
    logout: {
        display: 'flex',
        flexDirection: 'row',
        margin: 16,
    },
    logoutText: {
        color: 'red',
    },
    settingsCard: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 20,
        borderRadius: 16,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
    },
    settingLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingText: {
        flex: 1,
        fontSize: 16,
        color: '#2d3436',
    },
    recipesSection: {
        backgroundColor: '#fff',
        margin: 16,
        marginTop: 0,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: '#ef5800',
    },
    tabText: {
        fontSize: 16,
        color: '#636e72',
        fontWeight: '600',
    },
    activeTabText: {
        color: '#ef5800',
    },
    recipesList: {
        padding: 16,
    },
    recipeItem: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
    },
    recipeImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
    },
    recipeInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    recipeTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2d3436',
        marginBottom: 8,
    },
    recipeMeta: {
        flexDirection: 'row',
    },
    recipeMetaText: {
        fontSize: 12,
        color: '#666',
        marginRight: 12,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 18,
        color: '#636e72',
        marginTop: 12,
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});
