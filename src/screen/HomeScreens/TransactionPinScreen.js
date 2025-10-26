import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';
import Button from '../../component/Button';
import OTPInput from '../../component/OTPInput';
import { Toast } from '../../utils/Toast';
import { getPay } from '../../utils/apiHelper/Axios';

const TransactionPinScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // ✅ Destructure route params with defaults
  const {
    amount = '',
    bank = {},
    user = {},
    isViaUPI = false,
    note = '',
  } = route.params || {};

  console.log(
    'amount',
    amount,
    'bank',
    bank.id,
    'user',
    user,
    'isViaUPI',
    isViaUPI,
    'note',
    note,
  );

  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const themeColors = {
    background: isDark ? Colors.bg : Colors.lightBg,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
  };

  const pinLength = bank.pin_code_length || 4;

  const showToast = message => {
    setToastMessage(message);
    setToastVisible(true);
    // setTimeout(() => setToastVisible(false), 2000);
  };

  const handleContinue = async () => {
    if (pin.length !== pinLength) return;

    setLoading(true);

    try {
      // ✅ Build API payload dynamically
      const payload = {
        amount: amount,
        from_bank_account: bank.id,
        description: note,
        pin_code: pin,
      };

      if (isViaUPI) {
        payload.upi_id = user?.bank_account?.upi_id;
      } else {
        payload.to_bank_account = user?.bank_account?.id;
      }

      console.log('Transaction payload =>', payload);

      const response = await getPay(payload);

      if (!response?.data?.status) {
        showToast(response?.data?.messages || 'Transaction failed!');
      }
      showToast(response?.data?.messages || 'Transaction successful!');
      setTimeout(() => {
        navigation.replace('PaymentSuccessScreen', {
          amount,
          bank,
          user,
          transaction: response?.data?.data,
        });
      }, 1500);
    } catch (error) {
      showToast(error?.response?.data?.messages || 'Transaction error');
      //   setTimeout(() => navigation.goBack(), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('enter_transaction_pin')}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/image/appIcon/pin-lock.png')}
          style={[styles.pinImage, { tintColor: Colors.primary }]}
          resizeMode="contain"
        />
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: themeColors.text }]}>
          {I18n.t('enter_transaction_pin')}
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.subText }]}>
          {I18n.t('enter_pin_to_continue')}
        </Text>

        <Text style={[styles.label, { color: themeColors.text }]}>
          {I18n.t('enter_transaction_pin')}
        </Text>
        <View
          style={{
            alignSelf: 'center',
            marginVertical: scaleUtils.scaleHeight(10),
          }}
        >
          <OTPInput code={pin} setCode={setPin} length={pinLength} isSecure />
        </View>

        <View style={{ marginVertical: scaleUtils.scaleHeight(20) }}>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <Button
              title={I18n.t('continue')}
              onPress={handleContinue}
              disabled={pin.length !== pinLength}
            />
          )}
        </View>
      </ScrollView>

      <Toast visible={toastVisible} message={toastMessage} isDark={isDark} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: {
    alignItems: 'center',
    marginVertical: scaleUtils.scaleHeight(20),
  },
  pinImage: {
    width: scaleUtils.scaleWidth(80),
    height: scaleUtils.scaleWidth(80),
    marginTop: scaleUtils.scaleWidth(20),
  },
  scrollContent: { padding: scaleUtils.scaleWidth(20) },
  title: {
    fontSize: scaleUtils.scaleFont(22),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(10),
  },
  subtitle: {
    fontSize: scaleUtils.scaleFont(14),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(10),
    marginBottom: scaleUtils.scaleHeight(20),
  },
  label: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    marginTop: scaleUtils.scaleHeight(10),
    alignSelf: 'center',
  },
});

export default TransactionPinScreen;
