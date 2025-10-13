import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  useColorScheme,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import I18n from '../../utils/language/i18n';

const BankBalanceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const IMAGE_BASE_URL = 'https://cyapay.ddns.net';

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: Colors.white,
    subText: isDark ? Colors.white : Colors.black,
    btnColor: isDark ? Colors.darkGrey : Colors.cardGrey,
  };

  const defaultBank = {
    id: 1,
    name: 'State Bank of India',
    accountNumber: 'XXXX XXXX XXXX 1234',
    type: 'Savings',
    logo: require('../../assets/image/bankIcon/sbi.png'),
  };

  // Use bank data from route.params if available
  const [selectedBank, setSelectedBank] = useState(
    route.params?.selectedBank || defaultBank,
  );

  // Animation
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  const animateCard = () => {
    Animated.parallel([
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // console.log(route.params.balance);

  useEffect(() => {
    if (route.params?.selectedBank) {
      const bank = route.params.selectedBank;

      const logoUrl = `${IMAGE_BASE_URL}${bank.bank.logo}`;

      setSelectedBank({
        ...bank,
        logo: logoUrl,
        accountNumber: `${bank.account_number}`,
        type: bank.account_type || 'saving',
      });
    }
    animateCard();
  }, [route.params?.selectedBank]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {/* {console.log(route.params.selectedBank.bank.logo)} */}
      <Header
        title={I18n.t('bank_balance_title')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View
          style={{ transform: [{ scale: cardScale }], opacity: cardOpacity }}
        >
          <LinearGradient
            colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
            style={styles.cardGradient}
          >
            <Text style={styles.balanceLabel}>
              {I18n.t('bank_balance_title')}
            </Text>

            <View style={styles.balanceRow}>
              <Text style={styles.balance}>₹ {route.params.balance}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.bankRow}>
              <View style={styles.bankLogoContainer}>
                <Image
                  source={{ uri: selectedBank.logo }}
                  style={styles.bankLogo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.bankInfo}>
                <Text style={styles.bankName}>{selectedBank.bank.name}</Text>
                <Text style={styles.bankDetails}>
                  {selectedBank.accountNumber}
                </Text>
                <Text style={styles.bankDetails}>{selectedBank.type}</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: scaleUtils.scaleWidth(16) },
  cardGradient: {
    borderRadius: scaleUtils.scaleWidth(16),
    padding: scaleUtils.scaleWidth(16),
    marginBottom: scaleUtils.scaleHeight(20),
  },
  balanceLabel: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    color: Colors.white,
    opacity: 0.8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 4,
  },
  balance: {
    fontSize: scaleUtils.scaleFont(18),
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: scaleUtils.scaleHeight(12),
  },
  bankRow: { flexDirection: 'row' },
  bankLogo: {
    width: scaleUtils.scaleWidth(35),
    height: scaleUtils.scaleWidth(35),
    borderRadius: scaleUtils.scaleWidth(22),
    resizeMode: 'contain',
  },
  bankLogoContainer: {
    width: scaleUtils.scaleWidth(36),
    height: scaleUtils.scaleWidth(36),
    marginRight: scaleUtils.scaleWidth(14),
    borderRadius: scaleUtils.scaleWidth(24),
    backgroundColor: Colors.white,
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankInfo: { flex: 1 },
  bankName: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Medium',
    color: Colors.white,
  },
  bankDetails: {
    fontSize: scaleUtils.scaleFont(12),
    fontFamily: 'Poppins-Regular',
    color: Colors.white,
  },
});

export default BankBalanceScreen;
