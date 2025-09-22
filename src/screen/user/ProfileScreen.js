import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import I18n from '../../utils/language/i18n';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    card: isDark ? Colors.cardDark : Colors.cardLight,
  };

  // User Details
  const [user] = useState({
    name: 'Nikil Kumar',
    upiId: 'nikilkumar123@sbi',
    upiNumber: '7668766533',
  });

  const menuItems = [
    {
      id: 1,
      title: I18n.t('your_qr_code'),
      icon: require('../../assets/image/appIcon/qr.png'),
    },
    {
      id: 2,
      title: I18n.t('personal_info'),
      icon: require('../../assets/image/homeIcon/user.png'),
    },
    {
      id: 3,
      title: I18n.t('notifications_email'),
      icon: require('../../assets/image/homeIcon/bell.png'),
    },
    {
      id: 4,
      title: I18n.t('about'),
      icon: require('../../assets/image/appIcon/about.png'),
    },
    {
      id: 5,
      title: I18n.t('privacy_policy'),
      icon: require('../../assets/image/appIcon/security.png'),
    },
    {
      id: 6,
      title: I18n.t('languages'),
      icon: require('../../assets/image/appIcon/Language.png'),
    },
    {
      id: 7,
      title: I18n.t('logout'),
      icon: require('../../assets/image/appIcon/logout.png'),
    },
  ];

  const getInitial = name => name?.charAt(0)?.toUpperCase() || '';

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header title={I18n.t('profile')} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* User Info Card */}
        <LinearGradient
          colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
          style={styles.userCard}
        >
          <View style={styles.userRow}>
            {/* Avatar with QR badge */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitial(user.name)}</Text>
              <View style={styles.qrBadge}>
                <Image
                  source={require('../../assets/image/appIcon/qr.png')}
                  style={styles.qrIcon}
                />
              </View>
            </View>
            {/* User Details */}
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.upiLabel}>UPI ID:</Text>
              <Text style={styles.upiId}>{user.upiId}</Text>
              <View style={styles.upiRow}>
                <Text style={styles.upiNumber}>{user.upiNumber}</Text>
                <View style={styles.upiBadge}>
                  <Text style={styles.upiBadgeText}>UPI number</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Payment Methods */}
        <LinearGradient
          colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
          style={styles.paymentCard}
        >
          <Text style={styles.paymentTitle}>Set up payment methods 1/3</Text>
          <View style={styles.paymentRow}>
            <TouchableOpacity style={styles.paymentOption}>
              <Image
                source={require('../../assets/image/homeIcon/bank.png')}
                style={styles.paymentIcon}
              />
              <Text style={styles.paymentText}>
                Bank account{'\n'}1 account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.paymentOption}>
              <Image
                source={require('../../assets/image/homeIcon/credit.png')}
                style={styles.paymentIcon}
              />
              <Text style={styles.paymentText}>
                RuPay credit card{'\n'}Pay with UPI
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.paymentOption}>
              {/* <Image
                source={require('../../assets/image/appIcon/upi.png')}
                style={styles.paymentIcon}
              /> */}
              <Text style={styles.paymentText}>UPI Lite{'\n'}Pay PIN-free</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Menu List */}
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuItem, { backgroundColor: themeColors.card }]}
          >
            <Image source={item.icon} style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: themeColors.text }]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: scaleUtils.scaleWidth(16) },

  // User Card
  userCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  qrBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: 'black',
    borderRadius: 16,
    padding: 8,
  },
  qrIcon: {
    width: 14,
    height: 14,
    tintColor: 'white',
  },
  userName: { fontSize: 18, fontWeight: '600', color: Colors.white },
  upiLabel: { fontSize: 12, color: '#ccc', marginTop: 4 },
  upiId: { fontSize: 14, color: Colors.white },
  upiRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  upiNumber: {
    fontSize: 15,
    fontWeight: '600',
    marginRight: 8,
    color: Colors.white,
  },
  upiBadge: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 16,
  },
  upiBadgeText: { color: Colors.white, fontSize: 12, fontWeight: '500' },

  // Payment Methods
  paymentCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  paymentTitle: { fontSize: 13, color: Colors.white, marginBottom: 14 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between' },
  paymentOption: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  paymentIcon: {
    width: 28,
    height: 28,
    marginBottom: 6,
    tintColor: Colors.white,
  },
  paymentText: { fontSize: 12, textAlign: 'center', color: Colors.white },

  // Menu List
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  menuIcon: { width: 20, height: 20, marginRight: 12 },
  menuText: { fontSize: 14, fontFamily: 'Poppins-Regular' },
});

export default ProfileScreen;
