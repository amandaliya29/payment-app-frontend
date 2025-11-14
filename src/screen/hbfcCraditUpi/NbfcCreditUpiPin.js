import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Header from '../../component/Header';
import { Colors } from '../../themes/Colors';
import scaleUtils from '../../utils/Responsive';
import I18n from '../../utils/language/i18n';
import Button from '../../component/Button';
import OTPInput from '../../component/OTPInput';
import { Toast } from '../../utils/Toast';
import { NBFCSetPin } from '../../utils/apiHelper/Axios';

const NbfcCreditUpiPin = () => {
  const navigation = useNavigation();

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const confirmPinRef = useRef(null);

  const pinLength = 4;
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const themeColors = {
    background: isDark ? Colors.bg : Colors.lightBg,
    text: isDark ? Colors.white : Colors.black,
    subText: isDark ? Colors.grey : Colors.darkGrey,
  };

  // Toast function
  const showToast = msg => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handlePinChange = val => {
    setPin(val);
    if (val.length === pinLength) {
      confirmPinRef.current?.focus();
    }
  };

  const handleSetPin = async () => {
    if (pin.length !== pinLength || confirmPin.length !== pinLength) {
      showToast('Please enter 4-digit PINs');
      return;
    }

    if (pin !== confirmPin) {
      showToast('PIN and Confirm PIN do not match');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        pin_code: pin,
        pin_code_confirmation: confirmPin,
      };

      console.log('SEND PIN PAYLOAD:', payload);

      const response = await NBFCSetPin(payload);
      console.log('PIN RESPONSE:', response?.data);

      showToast(response?.data?.message || 'PIN Set Successfully');

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomePage' }],
        });
      }, 800);
    } catch (error) {
      console.log('PIN API ERROR:', error?.response?.data);
      showToast(error?.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
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

        {/* PIN */}
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

        {/* CONFIRM PIN */}
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

        {/* BUTTON */}
        <View style={{ marginVertical: scaleUtils.scaleHeight(20) }}>
          <Button
            title={loading ? 'Please wait...' : I18n.t('set_pin_continue')}
            onPress={handleSetPin}
            disabled={loading}
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
});

export default NbfcCreditUpiPin;
