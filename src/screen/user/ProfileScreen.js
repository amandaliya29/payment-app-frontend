import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import I18n from '../../utils/language/i18n';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import { logoutUser, getUserProfile } from '../../utils/apiHelper/Axios';
import LanguageModal from '../../component/LanguageModal';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const IMAGE_BASE_URL = 'https://cyapay.ddns.net';

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

  // State variables
  const [user, setUser] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data only once (on first load)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        if (response.status && response.data) {
          const { user, bank_accounts } = response.data;
          const primaryBank = bank_accounts?.find(acc => acc.is_primary === 1);

          const displayName =
            user.name && user.name.trim() !== ''
              ? user.name
              : primaryBank?.account_holder_name
                ? primaryBank.account_holder_name
                : 'Anonymous';

          setUser({
            name: displayName,
            upiId: primaryBank?.upi_id || '',
            upiNumber: user?.phone?.replace(/^\+91/, '') || '',
          });

          setBankAccounts(bank_accounts || []);
        }
      } catch (error) {
        console.log('Error fetching profile:', error);
      } finally {
        // Hide loader once data is loaded
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

  const handleMenuPress = item => {
    if (item.logout) return handleLogout();
    if (item.action === 'language') return setLanguageModalVisible(true);
    if (item.id === 1) return navigation.navigate('ReceiveMoneyScreen');
  };

  const menuItems = [
    {
      id: 1,
      title: I18n.t('your_qr_code'),
      icon: require('../../assets/image/appIcon/qr.png'),
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
      action: 'language',
    },
    {
      id: 7,
      title: I18n.t('logout'),
      icon: require('../../assets/image/appIcon/logout.png'),
      logout: true,
    },
  ];

  // ✅ Show Loader Screen while fetching data initially
  if (loading) {
    console.log();

    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        {/* <Text style={styles.loaderText}>{I18n.t('loading_profile')}...</Text> */}
      </View>
    );
  }

  // ✅ Once loaded, render the actual profile UI
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
              <Text
                style={styles.userName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user?.name}
              </Text>
              <Text style={styles.upiId} numberOfLines={1} ellipsizeMode="tail">
                {user?.upiId}
              </Text>
              <View style={styles.upiRow}>
                <Text style={styles.upiNumber}>
                  {user?.upiNumber
                    ? user.upiNumber
                    : 'Savings • Current Account'}
                </Text>
              </View>
            </View>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitial(user?.name)}</Text>
              <TouchableOpacity
                style={styles.qrBadge}
                onPress={() => navigation.navigate('ReceiveMoneyScreen')}
              >
                <Image
                  source={require('../../assets/image/appIcon/qr.png')}
                  style={styles.qrIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Bank Accounts Section */}
        <View style={styles.paymentCard}>
          <Text style={[styles.paymentTitle, { color: themeColors.text }]}>
            {I18n.t('bank_accounts_cards')}
          </Text>

          {bankAccounts.map(bank => (
            <View key={bank.id} style={styles.bankContainer}>
              <View style={styles.bankInfo}>
                <View
                  style={[
                    styles.bankIconBox,
                    { backgroundColor: themeColors.iconBox },
                  ]}
                >
                  <Image
                    source={{ uri: `${IMAGE_BASE_URL}${bank.bank.logo}` }}
                    style={styles.bankLogo}
                  />
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
                      {bank.bank.name}
                    </Text>
                    <Text
                      style={[
                        styles.bankAccountNumber,
                        { color: themeColors.placeholder },
                      ]}
                    >
                      •••• {bank.account_number.slice(-4)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.bankAccountType,
                      { color: themeColors.placeholder },
                    ]}
                  >
                    {bank.is_primary
                      ? 'Savings • Primary Account'
                      : 'Current Account'}
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
            onPress={() => navigation.navigate('BankLinkScreen')}
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

        {/* Menu Section */}
        <View style={{ marginVertical: scaleUtils.scaleHeight(6) }}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem]}
              onPress={() => handleMenuPress(item)}
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

      {/* Language Modal */}
      <LanguageModal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
      />
    </SafeAreaView>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: scaleUtils.scaleWidth(16) },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },
  loaderText: {
    marginTop: scaleUtils.scaleHeight(10),
    fontSize: scaleUtils.scaleFont(14),
    color: Colors.primary,
    fontFamily: 'Poppins-Medium',
  },
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
    width: '95%',
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
  },
  upiId: {
    width: '95%',
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
