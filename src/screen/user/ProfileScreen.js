import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import I18n from '../../utils/language/i18n';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../../utils/apiHelper/Axios';

const banks = [
  {
    id: 1,
    name: 'State Bank of India',
    accountNumber: '•••• 1234',
    type: 'Savings • Primary Account',
    logo: require('../../assets/image/bankIcon/sbi.png'),
  },
  {
    id: 2,
    name: 'HDFC Bank',
    accountNumber: '•••• 5678',
    type: 'Current',
    logo: require('../../assets/image/bankIcon/hdfc.png'),
  },
  {
    id: 3,
    name: 'ICICI Bank',
    accountNumber: '•••• 9012',
    type: 'Savings',
    logo: require('../../assets/image/bankIcon/icici.png'),
  },
];

const ProfileScreen = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: isDark ? Colors.white : Colors.black,
    card: isDark ? Colors.cardGrey : Colors.white,
    placeholder: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    iconBox: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    border: isDark ? Colors.white : Colors.black,
    paymentText: isDark ? Colors.white : Colors.black,
    bankIcon: isDark ? Colors.cardGrey : Colors.darkGrey,
  };

  const [user] = useState({
    name: 'Nikil Kumar',
    upiId: 'nikilkumar123@sbi',
    upiNumber: '7668766533',
  });

  const [bankAccountAdded, setBankAccountAdded] = useState(false);

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
      logout: true, // to identify logout
    },
  ];

  const getInitial = name => name?.charAt(0)?.toUpperCase() || '';

  const handleLogout = () => {
    Alert.alert(
      I18n.t('logout'),
      I18n.t('are_you_sure_logout'),
      [
        { text: I18n.t('no'), style: 'cancel' },
        {
          text: I18n.t('yes'),
          onPress: async () => {
            try {
              await logoutUser();
              navigation.replace('MobileNumberEntry');
            } catch (error) {
              Alert.alert(I18n.t('error'), error.message || 'Logout failed');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header title={I18n.t('profile')} onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Card */}
        <LinearGradient
          colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
          style={styles.userCard}
        >
          <View style={styles.userRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.upiId}>{user.upiId}</Text>
              <View style={styles.upiRow}>
                <Text style={styles.upiNumber}>{user.upiNumber}</Text>
              </View>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitial(user.name)}</Text>
              <View style={styles.qrBadge}>
                <Image
                  source={require('../../assets/image/appIcon/qr.png')}
                  style={styles.qrIcon}
                />
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Payment Methods */}
        <View style={styles.paymentCard}>
          <Text style={[styles.paymentTitle, { color: themeColors.text }]}>
            {I18n.t('bank_accounts_cards')}
          </Text>

          {banks.map(bank => (
            <View key={bank.id} style={styles.bankContainer}>
              <View style={styles.bankInfo}>
                <View
                  style={[
                    styles.bankIconBox,
                    { backgroundColor: themeColors.iconBox },
                  ]}
                >
                  <Image source={bank.logo} style={styles.bankLogo} />
                </View>
                <View style={{ marginLeft: scaleUtils.scaleWidth(8) }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      columnGap: scaleUtils.scaleWidth(8),
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={[styles.bankName, { color: themeColors.text }]}
                    >
                      {bank.name}
                    </Text>
                    <Text
                      style={[
                        styles.bankAccountNumber,
                        { color: themeColors.placeholder },
                      ]}
                    >
                      {bank.accountNumber}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.bankAccountType,
                      { color: themeColors.placeholder },
                    ]}
                  >
                    {bank.type}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          {/* Add Bank Account */}
          <TouchableOpacity
            style={[
              styles.paymentOption,
              { marginTop: scaleUtils.scaleHeight(10) },
            ]}
            onPress={() => setBankAccountAdded(!bankAccountAdded)}
          >
            <View
              style={[
                styles.dottedContainer,
                {
                  borderColor: themeColors.border,
                  backgroundColor: themeColors.iconBox,
                },
              ]}
            >
              <Image
                source={require('../../assets/image/appIcon/add.png')}
                style={[
                  styles.paymentIcon,
                  { tintColor: themeColors.bankIcon },
                ]}
              />
            </View>
            <Text
              style={[styles.paymentText, { color: themeColors.paymentText }]}
            >
              {I18n.t('add_bank_account')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Menu List */}
        <View style={{ marginVertical: scaleUtils.scaleHeight(6) }}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem]}
              onPress={() => item.logout && handleLogout()}
            >
              <Image
                source={item.icon}
                style={[
                  styles.menuIcon,
                  { tintColor: themeColors.placeholder },
                ]}
              />
              <Text style={[styles.menuText, { color: themeColors.text }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: scaleUtils.scaleWidth(16) },

  // User Card
  userCard: {
    paddingHorizontal: scaleUtils.scaleWidth(16),
    paddingVertical: scaleUtils.scaleWidth(20),
    borderRadius: scaleUtils.scaleWidth(12),
    marginBottom: scaleUtils.scaleHeight(26),
  },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: scaleUtils.scaleWidth(75),
    height: scaleUtils.scaleWidth(75),
    borderRadius: scaleUtils.scaleWidth(100),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: scaleUtils.scaleFont(30),
    fontWeight: '900',
    color: Colors.primary,
  },
  qrBadge: {
    position: 'absolute',
    bottom: scaleUtils.scaleHeight(-4),
    right: scaleUtils.scaleWidth(-4),
    backgroundColor: Colors.secondary,
    borderRadius: scaleUtils.scaleWidth(16),
    padding: scaleUtils.scaleWidth(8),
  },
  qrIcon: {
    width: scaleUtils.scaleWidth(14),
    height: scaleUtils.scaleWidth(14),
    tintColor: Colors.white,
  },
  userName: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
  },
  upiId: {
    fontSize: scaleUtils.scaleFont(14),
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
  },
  upiRow: { flexDirection: 'row', alignItems: 'center' },
  upiNumber: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
  },

  // Payment Methods
  paymentCard: { marginBottom: scaleUtils.scaleHeight(20) },
  paymentTitle: {
    fontSize: scaleUtils.scaleFont(15),
    marginBottom: scaleUtils.scaleHeight(8),
    fontFamily: 'Poppins-Regular',
  },
  bankContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: scaleUtils.scaleWidth(10),
  },
  bankInfo: {
    flexDirection: 'row',
    columnGap: scaleUtils.scaleWidth(10),
    alignItems: 'center',
  },
  bankIconBox: {
    width: scaleUtils.scaleWidth(60),
    height: scaleUtils.scaleWidth(40),
    borderRadius: scaleUtils.scaleWidth(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankLogo: {
    width: scaleUtils.scaleWidth(24),
    height: scaleUtils.scaleWidth(24),
    resizeMode: 'contain',
  },
  bankName: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-SemiBold',
  },
  bankAccountType: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
  },
  bankAccountNumber: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: scaleUtils.scaleWidth(16),
  },
  dottedContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: scaleUtils.scaleWidth(8),
    alignItems: 'center',
    justifyContent: 'center',
    width: scaleUtils.scaleWidth(60),
    height: scaleUtils.scaleWidth(40),
  },
  paymentIcon: {
    width: scaleUtils.scaleWidth(16),
    height: scaleUtils.scaleWidth(16),
  },
  paymentText: {
    fontSize: scaleUtils.scaleFont(12),
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },

  // Menu List
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaleUtils.scaleHeight(12),
    borderRadius: scaleUtils.scaleWidth(10),
  },
  menuIcon: {
    width: scaleUtils.scaleWidth(20),
    height: scaleUtils.scaleWidth(20),
    marginRight: scaleUtils.scaleWidth(16),
  },
  menuText: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
  },
});

export default ProfileScreen;
