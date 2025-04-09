import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const HamburgerMenu = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    if (menuVisible) {
      // Animate out
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setMenuVisible(false);
      });
    } else {
      setMenuVisible(true);
      // Animate in
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const navigateTo = (screen) => {
    toggleMenu();
    navigation.navigate(screen);
  };

  const handleLogout = () => {
    toggleMenu();
    logout();
  };

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 0],
  });

  return (
    <>
      <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
        <Ionicons name="menu" size={24} color="#333" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="none"
        onRequestClose={toggleMenu}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={toggleMenu}
          />
          
          <Animated.View
            style={[
              styles.menuContainer,
              { transform: [{ translateX }] }
            ]}
          >
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Property Management</Text>
              <TouchableOpacity onPress={toggleMenu}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Text style={styles.userInitials}>
                  {user ? user.firstName?.charAt(0) || 'U' : 'G'}
                </Text>
              </View>
              <Text style={styles.userName}>
                {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
              </Text>
              <Text style={styles.userRole}>
                {user ? user.role : 'Not logged in'}
              </Text>
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Home')}>
                <Ionicons name="home-outline" size={24} color="#333" />
                <Text style={styles.menuItemText}>Dashboard</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Properties')}>
                <Ionicons name="business-outline" size={24} color="#333" />
                <Text style={styles.menuItemText}>Properties</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Tenants')}>
                <Ionicons name="people-outline" size={24} color="#333" />
                <Text style={styles.menuItemText}>Tenants</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Payments')}>
                <Ionicons name="cash-outline" size={24} color="#333" />
                <Text style={styles.menuItemText}>Payments</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Maintenance')}>
                <Ionicons name="construct-outline" size={24} color="#333" />
                <Text style={styles.menuItemText}>Maintenance</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Messages')}>
                <Ionicons name="chatbubbles-outline" size={24} color="#333" />
                <Text style={styles.menuItemText}>Messages</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Calendar')}>
                <Ionicons name="calendar-outline" size={24} color="#333" />
                <Text style={styles.menuItemText}>Calendar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Documents')}>
                <Ionicons name="document-text-outline" size={24} color="#333" />
                <Text style={styles.menuItemText}>Documents</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Reports')}>
                <Ionicons name="bar-chart-outline" size={24} color="#333" />
                <Text style={styles.menuItemText}>Reports</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuFooter}>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Settings')}>
                <Ionicons name="settings-outline" size={24} color="#333" />
                <Text style={styles.menuItemText}>Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('HelpCenter')}>
                <Ionicons name="help-circle-outline" size={24} color="#333" />
                <Text style={styles.menuItemText}>Help & Support</Text>
              </TouchableOpacity>
              
              {user ? (
                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                  <Ionicons name="log-out-outline" size={24} color="#F44336" />
                  <Text style={[styles.menuItemText, { color: '#F44336' }]}>Logout</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Login')}>
                  <Ionicons name="log-in-outline" size={24} color="#2196F3" />
                  <Text style={[styles.menuItemText, { color: '#2196F3' }]}>Login</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    width: 280,
    backgroundColor: 'white',
    height: '100%',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2196F3',
  },
  menuTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInitials: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  menuItems: {
    flex: 1,
    padding: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  menuFooter: {
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default HamburgerMenu;
