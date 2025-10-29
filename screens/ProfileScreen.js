import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Switch } from 'react-native';
import { FontAwesome5, FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.userCard}>
          <View style={styles.avatarSection}>
            <Text>Username</Text>
            <Text>Picture</Text>
          </View>
          <Text>Button Edit</Text>
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
