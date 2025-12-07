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
import LineButton from '../../component/LineButton';
import CustomAlert from '../../component/CustomAlert';

const BankBalanceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { linked_account } = route?.params || {};
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState(null); // "remove" or "reset"

  const IMAGE_BASE_URL = 'https://cyapay.ddns.net';

  const themeColors = {
    background: isDark ? Colors.bg : Colors.white,
    text: Colors.white,
    subText: isDark ? Colors.white : Colors.black,
  };

  const defaultBank = {
    id: 1,
    name: 'State Bank of India',
    accountNumber: 'XXXX XXXX XXXX 1234',
    type: 'Savings',
    accountHolderName: 'Ashish Mandaliya',
    logo: require('../../assets/image/bankIcon/sbi.png'),
  };

  const [selectedBank, setSelectedBank] = useState(
    route.params?.selectedBank || defaultBank,
  );

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

  const handleConfirm = () => {
    if (alertType === 'remove') {
      console.log('Remove account confirmed');
      // your remove API call here
    } else if (alertType === 'reset') {
      console.log('Reset PIN confirmed');
      navigation.navigate('ResetPinScreen', {
        bank: selectedBank,
        old_pin_code: '',
        isCredit: false,
        isNbfc: false,
      });
    }

    setAlertVisible(false);
  };

  useEffect(() => {
    if (route.params?.selectedBank) {
      const bank = route.params.selectedBank;
      const logoUrl = `${IMAGE_BASE_URL}${bank.bank?.logo || ''}`;

      setSelectedBank({
        ...bank,
        logo: logoUrl,
        accountNumber: `${bank.account_number}`,
        type: bank.account_type || 'Saving',
        accountHolderName: bank.account_holder_name || '—',
        branch_name: bank.ifsc_detail?.branch_name || '—',
        branch_address: bank.ifsc_detail?.branch_address || '—',
        city: bank.ifsc_detail?.city || '—',
        state: bank.ifsc_detail?.state || '—',
        ifsc_code: bank.ifsc_detail?.ifsc_code || '—',
      });
    }
    animateCard();
  }, [route.params?.selectedBank]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={
          linked_account
            ? I18n.t('bank_details_title')
            : I18n.t('bank_balance_title')
        }
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View
          style={{ transform: [{ scale: cardScale }], opacity: cardOpacity }}
        >
          {linked_account ? (
            // ----------- BANK DETAILS CARD ------------
            <LinearGradient
              colors={[Colors.gradientPrimary, Colors.gradientSecondary]}
              style={styles.detailsCard}
            >
              <View style={styles.detailsHeader}>
                <Image
                  source={{ uri: selectedBank.logo }}
                  style={styles.detailsLogo}
                />
                <Text style={styles.detailsBankName}>
                  {selectedBank.bank?.name || selectedBank.name}
                </Text>
              </View>

              {/* Account Holder Name */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {I18n.t('account_holder_name')}:
                </Text>
                <Text style={styles.detailValue}>
                  {selectedBank.accountHolderName}
                </Text>
              </View>

              {/* Account Number */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {I18n.t('account_number')}:
                </Text>
                <Text style={styles.detailValue}>
                  {selectedBank.accountNumber}
                </Text>
              </View>

              {/* IFSC Code */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{I18n.t('ifsc_code')}:</Text>
                <Text style={styles.detailValue}>{selectedBank.ifsc_code}</Text>
              </View>

              {/* Account Type */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {I18n.t('account_type')}:
                </Text>
                <Text style={styles.detailValue}>
                  {selectedBank.type?.toUpperCase()}
                </Text>
              </View>

              {/* Branch Name */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {I18n.t('branch_name') || 'Branch Name'}:
                </Text>
                <Text style={styles.detailValue}>
                  {selectedBank.branch_name}
                </Text>
              </View>

              {/* Branch Address */}
              <View style={[styles.detailRow, { alignItems: 'flex-start' }]}>
                <Text style={styles.detailLabel}>
                  {I18n.t('branch_address') || 'Branch Address'}:
                </Text>
                <Text
                  style={[styles.detailValue, styles.detailAddress]}
                  numberOfLines={0}
                >
                  {selectedBank.branch_address}, {selectedBank.city},{' '}
                  {selectedBank.state}
                </Text>
              </View>
            </LinearGradient>
          ) : (
            // ----------- BANK BALANCE CARD ------------
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
                  <Text style={styles.bankName}>
                    {selectedBank.bank?.name || selectedBank.name}
                  </Text>
                  <Text style={styles.bankDetails}>
                    {selectedBank.accountNumber}
                  </Text>
                  <Text style={styles.bankDetails}>{selectedBank.type}</Text>
                </View>
              </View>
            </LinearGradient>
          )}
        </Animated.View>
      </ScrollView>

      {linked_account && (
        <View style={styles.bottomButtons}>
          <View style={{ flex: 1 }}>
            <LineButton
              title={I18n.t('reset_pin')}
              onPress={() => {
                setAlertType('reset');
                setAlertVisible(true);
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <LineButton
              title={I18n.t('remove_account')}
              onPress={() => {
                setAlertType('remove');
                setAlertVisible(true);
              }}
              style={{ borderColor: Colors.error }}
              textStyle={{ color: Colors.error }}
            />
          </View>
        </View>
      )}
      <CustomAlert
        visible={alertVisible}
        title={
          alertType === 'remove'
            ? I18n.t('remove_account')
            : I18n.t('reset_pin')
        }
        message={
          alertType === 'remove'
            ? I18n.t('remove_account_message')
            : I18n.t('reset_pin_message')
        }
        cancelText={I18n.t('cancel')}
        confirmText={I18n.t('yes')}
        onCancel={() => setAlertVisible(false)}
        onConfirm={handleConfirm}
      />
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
  },
  bankLogoContainer: {
    width: scaleUtils.scaleWidth(36),
    height: scaleUtils.scaleWidth(36),
    marginRight: scaleUtils.scaleWidth(14),
    borderRadius: scaleUtils.scaleWidth(24),
    backgroundColor: Colors.white,
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

  detailsCard: {
    borderRadius: scaleUtils.scaleWidth(20),
    padding: scaleUtils.scaleWidth(20),
    marginBottom: scaleUtils.scaleHeight(20),
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaleUtils.scaleHeight(16),
  },
  detailsLogo: {
    width: scaleUtils.scaleWidth(35),
    height: scaleUtils.scaleWidth(34),
    borderRadius: scaleUtils.scaleWidth(25),
    backgroundColor: Colors.white,
    marginRight: scaleUtils.scaleWidth(12),
  },
  detailsBankName: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scaleUtils.scaleHeight(8),
  },
  detailLabel: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Medium',
    color: 'rgba(255,255,255,0.85)',
  },
  detailValue: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
    color: Colors.white,
    width: '50%',
    flexWrap: 'wrap',
    textAlign: 'right',
  },
  detailAddress: {
    textAlign: 'right',
  },
  bottomButtons: {
    position: 'absolute',
    bottom: scaleUtils.scaleHeight(6),
    left: scaleUtils.scaleWidth(16),
    right: scaleUtils.scaleWidth(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scaleUtils.scaleHeight(10),
    backgroundColor: 'transparent',
    columnGap: scaleUtils.scaleWidth(10),
  },
});

export default BankBalanceScreen;
