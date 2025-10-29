import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Switch } from 'react-native';
import { FontAwesome5, FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {

    const [editing, setEditing] = useState(false);
    const [userData, setUserData] = useState({
        username: 'Hello',
        email: 'email@exemple.fr',
        bio: 'Je cuisine beaucoup',
        profilePicture: null,
    });
    const [editData, setEditData] = useState(userData);


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
                            <TouchableOpacity style={styles.cameraButton}>
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
                    <Text>Cooking Stats</Text>
                </View>

                <View style={styles.settingsCard}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <TouchableOpacity>
                        <Text>
                            Change E-mail
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text>
                            Change Password
                        </Text>
                    </TouchableOpacity>
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
        marginTop: 0,
        padding: 20,
        borderRadius: 16,
    },
    settingsCard: {
        backgroundColor: '#fff',
        margin: 16,
        marginTop: 0,
        padding: 20,
        borderRadius: 16,
    },
    logout: {
        display: 'flex',
        flexDirection: 'row',
        margin: 16,
    },
    logoutText: {
        color: 'red',
    }
});
