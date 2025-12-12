import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { FontAwesome5, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { setUsername, setEmail, setProfilePicture, logout, setBio } from '../reducers/user';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

export default function ProfileScreen({ navigation, recipes }) {
    const [editing, setEditing] = useState(false);
    const user = useSelector((state) => state.user.value);
    const { username, email, profile_picture, bio } = user;

    const [editData, setEditData] = useState({
        username: username,
        email: email,
        bio: bio,
        profilePicture: profile_picture,
    });

    const [isChangePasswordModal, setIsChangePasswordModal] = useState(false);
    const [isChangeEmailModal, setIsChangeEmailModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [emailData, setEmailData] = useState({
        newEmail: '',
        confirmEmail: '',
    });

    const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const dispatch = useDispatch();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setEditData({ ...editData, profilePicture: result.assets[0].uri });
            updateProfilePicture(result.assets[0].uri);
        }
    };

    const updateProfilePicture = (imageUri) => {
        fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/users/changepicture/${user.token}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile_picture: imageUri }),
        })
            .then(response => response.json())
            .then(result => {
                if (result.result) {
                    dispatch(setProfilePicture(imageUri));
                    Alert.alert('Success', 'Profile picture updated successfully!');
                } else {
                    Alert.alert('Error', result.error || 'Failed to update profile picture');
                    setEditData({ ...editData, profilePicture: profile_picture });
                }
            })
            .catch(err => {
                console.error('Profile picture update error:', err);
                Alert.alert('Error', 'Something went wrong. Please try again.');
                setEditData({ ...editData, profilePicture: profile_picture });
            });
    };

    const updateBio = () => {
        fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/users/changebio/${user.token}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bio: editData.bio }),
        })
            .then(response => response.json())
            .then(result => {
                if (result.result) {
                    dispatch(setBio(editData.bio));
                    Alert.alert('Success', 'Bio changed successfully!');
                }
            })
            .catch(err => {
                console.error('Bio update error:', err);
                Alert.alert('Error', 'Something went wrong. Please try again.');
            });
    };

    const updateUsername = () => {
        fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/users/changeusername/${user.token}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: editData.username }),
        })
            .then(response => response.json())
            .then(result => {
                if (result.result) {
                    dispatch(setUsername(editData.username));
                    Alert.alert('Success', 'Username changed successfully!');
                } else {
                Alert.alert('Error', result.error || 'Failed to update username');
            }
            })
            .catch(err => {
                console.error('Username update error:', err);
                Alert.alert('Error', 'Something went wrong. Please try again.');
            });
    };

    const handleSaveChanges = () => {
        updateUsername();
        updateBio();
        setEditing(false);
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

        fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/users/changepassword/${user.token}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                password: passwordData.currentPassword,
                newpassword: passwordData.newPassword,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setIsChangePasswordModal(false);
                    Alert.alert('Success', 'Password changed successfully!');
                } else {
                    Alert.alert('Error', 'Failed to change password');
                }
            })
            .catch(err => {
                console.error(err);
                Alert.alert('Error', 'Something went wrong. Please try again.');
            });
    };

    const handleChangeEmail = () => {
        if (emailData.newEmail !== emailData.confirmEmail) {
            Alert.alert('Error', 'New email do no match');
            return;
        }

        if (!EMAIL_REGEX.test(emailData.newEmail)) {
            Alert.alert('Error', 'Email not valid');
            return;
        }

        fetch(`http://${process.env.EXPO_PUBLIC_API_URL}/users/changeemail/${user.token}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailData.newEmail }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    setEmailData({ newEmail: '', confirmEmail: '' });
                    setIsChangeEmailModal(false);
                    Alert.alert('Success', 'Email changed successfully');
                    dispatch(setEmail(emailData.newEmail));
                } else {
                    Alert.alert('Error', 'Failed to change email');
                }
            })
            .catch(err => {
                console.error(err);
                Alert.alert('Error', 'Something went wrong, try again');
            });
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(logout());
                        navigation.navigate('Home');
                    }
                }
            ]
        );
    };

    const renderRecipeItem = (recipe) => (
        <TouchableOpacity
            key={recipe.id}
            style={styles.recipeItem}
            onPress={() => navigation.navigate('RecipeDetails', { recipe })}
        >
            {recipe.image ? (
                <Image
                    source={{ uri: recipe.image }}
                    style={styles.recipeImage}
                />
            ) : (
                <View style={styles.placeholder}>
                    <Feather name="camera-off" size={22} color="#999" />
                    <Text style={styles.placeholderText}>No Image</Text>
                </View>
            )}
            <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle} numberOfLines={2}>{recipe.title}</Text>
                <View style={styles.recipeMeta}>
                    <Text style={styles.recipeMetaText}><FontAwesome5 name="clock" size={12} color="#666" /> {recipe.time}m</Text>
                    <Text style={styles.recipeMetaText}><FontAwesome5 name="users" size={12} color="#666" /> {recipe.servings}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                </View>

                <View style={styles.userCard}>
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            {editData.profilePicture ? (
                                <Image source={{ uri: editData.profilePicture }} style={styles.avatar} />
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
                                <Text style={styles.username}>{username}</Text>
                            )}
                            {editing ? (
                                <TextInput
                                    style={[styles.editInput, styles.bioInput]}
                                    value={editData.bio}
                                    onChangeText={(text) => setEditData({ ...editData, bio: text })}
                                    placeholder="Bio"
                                    multiline
                                />
                            ) : (
                                <Text style={styles.bio}>{bio}</Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.actionButtons}>
                        {editing ? (
                            <View style={styles.editActions}>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => {
                                    setEditing(false);
                                    setEditData({
                                        username: username,
                                        email: email,
                                        bio: bio,
                                        profilePicture: profile_picture,
                                    });
                                }}>
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
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

                <View style={styles.settingsCard}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>

                    <TouchableOpacity style={styles.settingItem} onPress={() => setIsChangeEmailModal(true)}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.settingIcon, { backgroundColor: '#4E8255' }]}>
                                <MaterialIcons name="email" size={20} color="#fff" />
                            </View>
                            <Text style={styles.settingText}>Change Email</Text>
                        </View>
                        <FontAwesome5 name="chevron-right" size={16} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => setIsChangePasswordModal(true)}
                    >
                        <View style={styles.settingLeft}>
                            <View style={[styles.settingIcon, { backgroundColor: '#4E8255' }]}>
                                <FontAwesome5 name="lock" size={16} color="#fff" />
                            </View>
                            <Text style={styles.settingText}>Change Password</Text>
                        </View>
                        <FontAwesome5 name="chevron-right" size={16} color="#999" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logout} onPress={handleLogout}>
                    <FontAwesome5 name="sign-out-alt" size={20} color="#C43A32" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <Modal
                    visible={isChangePasswordModal}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Change Password</Text>

                            <TextInput
                                style={styles.modalInput}
                                placeholder="Current Password"
                                placeholderTextColor="#999"
                                secureTextEntry
                                value={passwordData.currentPassword}
                                onChangeText={(text) => setPasswordData({ ...passwordData, currentPassword: text })}
                            />

                            <TextInput
                                style={styles.modalInput}
                                placeholder="New Password"
                                placeholderTextColor="#999"
                                secureTextEntry
                                value={passwordData.newPassword}
                                onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
                            />

                            <TextInput
                                style={styles.modalInput}
                                placeholder="Confirm New Password"
                                placeholderTextColor="#999"
                                secureTextEntry
                                value={passwordData.confirmPassword}
                                onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalCancelButton}
                                    onPress={() => setIsChangePasswordModal(false)}
                                >
                                    <Text style={styles.modalCancelText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.modalConfirmButton}
                                    onPress={handleChangePassword}
                                >
                                    <Text style={styles.modalConfirmText}>Change Password</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={isChangeEmailModal}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Change Email</Text>

                            <Text style={styles.email}>current email:{email}</Text>

                            <TextInput
                                style={styles.modalInput}
                                placeholder="New Email"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                value={emailData.newEmail}
                                onChangeText={(text) => setEmailData({ ...emailData, newEmail: text })}
                            />

                            <TextInput
                                style={styles.modalInput}
                                placeholder="Confirm New Email"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                value={emailData.confirmEmail}
                                onChangeText={(text) => setEmailData({ ...emailData, confirmEmail: text })}
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalCancelButton}
                                    onPress={() => setIsChangeEmailModal(false)}
                                >
                                    <Text style={styles.modalCancelText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.modalConfirmButton}
                                    onPress={handleChangeEmail}
                                >
                                    <Text style={styles.modalConfirmText}>Change Email</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
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
        backgroundColor: '#C43A32',
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
        textAlign: 'center',
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
        backgroundColor: '#C43A32',
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
        backgroundColor: '#C43A32',
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2d3436',
        marginBottom: 16,
    },
    logout: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#C43A32',
    },
    logoutText: {
        fontSize: 16,
        color: '#C43A32',
        fontWeight: '600',
        marginLeft: 8,
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
        borderBottomColor: '#C43A32',
    },
    tabText: {
        fontSize: 16,
        color: '#636e72',
        fontWeight: '600',
    },
    activeTabText: {
        color: '#C43A32',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 24,
        borderRadius: 16,
        width: '90%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2d3436',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    modalCancelButton: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    modalCancelText: {
        color: '#636e72',
        fontSize: 16,
        fontWeight: '600',
    },
    modalConfirmButton: {
        flex: 1,
        backgroundColor: '#C43A32',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginLeft: 8,
    },
    modalConfirmText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});