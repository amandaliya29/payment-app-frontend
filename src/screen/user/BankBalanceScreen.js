import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
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

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: Colors.white,
    subText: isDark ? Colors.white : Colors.black,
    btnColor: isDark ? Colors.darkGrey : Colors.cardGrey,
  };

  const defaultBank = {
    id: 1,
    name: 'State Bank of India',
    balance: '2,50,000',
    accountNumber: 'XXXX XXXX XXXX 1234',
    type: 'Savings',
    logo: require('../../assets/image/bankIcon/sbi.png'),
  };

  const [selectedBank, setSelectedBank] = useState(
    route.params?.selectedBank || defaultBank,
  );
  const [showBalance, setShowBalance] = useState(false);

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

  useEffect(() => {
    if (route.params?.selectedBank) setSelectedBank(route.params.selectedBank);
    animateCard();
  }, [route.params?.selectedBank]);

  const toggleBalance = () => setShowBalance(prev => !prev);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
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
              <Text style={styles.balance}>
                ₹{' '}
                {showBalance
                  ? Number(
                      selectedBank.balance.replace(/,/g, ''),
                    ).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : '⁕⁕⁕⁕⁕'}
              </Text>
              <TouchableOpacity onPress={toggleBalance}>
                <Image
                  source={
                    showBalance
                      ? require('../../assets/image/appIcon/eye-open.png')
                      : require('../../assets/image/appIcon/eye-closed.png')
                  }
                  style={styles.eyeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.bankRow}>
              <Image
                source={selectedBank.logo}
                style={styles.bankLogo}
                resizeMode="contain"
              />
              <View style={styles.bankInfo}>
                <Text style={styles.bankName}>{selectedBank.name}</Text>
                <Text style={styles.bankDetails}>
                  {selectedBank.accountNumber}
                </Text>
                <Text style={styles.bankDetails}>{selectedBank.type}</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* <TouchableOpacity
          style={[
            styles.bankSelector,
            { backgroundColor: themeColors.btnColor },
          ]}
          onPress={() => navigation.navigate('SelectBankScreen')}
        >
          <Text style={[styles.bankName, { color: themeColors.subText }]}>
            {I18n.t('select_bank')}
          </Text>
          <Image
            source={require('../../assets/image/appIcon/right.png')}
            style={[styles.rightIcon, { tintColor: themeColors.subText }]}
            resizeMode="contain"
          />
        </TouchableOpacity> */}
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
    justifyContent: 'space-between',
    marginTop: 4,
  },
  balance: {
    fontSize: scaleUtils.scaleFont(18),
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
  },
  eyeIcon: {
    width: scaleUtils.scaleWidth(22),
    height: scaleUtils.scaleWidth(22),
    tintColor: Colors.white,
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: scaleUtils.scaleHeight(12),
  },
  bankRow: { flexDirection: 'row' },
  bankLogo: {
    width: scaleUtils.scaleWidth(36),
    height: scaleUtils.scaleWidth(36),
    marginRight: scaleUtils.scaleWidth(14),
    borderRadius: scaleUtils.scaleWidth(22),
    backgroundColor: 'white',
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
    color: 'rgba(255,255,255,0.85)',
  },
  bankSelector: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: scaleUtils.scaleHeight(8),
    paddingHorizontal: scaleUtils.scaleWidth(20),
    borderRadius: scaleUtils.scaleWidth(10),
    columnGap: scaleUtils.scaleWidth(10),
    justifyContent: 'center',
    marginTop: scaleUtils.scaleHeight(12),
  },
  rightIcon: {
    width: scaleUtils.scaleWidth(12),
    height: scaleUtils.scaleWidth(12),
    tintColor: Colors.black,
  },
});

export default BankBalanceScreen;
