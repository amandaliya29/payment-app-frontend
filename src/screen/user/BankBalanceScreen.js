import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import I18n from '../../utils/language/i18n';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import Header from '../../component/Header';
import { useNavigation } from '@react-navigation/native';

const BankBalanceScreen = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const themeColors = {
    bg: isDark ? Colors.bg : Colors.lightBg,
    text: Colors.white,
    subText: Colors.white,
  };

  const banks = [
    {
      id: 1,
      name: 'State Bank of India',
      balance: '2,50,000',
      accountNumber: 'XXXX XXXX XXXX 1234',
      type: 'Savings',
      logo: require('../../assets/image/bankIcon/sbi.png'),
    },
    {
      id: 2,
      name: 'HDFC Bank',
      balance: '1,10,500',
      accountNumber: 'XXXX XXXX XXXX 5678',
      type: 'Current',
      logo: require('../../assets/image/bankIcon/hdfc.png'),
    },
    {
      id: 3,
      name: 'ICICI Bank',
      balance: '95,000',
      accountNumber: 'XXXX XXXX XXXX 9012',
      type: 'Savings',
      logo: require('../../assets/image/bankIcon/icici.png'),
    },
  ];

  // Show/hide state for each card
  const [showBalance, setShowBalance] = useState(banks.map(() => false));

  const animations = useRef(banks.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      200,
      animations.map(anim =>
        Animated.spring(anim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, []);

  // Toggle balance visibility
  const toggleBalance = index => {
    setShowBalance(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.bg }]}
    >
      <Header
        title={I18n.t('bank_balance_title')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {banks.map((bank, index) => {
          const scale = animations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          });
          const opacity = animations[index];

          // If balance hidden, replace each character with '.'
          const maskedBalance = bank.balance.replace(/./g, '.');

          return (
            <Animated.View
              key={bank.id}
              style={[styles.cardWrapper, { transform: [{ scale }], opacity }]}
            >
              <LinearGradient
                colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
                style={styles.cardGradient}
              >
                <Text style={styles.balanceLabel}>
                  {I18n.t('bank_balance_title')}
                </Text>

                {/* Balance Row with Eye Icon */}
                <View style={styles.balanceRow}>
                  <Text style={styles.balance}>
                    ₹{' '}
                    {showBalance[index]
                      ? Number(bank.balance.replace(/,/g, '')).toLocaleString(
                          'en-IN',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )
                      : maskedBalance}
                  </Text>
                  <TouchableOpacity onPress={() => toggleBalance(index)}>
                    <Image
                      source={
                        showBalance[index]
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
                    source={bank.logo}
                    style={styles.bankLogo}
                    resizeMode="contain"
                  />
                  <View style={styles.bankInfo}>
                    <Text style={styles.bankName}>{bank.name}</Text>
                    <Text style={styles.bankDetails}>{bank.accountNumber}</Text>
                    <Text style={styles.bankDetails}>{bank.type}</Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    padding: scaleUtils.scaleWidth(16),
  },
  cardWrapper: {
    borderRadius: scaleUtils.scaleWidth(16),
    marginBottom: scaleUtils.scaleHeight(20),
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  cardGradient: {
    borderRadius: scaleUtils.scaleWidth(12),
    padding: scaleUtils.scaleWidth(16),
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
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleUtils.scaleHeight(10),
  },
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
});

export default BankBalanceScreen;
