import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
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
import { saveCreditUpiPin } from '../../utils/apiHelper/Axios';

const SetPinPage = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // --- Hooks at the top ---
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const pinLength = 4;
  const confirmPinRef = useRef(null);

  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const themeColors = {
    background: isDark ? Colors.bg : Colors.lightBg,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
    tipBox: isDark ? Colors.secondary : Colors.cardGrey,
  };

  // --- Handlers ---
  const handlePinChange = val => {
    setPin(val);
    if (val.length === pinLength) {
      confirmPinRef.current?.focus();
    }
  };

  const showToast = message => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleSetup = async () => {
    const bankCreditUpiId = route.params?.bankCreditUpiId;
    if (!bankCreditUpiId) {
      showToast('Missing Bank Credit UPI ID');
      return;
    }

    if (pin !== confirmPin) {
      showToast('PIN and Confirm PIN do not match');
      return;
    }

    try {
      const response = await saveCreditUpiPin(bankCreditUpiId, pin, confirmPin);
      if (response?.status) {
        showToast('PIN set successfully');
        setTimeout(() => {
          navigation.reset({
            index: 1,
            routes: [{ name: 'HomePage' }, { name: 'CreditUPIPage' }],
          });
        }, 1000);
      } else {
        showToast(response?.messages || 'Failed to set PIN');
      }
    } catch (error) {
      showToast(error.message || 'Something went wrong');
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <Header
        title={I18n.t('credit_upi_setup')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: themeColors.text }]}>
          {I18n.t('set_credit_upi_pin')}
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.subText }]}>
          {I18n.t('upi_pin_description')}
        </Text>

        <Text style={[styles.label, { color: themeColors.text }]}>
          {I18n.t('enter_credit_upi_pin')}
        </Text>
        <View style={{ alignSelf: 'center' }}>
          <OTPInput
            code={pin}
            setCode={handlePinChange}
            length={pinLength}
            isSecure={true}
          />
        </View>

        <Text style={[styles.label, { color: themeColors.text }]}>
          {I18n.t('confirm_credit_upi_pin')}
        </Text>
        <View style={{ alignSelf: 'center' }}>
          <OTPInput
            ref={confirmPinRef}
            code={confirmPin}
            setCode={setConfirmPin}
            length={pinLength}
            isSecure={true}
          />
        </View>

        <View style={{ marginVertical: scaleUtils.scaleHeight(20) }}>
          <Button
            title={I18n.t('set_pin_continue')}
            onPress={handleSetup}
            disabled={
              pin.length !== pinLength ||
              confirmPin.length !== pinLength ||
              pin !== confirmPin
            }
          />
        </View>
      </ScrollView>

      <Toast visible={toastVisible} message={toastMessage} isDark={isDark} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: scaleUtils.scaleWidth(20) },
  title: {
    fontSize: scaleUtils.scaleFont(22),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginTop: scaleUtils.scaleHeight(20),
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
  },
  tipBox: {
    paddingHorizontal: scaleUtils.scaleWidth(16),
    paddingVertical: scaleUtils.scaleWidth(10),
    borderRadius: scaleUtils.scaleWidth(12),
    marginVertical: scaleUtils.scaleHeight(14),
  },
  tipTitle: {
    fontSize: scaleUtils.scaleFont(16),
    fontFamily: 'Poppins-Bold',
    marginBottom: scaleUtils.scaleWidth(6),
  },
  tipText: {
    fontSize: scaleUtils.scaleFont(13),
    fontFamily: 'Poppins-Regular',
  },
});

export default SetPinPage;
